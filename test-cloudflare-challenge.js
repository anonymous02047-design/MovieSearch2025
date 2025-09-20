#!/usr/bin/env node

/**
 * Cloudflare Challenge Test Script
 * 
 * This script tests if Cloudflare is blocking admin access.
 * Run with: node test-cloudflare-challenge.js
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

async function testAdminLoginPage() {
  console.log('🔐 Testing Admin Login Page...');
  
  try {
    const response = await makeRequest(`${BASE_URL}/admin/login/`);
    
    if (response.status === 200) {
      // Check if it's a challenge page
      const isChallengePage = response.data.includes('Just a moment') ||
                             response.data.includes('challenge-platform') ||
                             response.data.includes('_cf_chl_opt') ||
                             response.data.includes('Enable JavaScript and cookies');
      
      if (isChallengePage) {
        console.log('❌ Admin login page is showing Cloudflare challenge');
        console.log('   Issue: Cloudflare security settings too strict');
        console.log('   Solution: Create page rule for /admin/* with "Essentially Off" security');
      } else {
        console.log('✅ Admin login page accessible (not challenge page)');
        
        // Check if it's the actual admin login form
        const hasAdminForm = response.data.includes('admin') ||
                            response.data.includes('password') ||
                            response.data.includes('login') ||
                            response.data.includes('Admin Login');
        
        if (hasAdminForm) {
          console.log('✅ Admin login form detected');
        } else {
          console.log('⚠️  Admin login form not detected');
        }
      }
    } else {
      console.log(`❌ Admin login page not accessible (Status: ${response.status})`);
    }
  } catch (error) {
    console.log('❌ Admin login page test error:', error.message);
  }
}

async function testAPIEndpoints() {
  console.log('\n🔌 Testing API Endpoints...');
  
  const apiTests = [
    { url: '/api/admin/auth/login', name: 'Admin Auth API' },
    { url: '/api/test-rate-limit', name: 'Test Rate Limit API' },
    { url: '/api/contact', name: 'Contact API' }
  ];
  
  for (const test of apiTests) {
    try {
      const response = await makeRequest(`${BASE_URL}${test.url}`);
      
      if (response.status === 200) {
        // Check if it's a challenge page
        const isChallengePage = response.data.includes('Just a moment') ||
                               response.data.includes('challenge-platform');
        
        if (isChallengePage) {
          console.log(`❌ ${test.name}: Cloudflare challenge page`);
        } else {
          console.log(`✅ ${test.name}: Accessible (${response.status})`);
        }
      } else if (response.status === 404) {
        console.log(`⚠️  ${test.name}: Not found (${response.status})`);
      } else {
        console.log(`❌ ${test.name}: Error (${response.status})`);
      }
    } catch (error) {
      console.log(`❌ ${test.name}: Error - ${error.message}`);
    }
  }
}

async function testRegularPages() {
  console.log('\n🏠 Testing Regular Pages...');
  
  const pageTests = [
    { url: '/', name: 'Home Page' },
    { url: '/sign-in', name: 'Sign-in Page' },
    { url: '/sign-up', name: 'Sign-up Page' }
  ];
  
  for (const test of pageTests) {
    try {
      const response = await makeRequest(`${BASE_URL}${test.url}`);
      
      if (response.status === 200) {
        // Check if it's a challenge page
        const isChallengePage = response.data.includes('Just a moment') ||
                               response.data.includes('challenge-platform');
        
        if (isChallengePage) {
          console.log(`❌ ${test.name}: Cloudflare challenge page`);
        } else {
          console.log(`✅ ${test.name}: Accessible (${response.status})`);
        }
      } else {
        console.log(`❌ ${test.name}: Error (${response.status})`);
      }
    } catch (error) {
      console.log(`❌ ${test.name}: Error - ${error.message}`);
    }
  }
}

async function testCloudflareHeaders() {
  console.log('\n☁️ Testing Cloudflare Headers...');
  
  try {
    const response = await makeRequest(`${BASE_URL}/`);
    
    const cfHeaders = {
      'cf-ray': response.headers['cf-ray'],
      'cf-cache-status': response.headers['cf-cache-status'],
      'cf-request-id': response.headers['cf-request-id'],
      'server': response.headers['server']
    };
    
    if (cfHeaders['cf-ray']) {
      console.log('✅ Cloudflare is active');
      console.log(`   CF-Ray: ${cfHeaders['cf-ray']}`);
      console.log(`   Server: ${cfHeaders['server']}`);
      
      if (cfHeaders['cf-cache-status']) {
        console.log(`   Cache Status: ${cfHeaders['cf-cache-status']}`);
      }
    } else {
      console.log('❌ Cloudflare not detected');
    }
  } catch (error) {
    console.log('❌ Cloudflare headers test error:', error.message);
  }
}

async function runCloudflareTests() {
  console.log('🚀 Cloudflare Challenge Test for LadliHub.in');
  console.log('============================================');
  console.log(`Testing URL: ${BASE_URL}`);
  console.log('');

  await testCloudflareHeaders();
  await testRegularPages();
  await testAPIEndpoints();
  await testAdminLoginPage();

  console.log('\n📋 Test Summary:');
  console.log('================');
  console.log('');
  console.log('🔧 CLOUDFLARE CHALLENGE PAGE FIXES:');
  console.log('');
  console.log('1. Create Page Rules in Cloudflare:');
  console.log('   - Go to Cloudflare Dashboard → Rules → Page Rules');
  console.log('   - Create rule for: ladlihub.in/admin/*');
  console.log('   - Settings: Security Level = "Essentially Off"');
  console.log('   - Create rule for: ladlihub.in/api/*');
  console.log('   - Settings: Security Level = "Essentially Off"');
  console.log('');
  console.log('2. Adjust Security Level:');
  console.log('   - Go to Security → Settings');
  console.log('   - Set Security Level to "Medium" or "Low"');
  console.log('   - Disable "Browser Integrity Check" temporarily');
  console.log('');
  console.log('3. Create Firewall Rules:');
  console.log('   - Go to Security → WAF → Custom rules');
  console.log('   - Create rule: Allow Admin Access');
  console.log('   - Expression: (http.host eq "ladlihub.in" and http.request.uri.path contains "/admin")');
  console.log('   - Action: Allow');
  console.log('');
  console.log('4. Emergency Bypass:');
  console.log('   - Pause Cloudflare temporarily');
  console.log('   - Use direct Netlify URL');
  console.log('   - Add your IP to whitelist');
  console.log('');
  console.log('📖 For detailed instructions:');
  console.log('   See: CLOUDFLARE_CHALLENGE_FIX.md');
  console.log('');
  console.log('🚨 If admin login shows "Just a moment..." challenge page:');
  console.log('   - This is a Cloudflare security issue');
  console.log('   - Create page rules to bypass security for admin paths');
  console.log('   - Lower global security level temporarily');
}

// Run the Cloudflare tests
runCloudflareTests().catch(console.error);
