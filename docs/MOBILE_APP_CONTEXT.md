# Mobile App Context

## What This Repo Is

This repo is the React Native / Expo mobile app for VNV Events. It is a branded mobile extension of the VNV Events backend experience. It is not the Ophyra web app and it is not the PHP backend.

The mobile app is responsible for:

* login,
* client signup,
* Level 4 team member access,
* token storage,
* a mobile dashboard,
* opening selected backend routes in WebView,
* sending Expo push tokens,
* allowing VNV Events clients to access orders, sessions and request tools.

## Main Runtime Pieces

* `App.js` configures notifications and renders `Root`.
* `src/Root.js` loads app version, token state, intro video and navigation.
* `src/navigation/index.js` switches between auth and panel navigators.
* `src/context/userContext/index.js` loads and stores `UserData`.
* `src/config/axiosConfig.js` sets `axios.defaults.baseURL`.
* `src/config/businessConfig.js` defines the brand/business owner context.

## Main Screens

* `SignInScreen` posts to `api/auth/login`.
* `SignUpScreen` posts to `api/auth/signup` for email/password client signup only.
* `ForgotPasswordScreen` posts to `api/auth/forgot-password`.
* `Panel` renders a native mobile dashboard and navigates to WebView routes.
* `PanelWebView` opens backend routes through `Panel/Tokenapi/<token>/<route>`.

## Current Mobile Dashboard Behavior

`src/screens/Panel/Panel.js` uses `userData.level` to choose dashboard links. Level 5 is the primary VNV client view; Level 4 is the VNV team member view. Levels 1-3 still have safe owner/admin route configs for internal testing and owner access, but normal client signup cannot create those accounts.

## Important Difference From Backend

The backend remains the source of truth for users, orders, music sessions, business ownership and panel permissions. The mobile app should not duplicate backend business logic. It should send correct scope and token data, then render or open mobile-safe flows.
