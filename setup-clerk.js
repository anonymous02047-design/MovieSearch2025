#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎬 MovieSearch 2025 - Clerk Authentication Setup');
console.log('================================================\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.log('📝 Creating .env.local file...');
  
  const envContent = `# TMDB API Configuration
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
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.local file created successfully!\n');
} else {
  console.log('✅ .env.local file already exists\n');
}

console.log('🔑 Next Steps:');
console.log('==============');
console.log('1. Get your Clerk API keys:');
console.log('   - Visit: https://dashboard.clerk.com/');
console.log('   - Create a new application or select existing one');
console.log('   - Go to "API Keys" section');
console.log('   - Copy your Publishable Key and Secret Key\n');

console.log('2. Get your TMDB API key:');
console.log('   - Visit: https://www.themoviedb.org/settings/api');
console.log('   - Create an account and request an API key\n');

console.log('3. Update .env.local with your keys:');
console.log('   - Replace "your_tmdb_api_key_here" with your TMDB API key');
console.log('   - Replace "your_clerk_publishable_key_here" with your Clerk publishable key');
console.log('   - Replace "your_clerk_secret_key_here" with your Clerk secret key\n');

console.log('4. Start the development server:');
console.log('   npm run dev\n');

console.log('🎯 Features Available After Setup:');
console.log('==================================');
console.log('✅ User authentication (sign-in/sign-up)');
console.log('✅ Protected routes (profile, favorites, watchlist)');
console.log('✅ User-specific data storage');
console.log('✅ 14+ additional pages (trending, genres, collections, etc.)');
console.log('✅ 47+ API endpoints');
console.log('✅ Professional contact page with Google Maps');
console.log('✅ WhatsApp integration');
console.log('✅ Cookies consent management');
console.log('✅ Comprehensive error handling');
console.log('✅ Dark/light theme toggle');
console.log('✅ Responsive design\n');

console.log('🚀 Ready to go! Add your API keys and run: npm run dev');
