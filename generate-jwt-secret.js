#!/usr/bin/env node

/**
 * JWT Secret Generator for LadliHub.in Admin System
 * 
 * This script generates a secure JWT secret for admin authentication.
 * Run with: node generate-jwt-secret.js
 */

const crypto = require('crypto');

function generateJWTSecret() {
  // Generate a 32-byte (256-bit) random key
  const secret = crypto.randomBytes(32).toString('hex');
  
  console.log('🔐 JWT Secret Generator for LadliHub.in');
  console.log('=====================================');
  console.log('');
  console.log('✅ Generated secure JWT secret:');
  console.log('');
  console.log(`ADMIN_JWT_SECRET=${secret}`);
  console.log('');
  console.log('📋 Copy this to your Netlify environment variables:');
  console.log('');
  console.log('1. Go to Netlify Dashboard');
  console.log('2. Site settings → Environment variables');
  console.log('3. Add new variable:');
  console.log(`   Key: ADMIN_JWT_SECRET`);
  console.log(`   Value: ${secret}`);
  console.log('');
  console.log('🔒 Security Notes:');
  console.log('- This secret is 64 characters long (256-bit)');
  console.log('- Keep this secret secure and private');
  console.log('- Don\'t share this secret with anyone');
  console.log('- Use this exact value in your environment variables');
  console.log('');
  console.log('🚀 After adding to Netlify, redeploy your site!');
  console.log('');
  
  return secret;
}

// Generate and display the secret
const secret = generateJWTSecret();

// Also save to a file for reference (optional)
const fs = require('fs');
const secretFile = '.jwt-secret.txt';

try {
  fs.writeFileSync(secretFile, `ADMIN_JWT_SECRET=${secret}\n`);
  console.log(`💾 Secret also saved to: ${secretFile}`);
  console.log('⚠️  Remember to delete this file after copying to Netlify!');
} catch (error) {
  console.log('⚠️  Could not save to file, but secret is displayed above');
}

console.log('');
console.log('🎯 Next Steps:');
console.log('1. Copy the ADMIN_JWT_SECRET value above');
console.log('2. Add it to Netlify environment variables');
console.log('3. Redeploy your site');
console.log('4. Test admin login at https://ladlihub.in/admin/login/');
console.log('');
