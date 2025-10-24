#!/usr/bin/env node

/**
 * Configuration Checker for MovieSearch 2025
 * Verifies all required resources and configurations
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking MovieSearch 2025 Configuration...\n');

const issues = [];
const warnings = [];
const success = [];

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Check 1: Environment Variables
console.log('📋 Checking Environment Variables...');

const requiredEnvVars = {
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY': 'Clerk Authentication',
  'CLERK_SECRET_KEY': 'Clerk Authentication',
  'NEXT_PUBLIC_TMDB_API_KEY': 'TMDB Movie Data',
};

const optionalEnvVars = {
  'OPENAI_API_KEY': 'AI Features (optional)',
  'MONGODB_URI': 'Database (optional for new features)',
  'NEXT_PUBLIC_GOOGLE_ANALYTICS_ID': 'Google Analytics',
  'NEXT_PUBLIC_RECAPTCHA_SITE_KEY': 'reCAPTCHA',
  'NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID': 'Google Ads',
};

Object.entries(requiredEnvVars).forEach(([key, description]) => {
  if (!process.env[key] || process.env[key].includes('your_') || process.env[key].includes('xxx')) {
    issues.push(`❌ Missing or invalid: ${key} (${description})`);
  } else {
    success.push(`✅ ${key} configured`);
  }
});

Object.entries(optionalEnvVars).forEach(([key, description]) => {
  if (!process.env[key] || process.env[key].includes('your_') || process.env[key].includes('xxx')) {
    warnings.push(`⚠️  Optional: ${key} (${description})`);
  } else {
    success.push(`✅ ${key} configured`);
  }
});

// Check 2: Package Dependencies
console.log('\n📦 Checking Package Dependencies...');

try {
  const packageJson = require('../package.json');
  const requiredDeps = [
    '@clerk/nextjs',
    'next',
    'react',
    'react-dom',
    '@mui/material',
  ];

  requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      success.push(`✅ ${dep} installed`);
    } else {
      issues.push(`❌ Missing dependency: ${dep}`);
    }
  });

  // Check optional dependencies
  if (!packageJson.dependencies['socket.io']) {
    warnings.push(`⚠️  Optional: socket.io not installed (real-time features disabled)`);
  }
  
  if (!packageJson.dependencies['openai']) {
    warnings.push(`⚠️  Optional: openai not installed (AI features may have limited functionality)`);
  }
} catch (error) {
  issues.push(`❌ Cannot read package.json: ${error.message}`);
}

// Check 3: Critical Files
console.log('\n📁 Checking Critical Files...');

const criticalFiles = [
  'next.config.ts',
  'src/middleware.ts',
  'src/app/layout.tsx',
  'src/components/AuthGuard.tsx',
  'package.json',
  'tsconfig.json',
];

criticalFiles.forEach(file => {
  if (fs.existsSync(path.join(process.cwd(), file))) {
    success.push(`✅ ${file} exists`);
  } else {
    issues.push(`❌ Missing file: ${file}`);
  }
});

// Check 4: .env.local file
console.log('\n🔐 Checking Environment File...');

if (fs.existsSync('.env.local')) {
  success.push('✅ .env.local exists');
  
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const envLines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
  
  console.log(`   Found ${envLines.length} environment variables`);
} else {
  warnings.push('⚠️  .env.local not found - copy from env.example');
}

// Check 5: Build Directory
console.log('\n🏗️  Checking Build Status...');

if (fs.existsSync('.next')) {
  success.push('✅ .next build directory exists');
} else {
  warnings.push('⚠️  No build found - run "npm run build"');
}

// Check 6: Node Modules
console.log('\n📚 Checking Node Modules...');

if (fs.existsSync('node_modules')) {
  success.push('✅ node_modules exists');
  
  const nodeModulesSize = fs.readdirSync('node_modules').length;
  console.log(`   Found ${nodeModulesSize} packages installed`);
} else {
  issues.push('❌ node_modules not found - run "npm install"');
}

// Check 7: Git Repository
console.log('\n🔄 Checking Git Status...');

if (fs.existsSync('.git')) {
  success.push('✅ Git repository initialized');
} else {
  warnings.push('⚠️  Not a git repository');
}

// Check 8: Deployment Configs
console.log('\n🚀 Checking Deployment Configs...');

const deploymentConfigs = [
  { file: 'netlify.toml', platform: 'Netlify' },
  { file: 'netlify-optimized.toml', platform: 'Netlify (optimized)' },
  { file: 'wrangler.toml', platform: 'Cloudflare' },
  { file: '_headers', platform: 'Cloudflare Pages' },
  { file: '_redirects', platform: 'Cloudflare Pages' },
  { file: 'vercel.json', platform: 'Vercel' },
];

let hasDeploymentConfig = false;
deploymentConfigs.forEach(({ file, platform }) => {
  if (fs.existsSync(file)) {
    success.push(`✅ ${platform} config found (${file})`);
    hasDeploymentConfig = true;
  }
});

if (!hasDeploymentConfig) {
  warnings.push('⚠️  No deployment configuration found');
}

// Check 9: TypeScript Configuration
console.log('\n⚙️  Checking TypeScript...');

if (fs.existsSync('tsconfig.json')) {
  try {
    const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
    if (tsconfig.compilerOptions) {
      success.push('✅ TypeScript configured');
    }
  } catch (error) {
    issues.push(`❌ Invalid tsconfig.json: ${error.message}`);
  }
}

// Check 10: Port Availability
console.log('\n🔌 Checking Ports...');

const net = require('net');

function checkPort(port, description) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => {
      warnings.push(`⚠️  Port ${port} (${description}) is already in use`);
      resolve(false);
    });
    server.once('listening', () => {
      server.close();
      success.push(`✅ Port ${port} (${description}) is available`);
      resolve(true);
    });
    server.listen(port);
  });
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 CONFIGURATION SUMMARY');
console.log('='.repeat(60));

if (issues.length > 0) {
  console.log('\n❌ CRITICAL ISSUES:');
  issues.forEach(issue => console.log(`   ${issue}`));
}

if (warnings.length > 0) {
  console.log('\n⚠️  WARNINGS:');
  warnings.forEach(warning => console.log(`   ${warning}`));
}

console.log('\n✅ SUCCESS:');
console.log(`   ${success.length} checks passed`);

console.log('\n' + '='.repeat(60));

if (issues.length > 0) {
  console.log('\n❌ Configuration has critical issues!');
  console.log('   Please fix the issues above before running the app.\n');
  process.exit(1);
} else if (warnings.length > 0) {
  console.log('\n⚠️  Configuration has warnings but is functional.');
  console.log('   Optional features may not work without additional setup.\n');
  process.exit(0);
} else {
  console.log('\n✅ All configurations are valid!');
  console.log('   Your app is ready to run.\n');
  process.exit(0);
}

