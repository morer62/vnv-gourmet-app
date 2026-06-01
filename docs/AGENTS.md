# Avomeal Mobile App Agent Guide

This repository is the Avomeal Mobile App.

Tech stack:

```text
React Native / Expo
```

This repository is not:

```text
Ophyra Web
VNV Events Web
VNV Events Mobile App
```

Before touching code, read these files in order:

1. `docs/MOBILE_APP_STANDARD.md`
2. `docs/AVOMEAL_MOBILE_CONTEXT.md`
3. `docs/BRANDING_AND_BUSINESS_ID.md`
4. `docs/API_ENDPOINTS.md`
5. `docs/AUTH_AND_SIGNUP_FLOW.md`
6. `docs/STORE_AND_ORDER_FLOW.md`
7. `docs/LEVEL_4_TEAM_MEMBER_FLOW.md`
8. `docs/NAVIGATION_FLOW.md`
9. `docs/NEXT_AGENT_HANDOFF.md`

## Non-Negotiable Scope

Avomeal Mobile is a branded customer app. It must use:

```text
id_user_business = 2
site_key = avomeal
brand = Avomeal
```

Mobile signup creates or associates final customers only, normally Level 5. It must not create Ophyra businesses, Level 1 users, Level 2 users, SaaS memberships, modules, or affiliates.

## Current App Shape

The current Expo app is mostly a native shell:

- Native splash/intro/session restore.
- Native login, signup, forgot password, phone confirmation, dashboard shell.
- Tokenized WebView handoff for store, orders, subscriptions, settings, and account pages.
- No complete native store/cart/checkout/order implementation is present in this repo yet.
- Google/Apple OAuth is disabled in the active UI; do not re-enable without a dedicated social-auth sprint.

## Editing Rules

- Keep `businessId`, `siteKey`, brand name, API base URL, Web base URL, and feature flags centralized in `src/config/businessConfig.js`.
- Use `src/config/apiRoutes.js` for endpoint paths and WebView token URLs.
- Do not scatter raw `2`, `avomeal`, or `https://avomeal.com/` through screens.
- Do not expose VNV Events or Ophyra internal tools in the customer mobile flow.
- Do not change bundle/package IDs, production payment behavior, or large architecture without explicit approval.
