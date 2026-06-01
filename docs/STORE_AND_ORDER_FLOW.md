# Store And Order Flow

The current mobile repo does not contain full native store, category, product, cart, checkout, order, or payment screens.

Current mobile behavior delegates those flows to backend/web through tokenized WebView paths.

## Customer Dashboard Entry Points

Native dashboard:

```text
src/screens/Panel/Panel.js
```

Current customer paths:

```text
meal-plans
panel/store/orders/home
panel/store/orders/home?intent=reorder
panel/store/subscriptions/home
panel/store/nutrition-advisor
panel/store/wellness-advisor
store/cart
store/checkout
```

## Store Requirements

The backend/web store opened from mobile must show only Avomeal visible products:

```text
id_user_business = 2
site_key = avomeal
site_visibility = VISIBLE
```

It must support:

- Product list.
- Categories.
- Product detail.
- Images.
- Prices.
- Attributes / variations.
- Availability.
- Empty states.

## Cart / Checkout Requirements

Cart and checkout are currently expected to run in backend/web.

Required behavior:

- Add products to cart.
- Update quantities.
- Remove products.
- Read minimum order from backend/settings.
- Do not hardcode minimum order amount in mobile.
- Use the active Avomeal payment provider from backend settings.
- Create orders with Avomeal business scope.
- Handle loading and errors.

## Orders

Customer order history should route to:

```text
panel/store/orders/home
```

The backend must ensure the customer sees only their own Avomeal orders.

## Reorder

The mobile dashboard now exposes a reorder entry route:

```text
panel/store/orders/home?intent=reorder
```

This is a UX handoff point, not a confirmed native reorder API. Backend/WebView must verify:

- Previous order belongs to current customer.
- Products still exist.
- Products are visible for `site_key=avomeal`.
- Current price is used.
- Current availability is checked.
- Customer confirms before checkout.

## Native Store Future Work

If store/cart/checkout become native, add new route helpers to `src/config/apiRoutes.js`, document them in `API_ENDPOINTS.md`, and keep all requests scoped through `withBusinessScope`.
