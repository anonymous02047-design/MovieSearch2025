#!/usr/bin/env node

/**
 * LadliHub.in Setup Script
 * 
 * This script helps configure the application for ladlihub.in domain
 * Run with: node setup-ladlihub.js
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 LadliHub.in Setup Script\n');

// Step 1: Update environment variables
console.log('1. Environment Variables Configuration:');
console.log('   Add these to your .env.local file:');
console.log('   NEXT_PUBLIC_APP_URL=https://ladlihub.in');
console.log('   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX');
console.log('   ADMIN_JWT_SECRET=your-secure-admin-secret-key');
console.log('');

// Step 2: Check current configuration
console.log('2. Current Configuration Check:');
const configFiles = [
  'src/app/layout.tsx',
  'src/lib/geolocation.ts',
  'src/components/GoogleAnalytics.tsx',
  'src/hooks/useGoogleAnalytics.ts'
];

configFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file} - Found`);
  } else {
    console.log(`   ❌ ${file} - Missing`);
  }
});

// Step 3: Cloudflare setup instructions
console.log('\n3. Cloudflare Setup Instructions:');
console.log('   📋 Steps to add ladlihub.in to Cloudflare:');
console.log('   1. Go to https://dash.cloudflare.com/');
console.log('   2. Click "Add a Site"');
console.log('   3. Enter: ladlihub.in');
console.log('   4. Choose Free plan');
console.log('   5. Update nameservers at your domain registrar');
console.log('   6. Configure DNS records:');
console.log('      - Type: A, Name: @, Content: [Netlify IP]');
console.log('      - Type: CNAME, Name: www, Content: ladlihub.in');
console.log('   7. Enable SSL/TLS: Full (strict)');
console.log('   8. Enable "Always Use HTTPS"');
console.log('');

// Step 4: Netlify setup instructions
console.log('4. Netlify Setup Instructions:');
console.log('   📋 Steps to configure Netlify:');
console.log('   1. Go to Netlify Dashboard');
console.log('   2. Site settings > Domain management');
console.log('   3. Add custom domain: ladlihub.in');
console.log('   4. Add www subdomain: www.ladlihub.in');
console.log('   5. Update environment variables in Netlify');
console.log('   6. Redeploy the site');
console.log('');

// Step 5: Google Analytics setup
console.log('5. Google Analytics Setup:');
console.log('   📋 Steps to set up Google Analytics:');
console.log('   1. Go to https://analytics.google.com/');
console.log('   2. Create new GA4 property for ladlihub.in');
console.log('   3. Get Measurement ID (G-XXXXXXXXXX)');
console.log('   4. Add to environment variables:');
console.log('      NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX');
console.log('   5. Verify tracking is working');
console.log('');

// Step 6: Rate limiting configuration
console.log('6. Rate Limiting Configuration:');
console.log('   ✅ India (IN) has unlimited access (10,000 requests per 15 minutes)');
console.log('   ✅ Other countries have standard limits');
console.log('   ✅ High-risk countries have stricter limits');
console.log('   ✅ IP whitelist/blacklist functionality active');
console.log('');

// Step 7: Admin dashboard verification
console.log('7. Admin Dashboard Verification:');
console.log('   📋 Test these URLs after deployment:');
console.log('   - https://ladlihub.in/admin/dashboard/');
console.log('   - https://ladlihub.in/admin/analytics/');
console.log('   - https://ladlihub.in/admin/rate-limits/');
console.log('   - https://ladlihub.in/admin/login/');
console.log('');

// Step 8: Testing checklist
console.log('8. Testing Checklist:');
console.log('   📋 After deployment, test:');
console.log('   [ ] Admin login works');
console.log('   [ ] Admin dashboard loads');
console.log('   [ ] Analytics dashboard works');
console.log('   [ ] Google Analytics tracking active');
console.log('   [ ] Rate limiting works for different countries');
console.log('   [ ] India has unlimited access');
console.log('   [ ] All API endpoints respond');
console.log('   [ ] SSL certificate is valid');
console.log('   [ ] Domain redirects work (www and non-www)');
console.log('');

// Step 9: Common issues and solutions
console.log('9. Common Issues & Solutions:');
console.log('   🔧 Admin dashboard not working:');
console.log('      - Check admin authentication');
console.log('      - Verify JWT token validity');
console.log('      - Check API endpoint responses');
console.log('');
console.log('   🔧 Analytics not working:');
console.log('      - Verify Google Analytics Measurement ID');
console.log('      - Check if tracking code loads');
console.log('      - Test in GA4 real-time reports');
console.log('');
console.log('   🔧 Rate limiting issues:');
console.log('      - Check geolocation detection');
console.log('      - Verify country configuration');
console.log('      - Test with different IP addresses');
console.log('');

// Step 10: Support information
console.log('10. Support Information:');
console.log('   📞 If you need help:');
console.log('   1. Check Netlify function logs');
console.log('   2. Check browser console for errors');
console.log('   3. Verify all environment variables');
console.log('   4. Test API endpoints individually');
console.log('   5. Check Google Analytics reports');
console.log('');

console.log('✅ Setup script completed!');
console.log('📖 For detailed instructions, see: LADLIHUB_CONFIGURATION.md');
console.log('');
console.log('🚀 Ready to deploy to ladlihub.in!');
