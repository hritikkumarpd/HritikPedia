/**
 * Hritikpedia - Advertising Management & Provider Adapters
 * Zero-budget-first monetization architecture.
 * Supports Google AdSense responsive units and Direct Educational Sponsors.
 */

export const AD_FORMATS = {
  LEADERBOARD: 'leaderboard', // 728x90 (Desktop)
  RECTANGLE: 'rectangle',     // 300x250 (In-content / Sidebar)
  RESPONSIVE: 'responsive',   // Auto-fluid
  BANNER: 'banner',           // 320x50 (Mobile)
};

export const AD_SLOTS = {
  HEADER: 'header-leaderboard',
  MOBILE_TOP: 'mobile-top',
  IN_CONTENT_1: 'in-content-1',
  IN_CONTENT_2: 'in-content-2',
  SIDEBAR: 'sidebar-sticky',
};

/**
 * Validates a direct sponsor creative.
 * Requirements:
 * - HTTPS link required for destination URL
 * - Valid title and sponsor name
 * - No malicious scripts or iframe embeds allowed
 */
export function validateSponsorCreative({ title, sponsorName, link, bannerText }) {
  const errors = [];

  if (!title || title.trim().length < 3) {
    errors.push('Title must be at least 3 characters long');
  }

  if (!sponsorName || sponsorName.trim().length < 2) {
    errors.push('Sponsor name must be at least 2 characters long');
  }

  if (!link || (!link.startsWith('https://') && !link.startsWith('/'))) {
    errors.push('Destination URL must begin with https:// or be an internal relative path');
  }

  if (link && (link.includes('javascript:') || link.includes('data:'))) {
    errors.push('Insecure URL protocol prohibited');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Generates Google AdSense client script attributes if client ID is set in environment
 */
export function getAdSenseConfig() {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || '';
  const isEnabled = Boolean(publisherId && process.env.ENABLE_ADS !== 'false');

  return {
    publisherId,
    isEnabled,
  };
}
