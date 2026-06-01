/* eslint-disable import/no-unresolved */
import {
  API_URL,
  EXPO_PUBLIC_API_BASE_URL,
  EXPO_PUBLIC_BRAND_NAME,
  EXPO_PUBLIC_BUSINESS_ID,
  EXPO_PUBLIC_SITE_KEY,
  EXPO_PUBLIC_WEB_BASE_URL,
  PUBLIC_WEB_URL,
} from '@env';

const DEFAULT_API_BASE_URL = 'https://avomeal.com/';
const DEFAULT_WEB_BASE_URL = 'https://avomeal.com/';

function normalizeBaseUrl(value, fallback) {
  const raw = typeof value === 'string' ? value.trim() : '';
  const base = raw || fallback;
  return base.endsWith('/') ? base : `${base}/`;
}

function parseBusinessId(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 2;
}

export const BUSINESS_CONFIG = {
  businessId: parseBusinessId(EXPO_PUBLIC_BUSINESS_ID),
  siteKey: EXPO_PUBLIC_SITE_KEY || 'avomeal',
  brandName: EXPO_PUBLIC_BRAND_NAME || 'Avomeal',
  apiBaseUrl: normalizeBaseUrl(EXPO_PUBLIC_API_BASE_URL || API_URL, DEFAULT_API_BASE_URL),
  webBaseUrl: normalizeBaseUrl(EXPO_PUBLIC_WEB_BASE_URL || PUBLIC_WEB_URL || API_URL, DEFAULT_WEB_BASE_URL),
};

export const FEATURE_FLAGS = {
  store: true,
  subscriptions: true,
  nutritionalCalculators: true,
  serviceRequests: false,
  musicSessions: false,
  teamMemberMode: false,
};

export function withBusinessScope(extra = {}) {
  return {
    ...extra,
    id_user_business: String(BUSINESS_CONFIG.businessId),
    business_id: String(BUSINESS_CONFIG.businessId),
    site_key: BUSINESS_CONFIG.siteKey,
  };
}

export function appendBusinessScope(url) {
  try {
    const scopedUrl = new URL(url);
    scopedUrl.searchParams.set('id_user_business', String(BUSINESS_CONFIG.businessId));
    scopedUrl.searchParams.set('business_id', String(BUSINESS_CONFIG.businessId));
    scopedUrl.searchParams.set('site_key', BUSINESS_CONFIG.siteKey);
    return scopedUrl.toString();
  } catch {
    const [base, query = ''] = String(url).split('?');
    const params = new URLSearchParams(query);
    params.set('id_user_business', String(BUSINESS_CONFIG.businessId));
    params.set('business_id', String(BUSINESS_CONFIG.businessId));
    params.set('site_key', BUSINESS_CONFIG.siteKey);
    return `${base}?${params.toString()}`;
  }
}
