# WebView Token Flow

The app uses tokenized WebView URLs for backend/web features.

Central builder:

```text
src/config/apiRoutes.js -> buildTokenWebViewUrl(token, path)
```

URL shape:

```text
{webBaseUrl}Panel/Tokenapi/{token}/{path}?id_user_business=2&business_id=2&site_key=avomeal
```

The builder uses `URLSearchParams.set`, so existing scope params are replaced instead of duplicated. Route query params, such as `intent=reorder`, are preserved.

Used by:

- `src/screens/PanelWebView/index.js`
- `src/Layouts/Panel/BottomAction/BottomActions.js`
- `src/Layouts/Panel/DrawerAction/DrawerLink.js`

WebView enables geolocation and inline media playback so Level 4 clock/map pages can request device capabilities when backend pages need them.

## Requirements

- Token must come from `AsyncStorage.Token`.
- WebView routes should avoid double login.
- Backend must validate token ownership.
- Backend must respect Avomeal business scope.
- Logout must remove `Token` and `UserData`.
- Expired tokens should be handled by backend/web and should return the user to login or show a clear session-expired state.

## Current Risk

The app appends scope query params, but the backend must be tested to confirm `Panel/Tokenapi` carries that scope into session/query resolution.

See `WEBVIEW_BACKEND_CONTRACT.md` and `WEBVIEW_QA_REPORT.md` for the route-by-route contract and QA status.
