#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envPath = path.join(process.cwd(), '.env.local');

console.log('🔐 MovieSearch Authentication Setup');
console.log('=====================================\n');

// Check if .env.local already exists
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists!');
  rl.question('Do you want to overwrite it? (y/N): ', (answer) => {
    if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
      setupEnvironment();
    } else {
      console.log('Setup cancelled.');
      rl.close();
    }
  });
} else {
  setupEnvironment();
}

function setupEnvironment() {
  console.log('\n📝 Setting up environment variables...\n');
  
  const envTemplate = `# Clerk Authentication Configuration
# Replace these with your actual Clerk API keys from https://dashboard.clerk.com

# Your Clerk Publishable Key (starts with pk_test_ or pk_live_)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here

# Your Clerk Secret Key (starts with sk_test_ or sk_live_)
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Clerk Sign-in URL
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in

# Clerk Sign-up URL
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# Clerk After Sign-in URL
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/

# Clerk After Sign-up URL
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# TMDB API Configuration
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000`;

  fs.writeFileSync(envPath, envTemplate);
  
  console.log('✅ .env.local file created successfully!');
  console.log('\n📋 Next Steps:');
  console.log('1. Get your Clerk API keys from https://dashboard.clerk.com');
  console.log('2. Get your TMDB API key from https://www.themoviedb.org/settings/api');
  console.log('3. Replace the placeholder values in .env.local with your actual keys');
  console.log('4. Restart your development server: npm run dev');
  console.log('\n🎬 Your MovieSearch application will then require authentication!');
  
  rl.close();
}
