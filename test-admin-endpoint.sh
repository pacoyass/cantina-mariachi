#!/bin/bash

echo "Testing Admin Session Management Endpoint..."
echo "============================================"
echo ""

# Test if server is running
echo "1. Checking if server is running..."
if curl -s http://localhost:3000/api/healthz > /dev/null 2>&1; then
  echo "   ✓ Server is running"
else
  echo "   ✗ Server is NOT running"
  echo "   Please start the server first: npm run dev (or your start command)"
  exit 1
fi

echo ""
echo "2. Testing admin endpoint (will fail without auth, but should return 401/403)..."
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" http://localhost:3000/api/admin/users/sessions)
HTTP_STATUS=$(echo "$RESPONSE" | grep "HTTP_STATUS" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_STATUS/d')

echo "   Status Code: $HTTP_STATUS"
if [ "$HTTP_STATUS" = "401" ] || [ "$HTTP_STATUS" = "403" ]; then
  echo "   ✓ Endpoint exists (requires authentication)"
elif [ "$HTTP_STATUS" = "404" ]; then
  echo "   ✗ Endpoint NOT FOUND - routes may not be loaded"
  echo "   Try restarting the server"
else
  echo "   Response: $BODY"
fi

echo ""
echo "3. Instructions:"
echo "   - If endpoint is 404: Restart your server"
echo "   - If endpoint is 401/403: The endpoint works! Login as ADMIN/OWNER to test"
echo "   - Check server logs for any errors"
