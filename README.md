# Sisters Promise Mobile App

This is the React Native mobile application for Sisters Promise, available on iOS and Android.

## Project Structure

```
SistersPromiseMobile/
├── src/
│   ├── screens/          # Screen components (Home, Cart, Profile, etc.)
│   ├── navigation/       # Navigation stacks and routing
│   ├── services/         # API communication, cart, analytics
│   ├── context/          # Global state management (Auth, Cart)
│   ├── components/       # Reusable UI components
│   └── utils/            # Utility functions
├── android/              # Android native code
├── ios/                  # iOS native code
├── App.tsx               # Main app entry point
├── package.json          # Dependencies
└── .env.example          # Environment configuration template
```

## Setup Instructions

### Prerequisites

- Node.js 16+ and npm
- Xcode 14+ (for iOS)
- Android Studio (for Android)
- CocoaPods (for iOS dependencies)

## Step 1: Install Dependencies

```bash
cd SistersPromiseMobile
npm install
```

## Step 2: Configure Environment

Create `.env` file from template:
```bash
cp .env.example .env
```

Update `.env` with your configuration:
- `API_BASE_URL`: Your Express backend URL
- `GA_MEASUREMENT_ID`: Your Google Analytics 4 measurement ID
- `GA_API_SECRET`: Your GA4 API secret

## Step 3: Start Metro

Start the Metro development server:

```bash
npm start
```

## Step 4: Run the App

### iOS

```bash
# Method 1: Using npx
npx react-native run-ios

# Method 2: Using Xcode
open ios/SistersPromiseMobile.xcworkspace
# Then click Run in Xcode

# Method 3: From command line
xed -b ios
```

### Android

```bash
# Start Android emulator first, then:
npx react-native run-android

# Or open Android Studio:
open android/
```

## Features

### Authentication
- User registration and login
- JWT token-based sessions
- Password management
- Automatic token refresh
- Logout functionality

### Shopping
- Browse products by category
- Search functionality
- Product details and descriptions
- Shopping cart management
- Checkout process with shipping

### User Profile
- View account information
- Change password
- Privacy policy access
- Logout

### Analytics
- Screen view tracking
- Product view and interaction tracking
- Purchase tracking
- Search tracking
- Email subscription tracking
- User property tracking

### Privacy & Security
- End-to-end encryption for sensitive data
- Secure token storage using AsyncStorage
- HTTPS/TLS for all network requests
- Privacy policy integrated into app
- GDPR/CCPA compliant

## API Integration

The app communicates with the Express backend at your configured `API_BASE_URL`. All requests include:
- JWT authentication token
- Automatic retry on token expiration
- Error handling and user feedback

### Key API Endpoints

- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `POST /api/users/change-password` - Change password
- `GET /api/products` - Get all products
- `POST /api/orders` - Create order
- `POST /api/analytics/*` - Analytics tracking

## Building for Production

### iOS

```bash
# Build for release
npx react-native run-ios --configuration Release

# Or in Xcode: Product > Scheme > Edit Scheme > Run > Release
```

### Android

```bash
# Build APK
cd android
./gradlew assembleRelease

# Build App Bundle (for Play Store)
./gradlew bundleRelease
```

## Troubleshooting

### Metro bundler issues
```bash
npx react-native start --reset-cache
```

### CocoaPods issues (iOS)
```bash
cd ios
pod install --repo-update
cd ..
```

### Android build issues
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### Network/API issues
- Check `API_BASE_URL` in `.env` is correct
- For local development, use your computer's IP address (not localhost)
- Example: `http://192.168.1.100:3000`

## Privacy Policy

The app includes a comprehensive privacy policy covering:
- Data collection practices
- Third-party integrations
- User rights (GDPR, CCPA)
- Security measures
- Data retention

Users can access the privacy policy from the Profile screen.

## Dependencies

### Core
- react-native 0.83.1
- @react-navigation/native
- @react-navigation/bottom-tabs
- @react-navigation/stack

### Services
- axios - HTTP client
- @react-native-async-storage/async-storage - Local storage
- uuid - Generate unique IDs

### UI
- react-native-safe-area-context
- react-native-gesture-handler
- react-native-vector-icons
- @react-native-community/cli

## Support

For issues or questions:
- Email: denise@sisterspromise.com
- Website: www.sisterspromise.com

## License

© 2026 Sisters Promise. All rights reserved.

## Step 2: Build and run your app

With Metro running, open a new terminal window/pane from the root of your React Native project, and use one of the following commands to build and run your Android or iOS app:

### Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

### iOS

For iOS, remember to install CocoaPods dependencies (this only needs to be run on first clone or after updating native deps).

The first time you create a new project, run the Ruby bundler to install CocoaPods itself:

```sh
bundle install
```

Then, and every time you update your native dependencies, run:

```sh
bundle exec pod install
```

For more information, please visit [CocoaPods Getting Started guide](https://guides.cocoapods.org/using/getting-started.html).

```sh
# Using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up correctly, you should see your new app running in the Android Emulator, iOS Simulator, or your connected device.

This is one way to run your app — you can also build it directly from Android Studio or Xcode.

## Step 3: Modify your app

Now that you have successfully run the app, let's make changes!

Open `App.tsx` in your text editor of choice and make some changes. When you save, your app will automatically update and reflect these changes — this is powered by [Fast Refresh](https://reactnative.dev/docs/fast-refresh).

When you want to forcefully reload, for example to reset the state of your app, you can perform a full reload:

- **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Dev Menu**, accessed via <kbd>Ctrl</kbd> + <kbd>M</kbd> (Windows/Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (macOS).
- **iOS**: Press <kbd>R</kbd> in iOS Simulator.

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [docs](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you're having issues getting the above steps to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.
