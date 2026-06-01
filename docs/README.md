# Avomeal Mobile App Docs

This docs folder defines the Avomeal branded mobile app. The authoritative scope is:

```text
businessId = 2
siteKey = avomeal
brandName = Avomeal
```

Start here:

1. `AGENTS.md`
2. `MOBILE_APP_STANDARD.md`
3. `AVOMEAL_MOBILE_CONTEXT.md`
4. `BRANDING_AND_BUSINESS_ID.md`
5. `API_ENDPOINTS.md`
6. `AUTH_AND_SIGNUP_FLOW.md`
7. `STORE_AND_ORDER_FLOW.md`
8. `SUBSCRIPTIONS_FLOW.md`
9. `LEVEL_4_TEAM_MEMBER_FLOW.md`
10. `NAVIGATION_FLOW.md`
11. `WEBVIEW_TOKEN_FLOW.md`
12. `WEBVIEW_BACKEND_CONTRACT.md`
13. `WEBVIEW_QA_REPORT.md`
14. `QA_CHECKLIST.md`
15. `NEXT_AGENT_HANDOFF.md`

## Implementation Snapshot

The app is React Native / Expo. It currently implements a native auth and dashboard shell, then opens backend/web features through a tokenized WebView route.

Implemented in native code:

- Splash / intro video shell.
- Session restore from `AsyncStorage`.
- Login.
- Signup as customer Level 5.
- Third-party customer signup.
- Forgot password.
- Dashboard entry cards.
- WebView token handoff.
- Expo push-token registration.

Mostly delegated to backend/web through WebView:

- Store.
- Categories.
- Product details.
- Cart.
- Checkout.
- Orders.
- Subscriptions.
- Settings.

## Current Readiness

The repo is prepared for a real QA pass, but not certified ready for production release until backend endpoint behavior is tested with real Avomeal credentials, products, minimum order settings, payment provider settings, and customer orders.
