import crypto from 'crypto';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'dev_secret_key';
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'dev_webhook_secret';

/**
 * Creates a server-side order with Razorpay API (or zero-budget test mock when in development).
 */
export async function createRazorpayOrder({ amountInRupees, receipt, notes = {} }) {
  const amountInPaise = Math.round(amountInRupees * 100);

  // In production, real Razorpay credentials are mandatory — never silently fall back to mock
  if (
    process.env.NODE_ENV === 'production' &&
    (RAZORPAY_KEY_ID === 'rzp_test_placeholder' || RAZORPAY_KEY_SECRET === 'dev_secret_key')
  ) {
    throw new Error('FATAL: Razorpay production credentials are not configured');
  }

  // If in real production mode with valid credentials, call Razorpay API
  if (
    process.env.NODE_ENV === 'production' &&
    RAZORPAY_KEY_ID !== 'rzp_test_placeholder' &&
    RAZORPAY_KEY_SECRET !== 'dev_secret_key'
  ) {
    const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt: receipt.toString(),
        notes,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(`Razorpay API order creation failed: ${err.error?.description || response.statusText}`);
    }

    return await response.json();
  }

  // Zero-budget development mock order
  return {
    id: `order_dev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    entity: 'order',
    amount: amountInPaise,
    amount_paid: 0,
    amount_due: amountInPaise,
    currency: 'INR',
    receipt: receipt.toString(),
    status: 'created',
    attempts: 0,
    notes,
    created_at: Math.floor(Date.now() / 1000),
  };
}

/**
 * Verifies Razorpay payment signature HMAC SHA256.
 * Formula: HMAC_SHA256(order_id + "|" + payment_id, secret) == signature
 */
export function verifyPaymentSignature({ orderId, paymentId, signature }) {
  if (!orderId || !paymentId || !signature) return false;

  // In local test development with mock keys only — never accepted in production
  if (
    process.env.NODE_ENV !== 'production' &&
    orderId.startsWith('order_dev_') &&
    signature === 'dev_mock_signature'
  ) {
    return true;
  }

  const payload = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', RAZORPAY_KEY_SECRET)
    .update(payload)
    .digest('hex');

  // Constant-time buffer comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedSignature, 'hex'));
  } catch {
    return false;
  }
}

/**
 * Verifies incoming Razorpay webhook signature.
 */
export function verifyWebhookSignature({ rawBody, signature }) {
  if (!rawBody || !signature) return false;

  const expectedSignature = crypto
    .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex');

  try {
    return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedSignature, 'hex'));
  } catch {
    return false;
  }
}

/**
 * Issues a full or partial refund through the Razorpay Refunds API.
 * Never called for local mock orders — those are handled by the admin route.
 */
export async function refundRazorpayPayment({ paymentId, amountInRupees, notes = {} }) {
  if (!paymentId) {
    throw new Error('A Razorpay payment ID is required to issue a refund');
  }

  if (
    RAZORPAY_KEY_ID === 'rzp_test_placeholder' ||
    RAZORPAY_KEY_SECRET === 'dev_secret_key'
  ) {
    throw new Error(
      process.env.NODE_ENV === 'production'
        ? 'Razorpay credentials are not configured for refunds'
        : 'Razorpay credentials are not configured. Only local mock orders can be refunded.'
    );
  }

  const payload = { notes };
  if (typeof amountInRupees === 'number' && Number.isFinite(amountInRupees)) {
    payload.amount = Math.round(amountInRupees * 100);
  }

  const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
  const response = await fetch(
    `https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}/refund`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(payload),
    }
  );

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      `Razorpay refund failed: ${
        data?.error?.description || data?.error?.reason || response.statusText || response.status
      }`
    );
  }

  return data;
}

/**
 * Formats amount in INR.
 */
export function formatINR(amount) {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
}

/**
 * Calculates price after applying percentage coupon discount.
 */
export function calculateDiscountedPrice(price, discountPercent) {
  const p = Math.max(0, parseFloat(price) || 0);
  const d = Math.min(100, Math.max(0, parseInt(discountPercent, 10) || 0));
  const discounted = p - (p * d) / 100;
  return Math.max(0, Math.round(discounted));
}

export const verifyRazorpaySignature = verifyPaymentSignature;

export default {
  createRazorpayOrder,
  refundRazorpayPayment,
  verifyPaymentSignature,
  verifyRazorpaySignature,
  verifyWebhookSignature,
  calculateDiscountedPrice,
  formatINR,
};
