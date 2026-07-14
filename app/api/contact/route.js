// app/api/contact/route.js

import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';

// ─── In-memory rate limit ─────────────────────────────────────────────────────
const rateLimitMap = new Map();
const RATE_LIMIT   = 3;
const WINDOW_MS    = 60 * 60 * 1000;

function checkRateLimit(ip) {
  const now   = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

// ─── Allowed values ───────────────────────────────────────────────────────────
const ALLOWED_POSITIONS = ['Student', 'Faculty', 'Developer', 'Other'];

// ─── reCAPTCHA Verification (web client) ──────────────────────────────────────
async function verifyRecaptcha(token) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (!secretKey) {
    console.error('[contact] RECAPTCHA_SECRET_KEY is not set.');
    return process.env.NODE_ENV !== 'production';
  }

  if (!token) return false;

  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

  try {
    const response = await fetch(verificationUrl, { method: 'POST' });
    const data = await response.json();
    return data.success && data.score > 0.5;
  } catch (error) {
    console.error('[contact] Error verifying reCAPTCHA:', error);
    return false;
  }
}

// ─── Shared Secret Verification (mobile app client) ───────────────────────────
// The Flutter app is a trusted native client — it can't run reCAPTCHA v3
// (that only works in a browser), so instead it authenticates with a secret
// baked into the app at build time, sent as a header. This is the same
// approach already used to secure Arivon's other native-client API calls.
function verifyAppSecret(providedSecret) {
  const expectedSecret = process.env.CONTACT_API_SECRET;
  if (!expectedSecret || !providedSecret) return false;

  // Constant-time comparison — a plain `===` leaks timing information that
  // could theoretically help an attacker guess the secret one byte at a time.
  const a = Buffer.from(providedSecret);
  const b = Buffer.from(expectedSecret);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

// ─── Bot / abuse verification — picks the right method per client ────────────
// Web sends `gRecaptchaToken` in the JSON body (reCAPTCHA v3 can only run in
// a browser). The Flutter app instead sends a shared secret in the
// `X-App-Secret` header, since reCAPTCHA v3 has no mobile equivalent for
// native apps.
//
// Each request is verified by exactly one method — whichever credential it
// actually presents — not by a client-declared "platform" field, so a
// request can't just claim to be mobile to dodge reCAPTCHA.
async function verifyRequest(req, gRecaptchaToken) {
  const appSecret = req.headers.get('x-app-secret');

  if (appSecret) {
    const ok = verifyAppSecret(appSecret);
    return { ok, source: 'mobile', message: ok ? null : 'App verification failed. Please update the app and try again.' };
  }

  const ok = await verifyRecaptcha(gRecaptchaToken);
  return { ok, source: 'web', message: ok ? null : 'Bot detection failed. Please try again.' };
}

// ─── Validation ───────────────────────────────────────────────────────────────
function validate({ name, email, phone, position, message, honeypot }) {
  if (honeypot !== '')           return 'Bad request.';
  if (!name?.trim())             return 'Name is required.';
  if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email?.trim()))
                                 return 'A valid email is required.';
  if (phone?.trim().replace(/\D/g, '').length < 10)
                                 return 'A valid phone number is required.';
  if (!ALLOWED_POSITIONS.includes(position))
                                 return 'Invalid position value.';
  if (message?.trim().length < 10)
                                 return 'Message must be at least 10 characters.';
  return null;
}

// ─── POST ─────────────────────────────────────────────────────────────────────
export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid JSON.' }, { status: 400 });
  }

  const {
    name     = '',
    email    = '',
    phone    = '',
    position = '',
    message  = '',
    honeypot = '',
    gRecaptchaToken = '',
  } = body;

  // Bot / abuse verification — reCAPTCHA for web, shared secret for the
  // mobile app. See verifyRequest() above.
  const { ok: isVerified, message: verificationMessage } = await verifyRequest(req, gRecaptchaToken);
  if (!isVerified) {
    return NextResponse.json(
      { success: false, message: verificationMessage },
      { status: 403 } // Forbidden
    );
  }

  // Validate
  const validationError = validate({ name, email, phone, position, message, honeypot });
  if (validationError) {
    return NextResponse.json({ success: false, message: validationError }, { status: 400 });
  }

  // Rate limit
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  if (checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, message: 'Too many requests. Please try again after 1 hour.' },
      { status: 429 }
    );
  }

  // Env vars
  const serviceId  = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey  = process.env.EMAILJS_PUBLIC_KEY;
  const toEmail    = process.env.CONTACT_TO_EMAIL;

  if (!serviceId || !templateId || !publicKey || !toEmail) {
    console.error('[contact] Missing one or more required EmailJS environment variables.');
    return NextResponse.json(
      { success: false, message: 'Server configuration error.' },
      { status: 500 }
    );
  }

  // Send via EmailJS — with 8s timeout
  try {
    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), 8000); // 8 seconds

    let ejsRes;
    try {
      ejsRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        signal:  controller.signal,
        body: JSON.stringify({
          service_id:  serviceId,
          template_id: templateId,
          user_id:     publicKey,
          template_params: {
            to_email:   toEmail,
            from_name:  name.trim(),
            from_email: email.trim(),
            phone:      phone.trim(),
            position,
            message:    message.trim(),
          },
        }),
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!ejsRes.ok) {
      const errText = await ejsRes.text();
      console.error('[contact] EmailJS error:', ejsRes.status, errText);
      return NextResponse.json(
        { success: false, message: 'Failed to send message. Please try again.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, message: 'Message sent successfully.' });

  } catch (err) {
    if (err.name === 'AbortError') {
      console.error('[contact] EmailJS timed out');
      return NextResponse.json(
        { success: false, message: 'Request timed out. Please try again.' },
        { status: 504 }
      );
    }
    console.error('[contact] Unexpected error:', err);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}