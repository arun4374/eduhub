// app/api/contact/route.js

import { NextResponse } from 'next/server';

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

  // 1. Secret header
  const apiSecret = req.headers.get('x-api-secret');
  if (!apiSecret || apiSecret !== process.env.CONTACT_API_SECRET) {
    return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
  }

  // 2. Origin check
  if (req.headers.get('origin')) {
    return NextResponse.json({ success: false, message: 'Forbidden.' }, { status: 403 });
  }

  // 3. User-Agent check
  if (!req.headers.get('user-agent')?.includes('ArivonApp')) {
    return NextResponse.json({ success: false, message: 'Forbidden.' }, { status: 403 });
  }

  // 4. Parse body
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
  } = body;

  // 5. Validate
  const validationError = validate({ name, email, phone, position, message, honeypot });
  if (validationError) {
    return NextResponse.json({ success: false, message: validationError }, { status: 400 });
  }

  // 6. Rate limit
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  if (checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, message: 'Too many requests. Please try again after 1 hour.' },
      { status: 429 }
    );
  }

  // 7. Env vars
  const serviceId  = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey  = process.env.EMAILJS_PUBLIC_KEY;
  const toEmail    = process.env.CONTACT_TO_EMAIL;

  if (!serviceId || !templateId || !publicKey || !toEmail) {
    console.error('[contact] Missing EmailJS env vars');
    return NextResponse.json(
      { success: false, message: 'Server configuration error.' },
      { status: 500 }
    );
  }

  // 8. Send via EmailJS — with 8s timeout so Flutter doesn't hang
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
