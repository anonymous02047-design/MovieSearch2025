#!/usr/bin/env node

/**
 * Clerk India Phone Number Setup Script
 * This script helps you configure Clerk for India phone number support
 */

const fs = require('fs');
const path = require('path');

console.log('🔐 Clerk Email-Only Authentication Setup');
console.log('==========================================\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('❌ .env.local file not found!');
  console.log('📝 Creating .env.local template...\n');
  
  const envTemplate = `# TMDB API Configuration
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Twilio Configuration (for India SMS support)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
`;

  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ Created .env.local template');
} else {
  console.log('✅ .env.local file exists');
}

console.log('\n📋 Next Steps:');
console.log('==============');
console.log('1. 🔑 Get your Clerk API keys:');
console.log('   - Go to: https://dashboard.clerk.com/');
console.log('   - Create/select your application');
console.log('   - Go to "API Keys" section');
console.log('   - Copy Publishable Key and Secret Key');
console.log('   - Add them to .env.local');

console.log('\n2. 🔐 Configure Email-Only Authentication:');
console.log('   - Go to: https://dashboard.clerk.com/');
console.log('   - Navigate to: User & Authentication > Email, Magic Links');
console.log('   - Enable "Email authentication"');
console.log('   - Enable "Magic Links" (email-based, no password)');
console.log('   - Disable "Phone number authentication"');

console.log('\n3. 📱 Alternative Authentication Methods:');
console.log('   - Enable Google Sign-In (recommended)');
console.log('   - Enable Facebook Sign-In (optional)');
console.log('   - Magic Links work automatically with email');

console.log('\n4. 🚀 Test the Application:');
console.log('   - Run: npm run dev');
console.log('   - Visit: http://localhost:3000');
console.log('   - Try signing up with email address');

console.log('\n📚 Documentation:');
console.log('================');
console.log('- Clerk Setup: CLERK_SETUP.md');
console.log('- India Phone Fix: CLERK_INDIA_PHONE_FIX.md');
console.log('- Clerk Dashboard: https://dashboard.clerk.com/');
console.log('- Twilio Setup: https://www.twilio.com/');

console.log('\n🎯 Quick Test Checklist:');
console.log('========================');
console.log('□ Email addresses work for sign-up');
console.log('□ Email addresses work for sign-in');
console.log('□ Magic links are received via email');
console.log('□ Users can complete authentication');
console.log('□ Protected routes require authentication');
console.log('□ Public routes (sign-in/sign-up) are accessible');

console.log('\n✨ Setup complete! Follow the steps above to configure your API keys.');
