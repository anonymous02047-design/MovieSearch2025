#!/usr/bin/env node

/**
 * Microsoft OAuth Redirect Test Script
 * 
 * This script tests the Microsoft OAuth redirect flow.
 * Run with: node test-microsoft-oauth-redirect.js
 */

const https = require('https');

const BASE_URL = 'https://ladlihub.in';

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({ 
          status: res.statusCode, 
          data: data, 
          headers: res.headers,
          url: url
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function testSignInPage() {
  console.log('🔐 Testing Sign-in Page...');
  
  try {
    const response = await makeRequest(`${BASE_URL}/sign-in`);
    
    if (response.status === 200) {
      console.log('✅ Sign-in page accessible');
      
      // Check if Microsoft OAuth button is present
      const hasMicrosoftButton = response.data.includes('Microsoft') || 
                                response.data.includes('microsoft') ||
                                response.data.includes('Continue with Microsoft');
      
      if (hasMicrosoftButton) {
        console.log('✅ Microsoft OAuth button found on sign-in page');
      } else {
        console.log('❌ Microsoft OAuth button NOT found on sign-in page');
      }
    } else {
      console.log(`❌ Sign-in page not accessible (Status: ${response.status})`);
    }
  } catch (error) {
    console.log('❌ Sign-in page test error:', error.message);
  }
}

async function testSignUpPage() {
  console.log('\n📝 Testing Sign-up Page...');
  
  try {
    const response = await makeRequest(`${BASE_URL}/sign-up`);
    
    if (response.status === 200) {
      console.log('✅ Sign-up page accessible');
    } else {
      console.log(`❌ Sign-up page not accessible (Status: ${response.status})`);
    }
  } catch (error) {
    console.log('❌ Sign-up page test error:', error.message);
  }
}

async function testMicrosoftCallback() {
  console.log('\n🔄 Testing Microsoft OAuth Callback...');
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/auth/callback/microsoft`);
    
    if (response.status === 200 || response.status === 302) {
      console.log('✅ Microsoft OAuth callback endpoint accessible');
      console.log(`   Status: ${response.status}`);
      
      if (response.status === 302) {
        const location = response.headers.location;
        if (location) {
          console.log(`   Redirect location: ${location}`);
          
          if (location.includes('/sign-up')) {
            console.log('❌ WARNING: Redirecting to sign-up page (this is the problem!)');
          } else if (location.includes('ladlihub.in')) {
            console.log('✅ Redirecting to correct domain');
          }
        }
      }
    } else {
      console.log('❌ Microsoft OAuth callback endpoint not accessible');
      console.log(`   Status: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Microsoft OAuth callback test error:', error.message);
  }
}

async function testHomePage() {
  console.log('\n🏠 Testing Home Page...');
  
  try {
    const response = await makeRequest(`${BASE_URL}/`);
    
    if (response.status === 200) {
      console.log('✅ Home page accessible');
    } else {
      console.log(`❌ Home page not accessible (Status: ${response.status})`);
    }
  } catch (error) {
    console.log('❌ Home page test error:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Microsoft OAuth Redirect Test for LadliHub.in');
  console.log('================================================');
  console.log(`Testing URL: ${BASE_URL}`);
  console.log('');

  await testHomePage();
  await testSignInPage();
  await testSignUpPage();
  await testMicrosoftCallback();

  console.log('\n📋 Test Summary:');
  console.log('================');
  console.log('');
  console.log('🔧 If Microsoft OAuth is redirecting to sign-up page:');
  console.log('');
  console.log('1. Fix Clerk Dashboard Configuration:');
  console.log('   - Go to Clerk Dashboard → User & Authentication → Paths');
  console.log('   - Set After sign-in URL: https://ladlihub.in/');
  console.log('   - Set After sign-up URL: https://ladlihub.in/');
  console.log('');
  console.log('2. Fix Azure Portal Configuration:');
  console.log('   - Go to Azure Portal → App registrations → Your app → Authentication');
  console.log('   - Update redirect URI: https://ladlihub.in/api/auth/callback/microsoft');
  console.log('');
  console.log('3. Update Environment Variables in Netlify:');
  console.log('   - NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=https://ladlihub.in/');
  console.log('   - NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=https://ladlihub.in/');
  console.log('');
  console.log('4. Redeploy Site:');
  console.log('   - Go to Netlify Deploys tab');
  console.log('   - Click "Trigger deploy"');
  console.log('   - Wait 2-3 minutes');
  console.log('');
  console.log('📖 For detailed instructions, see: MICROSOFT_OAUTH_REDIRECT_FIX.md');
}

// Run the tests
runTests().catch(console.error);
