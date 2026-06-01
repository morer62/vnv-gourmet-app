# WebView Backend Contract

This document is the contract between Avomeal Mobile App and the backend pages opened inside WebView.

## URL Builder

All protected routes must be opened through:

```text
buildTokenWebViewUrl(token, route)
```

Final URL shape:

```text
https://avomeal.com/Panel/Tokenapi/{token}/{route}?id_user_business=2&business_id=2&site_key=avomeal
```

The builder must:

- URL-encode the token.
- Preserve route query params, for example `?intent=reorder`.
- Set, not duplicate, Avomeal scope params.
- Keep `id_user_business`, `business_id`, and `site_key` in the final query string.

## Auth Expectations

Backend `Panel/Tokenapi/{token}/{route}` should:

- Read the mobile token.
- Resolve the user.
- Create or refresh the backend session for the WebView.
- Preserve Avomeal scope into route/controller context.
- Avoid asking the user to log in again while the token is valid.
- Redirect or show a clear auth error when the token is expired/invalid.

## Route Contract

| Feature | Route | Role | Requires token | Requires scope | Expected page | Failure/empty behavior |
| --- | --- | --- | --- | --- | --- | --- |
| Store | `meal-plans` | Level 5 | yes | yes | Avomeal product/storefront page | Empty state if no visible Avomeal products |
| Cart | `store/cart` | Level 5 | yes | yes | Current customer cart | Empty cart state; no backend crash |
| Checkout | `store/checkout` | Level 5 | yes | yes | Checkout with Avomeal payment provider | Clear minimum-order/provider/config error |
| Customer orders | `panel/store/orders/home` | Level 5 | yes | yes | Customer Avomeal order history | Empty state if no orders |
| Reorder | `panel/store/orders/home?intent=reorder` | Level 5 | yes | yes | Previous orders/reorder entry | Clear fallback if reorder is not implemented |
| Subscriptions | `panel/store/subscriptions/home` | Level 5 | yes | yes | Active/history subscriptions | Empty state if none |
| Nutrition advisor | `panel/store/nutrition-advisor` | Level 5 | yes | yes | Avomeal nutrition tool | Clear unavailable state if not implemented |
| Wellness advisor | `panel/store/wellness-advisor` | Level 5 | yes | yes | Avomeal wellness/food tool | Clear unavailable state if not implemented |
| Settings | `panel/settings` | Level 5/4/1 | yes | yes | Account/profile settings | Auth error if token invalid |
| Team store orders | `panel/planner-hub/team/store/orders/home` | Level 4 | yes | yes | Assigned Avomeal store work | Empty assigned-work state |
| Team my work | `panel/planner-hub/team/my-work` | Level 4 | yes | yes | Current team tasks | Empty assigned-work state |
| Team clock | `panel/planner-hub/team/payroll/clock` | Level 4 | yes | yes | Clock in/out; may request geolocation | Clear location-permission error |
| Team chat | `panel/planner-hub/team/chat` | Level 4 | yes | yes | Team/customer chat if enabled | Empty/unavailable state |
| Admin orders fallback | `panel/planner-hub/store/orders/home` | Level 1 | yes | yes | Basic Avomeal store admin/order page | Auth/permission error instead of blank page |

## Store Scope Rules

Store pages must filter:

```text
id_user_business = 2
business_id = 2
site_key = avomeal
site_visibility = VISIBLE
```

Backend must not show VNV Events products, orders, subscriptions, team tasks, or tools.

## Checkout Rules

Checkout must:

- Read minimum order from backend/settings.
- Use Avomeal's active payment provider.
- Revalidate stock, price, variation, and availability before payment.
- Create `store_orders`, `store_order_items`, and payment records under Avomeal ownership.
- Show mobile-readable errors when no provider or invalid cart exists.

## Reorder Rules

Reorder must not duplicate an order blindly. It must:

- Confirm the previous order belongs to the current customer.
- Revalidate product visibility, price, and availability.
- Re-add available items to cart only after customer action.
- Show unavailable items clearly.

## Mobile WebView Behavior

The app now:

- Shows a visible error instead of infinite spinner when token/route is missing.
- Shows friendly errors for HTTP 401/403/404/5xx.
- Enables geolocation and inline media for backend pages that need them.
- Clears session and returns to sign-in when session is missing/expired.
