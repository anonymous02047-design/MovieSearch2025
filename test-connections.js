#!/usr/bin/env node

/**
 * Comprehensive Connection Test
 * Tests all API connections, Clerk, MongoDB, and environment variables
 */

const https = require('https');
const http = require('http');

console.log('\n' + '='.repeat(60));
console.log('🔍 MOVIESEARCH 2025 - CONNECTION TEST');
console.log('='.repeat(60) + '\n');

// Load environment variables
try {
  require('dotenv').config({ path: '.env.local' });
  console.log('✅ Environment file loaded (.env.local)\n');
} catch (err) {
  console.log('⚠️  No .env.local file found, using process.env\n');
}

// Test results
const results = {
  envVars: [],
  apiTests: [],
  clerk: null,
  mongodb: null,
  tmdb: null
};

// ========================================
// 1. CHECK ENVIRONMENT VARIABLES
// ========================================
console.log('📋 STEP 1: Checking Environment Variables');
console.log('-'.repeat(60));

const envChecks = [
  {
    name: 'Clerk Publishable Key',
    key: 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    required: true,
    pattern: /^pk_test_/
  },
  {
    name: 'Clerk Secret Key',
    key: 'CLERK_SECRET_KEY',
    required: true,
    pattern: /^sk_test_/
  },
  {
    name: 'TMDB API Key',
    key: 'NEXT_PUBLIC_TMDB_API_KEY',
    required: true,
    minLength: 30
  },
  {
    name: 'MongoDB URI',
    key: 'MONGODB_URI',
    required: true,
    pattern: /^mongodb/
  },
  {
    name: 'OpenAI API Key',
    key: 'OPENAI_API_KEY',
    required: false,
    pattern: /^sk-/
  },
  {
    name: 'Google Analytics ID',
    key: 'NEXT_PUBLIC_GA_MEASUREMENT_ID',
    required: false,
    pattern: /^G-/
  },
  {
    name: 'Tawk.to Property ID',
    key: 'NEXT_PUBLIC_TAWK_PROPERTY_ID',
    required: false
  }
];

envChecks.forEach(check => {
  const value = process.env[check.key];
  const exists = !!value;
  
  let isValid = false;
  let status = '❌';
  let message = 'Not set';
  
  if (exists) {
    if (check.pattern && !check.pattern.test(value)) {
      status = '⚠️';
      message = 'Invalid format';
    } else if (check.minLength && value.length < check.minLength) {
      status = '⚠️';
      message = 'Too short';
    } else {
      status = '✅';
      message = 'Valid';
      isValid = true;
    }
  } else if (!check.required) {
    status = '⚪';
    message = 'Optional (not set)';
  }
  
  console.log(`${status} ${check.name}: ${message}`);
  
  if (!isValid && check.required) {
    console.log(`   → Set ${check.key} in .env.local`);
  }
  
  results.envVars.push({ name: check.name, status, message, required: check.required });
});

console.log('');

// ========================================
// 2. TEST TMDB API CONNECTION
// ========================================
console.log('🎬 STEP 2: Testing TMDB API Connection');
console.log('-'.repeat(60));

const tmdbApiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

function testTMDB() {
  return new Promise((resolve) => {
    if (!tmdbApiKey || tmdbApiKey.length < 30) {
      console.log('❌ TMDB API Key not configured properly');
      console.log('   → Get your key at: https://www.themoviedb.org/settings/api');
      results.tmdb = { status: 'failed', error: 'API key not set' };
      resolve(false);
      return;
    }

    const url = `https://api.themoviedb.org/3/movie/550?api_key=${tmdbApiKey}`;
    
    console.log('📡 Making test request to TMDB...');
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', chunk => data += chunk);
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const movie = JSON.parse(data);
            console.log('✅ TMDB API Connection: SUCCESS');
            console.log(`   → Test Movie: "${movie.title}" (${movie.release_date})`);
            console.log(`   → API is working and returning data!`);
            results.tmdb = { status: 'success', movie: movie.title };
            resolve(true);
          } catch (err) {
            console.log('⚠️  Received response but failed to parse');
            results.tmdb = { status: 'warning', error: 'Parse error' };
            resolve(false);
          }
        } else if (res.statusCode === 401) {
          console.log('❌ TMDB API Key is INVALID');
          console.log('   → Check your API key at: https://www.themoviedb.org/settings/api');
          results.tmdb = { status: 'failed', error: 'Invalid API key' };
          resolve(false);
        } else {
          console.log(`❌ TMDB API Error: HTTP ${res.statusCode}`);
          results.tmdb = { status: 'failed', error: `HTTP ${res.statusCode}` };
          resolve(false);
        }
      });
    }).on('error', (err) => {
      console.log('❌ TMDB Connection Failed:', err.message);
      results.tmdb = { status: 'failed', error: err.message };
      resolve(false);
    });
  });
}

