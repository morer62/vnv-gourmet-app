# Next Agent Handoff

## What Was Corrected

- Added central Avomeal config in `src/config/businessConfig.js`.
- Added API route and WebView URL helpers in `src/config/apiRoutes.js`.
- Updated Axios default base URL to use Avomeal config.
- Updated login, signup, forgot password, validate-token, phone confirmation, third-party signup, and WebView routes to use central helpers.
- Added Avomeal business scope to customer-facing auth/signup calls.
- Forced the mobile dashboard and bottom orders nav to the Level 5 customer view.
- Replaced third-party signup account choices with a customer-only Avomeal account action.
- Updated visible auth/dashboard copy from inherited VNV labels to Avomeal-driven copy.
- Disabled active Google/Apple initialization and removed OAuth handlers from the login UI path.
- Restored role-aware dashboard behavior for Level 4 while keeping Level 5 as the default customer view.
- Added central WebView route constants and a light API service for future native store/reorder endpoints.
- Added reorder/cart/checkout WebView entry points, with backend verification still required.
- Hardened `PanelWebView` with visible missing-token, HTTP error, retry, session-expired, geolocation and inline media handling.
- Added `WEBVIEW_BACKEND_CONTRACT.md` and `WEBVIEW_QA_REPORT.md`.
- Rewrote requested docs for Avomeal Mobile.

## Reference Repo Comparison

Reference reviewed:

```text
https://github.com/morer62/vnv-mobile-app
```

Adapted:

- Email/password-only active auth.
- Signup auto-login fallback.
- WebView token bridge for protected backend pages.
- Level 4 route documentation and geolocation-enabled WebView.
- QA checklist structure.

Not adapted:

- Event request modal.
- Music/media sessions.
- Venue/vendor signup choices.
- VNV Events event-operation routes.

## Current Code Limits

- Native store/cart/checkout/order/subscription screens are not present.
- Store/cart/checkout/orders/subscriptions depend on backend/web pages loaded by tokenized WebView.
- Reorder is currently a WebView entry point, not a confirmed native API flow.
- `cart` and `checkout` routes must be verified against the Avomeal backend.
- Backend contract for every WebView route is documented, but still pending real account/device validation.
- Backend behavior has not been verified with live Avomeal test credentials in this pass.
- Payment provider and minimum order behavior must be validated on backend/web.

## QA Checklist

- [ ] App opens.
- [ ] Splash/intro finishes or falls back after timeout.
- [ ] Branding says Avomeal.
- [ ] `BUSINESS_CONFIG.businessId` resolves to `2`.
- [ ] `BUSINESS_CONFIG.siteKey` resolves to `avomeal`.
- [ ] Login works with Avomeal customer credentials.
- [ ] Signup creates or associates a Level 5 Avomeal customer only.
- [ ] Third-party signup creates a customer only.
- [ ] Forgot password sends Avomeal-scoped request.
- [ ] Dashboard loads customer view.
- [ ] Store WebView opens `meal-plans`.
- [ ] Store shows only Avomeal visible products.
- [ ] Categories are Avomeal-scoped.
- [ ] Product detail loads.
- [ ] Cart works.
- [ ] Checkout reads minimum order from backend/settings.
- [ ] Checkout uses Avomeal payment provider.
- [ ] Order creation uses Avomeal scope.
- [ ] Customer sees only their Avomeal orders.
- [ ] Subscriptions page works or shows empty state.
- [ ] WebView token avoids double login.
- [ ] Logout clears session.

## Readiness

Ready for a real Avomeal QA pass. Not ready to declare production release complete until backend/web store, checkout, payment, orders, subscriptions, and token-scope behavior are tested end to end.
