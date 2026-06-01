# Navigation Flow

## Stack

Entry:

```text
App.js -> src/Root.js -> src/navigation/index.js
```

`Root` restores session from `AsyncStorage.Token`, checks `api/version`, shows the intro video with a timeout fallback, and routes to:

- `loginNavigator` when no token exists.
- `panelNavigator` when token exists.

## Login Navigator

Routes:

| Route | Purpose |
| --- | --- |
| `SignIn` | Email/password login |
| `SignUp` | Level 5 customer signup |
| `ForgotPassword` | Email recovery |
| `ConfirmPhone1` | Legacy phone validation step |
| `ConfirmPhone2` | Legacy phone validation code step |
| `SignUpThirdParty` | Legacy disabled OAuth fallback screen; not linked from active UI |

Google/Apple buttons are not active.

## Panel Navigator

Routes:

| Route | Purpose |
| --- | --- |
| `Panel` | Native dashboard cards based on user level |
| `PanelView` | Tokenized WebView |

The drawer is visually hidden and swipe-disabled. Bottom navigation provides quick access:

- Home.
- Store/work route depending on level.
- Orders route depending on level.
- Settings.
- Logout.

## Level Behavior

| Level | Native dashboard |
| --- | --- |
| 5 | Customer shopping/reorder/orders/subscriptions/tools |
| 4 | Store operations/team workflow |
| 1 | Basic admin/order WebView shortcuts only |
| Other | Falls back to Level 5 customer dashboard |

## WebView Token

All protected backend pages should be opened with:

```text
buildTokenWebViewUrl(token, route)
```

This adds Avomeal scope:

```text
id_user_business=2
business_id=2
site_key=avomeal
```