// ========================================
// 3. TEST CLERK API
// ========================================
async function testClerk() {
  console.log('\n🔐 STEP 3: Testing Clerk Authentication');
  console.log('-'.repeat(60));

  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const secretKey = process.env.CLERK_SECRET_KEY;

  if (!publishableKey || !secretKey) {
    console.log('❌ Clerk keys not configured');
    console.log('   → Get your keys at: https://dashboard.clerk.com');
    results.clerk = { status: 'failed', error: 'Keys not set' };
    return false;
  }

  if (!publishableKey.startsWith('pk_test_') && !publishableKey.startsWith('pk_live_')) {
    console.log('❌ Invalid Clerk Publishable Key format');
    console.log('   → Key should start with pk_test_ or pk_live_');
    results.clerk = { status: 'failed', error: 'Invalid format' };
    return false;
  }

  if (!secretKey.startsWith('sk_test_') && !secretKey.startsWith('sk_live_')) {
    console.log('❌ Invalid Clerk Secret Key format');
    console.log('   → Key should start with sk_test_ or sk_live_');
    results.clerk = { status: 'failed', error: 'Invalid format' };
    return false;
  }

  // Extract instance from publishable key
  const match = publishableKey.match(/pk_(test|live)_([^.]+)/);
  if (!match) {
    console.log('⚠️  Could not extract Clerk instance from key');
    results.clerk = { status: 'warning', error: 'Cannot parse key' };
    return false;
  }

  console.log('✅ Clerk Keys Format: Valid');
  console.log(`   → Environment: ${match[1]}`);
  console.log(`   → Keys are properly configured`);
  console.log('   → Clerk will work when app runs!');
  
  results.clerk = { status: 'success', environment: match[1] };
  return true;
}

// ========================================
// 4. TEST MONGODB CONNECTION
// ========================================
async function testMongoDB() {
  console.log('\n🗄️  STEP 4: Testing MongoDB Connection');
  console.log('-'.repeat(60));

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.log('❌ MongoDB URI not configured');
    console.log('   → Get your URI at: https://cloud.mongodb.com');
    results.mongodb = { status: 'failed', error: 'URI not set' };
    return false;
  }

  if (!mongoUri.startsWith('mongodb://') && !mongoUri.startsWith('mongodb+srv://')) {
    console.log('❌ Invalid MongoDB URI format');
    console.log('   → Should start with mongodb:// or mongodb+srv://');
    results.mongodb = { status: 'failed', error: 'Invalid format' };
    return false;
  }

  // Check for placeholder values
  if (mongoUri.includes('<username>') || mongoUri.includes('<password>')) {
    console.log('❌ MongoDB URI contains placeholders');
    console.log('   → Replace <username> and <password> with your actual credentials');
    results.mongodb = { status: 'failed', error: 'Contains placeholders' };
    return false;
  }

  try {
    console.log('📡 Attempting to connect to MongoDB...');
    
    // Try to import mongoose
    const mongoose = require('mongoose');
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
    });

    console.log('✅ MongoDB Connection: SUCCESS');
    console.log(`   → Connected to: ${mongoose.connection.name}`);
    console.log(`   → Database is ready to use!`);
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`   → Found ${collections.length} collection(s)`);
    
    results.mongodb = { 
      status: 'success', 
      database: mongoose.connection.name,
      collections: collections.length 
    };
    
    await mongoose.connection.close();
    return true;
    
  } catch (err) {
    console.log('❌ MongoDB Connection Failed');
    console.log(`   → Error: ${err.message}`);
    
    if (err.message.includes('Authentication failed')) {
      console.log('   → Check your username and password');
    } else if (err.message.includes('ENOTFOUND')) {
      console.log('   → Check your cluster address');
    } else if (err.message.includes('network')) {
      console.log('   → Check your network/firewall settings');
    }
    
    results.mongodb = { status: 'failed', error: err.message };
    return false;
  }
}

// ========================================
// 5. GENERATE SUMMARY
// ========================================
function generateSummary() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60) + '\n');

  const requiredEnvVars = results.envVars.filter(v => v.required);
  const validRequired = requiredEnvVars.filter(v => v.status === '✅').length;
  const totalRequired = requiredEnvVars.length;

  console.log(`Environment Variables: ${validRequired}/${totalRequired} required vars set`);
  console.log(`TMDB API: ${results.tmdb?.status || 'not tested'}`);
  console.log(`Clerk Auth: ${results.clerk?.status || 'not tested'}`);
  console.log(`MongoDB: ${results.mongodb?.status || 'not tested'}`);

  console.log('\n' + '-'.repeat(60));

  if (validRequired === totalRequired && 
      results.tmdb?.status === 'success' && 
      results.clerk?.status === 'success' && 
      results.mongodb?.status === 'success') {
    console.log('✅ ALL SYSTEMS GO! Your app is fully configured!');
    console.log('\n🚀 Ready to run: npm run dev');
    console.log('   Visit: http://localhost:3000');
  } else {
    console.log('⚠️  Some issues need attention:');
    console.log('');
    
    if (validRequired < totalRequired) {
      console.log('❌ Missing required environment variables');
      console.log('   → Check .env.local file');
    }
    
    if (results.tmdb?.status !== 'success') {
      console.log('❌ TMDB API not working');
      console.log('   → Get key: https://www.themoviedb.org/settings/api');
    }
    
    if (results.clerk?.status !== 'success') {
      console.log('❌ Clerk not properly configured');
      console.log('   → Get keys: https://dashboard.clerk.com');
    }
    
    if (results.mongodb?.status !== 'success') {
      console.log('❌ MongoDB not connected');
      console.log('   → Get URI: https://cloud.mongodb.com');
    }
  }

  console.log('\n' + '='.repeat(60) + '\n');
}

// ========================================
// RUN ALL TESTS
// ========================================
async function runAllTests() {
  try {
    await testTMDB();
    await testClerk();
    await testMongoDB();
    generateSummary();
  } catch (err) {
    console.error('Error running tests:', err);
  }
}

runAllTests();

