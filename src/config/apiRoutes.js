import { appendBusinessScope, BUSINESS_CONFIG } from './businessConfig';

export const API_ROUTES = {
  appVersion: 'api/version',
  login: 'api/auth/login',
  signup: 'api/auth/signup',
  forgotPassword: 'api/auth/forgot-password',
  validateToken: 'api/auth/validate-token',
  changeLevel: 'api/auth/change-level',
  setExpoPushToken: 'api/set-expo-push-token',
  getUserData: 'api/GetUserData',
  activationSms: 'api/getActivationSMS',
  firstActivation: 'api/firsrActivation',
  appleClientSignup: 'api/auth/apple-signing/client-app',
  googleClientSignup: 'api/auth/google/signup-app',
};

export const WEBVIEW_ROUTES = {
  storeHome: 'meal-plans',
  cart: 'store/cart',
  checkout: 'store/checkout',
  customerOrders: 'panel/store/orders/home',
  reorder: 'panel/store/orders/home?intent=reorder',
  subscriptions: 'panel/store/subscriptions/home',
  nutritionAdvisor: 'panel/store/nutrition-advisor',
  wellnessAdvisor: 'panel/store/wellness-advisor',
  customerSettings: 'panel/settings',
  teamStoreOrders: 'panel/planner-hub/team/store/orders/home',
  teamMyWork: 'panel/planner-hub/team/my-work',
  teamClock: 'panel/planner-hub/team/payroll/clock',
  teamChat: 'panel/planner-hub/team/chat',
  adminStoreOrders: 'panel/planner-hub/store/orders/home',
};

export function getApiUrl(route) {
  const cleanRoute = String(route || '').replace(/^\/+/, '');
  return `${BUSINESS_CONFIG.apiBaseUrl}${cleanRoute}`;
}

export function buildTokenWebViewUrl(token, path) {
  const cleanPath = String(path || '').replace(/^\/+/, '');
  return appendBusinessScope(
    `${BUSINESS_CONFIG.webBaseUrl}Panel/Tokenapi/${encodeURIComponent(token)}/${cleanPath}`
  );
}
