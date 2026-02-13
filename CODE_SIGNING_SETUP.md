# Code Signing Setup Guide for iOS

**Bundle ID:** com.sisterspromise.app  
**Status:** Ready for Code Signing

---

## ✅ What's Already Done

- ✅ Bundle ID created: `com.sisterspromise.app`
- ✅ Xcode project configured
- ✅ Info.plist set up
- ✅ App Store compliance: Privacy policy, ATT
- ✅ app.json updated with identifiers

---

## Next: Code Signing Setup

### Step 1: Setup Apple Developer Team

**In Xcode:**
```
1. Open: SistersPromiseMobile.xcworkspace
2. Select: SistersPromiseMobile target
3. Go to: Signing & Capabilities
4. Select Team: Your Apple Developer Team
5. Check: "Automatically manage signing"
```

### Step 2: Create App in App Store Connect

**In App Store Connect:**
1. Go to: https://appstoreconnect.apple.com
2. Click: "+ Apps"
3. Fill in:
   - Platform: iOS
   - Name: Sister's Promise
   - Bundle ID: `com.sisterspromise.app` ✅
   - SKU: (any unique identifier, e.g., sisterspromise-2025)
   - Primary Language: English
   - Category: Health & Fitness or Shopping

### Step 3: Configure App Information

**App Store Details:**
- Screenshots (5.5" and 6.5" iPhone)
- App Preview Video
- Description
- Keywords: skincare, soap, natural, wellness
- Support URL: sisterspromise.com/support
- Privacy Policy URL: sisterspromise.com/privacy

**Pricing & Availability:**
- Price Tier: Free
- Availability: All territories
- Release: Automatic release on approval

### Step 4: Build for Testing

```bash
# Build for development
cd SistersPromiseMobile
npm install
cd ios
pod install
cd ..

# Run on simulator
npm run ios

# Build for device (requires provisioning profile)
xcodebuild -workspace ios/SistersPromiseMobile.xcworkspace \
  -scheme SistersPromiseMobile \
  -configuration Release \
  -derivedDataPath ios/build \
  build-for-testing
```

### Step 5: Create Archive for TestFlight

```bash
# Method 1: Using Xcode GUI
1. Open Xcode
2. Product → Archive
3. Select SistersPromiseMobile build
4. Click "Distribute App"
5. Select "TestFlight and the App Store"
6. Select Automatically Manage Signing
7. Choose Release configuration
8. Review and submit to TestFlight

# Method 2: Using command line
xcodebuild -workspace ios/SistersPromiseMobile.xcworkspace \
  -scheme SistersPromiseMobile \
  -configuration Release \
  -derivedDataPath ios/build \
  archive \
  -archivePath "ios/build/SistersPromise.xcarchive"

# Export archive
xcodebuild -exportArchive \
  -archivePath "ios/build/SistersPromise.xcarchive" \
  -exportOptionsPlist export.plist \
  -exportPath "ios/build/export"
```

### Step 6: TestFlight Beta Distribution

**Add Internal Testers:**
1. App Store Connect → TestFlight → Internal Testing
2. Add internal testers (development team)
3. Send build for review (usually auto-approved)
4. Testers get email with TestFlight link

**Add External Testers:**
1. App Store Connect → TestFlight → External Testing
2. Create test group (max 10,000 testers)
3. Send app for review (1-2 hours approval)
4. Provide beta app link to testers

### Step 7: App Store Submission

```
1. Complete all app information
2. Upload build from TestFlight or Xcode
3. Complete app review information
4. Add beta testing notes (internal use only)
5. Submit for Review
6. Apple reviews (24-48 hours)
7. Approved → Available on App Store
```

---

## Files Needed

### Code Signing

**Create/Obtain:**
1. **Development Certificate** (if building for device)
   - Apple Developer Account → Certificates
   - Create "iOS App Development" certificate
   - Download and install

2. **Distribution Certificate** (for App Store)
   - Apple Developer Account → Certificates
   - Create "iOS Distribution" certificate
   - Download and install

3. **Provisioning Profiles**
   - Xcode generates automatically (if using auto signing)
   - Or create manually in Apple Developer Account

### Export Options

**Create export.plist for command-line builds:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>signingStyle</key>
    <string>automatic</string>
    <key>teamID</key>
    <string>YOUR_TEAM_ID</string>
    <key>stripSwiftSymbols</key>
    <true/>
    <key>thinning</key>
    <string>&lt;none&gt;</string>
</dict>
</plist>
```

---

## Configuration Files

### ios/SistersPromiseMobile.xcodeproj/project.pbxproj
```
PRODUCT_BUNDLE_IDENTIFIER = com.sisterspromise.app ✅
```

### ios/SistersPromiseMobile/Info.plist
```xml
<key>CFBundleIdentifier</key>
<string>$(PRODUCT_BUNDLE_IDENTIFIER)</string> ✅
```

### app.json
```json
"ios": {
  "bundleIdentifier": "com.sisterspromise.app"
} ✅
```

---

## Troubleshooting

### "Signing for SistersPromiseMobile requires a development team"
**Solution:** Select team in Xcode Signing & Capabilities

### "Unable to find provisioning profile"
**Solution:** 
1. Xcode → Preferences → Accounts
2. Add Apple Developer Account
3. Click Manage Certificates
4. Create certificate
5. Reset provisioning profiles

### "Bundle ID doesn't match"
**Solution:** Verify bundle ID matches in:
- Xcode project settings: `com.sisterspromise.app` ✅
- Info.plist: Uses `$(PRODUCT_BUNDLE_IDENTIFIER)` ✅
- App Store Connect app configuration ✅

### "Certificate is not trusted"
**Solution:**
1. Download certificate again
2. Double-click to install in Keychain
3. Check Keychain access permissions
4. Restart Xcode

---

## Security Best Practices

✅ **Do:**
- Keep certificates in secure location
- Use strong Apple Developer Account password
- Enable 2-factor authentication
- Backup certificates to secure location
- Use different certificates for dev/prod

❌ **Don't:**
- Share certificates or private keys
- Commit certificates to version control
- Upload certificates to GitHub
- Use same password everywhere
- Forget certificate expiration dates

---

## Timeline

- **Today:** ✅ Bundle ID created: `com.sisterspromise.app`
- **Next:** Setup code signing (team ID setup)
- **1-2 hours:** Build and upload to TestFlight
- **24+ hours:** Internal testing on TestFlight
- **As needed:** Iterations based on testing
- **Final:** Submit for App Store review
- **24-48 hours:** Apple review
- **Result:** Live on App Store 🚀

---

## Quick Reference

| Task | Time | Status |
|------|------|--------|
| Bundle ID setup | 5 min | ✅ Done |
| Xcode signing | 10 min | ⏳ Next |
| TestFlight build | 30 min | ⏳ Pending |
| Beta testing | 24+ hours | ⏳ Pending |
| App Store submission | 5 min | ⏳ Pending |
| Apple review | 24-48 hours | ⏳ Pending |
| Launch | Instant | ⏳ Pending |

---

## Next Command

```bash
# Open in Xcode and setup signing
open ios/SistersPromiseMobile.xcworkspace
```

Then:
1. Select SistersPromiseMobile target
2. Go to Signing & Capabilities
3. Select your Apple Team
4. Check "Automatically manage signing"
5. Build and test!

---

**Bundle ID:** com.sisterspromise.app ✅  
**Status:** Ready for code signing  
**Next Action:** Setup Apple Team in Xcode
