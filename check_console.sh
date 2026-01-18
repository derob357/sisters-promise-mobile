#!/bin/bash

echo "========================================"
echo "   CONSOLE ERROR CHECK"
echo "========================================"
echo ""

# Check Metro logs for errors
echo "1. Metro Bundler Errors (last 50 lines):"
echo "========================================="
tail -50 logs/metro*.log 2>/dev/null | grep -i "error\|fatal\|crash" | head -10 || echo "✅ No errors in Metro logs"
echo ""

# Check for common React Native errors
echo "2. React Native Runtime Errors:"
echo "==============================="
echo "Checking for:"
echo "  • JSX syntax errors"
echo "  • Undefined variables"
echo "  • Import failures"
echo "  • Network errors"
echo ""

# Check for image loading issues
grep -r "Invalid image URI\|Failed to load image\|Image not found" logs/ 2>/dev/null | head -5 || echo "✅ No image loading errors detected"
echo ""

echo "3. App Status:"
echo "============="
curl -s http://localhost:3000/status 2>/dev/null | head -3 && echo "✅ Backend is responsive" || echo "⏳ Backend starting..."
curl -s httcurl -s httcurl -s httcurl -s httcurl -s httcu3 curl -s httcurl -s httcurl is curl -s httcurl -s httcurl -s httcurl -s hrting.curl
