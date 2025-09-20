#!/usr/bin/env node

/**
 * Social Login Configuration Fix Script
 * This script helps you configure the correct environment variables for social logins
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Social Login Configuration Fix Script');
console.log('=====================================\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), 'env.example');

if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!');
  console.log('📋 Please copy env.example to .env.local and update the values:');
  console.log('   cp env.example .env.local\n');
  process.exit(1);
}

// Read current .env.local
const envContent = fs.readFileSync(envPath, 'utf8');
const envExampleContent = fs.readFileSync(envExamplePath, 'utf8');

console.log('📋 Current Environment Variables Status:');
console.log('=====================================\n');

// Check for required variables
const requiredVars = [
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'NEXT_PUBLIC_CLERK_SIGN_IN_URL',
  'NEXT_PUBLIC_CLERK_SIGN_UP_URL',
  'NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL',
  'NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL',
  'NEXT_PUBLIC_APP_URL'
];

requiredVars.forEach(varName => {
  const regex = new RegExp(`^${varName}=(.+)$`, 'm');
  const match = envContent.match(regex);
  
  if (match) {
    const value = match[1];
    if (value.includes('your_') || value.includes('placeholder') || value === '') {
      console.log(`❌ ${varName}: Not configured (placeholder value)`);
    } else {
      console.log(`✅ ${varName}: Configured`);
    }
  } else {
    console.log(`❌ ${varName}: Missing`);
  }
});

console.log('\n🔧 Social Login Fix Steps:');
console.log('========================\n');

console.log('1. 📱 Google OAuth Setup:');
console.log('   - Go to: https://console.cloud.google.com/');
console.log('   - Create OAuth 2.0 credentials');
console.log('   - Add redirect URI: https://your-domain.netlify.app/api/auth/callback/google');
console.log('   - Copy Client ID and Secret to Clerk Dashboard\n');

console.log('2. 📘 Facebook OAuth Setup:');
console.log('   - Go to: https://developers.facebook.com/');
console.log('   - Create new app');
console.log('   - Add Facebook Login product');
console.log('   - Add redirect URI: https://your-domain.netlify.app/api/auth/callback/facebook');
console.log('   - Copy App ID and Secret to Clerk Dashboard\n');

console.log('3. 🏢 Microsoft OAuth Setup:');
console.log('   - Go to: https://portal.azure.com/');
console.log('   - Create app registration');
console.log('   - Add redirect URI: https://your-domain.netlify.app/api/auth/callback/microsoft');
console.log('   - Copy Client ID and Secret to Clerk Dashboard\n');

console.log('4. 🔑 Clerk Dashboard Configuration:');
console.log('   - Go to: https://dashboard.clerk.com/');
console.log('   - Enable Google, Facebook, Microsoft in Social Connections');
console.log('   - Add your production domain');
console.log('   - Update redirect URLs\n');

console.log('5. 🌐 Netlify Environment Variables:');
console.log('   - Go to your Netlify site settings');
console.log('   - Add/update environment variables');
console.log('   - Redeploy your site\n');

console.log('📖 For detailed instructions, see: SOCIAL_LOGIN_FIX_GUIDE.md\n');

// Check if running in development
if (process.env.NODE_ENV === 'development') {
  console.log('⚠️  Development Mode Detected');
  console.log('   Make sure to use test/development OAuth credentials');
  console.log('   Production credentials should only be used in production\n');
}

console.log('🎯 Expected Result:');
console.log('   - Google login works without "client_id" error');
console.log('   - Facebook login works properly');
console.log('   - Microsoft login works properly');
console.log('   - Users can sign in with any social provider\n');

console.log('📞 Need Help?');
console.log('   Email: naushadalamprivate@gmail.com');
console.log('   Phone: +91 7209752686\n');
