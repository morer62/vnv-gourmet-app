# WebView QA Report

## Scope

Sprint focus: WebView QA + backend contract validation for Avomeal Mobile App.

This pass validates app-side construction and hardening. Real backend/user-data validation still requires real Avomeal test accounts:

- Level 5 customer account.
- Level 4 team account if applicable.
- Level 1 account if allowed in mobile.
- At least one visible Avomeal product.
- A cart/checkout payment-provider sandbox.
- Existing order/subscription data for reorder/subscription checks.

## App-Side Validation Completed

- WebView routes are centralized in `src/config/apiRoutes.js`.
- `cart` and `checkout` were aligned to backend-style routes: `store/cart`, `store/checkout`.
- `buildTokenWebViewUrl(token, route)` appends Avomeal scope.
- Scope params are set with `URLSearchParams.set`, avoiding duplicate query values.
- Existing route query params are preserved, including `intent=reorder`.
- `PanelWebView` handles missing token/route with a visible error state.
- `PanelWebView` handles HTTP 401/403, 404, and 5xx with mobile-readable messages.
- WebView geolocation/inline media are enabled for Level 4 clock/map flows.
- Hidden drawer fallback no longer points to VNV Events.

## Route Status

| Route | App URL ready | Backend verified | Notes |
| --- | --- | --- | --- |
| `meal-plans` | yes | pending | Must confirm Avomeal-only visible products |
| `store/cart` | yes | pending | Must confirm backend route exists and session cart works |
| `store/checkout` | yes | pending | Must confirm provider/minimum-order behavior |
| `panel/store/orders/home` | yes | pending | Must confirm customer sees Avomeal-only orders |
| `panel/store/orders/home?intent=reorder` | yes | pending | Reorder behavior not confirmed |
| `panel/store/subscriptions/home` | yes | pending | Must confirm empty state or real subscriptions |
| `panel/store/nutrition-advisor` | yes | pending | Must confirm Avomeal-specific tool content |
| `panel/store/wellness-advisor` | yes | pending | Must confirm Avomeal-specific tool content |
| `panel/settings` | yes | pending | Must confirm session handoff |
| `panel/planner-hub/team/store/orders/home` | yes | pending | Requires Level 4 account |
| `panel/planner-hub/team/my-work` | yes | pending | Requires Level 4 account |
| `panel/planner-hub/team/payroll/clock` | yes | pending | Requires device geolocation QA |
| `panel/planner-hub/team/chat` | yes | pending | Requires Level 4/chat-enabled backend |
| `panel/planner-hub/store/orders/home` | yes | pending | Level 1 fallback only |

## Real QA Checklist

### Auth/WebView

- [ ] Login as Avomeal Level 5 customer.
- [ ] Open Store WebView and confirm no second login.
- [ ] Open Cart and confirm no second login.
- [ ] Open Checkout and confirm no second login.
- [ ] Open Orders and confirm no second login.
- [ ] Open Subscriptions and confirm no second login.
- [ ] Open Nutrition/Wellness tools and confirm no second login.

### Scope

- [ ] Confirm backend receives `id_user_business=2`.
- [ ] Confirm backend receives `business_id=2`.
- [ ] Confirm backend receives `site_key=avomeal`.
- [ ] Confirm products are Avomeal-only.
- [ ] Confirm orders are Avomeal-only.
- [ ] Confirm no VNV Events data/tools appear.

### Reorder

- [ ] Open reorder route.
- [ ] Confirm previous Avomeal orders appear.
- [ ] Confirm unavailable products are handled.
- [ ] Confirm prices are current before checkout.
- [ ] If route does not support reorder, document backend task.

### Checkout

- [ ] Add product to cart.
- [ ] Confirm minimum order comes from backend/settings.
- [ ] Confirm payment provider belongs to Avomeal.
- [ ] Confirm order is created with Avomeal scope.
- [ ] Confirm success/error page is mobile usable.

### Level 4

- [ ] Login as Level 4.
- [ ] Open assigned store orders.
- [ ] Open my work.
- [ ] Open chat.
- [ ] Open clock.
- [ ] Confirm geolocation prompt and denial handling.
- [ ] Confirm no customer-only or Level 1 tools appear.

### Error Handling

- [ ] Expired token returns clear error/sign-in path.
- [ ] No network shows WebView unavailable state.
- [ ] Backend 404 shows missing page message.
- [ ] Backend 500 shows retry-later message.
- [ ] Empty store/orders/subscriptions show clear empty states.

## Current Readiness

Ready for real device/backend QA.

Not production-certified until the pending backend checks above are completed.
