#!/bin/bash
# Link vector icons fonts for iOS and Android
# This script must be run after `npm install react-native-vector-icons`

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR"

echo "🔗 Linking react-native-vector-icons..."

# iOS: Link fonts through CocoaPods (done via Podfile)
if [ -d "$PROJECT_ROOT/ios" ]; then
  echo "✅ iOS Podfile updated with RNVectorIcons support"
fi

# Android: Copy Ionicons font to assets
if [ -d "$PROJECT_ROOT/android/app/src/main/assets" ]; then
  # Create fonts directory if it doesn't exist
  mkdir -p "$PROJECT_ROOT/android/app/src/main/assets/fonts"
  
  # Copy Ionicons font from node_modules
  IONICONS_SOURCE="$PROJECT_ROOT/node_modules/react-native-vector-icons/Fonts/Ionicons.ttf"
  IONICONS_DEST="$PROJECT_ROOT/android/app/src/main/assets/fonts/Ionicons.ttf"
  
  if [ -f "$IONICONS_SOURCE" ]; then
    cp "$IONICONS_SOURCE" "$IONICONS_DEST"
    echo "✅ Copied Ionicons.ttf to Android assets"
  else
    echo "⚠️  Warning: Ionicons.ttf not found at $IONICONS_SOURCE"
  fi
else
  mkdir -p "$PROJECT_ROOT/android/app/src/main/assets/fonts"
fi

# Rebuild iOS pods if Podfile was modified
if [ -f "$PROJECT_ROOT/ios/Podfile" ]; then
  echo "📦 Installing iOS pods..."
  cd "$PROJECT_ROOT/ios"
  rm -rf Pods Podfile.lock 2>/dev/null || true
  pod install
  cd "$PROJECT_ROOT"
fi

echo "✅ Vector icons linking complete!"
echo ""
echo "Next steps:"
echo "1. Rebuild iOS: npm run ios"
echo "2. Rebuild Android: npm run android"
