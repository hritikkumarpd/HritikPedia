/**
 * HRITIKPEDIA REAL-TIME PRODUCTION WEBHOOK & ALERTING ENGINE
 * Dispatches instant notifications to Telegram, Discord, and Slack
 * for purchases, student registrations, and SOC security incidents.
 */

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || '';
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || '';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';

export const ALERT_TYPES = {
  ORDER: 'order',
  REGISTRATION: 'registration',
  SECURITY: 'security',
  SYSTEM: 'system',
};

/**
 * Sends a webhook alert to all configured channels (Discord, Telegram, Slack).
 * Executes asynchronously without blocking parent request execution.
 * @param {object} params
 * @param {string} params.type 'order' | 'registration' | 'security' | 'system'
 * @param {string} params.title Short headline
 * @param {string} params.message Detailed description
 * @param {object} [params.metadata] Key-value metadata
 */
export async function sendAlert({ type = ALERT_TYPES.SYSTEM, title, message, metadata = {} }) {
  // If no external webhook is configured, log cleanly in zero-budget console mode
  if (!DISCORD_WEBHOOK_URL && !SLACK_WEBHOOK_URL && (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID)) {
    console.log(`[ALERT : ${type.toUpperCase()}] 📢 ${title} — ${message}`);
    if (Object.keys(metadata).length > 0) {
      console.log(`  Details:`, metadata);
    }
    return { success: true, provider: 'console_zero_budget' };
  }

  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
  const promises = [];

  // 1. Telegram Bot Notification
  if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
    const icon = type === 'order' ? '💰' : type === 'security' ? '🚨' : type === 'registration' ? '🎓' : 'ℹ️';
    let text = `${icon} <b>${title}</b>\n\n${message}\n\n`;
    if (Object.keys(metadata).length > 0) {
      for (const [k, v] of Object.entries(metadata)) {
        text += `• <b>${k}:</b> ${v}\n`;
      }
    }
    text += `\n⏱ <i>${timestamp}</i> | <b>Hritikpedia Core</b>`;

    promises.push(
      fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text,
          parse_mode: 'HTML',
          disable_web_page_preview: true,
        }),
      }).catch((err) => console.warn('[ALERT] Telegram dispatch failed:', err.message))
    );
  }

  // 2. Discord Webhook Notification
  if (DISCORD_WEBHOOK_URL) {
    const color =
      type === 'order'
        ? 0x10b981 // Emerald Green
        : type === 'security'
        ? 0xef4444 // Red
        : type === 'registration'
        ? 0x3b82f6 // Blue
        : 0x8b5cf6; // Purple

    const fields = Object.entries(metadata).map(([k, v]) => ({
      name: k,
      value: String(v),
      inline: true,
    }));

    promises.push(
      fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'Hritikpedia Alerts',
          avatar_url: 'https://hritikpedia.com/logo.png',
          embeds: [
            {
              title,
              description: message,
              color,
              fields,
              footer: { text: `Hritikpedia Production • ${timestamp}` },
            },
          ],
        }),
      }).catch((err) => console.warn('[ALERT] Discord dispatch failed:', err.message))
    );
  }

  // 3. Slack Webhook Notification
  if (SLACK_WEBHOOK_URL) {
    const metaText = Object.entries(metadata)
      .map(([k, v]) => `*${k}:* ${v}`)
      .join(' | ');

    promises.push(
      fetch(SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `*${title}*\n${message}\n>${metaText}`,
        }),
      }).catch((err) => console.warn('[ALERT] Slack dispatch failed:', err.message))
    );
  }

  await Promise.allSettled(promises);
  return { success: true };
}

/**
 * Dedicated Helper: New Purchase Alert
 */
export function alertNewOrder({ orderId, studentName, studentEmail, noteTitle, amount, paymentId }) {
  return sendAlert({
    type: ALERT_TYPES.ORDER,
    title: `💰 New Note Purchase: ₹${amount}`,
    message: `Learner **${studentName}** just unlocked full lifetime access to **${noteTitle}**!`,
    metadata: {
      'Student': studentName,
      'Email': studentEmail,
      'Note': noteTitle,
      'Amount': `₹${amount}`,
      'Order ID': orderId,
      'Payment ID': paymentId || 'N/A',
    },
  });
}

/**
 * Dedicated Helper: New Student Registration Alert
 */
export function alertNewStudent({ name, email, userId }) {
  return sendAlert({
    type: ALERT_TYPES.REGISTRATION,
    title: `🎓 New Student Joined Hritikpedia`,
    message: `Welcome **${name}** to the Hritikpedia learning community!`,
    metadata: {
      'Name': name,
      'Email': email,
      'User ID': String(userId),
    },
  });
}

/**
 * Dedicated Helper: Security Threat / SOC Alert
 */
export function alertSecurityThreat({ eventType, ipAddress, details }) {
  return sendAlert({
    type: ALERT_TYPES.SECURITY,
    title: `🚨 SOC Alert: ${eventType}`,
    message: `A security-critical event was intercepted and blocked by the defensive engine.`,
    metadata: {
      'Event Type': eventType,
      'Source IP': ipAddress,
      'Details': typeof details === 'object' ? JSON.stringify(details) : String(details),
    },
  });
}

export default {
  ALERT_TYPES,
  sendAlert,
  alertNewOrder,
  alertNewStudent,
  alertSecurityThreat,
};
