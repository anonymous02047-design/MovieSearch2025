#!/usr/bin/env node

/**
 * Admin System Test Script for LadliHub.in
 * 
 * This script tests the admin authentication and dashboard functionality.
 * Run with: node test-admin-system.js
 */

const https = require('https');

const BASE_URL = 'https://ladlihub.in';
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData, headers: res.headers });
        } catch (error) {
          resolve({ status: res.statusCode, data: data, headers: res.headers });
        }
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

async function testAdminLogin() {
  console.log('🔐 Testing Admin Login...');
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/admin/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ADMIN_CREDENTIALS)
    });

    if (response.status === 200 && response.data.success) {
      console.log('✅ Admin login successful');
      console.log(`   Username: ${response.data.username}`);
      console.log(`   Token: ${response.data.token.substring(0, 20)}...`);
      return response.data.token;
    } else {
      console.log('❌ Admin login failed');
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${response.data.error || 'Unknown error'}`);
      return null;
    }
  } catch (error) {
    console.log('❌ Admin login error:', error.message);
    return null;
  }
}

async function testAdminAPI(token, endpoint, description) {
  console.log(`\n🔍 Testing ${description}...`);
  
  try {
    const response = await makeRequest(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });

    if (response.status === 200) {
      console.log(`✅ ${description} working`);
      if (response.data) {
        console.log(`   Response: ${JSON.stringify(response.data).substring(0, 100)}...`);
      }
      return true;
    } else {
      console.log(`❌ ${description} failed`);
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${response.data.error || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${description} error:`, error.message);
    return false;
  }
}

async function testAdminDashboard() {
  console.log('\n🏠 Testing Admin Dashboard Access...');
  
  try {
    const response = await makeRequest(`${BASE_URL}/admin/dashboard`, {
      method: 'GET'
    });

    if (response.status === 200) {
      console.log('✅ Admin dashboard accessible');
      return true;
    } else {
      console.log('❌ Admin dashboard not accessible');
      console.log(`   Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Admin dashboard error:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Admin System Test for LadliHub.in');
  console.log('=====================================');
  console.log(`Testing URL: ${BASE_URL}`);
  console.log(`Admin Credentials: ${ADMIN_CREDENTIALS.username} / ${ADMIN_CREDENTIALS.password}`);
  console.log('');

  // Test 1: Admin Login
  const token = await testAdminLogin();
  
  if (!token) {
    console.log('\n❌ Admin login failed. Cannot continue with other tests.');
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if environment variables are set in Netlify:');
    console.log('   - ADMIN_USERNAME=admin');
    console.log('   - ADMIN_PASSWORD=admin123');
    console.log('   - ADMIN_JWT_SECRET=5be0c6c031217dd0a06965b0905f7a7fa350410ccbbc7f8ff1606581f65ab0ac');
    console.log('2. Redeploy your site after adding variables');
    console.log('3. Check Netlify build logs for errors');
    return;
  }

  // Test 2: Admin API Endpoints
  const apiTests = [
    { endpoint: '/api/admin/rate-limits/stats', description: 'Rate Limits Stats API' },
    { endpoint: '/api/admin/rate-limits/block-ip', description: 'Block IP API' },
    { endpoint: '/api/admin/rate-limits/block-country', description: 'Block Country API' },
    { endpoint: '/api/admin/analytics/summary', description: 'Analytics Summary API' }
  ];

  let passedTests = 0;
  for (const test of apiTests) {
    const passed = await testAdminAPI(token, test.endpoint, test.description);
    if (passed) passedTests++;
  }

  // Test 3: Admin Dashboard
  const dashboardAccessible = await testAdminDashboard();

  // Summary
  console.log('\n📊 Test Summary:');
  console.log('================');
  console.log(`✅ Admin Login: ${token ? 'PASSED' : 'FAILED'}`);
  console.log(`✅ API Endpoints: ${passedTests}/${apiTests.length} PASSED`);
  console.log(`✅ Dashboard Access: ${dashboardAccessible ? 'PASSED' : 'FAILED'}`);
  
  if (token && passedTests === apiTests.length && dashboardAccessible) {
    console.log('\n🎉 All tests passed! Admin system is working correctly.');
    console.log('\n🎯 Next Steps:');
    console.log('1. Visit https://ladlihub.in/admin/login/');
    console.log('2. Login with: admin / admin123');
    console.log('3. Access dashboard at https://ladlihub.in/admin/dashboard/');
  } else {
    console.log('\n❌ Some tests failed. Check the troubleshooting guide.');
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check environment variables in Netlify');
    console.log('2. Redeploy your site');
    console.log('3. Check browser console for errors');
    console.log('4. See ADMIN_DASHBOARD_TROUBLESHOOTING.md for detailed help');
  }
}

// Run the tests
runTests().catch(console.error);
