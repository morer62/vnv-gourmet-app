# Branding And Business ID

Avomeal mobile branding and business scope are centralized.

Source of truth:

```text
src/config/businessConfig.js
```

Required values:

```text
businessId = 2
siteKey = avomeal
brandName = Avomeal
apiBaseUrl = https://avomeal.com/
webBaseUrl = https://avomeal.com/
```

## App Branding

`app.json` currently identifies the app as:

```text
name = Avomeal
slug = avomeal-app
scheme = avomeal
bundleIdentifier = com.vnvevents.avomeal
android.package = com.vnvevents.avomeal
```

Do not change bundle/package IDs without explicit release approval.

## Runtime Branding

Login, signup, forgot password, third-party signup, and dashboard copy should use `BUSINESS_CONFIG.brandName`.

Do not use `VNV Gourmet` as the active brand in user-facing mobile screens. It may appear only as documented legacy context.

## URL Scope

All token WebView URLs must be built with:

```text
buildTokenWebViewUrl(token, path)
```

This appends:

```text
id_user_business=2
business_id=2
site_key=avomeal
```
