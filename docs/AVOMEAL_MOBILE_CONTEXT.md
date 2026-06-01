# Avomeal Mobile Context

This app is the Avomeal mobile customer app.

Avomeal is a store / food brand under the shared VNV Events backend/database ecosystem. It must use the shared backend while remaining clearly scoped to Avomeal data:

```text
id_user_business = 2
site_key = avomeal
brand = Avomeal
```

## Audience

Primary user: final Avomeal customer, normally Level 5.

The app may let customers:

- Sign in.
- Create a customer account.
- Reset password.
- See a customer dashboard.
- Browse products and categories through the Avomeal storefront.
- Use cart and checkout through the Avomeal storefront.
- Review orders.
- Manage subscriptions if enabled.
- Open tokenized backend/web pages without a second login.

## What This App Must Not Become

This is not the VNV Events mobile app. It must not show VNV Events-specific service, venue, music, event operations, or team workflows unless a future feature flag explicitly enables them for Avomeal.

This is not Ophyra Web. It must not onboard new businesses, Level 1 users, Level 2 users, SaaS modules, memberships, or affiliate accounts.

## Current Code Reality

Native customer screens exist for auth and the dashboard shell. Store, checkout, orders, and subscriptions currently route to backend/web views through `Panel/Tokenapi/{token}/{path}`.
