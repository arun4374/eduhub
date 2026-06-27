// pages/api/contact.js

// ─── In-memory rate limit (per Vercel instance) ───────────────────────────────
// Good enough for a student app — resets on cold start but that's fine
const rateLimitMap = new Map(); // ip → { count, resetAt }
const RATE_LIMIT   = 3;
const WINDOW_MS    = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip) {
  const now   = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false; // not limited
  }
  if (entry.count >= RATE_LIMIT) return true; // limited
  entry.count++;
  return false;
}

// ─── Allowed values ───────────────────────────────────────────────────────────
const ALLOWED_POSITIONS = ['Student', 'Faculty', 'Developer', 'Other'];

// ─── Validation ───────────────────────────────────────────────────────────────
function validate({ name, email, phone, position, message, honeypot }) {
  if (honeypot !== '')
    return 'Bad request.';

  if (!name || name.trim().length === 0)
    return 'Name is required.';

  if (!email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email.trim()))
    return 'A valid email is required.';

  if (!phone || phone.trim().replace(/\D/g, '').length < 10)
    return 'A valid phone number is required.';

  if (!position || !ALLOWED_POSITIONS.includes(position))
    return 'Invalid position value.';

  if (!message || message.trim().length < 10)
    return 'Message must be at least 10 characters.';

  return null; // null = valid
}

// ─── Handler ──────────────────────────────────────────────────────────────────
export default async function handler(req, res) {

  // 1. Method guard
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  // 2. Secret header — blocks anyone without the key
  const apiSecret = req.headers['x-api-secret'];
  if (!apiSecret || apiSecret !== process.env.CONTACT_API_SECRET) {
    return res.status(401).json({ success: false, message: 'Unauthorized.' });
  }

  // 3. Origin check — Flutter sends no origin; browsers/Postman always do
  if (req.headers['origin']) {
    return res.status(403).json({ success: false, message: 'Forbidden.' });
  }

  // 4. User-Agent check — only allow your app
  const userAgent = req.headers['user-agent'] || '';
  if (!userAgent.includes('ArivonApp')) {
    return res.status(403).json({ success: false, message: 'Forbidden.' });
  }

  // 5. Parse body
  const {
    name     = '',
    email    = '',
    phone    = '',
    position = '',
    message  = '',
    honeypot = '',
  } = req.body || {};

  // 6. Honeypot + validation
  const validationError = validate({ name, email, phone, position, message, honeypot });
  if (validationError) {
    return res.status(400).json({ success: false, message: validationError });
  }

  // 7. Rate limit by IP
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown';

  if (checkRateLimit(ip)) {
    return res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again after 1 hour.',
    });
  }

  // 8. Read EmailJS secrets from env
  const serviceId  = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey  = process.env.EMAILJS_PUBLIC_KEY;
  const toEmail    = process.env.CONTACT_TO_EMAIL;

  if (!serviceId || !templateId || !publicKey || !toEmail) {
    console.error('[contact] Missing EmailJS env vars');
    return res.status(500).json({
      success: false,
      message: 'Server configuration error. Please try again later.',
    });
  }

  // 9. Send via EmailJS
  try {
    const ejsRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
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

    if (!ejsRes.ok) {
      const errText = await ejsRes.text();
      console.error('[contact] EmailJS error:', errText);
      return res.status(502).json({
        success: false,
        message: 'Failed to send message. Please try again.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully.',
    });

  } catch (err) {
    console.error('[contact] Unexpected error:', err);
    return res.status(500).json({
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    });
  }
}
