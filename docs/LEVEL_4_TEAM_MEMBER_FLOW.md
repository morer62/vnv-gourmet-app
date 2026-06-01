# Level 4 Team Member Flow

Level 4 is supported as an Avomeal team-member workflow only when the backend account and permissions exist.

## Entry

- Team members log in with email/password through `api/auth/login`.
- The app sends Avomeal scope:

```text
id_user_business = 2
business_id = 2
site_key = avomeal
source = avomeal_mobile_app
```

OAuth is disabled in the mobile UI.

## Dashboard

The native dashboard uses the user's backend `level`. Level 4 opens a store-operations dashboard, not the Level 5 customer dashboard.

Current WebView routes:

| Area | Route |
| --- | --- |
| Store Orders | `panel/planner-hub/team/store/orders/home` |
| My Work | `panel/planner-hub/team/my-work` |
| Clock | `panel/planner-hub/team/payroll/clock` |
| Chat | `panel/planner-hub/team/chat` |
| Settings | `panel/settings` |

## Mobile Responsibilities

- Preserve token in `AsyncStorage`.
- Pass Avomeal scope through `buildTokenWebViewUrl`.
- Enable WebView geolocation for clock/map pages.
- Keep Level 4 out of customer reorder/cart shortcuts.
- Keep Level 4 out of Level 1/admin tools unless the backend route grants access.

## Pending QA

- Confirm Level 4 Avomeal login works.
- Confirm assigned store orders load.
- Confirm order detail/status updates work if backend supports them.
- Confirm chat works if enabled.
- Confirm clock/location prompts work on physical devices.
- Confirm no VNV Events event-specific tools appear.
