/**
 * INPUT VALIDATION AND SANITIZATION UTILITIES
 */

export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/; // E.164 international standard

export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  return email.length <= 254 && EMAIL_REGEX.test(email.trim());
}

export function isValidSlug(slug) {
  if (!slug || typeof slug !== 'string') return false;
  return slug.length >= 2 && slug.length <= 100 && SLUG_REGEX.test(slug.trim());
}

export function generateSlug(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function isValidPassword(password) {
  if (!password || typeof password !== 'string') return false;
  // Minimum 8 characters, at least one letter and one number or symbol
  return password.length >= 8 && /[a-zA-Z]/.test(password) && /[\d\W]/.test(password);
}

export function isValidUrl(urlStr) {
  if (!urlStr || typeof urlStr !== 'string') return false;
  try {
    const parsed = new URL(urlStr);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function sanitizeHtml(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function validateNoteInput(data) {
  const errors = {};

  if (!data.title || typeof data.title !== 'string' || data.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters long';
  }

  if (!data.slug || !isValidSlug(data.slug)) {
    errors.slug = 'Valid URL-friendly slug is required (e.g. "dbms-normalization-notes")';
  }

  if (!data.subject_id) {
    errors.subject_id = 'Subject is required';
  }

  if (data.is_free === false || data.price > 0) {
    const price = parseFloat(data.price);
    if (isNaN(price) || price < 0) {
      errors.price = 'Price must be a non-negative number';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateArticleInput(data) {
  const errors = {};

  if (!data.title || typeof data.title !== 'string' || data.title.trim().length < 5) {
    errors.title = 'Article title must be at least 5 characters long';
  }

  if (!data.slug || !isValidSlug(data.slug)) {
    errors.slug = 'Valid URL slug is required';
  }

  if (!data.content || typeof data.content !== 'string' || data.content.trim().length < 20) {
    errors.content = 'Content must contain substantive text';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export default {
  EMAIL_REGEX,
  SLUG_REGEX,
  isValidEmail,
  isValidSlug,
  generateSlug,
  isValidPassword,
  isValidUrl,
  sanitizeHtml,
  validateNoteInput,
  validateArticleInput,
};
