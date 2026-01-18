// Test script to verify key components
const fs = require('fs');
const path = require('path');

const screens = [
  'src/screens/HomeScreen.js',
  'src/screens/LoginScreen.js',
  'src/screens/RegisterScreen.js',
  'src/screens/CartScreen.js',
  'src/screens/ProductDetailScreen.js',
  'src/screens/CheckoutScreen.js',
  'src/screens/ProfileScreen.js',
  'src/screens/PrivacyPolicyScreen.js'
];

console.log('🔍 Verifying SafeAreaView implementation across all screens:\n');

let allGood = true;
screens.forEach(screen => {
  const filePath = path.join(__dirname, screen);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const hasSafeArea = content.includes('SafeAreaView');
    const hasProperImport = content.includes("import { SafeAreaView }") || content.includes('from \'react-native\'');
    
    if (hasSafeArea && hasProperImport) {
      console.log(`✅ ${path.basen      console.log(`✅ ${path.basen      console.log(`✅ ${path.basen      console.log(`✅ ${path.be(      console.log(`✅ ${path.basen   );      console.log(`✅ $        console.log(`ck for critical files
console.console.console.console.consol console.console.console.consolt console.console.console.consolive.cconsole.console.console.consoficonsole.console.console.console.consol',console.console.console.console.c econsole.console.console.console.ticonsole.console.console.console.conssrcccomconsole.console.console.console.consol console.console.console.consolt consolelFiles).forEach(([file, console.console.console.cothconsole.console.console.console.consol console.ynconsole.console.console.console`�console.console.console.console.consol console.consol� console.console.console.console.consol console.;

console.log('\n' + (allGood ? '✅ All checks passed!' : '⚠️  Some issues detected'));
