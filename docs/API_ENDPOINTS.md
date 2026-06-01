# API Endpoints

Endpoints below are the real routes currently referenced by the mobile code. They are centralized in `src/config/apiRoutes.js`.

Every auth/customer request should include the Avomeal scope when the backend accepts it:

```text
id_user_business = 2
business_id = 2
site_key = avomeal
```

## Native API Calls

| Endpoint | Method | Params | Token | Business scope | Used by |
| --- | --- | --- | --- | --- | --- |
| `api/version` | GET | none | no | no | `src/http/getAppVersion.js` |
| `api/auth/login` | POST form | `email`, `password`, `expo_token`, `id_user_business`, `business_id`, `site_key` | no | yes | `SignInScreen` |
| `api/auth/login` | POST form | `google_token` or `apple_credentials`, plus business scope | no | yes | third-party login handlers |
| `api/auth/signup` | POST form | `name`, `lastname`, `email`, `phone`, `password`, `passwordConfirmation`, `level=5`, business scope | no | yes | `SignUpScreen` |
| `api/auth/forgot-password` | POST form | `email`, business scope | no | yes | `ForgotPasswordScreen` |
| `api/auth/validate-token` | POST form | `token`, business scope | token value in form | yes | `src/http/getUserData.js` |
| `api/set-expo-push-token` | POST JSON | `expo_push_token`, `api_token` | bearer token | not currently sent | `Panel` |
| `api/GetUserData` | POST JSON | `token`, business scope | token value in body | yes | `ConfirmPhoneScreen1` |
| `api/getActivationSMS` | POST JSON | `token`, `phoneNumber`, business scope | token value in body | yes | `ConfirmPhoneScreen1` |
| `api/firsrActivation` | POST JSON | `token`, `validationCode`, business scope | token value in body | yes | `ConfirmPhoneScreen2` |
| `api/auth/apple-signing/client-app` | POST JSON | `identityToken`, `accountType=client`, `level=5`, business scope | no | yes | `SignUpThridParty` |
| `api/auth/google/signup-app` | POST JSON | `idToken`, `accountType=client`, `level=5`, business scope | no | yes | `SignUpThridParty` |
| `api/auth/change-level` | POST JSON | `level` | bearer token | no | legacy helper; not active in customer dashboard |

## WebView Token Routes

Base builder:

```text
{webBaseUrl}Panel/Tokenapi/{token}/{path}?id_user_business=2&business_id=2&site_key=avomeal
```

Current paths opened from the mobile dashboard:

| Path | Purpose |
| --- | --- |
| `panel/store/orders/home` | Customer order history |
| `panel/store/subscriptions/home` | Customer subscriptions |
| `panel/store/nutrition-advisor` | Nutrition advisor |
| `panel/store/wellness-advisor` | Wellness advisor |
| `meal-plans` | Store / meal ordering |
| `store/cart` | Cart entry; must be backend-verified |
| `store/checkout` | Checkout entry; must be backend-verified before production |
| `panel/store/orders/home?intent=reorder` | Reorder entry point; UX prepared, backend behavior pending verification |
| `panel/settings` | Customer settings |
| `panel/planner-hub/team/store/orders/home` | Level 4 store operations |
| `panel/planner-hub/team/my-work` | Level 4 assigned work |
| `panel/planner-hub/team/payroll/clock` | Level 4 clock/location flow |

## Expected Store Filtering

Store endpoints behind WebView must filter Avomeal products by:

```text
id_user_business = 2
site_key = avomeal
site_visibility = VISIBLE
```

Native store/cart endpoints are not implemented in this repo yet.

## API Service

`src/config/apiClient.js` provides shared helpers for future native endpoints:

- `postForm(route, payload, options)`
- `postJson(route, payload, options)`
- `getReadableApiError(error, fallback)`

These helpers add token headers when available and apply Avomeal business scope.
