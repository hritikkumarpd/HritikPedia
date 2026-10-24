/**
 * Hritikpedia - Multi-Channel Messaging & Notification Adapters
 * Strict Opt-in Discipline & Zero-Budget Fallbacks.
 * Covers:
 * 1. Newsletter & Transactional Email (Resend / SMTP / Console)
 * 2. SMS Notifications (Fast2SMS / Twilio) - Safe off-by-default
 * 3. WhatsApp Business Cloud API - Safe off-by-default
 */

/**
 * Validates Indian 10-digit mobile number or E.164 phone number
 */
export function validatePhoneNumber(phone) {
  if (!phone || typeof phone !== 'string') return false;
  const clean = phone.replace(/[\s\-\(\)]/g, '');
  // Matches +91 followed by 10 digits starting with 6-9, or 10 digits directly
  return /^(\+91)?[6-9]\d{9}$/.test(clean);
}

/**
 * Formats phone number into standard E.164 format for WhatsApp / SMS APIs
 */
export function formatE164(phone) {
  const clean = phone.replace(/[\s\-\(\)]/g, '');
  if (clean.startsWith('+')) return clean;
  if (clean.length === 10) return `+91${clean}`;
  return clean;
}

/**
 * Dispatches an educational newsletter or broadcast email.
 * Falls back cleanly to console log if RESEND_API_KEY / SMTP not set (Zero-Budget Mode).
 */
export async function dispatchEmail({ to, subject, html, text }) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log(`[ZERO-BUDGET EMAIL DISPATCH (DEV/MOCK)] To: ${to} | Subject: "${subject}"`);
    return {
      success: true,
      provider: 'console_mock',
      messageId: `mock_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'Hritikpedia <updates@hritikpedia.com>',
        to: [to],
        subject,
        html,
        text,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Email dispatch failed');
    return { success: true, provider: 'resend', messageId: data.id };
  } catch (err) {
    console.error('Email delivery error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * SMS Notification Adapter (Fast2SMS / Twilio)
 * Strict opt-in required. Disabled by default via ENABLE_SMS=false to prevent charges.
 */
export async function sendSMS({ phone, message, optInVerified = false }) {
  const isEnabled = process.env.ENABLE_SMS === 'true';

  if (!optInVerified) {
    throw new Error('Compliance rejection: SMS requires explicit optInVerified flag');
  }

  if (!validatePhoneNumber(phone)) {
    throw new Error('Invalid mobile phone number format');
  }

  if (!isEnabled) {
    console.log(`[SMS ADAPTER DISABLED (FREE-TIER SAFEGUARD)] To: ${phone} | Msg: "${message}"`);
    return {
      success: true,
      provider: 'mock_disabled',
      delivered: false,
      reason: 'ENABLE_SMS flag is false',
    };
  }

  // Fast2SMS Indian gateway implementation
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (apiKey) {
    try {
      const res = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          authorization: apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: 'v3',
          sender_id: 'TXTIND',
          message,
          language: 'english',
          flash: 0,
          numbers: phone.replace('+91', ''),
        }),
      });

      const json = await res.json();
      return { success: json.return === true, provider: 'fast2sms', details: json };
    } catch (err) {
      console.error('Fast2SMS error:', err);
      return { success: false, error: err.message };
    }
  }

  return { success: true, provider: 'unconfigured_mock' };
}

/**
 * WhatsApp Business Cloud API Adapter (Meta Graph API)
 * Template-only messages, strict opt-in, disabled by default via ENABLE_WHATSAPP=false.
 */
export async function sendWhatsAppMessage({ phone, templateName, components = [], optInVerified = false }) {
  const isEnabled = process.env.ENABLE_WHATSAPP === 'true';

  if (!optInVerified) {
    throw new Error('Compliance rejection: WhatsApp messaging requires verified user opt-in');
  }

  if (!validatePhoneNumber(phone)) {
    throw new Error('Invalid phone number for WhatsApp message');
  }

  const e164 = formatE164(phone);

  if (!isEnabled) {
    console.log(`[WHATSAPP ADAPTER DISABLED (FREE-TIER SAFEGUARD)] To: ${e164} | Template: ${templateName}`);
    return {
      success: true,
      provider: 'mock_disabled',
      delivered: false,
      reason: 'ENABLE_WHATSAPP flag is false',
    };
  }

  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneNumberId) {
    return {
      success: false,
      error: 'WhatsApp Business credentials not configured in environment',
    };
  }

  try {
    const res = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: e164.replace('+', ''),
        type: 'template',
        template: {
          name: templateName,
          language: { code: 'en' },
          components,
        },
      }),
    });

    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Meta API error');

    return {
      success: true,
      provider: 'whatsapp_cloud_api',
      messageId: json.messages?.[0]?.id,
    };
  } catch (err) {
    console.error('WhatsApp dispatch error:', err);
    return { success: false, error: err.message };
  }
}
