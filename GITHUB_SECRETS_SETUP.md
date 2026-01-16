# GitHub Actions Setup & Secrets Configuration

This guide explains how to configure GitHub repository secrets for CI/CD builds to work properly.

## Required GitHub Secrets

### 1. **API_BASE_URL** (Required)
Your backend API endpoint URL.

**Value:** `https://api.sisterspromise.com/api`  
**Used in:** Android and iOS builds

### 2. **GA_MEASUREMENT_ID** (Required)
Google Analytics 4 Measurement ID for tracking.

**Format:** `G_XXXXXXXXXX`  
**Used in:** Analytics configuration

### 3. **GA_API_SECRET** (Required)
Google Analytics API secret for server-side tracking.

**Where to find:** Google Analytics → Admin → Data API → API Secret  
**Used in:** Backend communication for analytics

### 4. **RELEASE_STORE_FILE** (Optional - for Android signing)
Path to your Android release keystore file (base64 encoded).

**Generate keystore:**
```bash
keytool -genkey -v -keystore release.keystore \
  -alias release \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**Encode for GitHub Secret:**
```bash
cat release.keystore | base64 | pbcopy  # macOS
# or on Linux
cat release.keystore | base64 > release.keystore.b64
```

### 5. **RELEASE_STORE_PASSWORD** (Optional)
Password for your Android release keystore.

### 6. **RELEASE_KEY_ALIAS** (Optional)
Alias used when generating the keystore (default: `release`).

### 7. **RELEASE_KEY_PASSWORD** (Optional)
Key password for your keystore (usually same as store password).

---

## How to Add Secrets to GitHub

### Method 1: GitHub Web Interface (Easiest)

1. Go to your repository: `https://github.com/derob357/sisters-promise-mobile`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Enter the secret name (e.g., `API_BASE_URL`)
5. Enter the secret value
6. Click **Add secret**

### Method 2: GitHub CLI

```bash
# Install GitHub CLI if not already installed
brew install gh

# Authenticate
gh auth login

# Add secrets
gh secret set API_BASE_URL -b "https://api.sisterspromise.com/api"
gh secret set GA_MEASUREMENT_ID -b "G_XXXXXXXXXX"
gh secret set GA_API_SECRET -b "your_secret_here"
```

---

## Minimal Setup (For Testing)

At minimum, add these three secrets:

```bash
gh secret set API_BASE_URL -b "https://api.sisterspromise.com/api"
gh secret set GA_MEASUREMENT_ID -b "G_XXXXXXXXXX"
gh secret set GA_API_SECRET -b "placeholder"
```

This allows builds to complete. Update with real values later.

---

## Android Release Signing (For Production)

If you need to sign Android APKs in CI/CD:

1. **Generate a release keystore** (one time):
```bash
keytool -genkey -v -keystore release.keystore \
  -alias release \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass "your-password" \
  -keypass "your-password" \
  -dname "CN=Sisters Promise,OU=Dev,O=Sisters Promise,L=City,S=State,C=US"
```

2. **Encode the keystore for GitHub**:
```bash
# macOS
cat release.keystore | base64 | pbcopy

# Linux
cat release.keystore | base64

# Windows (PowerShell)
certutil -encode release.keystore release.keystore.b64
```

3. **Add to GitHub Secrets**:
```bash
# Store the base64-encoded keystore
gh secret set RELEASE_STORE_FILE_B64 -b "$(cat release.keystore | base64)"

# Store the passwords
gh secret set RELEASE_STORE_PASSWORD -b "your-password"
gh secret set RELEASE_KEY_ALIAS -b "release"
gh secret set RELEASE_KEY_PASSWORD -b "your-password"
```

4. **Update GitHub Actions workflow** to decode and use:
```yaml
- name: Create release keystore
  run: |
    echo "${{ secrets.RELEASE_STORE_FILE_B64 }}" | base64 -d > release.keystore
    mv release.keystore android/app/release.keystore
```

---

## Verify Secrets Are Set

```bash
# List all secrets (names only, not values)
gh secret list
```

**Expected output:**
```
API_BASE_URL
GA_API_SECRET
GA_MEASUREMENT_ID
```

---

## Troubleshooting

### Build fails with "API_BASE_URL not found"
- Check that `API_BASE_URL` secret exists
- Verify spelling (case-sensitive)
- Re-run the workflow after adding the secret

### Android build fails with "keystore not found"
- Check that all `RELEASE_*` secrets are set
- Verify the keystore is correctly base64-encoded

### Analytics not working
- Check that `GA_MEASUREMENT_ID` and `GA_API_SECRET` are correct
- Verify in Google Analytics dashboard that events are being received

---

## Security Best Practices

✅ **DO:**
- Use strong passwords for keystores (16+ characters)
- Store keystore passwords in GitHub Secrets, not in code
- Rotate secrets periodically
- Use different keystores for different environments
- Never commit `.env` files with real secrets

❌ **DON'T:**
- Hardcode secrets in workflow files
- Commit keystores to the repository
- Share secrets in Slack/email
- Use the same keystore for development and production
- Store secrets in comments or documentation

---

## Next Steps

1. Add the minimal secrets (API_BASE_URL, GA_MEASUREMENT_ID, GA_API_SECRET)
2. Push a commit to trigger the workflow
3. Check **Actions** tab to see the build logs
4. Fix any issues that appear in the logs

---

**Last Updated:** January 16, 2026
