/**
 * Analytics System Health Check Script
 * Verifies the analytics system is working correctly
 */

const fs = require('fs');
const path = require('path');

async function healthCheck() {
  console.log('🔍 Running Analytics System Health Check...');
  console.log('==========================================');
  
  let issues = 0;
  
  // Check data directory
  const dataDir = path.join(__dirname, 'data');
  const sessionsDir = path.join(dataDir, 'sessions');
  
  if (!fs.existsSync(dataDir)) {
    console.log('❌ Data directory missing');
    issues++;
  } else {
    console.log('✅ Data directory exists');
  }
  
  if (!fs.existsSync(sessionsDir)) {
    console.log('❌ Sessions directory missing');
    issues++;
  } else {
    console.log('✅ Sessions directory exists');
  }
  
  // Check configuration file
  const configFile = path.join(dataDir, 'analytics-config.json');
  if (!fs.existsSync(configFile)) {
    console.log('❌ Configuration file missing');
    issues++;
  } else {
    console.log('✅ Configuration file exists');
  }
  
  // Check environment variables
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const requiredVars = ['ADMIN_USERNAME', 'ADMIN_PASSWORD', 'ADMIN_JWT_SECRET'];
    const missingVars = requiredVars.filter(varName => !envContent.includes(varName));
    
    if (missingVars.length === 0) {
      console.log('✅ Environment variables configured');
    } else {
      console.log(`❌ Missing environment variables: ${missingVars.join(', ')}`);
      issues++;
    }
  } else {
    console.log('❌ .env.local file missing');
    issues++;
  }
  
  // Check file permissions
  try {
    const testFile = path.join(sessionsDir, 'health_check_test.json');
    fs.writeFileSync(testFile, JSON.stringify({ test: Date.now() }));
    fs.unlinkSync(testFile);
    console.log('✅ File permissions working');
  } catch (error) {
    console.log('❌ File permission error:', error.message);
    issues++;
  }
  
  // Check session files
  try {
    const files = fs.readdirSync(sessionsDir);
    const sessionFiles = files.filter(f => f.startsWith('sessions_') && f.endsWith('.json'));
    console.log(`✅ Found ${sessionFiles.length} session files`);
  } catch (error) {
    console.log('❌ Error reading session files:', error.message);
    issues++;
  }
  
  console.log('\n==========================================');
  if (issues === 0) {
    console.log('🎉 Analytics system is healthy!');
  } else {
    console.log(`⚠️  Found ${issues} issue(s) that need attention`);
  }
}

healthCheck();
