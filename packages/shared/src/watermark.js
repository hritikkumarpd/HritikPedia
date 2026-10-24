/**
 * WATERMARK GENERATION & METADATA UTILITIES
 * Generates secure, user-specific watermarks for protected PDF viewing.
 * Masks sensitive email portions to prevent accidental PII exposure while maintaining deterrence.
 */

export function maskEmail(email) {
  if (!email || typeof email !== 'string') return 'anonymous@hritikpedia';
  const parts = email.split('@');
  if (parts.length !== 2) return 'user***@hritikpedia';

  const [name, domain] = parts;
  let maskedName = name;
  if (name.length <= 2) {
    maskedName = name[0] + '*';
  } else {
    maskedName = name.slice(0, 2) + '*'.repeat(Math.max(2, name.length - 4)) + name.slice(-2);
  }

  return `${maskedName}@${domain}`;
}

export function generateWatermarkMetadata({ user, note, ipAddress = '' }) {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
  const maskedEmail = user ? maskEmail(user.email) : 'Public Preview';
  const shortUserId = user?.id ? `UID-${String(user.id).substring(0, 8)}` : 'GUEST';
  const noteTitle = note?.title ? (note.title.length > 25 ? note.title.substring(0, 25) + '...' : note.title) : 'Hritikpedia Study Notes';

  const primaryText = `HRITIKPEDIA • ${maskedEmail} • ${shortUserId}`;
  const secondaryText = `${noteTitle} • Licensed Copy • ${timestamp}`;

  return {
    primaryText,
    secondaryText,
    lineText: `${primaryText}  |  ${secondaryText}`,
    timestamp,
    maskedEmail,
    shortUserId,
    opacity: parseFloat(process.env.WATERMARK_OPACITY || '0.18'),
    fontSize: parseInt(process.env.WATERMARK_FONT_SIZE || '13', 10),
    rotationAngle: -30, // degrees
    disclaimer: 'Personal educational copy. Unauthorized distribution or copying is strictly prohibited.',
  };
}

export const maskEmailForWatermark = maskEmail;

export function generateWatermarkText({ email, userId, noteTitle }) {
  const masked = maskEmail(email);
  const uid = userId ? `UID: ${userId}` : 'UID: GUEST';
  const title = noteTitle || 'Hritikpedia Educational Notes';
  const time = new Date().toISOString().slice(0, 19).replace('T', ' ') + ' UTC';
  return `HRITIKPEDIA • ${masked} • ${uid} • ${title} • ${time}`;
}

export function generateWatermarkSvg({ email, userId, noteTitle, opacity = 0.18 }) {
  const text = generateWatermarkText({ email, userId, noteTitle });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400">
    <defs>
      <pattern id="wm" width="400" height="250" patternTransform="rotate(-30)" patternUnits="userSpaceOnUse">
        <text x="20" y="50" font-family="sans-serif" font-size="12" fill="currentColor" fill-opacity="${opacity}" font-weight="600">
          ${text}
        </text>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#wm)" />
  </svg>`;
}

export default {
  maskEmail,
  maskEmailForWatermark,
  generateWatermarkMetadata,
  generateWatermarkText,
  generateWatermarkSvg,
};
