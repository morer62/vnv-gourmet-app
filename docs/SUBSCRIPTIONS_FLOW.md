# Subscriptions Flow

Subscriptions are enabled by feature flag:

```text
FEATURE_FLAGS.subscriptions = true
```

Current mobile implementation:

- Native dashboard card links to `panel/store/subscriptions/home`.
- Subscription list/detail behavior is expected to run in backend/web through the tokenized WebView.

Expected customer behavior if backend supports subscriptions:

- List customer subscriptions.
- Show detail/status.
- Show next renewal.
- Show included products.
- Allow pause/cancel only if backend supports it.
- Show an empty state if the customer has no active subscriptions.

Backend must scope all subscription queries to:

```text
id_user_business = 2
site_key = avomeal
current customer
```

Pending native work: no native subscription list/detail screens exist in this repo.
