# Auth And Signup Flow

## Splash / Initial Load

Entry path:

```text
App.js -> src/Root.js -> src/navigation
```

Current behavior:

- Loads Expo/React Native root.
- Shows `IntroVideo` for up to 5 seconds or until finished.
- Reads `Token` from `AsyncStorage`.
- Calls `api/version` and compares app version.
- Sends logged-in users to `panelNavigator`.
- Sends logged-out users to `loginNavigator`.
- Shows force-update modal if backend requires a newer app version.

## Login

Screen:

```text
src/screens/SignInScreen/SignInScreen.js
```

Endpoint:

```text
POST api/auth/login
```

Payload includes:

```text
email
password
expo_token
id_user_business = 2
business_id = 2
site_key = avomeal
source = avomeal_mobile_app
```

Success stores:

```text
AsyncStorage.Token
AsyncStorage.UserData
```

## Signup

Screen:

```text
src/screens/SignUpScreen/SignUpScreen.js
```

Endpoint:

```text
POST api/auth/signup
```

Payload includes:

```text
name
lastname
email
phone
password
passwordConfirmation
level = 5
id_user_business = 2
business_id = 2
site_key = avomeal
```

Critical rule: mobile signup is customer-only. It must not create businesses, Ophyra memberships, Level 1 users, Level 2 users, modules, or affiliates.

## Third-Party Signup

Screen:

```text
src/screens/SignUpThridParty/index.jsx
```

Google and Apple login/signup are disabled in the active mobile UI. The legacy `SignUpThirdParty` screen remains in the navigator for compatibility, but no active login button routes to it.

If re-enabled in a future sprint, it must expose only a customer account action:

```text
accountType = client
level = 5
id_user_business = 2
site_key = avomeal
```

## Forgot Password

Screen:

```text
src/screens/ForgotPasswordScreen/ForgotPasswordScreen.js
```

Endpoint:

```text
POST api/auth/forgot-password
```

Payload includes email and Avomeal business scope.

## Reference Comparison

Compared with `morer62/vnv-mobile-app`, this repo adapted:

- Email/password only auth posture.
- Customer-only mobile signup.
- Signup auto-login fallback when backend does not return a token.
- WebView token handoff as the protected backend bridge.
- Level 4 documented as WebView-driven operations.

This repo intentionally did not adapt:

- Event requests.
- Music sessions.
- Venue/vendor account choices.
- VNV Events office/contact actions.

## Residual Risks

- Backend must confirm that business scope is honored for login/signup/forgot password.
- Backend must confirm that `level=5` is enforced server-side for mobile Avomeal signup.
- Third-party login account-not-found behavior depends on backend status codes/data shape.
