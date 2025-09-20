#!/usr/bin/env node

/**
 * Microsoft OAuth Configuration Test Script
 * 
 * This script helps diagnose Microsoft OAuth configuration issues
 * Run with: node test-microsoft-oauth.js
 */

const https = require('https');

console.log('🔍 Microsoft OAuth Configuration Test\n');

// Test 1: Check if environment variables are set
console.log('1. Checking Environment Variables:');
const requiredEnvVars = [
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY'
];

requiredEnvVars.forEach(envVar => {
  const value = process.env[envVar];
  if (value) {
    console.log(`   ✅ ${envVar}: Set`);
  } else {
    console.log(`   ❌ ${envVar}: Missing`);
  }
});

// Test 2: Check if app URL is accessible
console.log('\n2. Testing App Accessibility:');
const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://your-netlify-domain.netlify.app';

function testUrl(url) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname,
      method: 'GET',
      timeout: 5000
    };

    const req = https.request(options, (res) => {
      resolve({
        status: res.statusCode,
        accessible: res.statusCode < 400
      });
    });

    req.on('error', () => {
      resolve({
        status: 'ERROR',
        accessible: false
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        status: 'TIMEOUT',
        accessible: false
      });
    });

    req.end();
  });
}

testUrl(appUrl).then(result => {
  if (result.accessible) {
    console.log(`   ✅ App is accessible: ${appUrl} (Status: ${result.status})`);
  } else {
    console.log(`   ❌ App is not accessible: ${appUrl} (Status: ${result.status})`);
  }
});

// Test 3: Check Microsoft OAuth endpoints
console.log('\n3. Testing Microsoft OAuth Endpoints:');
const microsoftEndpoints = [
  'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
  'https://login.microsoftonline.com/common/oauth2/v2.0/token'
];

microsoftEndpoints.forEach(endpoint => {
  testUrl(endpoint).then(result => {
    if (result.accessible) {
      console.log(`   ✅ ${endpoint} (Status: ${result.status})`);
    } else {
      console.log(`   ❌ ${endpoint} (Status: ${result.status})`);
    }
  });
});

// Test 4: Configuration recommendations
console.log('\n4. Configuration Recommendations:');
console.log('   📋 Azure Portal Checklist:');
console.log('      - App registration created');
console.log('      - Redirect URI: https://your-domain.netlify.app/api/auth/callback/microsoft');
console.log('      - Account types: "Accounts in any organizational directory and personal Microsoft accounts"');
console.log('      - API permissions: User.Read, email, openid, profile');
console.log('      - Admin consent granted');
console.log('      - Client secret created');

console.log('\n   📋 Clerk Dashboard Checklist:');
console.log('      - Microsoft provider enabled');
console.log('      - Client ID from Azure configured');
console.log('      - Client Secret from Azure configured');
console.log('      - Production domain added');

console.log('\n   📋 Netlify Checklist:');
console.log('      - Environment variables set');
console.log('      - App deployed and accessible');
console.log('      - HTTPS enabled');

// Test 5: Common error solutions
console.log('\n5. Common Error Solutions:');
console.log('   🔧 "Unable to complete action at this time":');
console.log('      - Check redirect URIs in Azure Portal');
console.log('      - Verify API permissions are granted');
console.log('      - Ensure client secret is not expired');
console.log('      - Check if app is in correct tenant');

console.log('\n   🔧 "AADSTS50011: Reply URL mismatch":');
console.log('      - Add exact redirect URI to Azure app registration');
console.log('      - Ensure URL uses HTTPS in production');

console.log('\n   🔧 "AADSTS65001: Consent required":');
console.log('      - Grant admin consent for API permissions');
console.log('      - Or have users consent individually');

console.log('\n✅ Test completed! Check the results above and follow the recommendations.');
console.log('\n📖 For detailed setup instructions, see: MICROSOFT_OAUTH_FIX_GUIDE.md');
