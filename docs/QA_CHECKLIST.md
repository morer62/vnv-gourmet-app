# QA Checklist

## Auth

- [ ] App opens.
- [ ] Splash/intro does not block if video fails.
- [ ] Login email/password works.
- [ ] Signup creates or associates Level 5 only.
- [ ] Signup auto-login works when backend returns token.
- [ ] Signup fallback login works when backend creates account without token.
- [ ] Forgot password works by email.
- [ ] Google/Apple buttons do not appear.
- [ ] Token saves in `AsyncStorage`.
- [ ] Session restores after app restart.
- [ ] Logout clears `Token` and `UserData`.

## Customer Level 5

- [ ] Dashboard loads customer shortcuts.
- [ ] Store opens.
- [ ] Products are Avomeal scoped.
- [ ] Categories are Avomeal scoped.
- [ ] Product detail loads.
- [ ] Cart opens or shows a clear backend state.
- [ ] Checkout does not hardcode minimum order.
- [ ] Checkout route is `store/checkout` and payment provider is backend configured.
- [ ] Payment provider is Avomeal/backend configured.
- [ ] Order is created with `id_user_business=2` and `site_key=avomeal`.
- [ ] Customer sees only Avomeal orders.
- [ ] Reorder entry opens previous orders/reorder UX.
- [ ] Reorder validates current price and availability before checkout.
- [ ] Subscriptions load or show empty state.
- [ ] Nutrition/wellness tools load.

## Team Level 4

- [ ] Level 4 login works.
- [ ] Team dashboard loads.
- [ ] Assigned store orders load.
- [ ] Order detail/status update works if backend supports it.
- [ ] Clock route opens and location prompt works on device.
- [ ] Chat route opens if enabled.
- [ ] Team user does not see customer-only reorder/cart shortcuts.
- [ ] Team user does not see admin tools.

## Navigation

- [ ] Stack navigation works.
- [ ] Hidden drawer does not interfere with gestures.
- [ ] Bottom nav home/store-or-work/orders/settings/logout works.
- [ ] Back behavior is predictable in WebView.
- [ ] Loading states are visible.
- [ ] Error states are clear.
- [ ] Expired token behavior is acceptable or documented.

## Config And Branding

- [ ] `BUSINESS_CONFIG.businessId === 2`.
- [ ] `BUSINESS_CONFIG.siteKey === 'avomeal'`.
- [ ] Branding says Avomeal.
- [ ] VNV Gourmet is not active user-facing brand.
- [ ] VNV Events data/tools do not appear by mistake.
