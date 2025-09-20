#!/usr/bin/env node

/**
 * LadliHub.in Issues Diagnostic Script
 * 
 * This script diagnoses Google Analytics and Microsoft OAuth issues.
 * Run with: node diagnose-issues.js
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

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

async function testGoogleAnalytics() {
  console.log('📊 Testing Google Analytics...');
  
  try {
    const response = await makeRequest(`${BASE_URL}/`);
    
    if (response.status === 200) {
      // Check if GA script is present in HTML
      const hasGAScript = response.data.includes('googletagmanager.com') || 
                         response.data.includes('gtag') ||
                         response.data.includes('G-Z2QNY6M1QL');
      
      if (hasGAScript) {
        console.log('✅ Google Analytics script found in HTML');
        console.log('   Check browser console for GA initialization message');
      } else {
        console.log('❌ Google Analytics script NOT found in HTML');
        console.log('   Issue: NEXT_PUBLIC_GA_MEASUREMENT_ID not set in Netlify');
      }
    } else {
      console.log(`❌ Site not accessible (Status: ${response.status})`);
    }
  } catch (error) {
    console.log('❌ Google Analytics test error:', error.message);
  }
}

async function testMicrosoftOAuth() {
  console.log('\n🔐 Testing Microsoft OAuth...');
  
  try {
    // Test the callback endpoint
    const response = await makeRequest(`${BASE_URL}/api/auth/callback/microsoft`);
    
    if (response.status === 200 || response.status === 302) {
      console.log('✅ Microsoft OAuth callback endpoint accessible');
      console.log(`   Status: ${response.status}`);
    } else {
      console.log('❌ Microsoft OAuth callback endpoint not accessible');
      console.log(`   Status: ${response.status}`);
      console.log('   Issue: Redirect URI mismatch in Azure Portal');
    }
  } catch (error) {
    console.log('❌ Microsoft OAuth test error:', error.message);
  }
}

async function testAdminSystem() {
  console.log('\n🛡️ Testing Admin System...');
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/admin/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });

    if (response.status === 200) {
      console.log('✅ Admin login API working');
      const data = JSON.parse(response.data);
      if (data.success) {
        console.log('   Admin authentication successful');
      }
    } else if (response.status === 401) {
      console.log('❌ Admin login failed - Invalid credentials');
      console.log('   Issue: ADMIN_USERNAME/ADMIN_PASSWORD not set in Netlify');
    } else if (response.status === 403) {
      console.log('❌ Admin login failed - Access forbidden');
      console.log('   Issue: Environment variables not set in Netlify');
    } else {
      console.log(`❌ Admin login failed (Status: ${response.status})`);
    }
  } catch (error) {
    console.log('❌ Admin system test error:', error.message);
  }
}

async function testEnvironmentVariables() {
  console.log('\n🔧 Testing Environment Variables...');
  
  try {
    // Test if the site is using environment variables
    const response = await makeRequest(`${BASE_URL}/`);
    
    if (response.status === 200) {
      // Check for signs of environment variables being used
      const hasGA = response.data.includes('G-Z2QNY6M1QL');
      const hasAppURL = response.data.includes('ladlihub.in');
      
      console.log(`✅ Site accessible (Status: ${response.status})`);
      console.log(`   Google Analytics configured: ${hasGA ? 'YES' : 'NO'}`);
      console.log(`   App URL configured: ${hasAppURL ? 'YES' : 'NO'}`);
      
      if (!hasGA) {
        console.log('   ❌ NEXT_PUBLIC_GA_MEASUREMENT_ID not set in Netlify');
      }
    }
  } catch (error) {
    console.log('❌ Environment variables test error:', error.message);
  }
}

async function runDiagnostics() {
  console.log('🚀 LadliHub.in Issues Diagnostic');
  console.log('=================================');
  console.log(`Testing URL: ${BASE_URL}`);
  console.log('');

  await testEnvironmentVariables();
  await testGoogleAnalytics();
  await testMicrosoftOAuth();
  await testAdminSystem();

  console.log('\n📋 Summary & Solutions:');
  console.log('========================');
  console.log('');
  console.log('🔧 IMMEDIATE FIXES NEEDED:');
  console.log('');
  console.log('1. Set Environment Variables in Netlify:');
  console.log('   - Go to Netlify Dashboard → Site settings → Environment variables');
  console.log('   - Add: NEXT_PUBLIC_GA_MEASUREMENT_ID=G-Z2QNY6M1QL');
  console.log('   - Add: ADMIN_USERNAME=admin');
  console.log('   - Add: ADMIN_PASSWORD=admin123');
  console.log('   - Add: ADMIN_JWT_SECRET=5be0c6c031217dd0a06965b0905f7a7fa350410ccbbc7f8ff1606581f65ab0ac');
  console.log('');
  console.log('2. Fix Microsoft OAuth in Azure Portal:');
  console.log('   - Update redirect URI to: https://ladlihub.in/api/auth/callback/microsoft');
  console.log('   - Regenerate client secret if expired');
  console.log('   - Update Clerk Dashboard with new credentials');
  console.log('');
  console.log('3. Redeploy Site:');
  console.log('   - Go to Netlify Deploys tab');
  console.log('   - Click "Trigger deploy"');
  console.log('   - Wait 2-3 minutes');
  console.log('');
  console.log('4. Test Everything:');
  console.log('   - Visit https://ladlihub.in');
  console.log('   - Check Google Analytics detection');
  console.log('   - Test Microsoft OAuth login');
  console.log('   - Test admin dashboard access');
  console.log('');
  console.log('📖 For detailed instructions, see: IMMEDIATE_FIXES.md');
}

// Run the diagnostics
runDiagnostics().catch(console.error);
