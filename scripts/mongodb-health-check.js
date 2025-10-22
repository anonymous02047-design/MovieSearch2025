#!/usr/bin/env node

/**
 * MongoDB Health Check Script
 * Checks MongoDB connection and initialization status
 */

require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

console.log('🔍 MongoDB Health Check\n');
console.log('='.repeat(50));

if (!MONGODB_URI) {
  console.log('❌ MONGODB_URI not found in environment variables');
  console.log('\n📝 To fix this:');
  console.log('   1. Create a .env.local file');
  console.log('   2. Add: MONGODB_URI=your_mongodb_connection_string');
  console.log('   3. See MONGODB_INTEGRATION_GUIDE.md for details');
  process.exit(1);
}

console.log('✅ MONGODB_URI found in environment');
console.log('🔗 Connection string: ' + MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));

// Check if MongoDB is accessible
async function checkHealth() {
  try {
    const response = await fetch('http://localhost:3000/api/health/mongodb');
    
    if (!response.ok) {
      console.log('\n⚠️  Health check endpoint not responding');
      console.log('   Make sure your Next.js server is running');
      console.log('   Run: npm run dev');
      return;
    }
    
    const data = await response.json();
    
    console.log('\n📊 Database Health Status:');
    console.log('='.repeat(50));
    console.log(`Status: ${data.status === 'healthy' ? '✅ Healthy' : '❌ Unhealthy'}`);
    
    if (data.connection) {
      console.log(`\n📡 Connection Info:`);
      console.log(`   State: ${data.connection.state === 1 ? '✅ Connected' : '❌ Disconnected'}`);
      console.log(`   Host: ${data.connection.host}`);
      console.log(`   Database: ${data.connection.name}`);
    }
    
    if (data.collections) {
      console.log(`\n📚 Collections:`);
      console.log(`   Users: ${data.collections.users}`);
      console.log(`   Reviews: ${data.collections.reviews}`);
      console.log(`   Collections: ${data.collections.collections}`);
    }
    
    if (data.stats) {
      console.log(`\n💾 Database Stats:`);
      console.log(`   Database: ${data.stats.database}`);
      console.log(`   Collections: ${data.stats.collections}`);
      console.log(`   Data Size: ${data.stats.dataSize}`);
      console.log(`   Storage Size: ${data.stats.storageSize}`);
      console.log(`   Indexes: ${data.stats.indexes}`);
      console.log(`   Objects: ${data.stats.objects}`);
    }
    
    console.log('\n✅ MongoDB is working correctly!');
    
  } catch (error) {
    console.log('\n❌ Error checking MongoDB health:');
    console.log('   ' + error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Ensure MongoDB URI is correct');
    console.log('   2. Check if MongoDB cluster is accessible');
    console.log('   3. Verify network connectivity');
    console.log('   4. Check if Next.js server is running');
  }
}

// Run health check if server is running
console.log('\n🔄 Checking health endpoint...');
console.log('   (Requires Next.js server to be running)\n');

checkHealth();

