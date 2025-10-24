#!/usr/bin/env node

/**
 * Complete Setup Script for MovieSearch 2025
 * Configures all required resources
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 MovieSearch 2025 - Complete Setup\n');
console.log('='.repeat(60));

// Step 1: Check if .env.local exists
console.log('\n📋 Step 1: Environment Variables Setup');
console.log('-'.repeat(60));

if (!fs.existsSync('.env.local')) {
  console.log('Creating .env.local from env.example...');
  if (fs.existsSync('env.example')) {
    fs.copyFileSync('env.example', '.env.local');
    console.log('✅ .env.local created!');
    console.log('\n⚠️  IMPORTANT: Edit .env.local and add your API keys:');
    console.log('   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY');
    console.log('   - CLERK_SECRET_KEY');
    console.log('   - NEXT_PUBLIC_TMDB_API_KEY');
    console.log('   - OPENAI_API_KEY (optional)');
    console.log('   - MONGODB_URI (optional)');
  } else {
    console.log('❌ env.example not found!');
  }
} else {
  console.log('✅ .env.local already exists');
}

// Step 2: Install Dependencies
console.log('\n📦 Step 2: Installing Dependencies');
console.log('-'.repeat(60));

try {
  console.log('Running npm install...');
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed!');
} catch (error) {
  console.log('❌ Failed to install dependencies');
  console.log('   Please run "npm install" manually');
}

// Step 3: Check TypeScript
console.log('\n⚙️  Step 3: TypeScript Configuration');
console.log('-'.repeat(60));

if (fs.existsSync('tsconfig.json')) {
  console.log('✅ TypeScript configured');
} else {
  console.log('⚠️  tsconfig.json not found');
}

// Step 4: Create necessary directories
console.log('\n📁 Step 4: Creating Directories');
console.log('-'.repeat(60));

const dirs = [
  'public/images',
  'data/sessions',
  'logs',
  '.next',
];

dirs.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created ${dir}`);
  } else {
    console.log(`✅ ${dir} exists`);
  }
});

// Step 5: Verify Critical Files
console.log('\n🔍 Step 5: Verifying Critical Files');
console.log('-'.repeat(60));

const criticalFiles = [
  'next.config.ts',
  'src/middleware.ts',
  'src/app/layout.tsx',
  'src/components/AuthGuard.tsx',
  'package.json',
];

let allFilesExist = true;
criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ Missing: ${file}`);
    allFilesExist = false;
  }
});

// Step 6: Setup Instructions
console.log('\n📝 Step 6: Next Steps');
console.log('-'.repeat(60));

console.log('\n1️⃣  Configure Environment Variables:');
console.log('   Edit .env.local and add your API keys');
console.log('   Get keys from:');
console.log('   - Clerk: https://dashboard.clerk.com');
console.log('   - TMDB: https://www.themoviedb.org/settings/api');
console.log('   - OpenAI: https://platform.openai.com/api-keys (optional)');

console.log('\n2️⃣  Run Configuration Check:');
console.log('   npm run check-config');

console.log('\n3️⃣  Start Development Server:');
console.log('   npm run dev');

console.log('\n4️⃣  Build for Production:');
console.log('   npm run build');

console.log('\n5️⃣  Deploy to Cloudflare:');
console.log('   npx wrangler pages deploy .next');

console.log('\n' + '='.repeat(60));
console.log('✅ Setup Complete!');
console.log('='.repeat(60));
console.log('\n💡 Tip: Run "npm run check-config" to verify your setup\n');

