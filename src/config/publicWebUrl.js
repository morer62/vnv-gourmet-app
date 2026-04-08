import { API_URL, PUBLIC_WEB_URL } from '@env';

/**
 * Sitio público (navegador). Por defecto Avomeal.
 */
export function getPublicMarketingUrl() {
  const explicit = (PUBLIC_WEB_URL || '').trim();
  if (explicit) {
    return explicit.replace(/\/?$/, '/');
  }
  try {
    const raw = (API_URL || '').trim();
    if (!raw) return 'https://avomeal.com/';
    const u = new URL(raw.endsWith('/') ? raw : `${raw}/`);
    const path = u.pathname.replace(/\/public\/?$/i, '');
    const base = `${u.origin}${path.endsWith('/') ? path : `${path}/`}`;
    return base;
  } catch {
    return 'https://avomeal.com/';
  }
}
