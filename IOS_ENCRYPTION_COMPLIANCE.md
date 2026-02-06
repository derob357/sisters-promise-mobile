# iOS Export Compliance & Encryption Documentation

## App Store Connect Export Compliance Declaration

This document describes the encryption usage in the **Sisters Promise** iOS mobile application for Apple App Store Connect compliance.

---

## Summary

| Question | Answer |
|----------|--------|
| Does the app use encryption? | Yes - HTTPS/TLS only |
| Is the encryption exempt? | **Yes** |
| ITSAppUsesNonExemptEncryption | `false` |
| Export compliance documentation required? | No |

---

## Encryption Usage Details

### 1. Types of Encryption Used

| Encryption Type | Usage | Exempt? |
|-----------------|-------|---------|
| HTTPS/TLS (Transport Layer Security) | API communication | ✅ Yes - Exempt |
| AsyncStorage | Local data storage | ✅ Yes - No encryption |

### 2. HTTPS/TLS Usage

The Sisters Promise app uses HTTPS (TLS 1.2+) exclusively for:

- **API Communication**: All requests to the backend server (`api.sisterspromise.com`) use HTTPS
- **Authentication**: JWT tokens transmitted over encrypted connections
- **E-commerce Transactions**: Cart and checkout data sent securely
- **Analytics**: Google Analytics data transmitted via HTTPS

**This is EXEMPT encryption** because:
- The app uses the standard iOS URL Loading System (NSURLSession/URLSession)
- TLS is provided by the operating system, not bundled with the app
- No custom encryption algorithms are implemented

### 3. Local Data Storage

| Data Type | Storage Method | Encryption |
|-----------|----------------|------------|
| User preferences | AsyncStorage | None (OS-level protection) |
| JWT tokens | AsyncStorage | None (OS-level protection) |
| Cart data | AsyncStorage | None (OS-level protection) |
| Analytics cache | AsyncStorage | None (OS-level protection) |

The app relies on iOS Data Protection for at-rest security, which is an OS-level feature and not subject to export restrictions.

---

## Why This App is EXEMPT

According to Apple's Export Compliance guidelines and U.S. Bureau of Industry and Security (BIS) regulations, the following uses of encryption are **EXEMPT**:

### ✅ Exemption Categories Applied

1. **Authentication** (Section 740.17(b)(4)(ii))
   - The app uses encryption solely for user authentication (JWT tokens)
   - No data is encrypted for storage purposes

2. **Standard Operating System Encryption** (Section 740.17(b)(1))
   - HTTPS/TLS is provided by iOS, not bundled in the app
   - Uses Apple's built-in Security framework

3. **No Proprietary Encryption**
   - No custom encryption algorithms
   - No encryption SDKs or libraries bundled
   - No end-to-end encryption implemented

---

## Info.plist Configuration

The following key is set in `ios/SistersPromiseMobile/Info.plist`:

```xml
<key>ITSAppUsesNonExemptEncryption</key>
<false/>
```

This declaration indicates:
- The app **does not** use non-exempt encryption
- No export compliance documentation is required for submission
- Automatic approval for export to all App Store regions

---

## Third-Party SDKs & Encryption

| SDK/Library | Encryption Usage | Exempt? |
|-------------|------------------|---------|
| React Native | None | ✅ N/A |
| Axios | HTTPS (via iOS) | ✅ Yes |
| AsyncStorage | None | ✅ N/A |
| React Navigation | None | ✅ N/A |
| Google Analytics | HTTPS (via iOS) | ✅ Yes |

**None of the third-party libraries bundle proprietary encryption.**

---

## Compliance Checklist

- [x] App uses only HTTPS for network communication
- [x] HTTPS is provided by iOS, not bundled
- [x] No custom encryption algorithms implemented
- [x] No encryption libraries bundled (e.g., OpenSSL, libsodium)
- [x] No end-to-end encryption features
- [x] No file encryption features
- [x] No encrypted messaging features
- [x] `ITSAppUsesNonExemptEncryption` set to `false` in Info.plist
- [x] No ECCN classification required

---

## App Store Connect Questions & Answers

When submitting to App Store Connect, answer the export compliance questions as follows:

### Question 1: "Does your app use encryption?"
**Answer: Yes**

*(Even though our encryption is exempt, we must acknowledge using HTTPS)*

### Question 2: "Does your app qualify for any encryption exemptions?"
**Answer: Yes**

### Question 3: "Does your app implement any standard encryption algorithms?"
**Answer: No** 

*(We don't implement encryption - iOS provides it)*

### Question 4: "Does your app contain, use, or call encryption for any purpose?"
**Answer: Yes - Authentication only**

### Question 5: "Is your app exempt based on category?"
**Answer: Yes - Exempt under 740.17(b)**

---

## References

- [Apple Export Compliance Overview](https://developer.apple.com/documentation/security/complying_with_encryption_export_regulations)
- [U.S. BIS Export Administration Regulations (EAR)](https://www.bis.doc.gov/index.php/regulations/export-administration-regulations-ear)
- [EAR Part 740.17 - Encryption Exemptions](https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-740/section-740.17)

---

## Document Information

| Field | Value |
|-------|-------|
| App Name | Sisters Promise |
| Bundle ID | com.sisterspromise.app |
| Version | 1.0.0 |
| Last Updated | February 2026 |
| Prepared By | Sisters Promise Development Team |

---

## Contact

For questions about this compliance documentation:
- **Email**: support@sisterspromise.com
- **Developer**: Sisters Promise LLC
