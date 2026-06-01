# Mobile App Standard

The mobile architecture should support one reusable technical base and many branded apps.

What changes by brand:

- Business ID / ownership.
- Site key / storefront scope.
- Brand name.
- Base URLs.
- Logos, icon, splash, copy, and colors.
- Feature flags.

What should stay reusable:

- Auth shell.
- Session restore.
- Token storage.
- API route helpers.
- WebView token handoff.
- Push-token registration.
- Shared loading/error states.

## Scope Rules

`id_user_business` means ownership. It tells the shared backend which business owns the customer, catalog, orders, payments, subscriptions, settings, and operational data.

`site_key` means storefront / brand scope. It tells the shared backend which public branded storefront the request belongs to.

For Avomeal:

```text
businessId = 2
siteKey = avomeal
brandName = Avomeal
```

## Central Config

The mobile app must read brand scope from `src/config/businessConfig.js`:

```js
export const BUSINESS_CONFIG = {
  businessId: 2,
  siteKey: 'avomeal',
  brandName: 'Avomeal',
  apiBaseUrl: 'https://avomeal.com/',
  webBaseUrl: 'https://avomeal.com/',
};
```

The actual file supports public env overrides:

```text
EXPO_PUBLIC_BUSINESS_ID=2
EXPO_PUBLIC_SITE_KEY=avomeal
EXPO_PUBLIC_BRAND_NAME=Avomeal
EXPO_PUBLIC_API_BASE_URL=https://avomeal.com/
EXPO_PUBLIC_WEB_BASE_URL=https://avomeal.com/
```

## Feature Flags

Optional features belong in `FEATURE_FLAGS` in `src/config/businessConfig.js`.

Current Avomeal defaults:

```js
store: true
subscriptions: true
nutritionalCalculators: true
serviceRequests: false
musicSessions: false
teamMemberMode: false
```

Do not assume VNV Events features such as music sessions, event tools, or team operations are active in Avomeal Mobile.
