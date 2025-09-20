#!/usr/bin/env node

/**
 * Comprehensive Microsoft OAuth Diagnostic Script
 * 
 * This script diagnoses all possible causes of Microsoft OAuth issues.
 * Run with: node diagnose-microsoft-oauth-comprehensive.js
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

async function testSiteAccessibility() {
  console.log('🌐 Testing Site Accessibility...');
  
  try {
    const response = await makeRequest(`${BASE_URL}/`);
    
    if (response.status === 200) {
      console.log('✅ Site is accessible');
      
      // Check for Clerk integration
      const hasClerk = response.data.includes('clerk') || 
                      response.data.includes('Clerk') ||
                      response.data.includes('clerk.js');
      
      if (hasClerk) {
        console.log('✅ Clerk integration detected');
      } else {
        console.log('❌ Clerk integration NOT detected');
      }
    } else {
      console.log(`❌ Site not accessible (Status: ${response.status})`);
    }
  } catch (error) {
    console.log('❌ Site accessibility test error:', error.message);
  }
}

async function testSignInPage() {
  console.log('\n🔐 Testing Sign-in Page...');
  
  try {
    const response = await makeRequest(`${BASE_URL}/sign-in`);
    
    if (response.status === 200) {
      console.log('✅ Sign-in page accessible');
      
      // Check for Microsoft OAuth button
      const hasMicrosoftButton = response.data.includes('Microsoft') || 
                                response.data.includes('microsoft') ||
                                response.data.includes('Continue with Microsoft') ||
                                response.data.includes('Sign in with Microsoft');
      
      if (hasMicrosoftButton) {
        console.log('✅ Microsoft OAuth button found');
      } else {
        console.log('❌ Microsoft OAuth button NOT found');
      }
      
      // Check for OAuth URLs
      const hasOAuthUrls = response.data.includes('/api/auth/callback/microsoft') ||
                          response.data.includes('microsoft.com') ||
                          response.data.includes('login.microsoftonline.com');
      
      if (hasOAuthUrls) {
        console.log('✅ Microsoft OAuth URLs detected');
      } else {
        console.log('❌ Microsoft OAuth URLs NOT detected');
      }
    } else {
      console.log(`❌ Sign-in page not accessible (Status: ${response.status})`);
    }
  } catch (error) {
    console.log('❌ Sign-in page test error:', error.message);
  }
}

async function testMicrosoftCallback() {
  console.log('\n🔄 Testing Microsoft OAuth Callback...');
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/auth/callback/microsoft`);
    
    if (response.status === 200) {
      console.log('✅ Microsoft OAuth callback accessible (200)');
    } else if (response.status === 302) {
      console.log('✅ Microsoft OAuth callback accessible (302 redirect)');
      
      const location = response.headers.location;
      if (location) {
        console.log(`   Redirect location: ${location}`);
        
        if (location.includes('/sign-up')) {
          console.log('❌ WARNING: Redirecting to sign-up page');
        } else if (location.includes('ladlihub.in')) {
          console.log('✅ Redirecting to correct domain');
        } else if (location.includes('microsoft.com')) {
          console.log('✅ Redirecting to Microsoft (normal)');
        }
      }
    } else if (response.status === 404) {
      console.log('❌ Microsoft OAuth callback NOT FOUND (404)');
      console.log('   Issue: Callback route not implemented');
    } else if (response.status === 403) {
      console.log('❌ Microsoft OAuth callback FORBIDDEN (403)');
      console.log('   Issue: Environment variables not set or domain mismatch');
    } else {
      console.log(`❌ Microsoft OAuth callback error (Status: ${response.status})`);
    }
  } catch (error) {
    console.log('❌ Microsoft OAuth callback test error:', error.message);
  }
}

async function testClerkConfiguration() {
  console.log('\n⚙️ Testing Clerk Configuration...');
  
  try {
    // Test if Clerk is properly configured by checking for Clerk-specific endpoints
    const response = await makeRequest(`${BASE_URL}/sign-in`);
    
    if (response.status === 200) {
      // Check for Clerk configuration indicators
      const hasClerkConfig = response.data.includes('clerk') ||
                            response.data.includes('Clerk') ||
                            response.data.includes('__clerk') ||
                            response.data.includes('clerk.js');
      
      if (hasClerkConfig) {
        console.log('✅ Clerk configuration detected');
        
        // Check for environment variable usage
        const hasEnvVars = response.data.includes('NEXT_PUBLIC_CLERK') ||
                          response.data.includes('ladlihub.in');
        
        if (hasEnvVars) {
          console.log('✅ Environment variables appear to be set');
        } else {
          console.log('❌ Environment variables may not be set');
        }
      } else {
        console.log('❌ Clerk configuration NOT detected');
      }
    }
  } catch (error) {
    console.log('❌ Clerk configuration test error:', error.message);
  }
}

async function testOAuthFlow() {
  console.log('\n🔗 Testing OAuth Flow Components...');
  
  const oauthTests = [
    { url: '/sign-in', name: 'Sign-in Page' },
    { url: '/sign-up', name: 'Sign-up Page' },
    { url: '/api/auth/callback/microsoft', name: 'Microsoft Callback' },
    { url: '/', name: 'Home Page' }
  ];
  
  for (const test of oauthTests) {
    try {
      const response = await makeRequest(`${BASE_URL}${test.url}`);
      console.log(`✅ ${test.name}: ${response.status}`);
    } catch (error) {
      console.log(`❌ ${test.name}: Error - ${error.message}`);
    }
  }
}

async function runComprehensiveDiagnostics() {
  console.log('🚀 Comprehensive Microsoft OAuth Diagnostic for LadliHub.in');
  console.log('===========================================================');
  console.log(`Testing URL: ${BASE_URL}`);
  console.log('');

  await testSiteAccessibility();
  await testSignInPage();
  await testMicrosoftCallback();
  await testClerkConfiguration();
  await testOAuthFlow();

  console.log('\n📋 Diagnostic Summary:');
  console.log('======================');
  console.log('');
  console.log('🔧 LIKELY CAUSES OF "Unable to complete action at this time":');
  console.log('');
  console.log('1. Azure Portal Configuration Issues:');
  console.log('   - Redirect URI mismatch');
  console.log('   - Expired client secret');
  console.log('   - Missing API permissions');
  console.log('   - Wrong account type');
  console.log('');
  console.log('2. Clerk Dashboard Configuration Issues:');
  console.log('   - Wrong Client ID/Secret');
  console.log('   - Incorrect redirect URLs');
  console.log('   - Domain not configured');
  console.log('');
  console.log('3. Environment Variables Issues:');
  console.log('   - Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY');
  console.log('   - Missing CLERK_SECRET_KEY');
  console.log('   - Wrong NEXT_PUBLIC_APP_URL');
  console.log('');
  console.log('4. Network/Infrastructure Issues:');
  console.log('   - Cloudflare blocking requests');
  console.log('   - DNS resolution problems');
  console.log('   - SSL certificate issues');
  console.log('');
  console.log('🎯 RECOMMENDED FIXES:');
  console.log('');
  console.log('1. Create FRESH Azure App Registration:');
  console.log('   - Go to Azure Portal → App registrations → New registration');
  console.log('   - Use exact redirect URI: https://ladlihub.in/api/auth/callback/microsoft');
  console.log('   - Generate new client secret');
  console.log('');
  console.log('2. Update Clerk Dashboard:');
  console.log('   - Use new Azure Client ID and Secret');
  console.log('   - Set correct redirect URLs');
  console.log('   - Configure domain properly');
  console.log('');
  console.log('3. Set ALL Environment Variables in Netlify:');
  console.log('   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY');
  console.log('   - CLERK_SECRET_KEY');
  console.log('   - NEXT_PUBLIC_APP_URL=https://ladlihub.in');
  console.log('');
  console.log('4. Test with Different Browser/Network:');
  console.log('   - Try incognito mode');
  console.log('   - Try different browser');
  console.log('   - Try from mobile device');
  console.log('');
  console.log('📖 For detailed step-by-step instructions:');
  console.log('   See: COMPREHENSIVE_MICROSOFT_OAUTH_FIX.md');
  console.log('');
  console.log('🚨 If all else fails:');
  console.log('   - Contact Microsoft Azure support');
  console.log('   - Use Google OAuth as alternative');
  console.log('   - Consider custom OAuth implementation');
}

// Run the comprehensive diagnostics
runComprehensiveDiagnostics().catch(console.error);
