import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { getAdminApp } from '@/lib/firebaseAdmin';

export const runtime = 'nodejs';

const COLLECTION = 'newsletter_subscribers';
const ipAttempts = new Map();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 3;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = ipAttempts.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    ipAttempts.set(ip, { windowStart: now, count: 1 });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count += 1;
  return false;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    if (isRateLimited(ip)) {
      return new Response(JSON.stringify({ error: 'Too many requests. Please try again later.' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { fullName, email } = await request.json();
    const normalizedFullName = String(fullName || '').trim();
    const normalizedEmail = String(email || '').trim().toLowerCase();

    if (!normalizedFullName) {
      return new Response(JSON.stringify({ error: 'Please provide your full name.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
      return new Response(JSON.stringify({ error: 'Please provide a valid email address.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const db = getFirestore(getAdminApp());
    const existing = await db
      .collection(COLLECTION)
      .where('email', '==', normalizedEmail)
      .limit(1)
      .get();

    if (!existing.empty) {
      return new Response(JSON.stringify({ message: 'You are already subscribed.' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await db.collection(COLLECTION).add({
      fullName: normalizedFullName,
      email: normalizedEmail,
      subscribedAt: Timestamp.now(),
      source: 'website_footer',
    });

    return new Response(JSON.stringify({ message: 'Subscribed successfully.' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return new Response(JSON.stringify({ error: 'Failed to subscribe. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
