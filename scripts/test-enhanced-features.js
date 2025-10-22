#!/usr/bin/env node

/**
 * Enhanced Features Test Script
 * Tests all new integrations and enhancements
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Enhanced Features for MovieSearch 2025\n');
console.log('=' .repeat(60) + '\n');

let passed = 0;
let failed = 0;
let warnings = 0;

const assert = (condition, message, file = 'N/A') => {
  if (condition) {
    console.log(`✅ ${message}`);
    passed++;
  } else {
    console.error(`❌ ${message}: ${file}`);
    failed++;
  }
};

const warn = (message) => {
  console.warn(`⚠️  ${message}`);
  warnings++;
};

const assertFileExists = (filePath, message) => {
  const exists = fs.existsSync(filePath);
  assert(exists, message, filePath);
  return exists;
};

const assertFileContains = (filePath, content, message) => {
  try {
    if (!fs.existsSync(filePath)) {
      assert(false, `${message} (File not found)`, filePath);
      return false;
    }
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const contains = fileContent.includes(content);
    assert(contains, message, filePath);
    return contains;
  } catch (error) {
    assert(false, `${message} (Read error)`, filePath);
    return false;
  }
};

console.log('📦 TESTING CORE COMPONENTS\n');

// Test Enhanced AuthGuard
assertFileExists('src/components/EnhancedAuthGuard.tsx', 'Enhanced AuthGuard component exists');
assertFileContains('src/components/EnhancedAuthGuard.tsx', 'performSecurityChecks', 'Security checks function exists');
assertFileContains('src/components/EnhancedAuthGuard.tsx', 'sessionValidity', 'Session validity tracking exists');
assertFileContains('src/components/EnhancedAuthGuard.tsx', 'allowedRoles', 'Role-based authorization exists');

// Test Google Ads
assertFileExists('src/components/GoogleAds.tsx', 'Google Ads component exists');
assertFileContains('src/components/GoogleAds.tsx', 'adsbygoogle', 'AdSense script integration exists');
assertFileContains('src/components/GoogleAds.tsx', 'GoogleAdsScript', 'Ads script component exists');

// Test Google reCAPTCHA v3
assertFileExists('src/components/GoogleReCaptchaV3.tsx', 'Google reCAPTCHA v3 component exists');
assertFileContains('src/components/GoogleReCaptchaV3.tsx', 'useReCaptchaV3', 'reCAPTCHA hook exists');
assertFileContains('src/components/GoogleReCaptchaV3.tsx', 'verifyRecaptchaToken', 'Server-side verification exists');

// Test Enhanced Google Analytics
assertFileExists('src/components/EnhancedGoogleAnalytics.tsx', 'Enhanced Google Analytics component exists');
assertFileContains('src/components/EnhancedGoogleAnalytics.tsx', 'useGoogleAnalytics', 'Analytics hook exists');
assertFileContains('src/components/EnhancedGoogleAnalytics.tsx', 'web_vitals', 'Web Vitals tracking exists');
assertFileContains('src/components/EnhancedGoogleAnalytics.tsx', 'trackSearch', 'Search tracking exists');

// Test Enhanced Tawk.to
assertFileExists('src/components/EnhancedTawkTo.tsx', 'Enhanced Tawk.to component exists');
assertFileContains('src/components/EnhancedTawkTo.tsx', 'useTawkTo', 'Tawk.to hook exists');
assertFileContains('src/components/EnhancedTawkTo.tsx', 'setAttributes', 'User attributes setting exists');

// Test Enhanced TMDB Client
assertFileExists('src/lib/enhancedTmdb.ts', 'Enhanced TMDB client exists');
assertFileContains('src/lib/enhancedTmdb.ts', 'EnhancedTMDBClient', 'TMDB client class exists');
assertFileContains('src/lib/enhancedTmdb.ts', 'cache', 'Caching layer exists');
assertFileContains('src/lib/enhancedTmdb.ts', 'retryDelay', 'Retry logic exists');

// Test Enhanced Error Handling
assertFileExists('src/utils/enhancedErrorHandling.ts', 'Enhanced error handling exists');
assertFileContains('src/utils/enhancedErrorHandling.ts', 'AppError', 'AppError class exists');
assertFileContains('src/utils/enhancedErrorHandling.ts', 'handleApiError', 'API error handler exists');
assertFileContains('src/utils/enhancedErrorHandling.ts', 'errorRecovery', 'Error recovery strategies exist');

console.log('\n' + '─'.repeat(60) + '\n');
console.log('🔧 TESTING CONFIGURATION FILES\n');

// Test Nginx configuration
assertFileExists('nginx-enhanced.conf', 'Enhanced Nginx configuration exists');
assertFileContains('nginx-enhanced.conf', 'limit_req_zone', 'Rate limiting configured');
assertFileContains('nginx-enhanced.conf', 'ssl_certificate', 'SSL configured');
assertFileContains('nginx-enhanced.conf', 'gzip on', 'Gzip compression enabled');
assertFileContains('nginx-enhanced.conf', 'proxy_cache', 'Caching configured');

// Test MongoDB configuration
assertFileExists('mongodb-enhanced.config.js', 'Enhanced MongoDB configuration exists');
assertFileContains('mongodb-enhanced.config.js', 'maxPoolSize', 'Connection pooling configured');
assertFileContains('mongodb-enhanced.config.js', 'indexes', 'Database indexes defined');
assertFileContains('mongodb-enhanced.config.js', 'validation', 'Data validation rules defined');

console.log('\n' + '─'.repeat(60) + '\n');
console.log('📄 TESTING DOCUMENTATION\n');

// Test setup guide
assertFileExists('🚀_COMPLETE_ENHANCED_SETUP_GUIDE.md', 'Complete setup guide exists');
assertFileContains('🚀_COMPLETE_ENHANCED_SETUP_GUIDE.md', 'Environment Variables Setup', 'Environment setup documented');
assertFileContains('🚀_COMPLETE_ENHANCED_SETUP_GUIDE.md', 'Service Integrations', 'Service integrations documented');
assertFileContains('🚀_COMPLETE_ENHANCED_SETUP_GUIDE.md', 'Troubleshooting', 'Troubleshooting guide included');

// Test env.example
assertFileExists('env.example', 'Example environment file exists');
assertFileContains('env.example', 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY', 'Clerk variables documented');
assertFileContains('env.example', 'NEXT_PUBLIC_RECAPTCHA_SITE_KEY', 'reCAPTCHA variables documented');
assertFileContains('env.example', 'NEXT_PUBLIC_GOOGLE_ADS_CLIENT', 'Google Ads variables documented');
assertFileContains('env.example', 'NEXT_PUBLIC_TAWK_PROPERTY_ID', 'Tawk.to variables documented');

console.log('\n' + '─'.repeat(60) + '\n');
console.log('⚙️  TESTING ENVIRONMENT CONFIGURATION\n');

// Check if .env.local exists
if (fs.existsSync('.env.local')) {
  console.log('✅ .env.local file exists');
  
  const envContent = fs.readFileSync('.env.local', 'utf8');
  
  // Check critical variables
  const criticalVars = [
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY',
    'NEXT_PUBLIC_TMDB_API_KEY',
    'MONGODB_URI'
  ];
  
  criticalVars.forEach(varName => {
    if (envContent.includes(varName) && !envContent.includes(`${varName}=your_`) && !envContent.includes(`${varName}=XXXX`)) {
      console.log(`✅ ${varName} is configured`);
      passed++;
    } else {
      warn(`${varName} is not configured or using placeholder`);
    }
  });
} else {
  warn('.env.local file not found. Copy env.example to .env.local and configure it.');
}

console.log('\n' + '─'.repeat(60) + '\n');
console.log('📦 TESTING PACKAGE DEPENDENCIES\n');

// Check package.json
if (assertFileExists('package.json', 'package.json exists')) {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  const requiredDeps = [
    '@clerk/nextjs',
    '@mui/material',
    'axios',
    'mongoose',
    'next',
    'react'
  ];
  
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`✅ ${dep} is installed`);
      passed++;
    } else {
      console.error(`❌ ${dep} is missing from dependencies`);
      failed++;
    }
  });
}

console.log('\n' + '─'.repeat(60) + '\n');
console.log('🔍 TESTING CODE QUALITY\n');

// Check for TypeScript errors (basic check)
const tsConfigExists = assertFileExists('tsconfig.json', 'TypeScript configuration exists');
if (tsConfigExists) {
  assertFileContains('tsconfig.json', '"strict":', 'Strict mode enabled');
}

// Check Next.js configuration
if (assertFileExists('next.config.ts', 'Next.js configuration exists')) {
  assertFileContains('next.config.ts', 'images', 'Image optimization configured');
}

console.log('\n' + '─'.repeat(60) + '\n');
console.log('🚀 TESTING BUILD READINESS\n');

// Check if node_modules exists
if (fs.existsSync('node_modules')) {
  console.log('✅ Dependencies are installed');
  passed++;
} else {
  warn('node_modules not found. Run npm install first.');
}

// Check if .next build directory exists
if (fs.existsSync('.next')) {
  console.log('✅ Next.js build directory exists');
  passed++;
} else {
  warn('.next build directory not found. Run npm run build to test production build.');
}

console.log('\n' + '='.repeat(60) + '\n');
console.log('📊 TEST SUMMARY\n');
console.log(`✅ Passed:   ${passed}`);
console.log(`❌ Failed:   ${failed}`);
console.log(`⚠️  Warnings: ${warnings}\n`);

if (failed === 0) {
  console.log('🎉 All critical tests passed!\n');
  console.log('Next steps:');
  console.log('1. Configure .env.local with your actual API keys');
  console.log('2. Run: npm install (if not done)');
  console.log('3. Run: npm run dev');
  console.log('4. Test in browser');
  console.log('5. Run: npm run build (for production build)');
  console.log('6. Deploy to your hosting provider\n');
  process.exit(0);
} else {
  console.error('\n❌ Some tests failed. Please fix the issues above before proceeding.\n');
  process.exit(1);
}

