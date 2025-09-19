/**
 * Analytics System Setup Script
 * Configures the analytics system and ensures proper file permissions
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function setupAnalytics() {
  console.log('🔧 Setting up Analytics System...');
  console.log('=====================================\n');

  try {
    // Create data directory structure
    console.log('📁 Creating data directory structure...');
    const dataDir = path.resolve(process.cwd(), 'data');
    const sessionsDir = path.join(dataDir, 'sessions');
    
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log('✅ Created data directory');
    } else {
      console.log('✅ Data directory already exists');
    }
    
    if (!fs.existsSync(sessionsDir)) {
      fs.mkdirSync(sessionsDir, { recursive: true });
      console.log('✅ Created sessions directory');
    } else {
      console.log('✅ Sessions directory already exists');
    }

    // Create sample session file for testing
    const sampleSessionFile = path.join(sessionsDir, 'sessions_sample.json');
    if (!fs.existsSync(sampleSessionFile)) {
      const sampleSession = {
        sessionId: 'sess_sample_1234567890_abcdefghi',
        userId: null,
        timestamp: Date.now(),
        ipAddress: '127.0.0.1',
        country: 'US',
        region: 'CA',
        city: 'San Francisco',
        deviceType: 'desktop',
        browser: 'Chrome',
        browserVersion: '120.0.0.0',
        operatingSystem: 'Windows',
        screenWidth: 1920,
        screenHeight: 1080,
        language: 'en-US',
        referrer: '',
        landingPage: '/',
        currentPage: '/',
        pagesVisited: ['/'],
        sessionDuration: 0,
        loginStatus: false,
        events: [],
        customField1: '0',
        customField2: 'low',
        customField3: 'good'
      };
      
      fs.writeFileSync(sampleSessionFile, JSON.stringify([sampleSession], null, 2));
      console.log('✅ Created sample session file');
    }

    // Check environment variables
    console.log('\n🔐 Checking environment variables...');
    const envPath = path.resolve(process.cwd(), '.env.local');
    
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const requiredVars = ['ADMIN_USERNAME', 'ADMIN_PASSWORD', 'ADMIN_JWT_SECRET'];
      const missingVars = requiredVars.filter(varName => !envContent.includes(varName));
      
      if (missingVars.length === 0) {
        console.log('✅ All required environment variables are present');
      } else {
        console.log('⚠️  Missing environment variables:', missingVars.join(', '));
        console.log('   Please run setup-admin.js to configure admin credentials');
      }
    } else {
      console.log('⚠️  .env.local file not found');
      console.log('   Please create it with the required environment variables');
    }

    // Test file permissions
    console.log('\n🔒 Testing file permissions...');
    const testFile = path.join(sessionsDir, 'test_permissions.json');
    
    try {
      fs.writeFileSync(testFile, JSON.stringify({ test: true }));
      fs.unlinkSync(testFile);
      console.log('✅ Write permissions are working correctly');
    } catch (error) {
      console.log('❌ Write permission error:', error.message);
      console.log('   Please ensure the application has write access to the data directory');
    }

    // Create analytics configuration file
    console.log('\n⚙️  Creating analytics configuration...');
    const configFile = path.join(dataDir, 'analytics-config.json');
    
    if (!fs.existsSync(configFile)) {
      const config = {
        maxSessionsPerFile: 1000,
        sessionRetentionDays: 30,
        cleanupInterval: 24 * 60 * 60 * 1000, // 24 hours
        enableClientTracking: true,
        enableServerTracking: true,
        enableGeolocation: true,
        enableDeviceDetection: true,
        enablePerformanceTracking: true,
        enableCustomEvents: true,
        dataRetentionPolicy: {
          sessions: 30, // days
          events: 30,   // days
          exports: 7    // days
        },
        privacySettings: {
          anonymizeIPs: false,
          trackUserAgents: true,
          trackReferrers: true,
          trackCookies: true
        }
      };
      
      fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
      console.log('✅ Created analytics configuration file');
    } else {
      console.log('✅ Analytics configuration file already exists');
    }

    // Create cleanup script
    console.log('\n🧹 Creating cleanup script...');
    const cleanupScript = path.join(process.cwd(), 'cleanup-analytics.js');
    
    if (!fs.existsSync(cleanupScript)) {
      const cleanupCode = `/**
 * Analytics Data Cleanup Script
 * Removes old session files based on retention policy
 */

const fs = require('fs');
const path = require('path');

async function cleanupAnalytics() {
  const sessionsDir = path.join(__dirname, 'data', 'sessions');
  const configFile = path.join(__dirname, 'data', 'analytics-config.json');
  
  try {
    const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    const retentionDays = config.sessionRetentionDays || 30;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
    
    const files = fs.readdirSync(sessionsDir);
    let deletedCount = 0;
    
    for (const file of files) {
      if (!file.startsWith('sessions_') || !file.endsWith('.json')) continue;
      
      const dateStr = file.replace('sessions_', '').replace('.json', '');
      const fileDate = new Date(dateStr);
      
      if (fileDate < cutoffDate) {
        const filePath = path.join(sessionsDir, file);
        fs.unlinkSync(filePath);
        deletedCount++;
        console.log(\`Deleted old session file: \${file}\`);
      }
    }
    
    console.log(\`Cleanup completed. Deleted \${deletedCount} old session files.\`);
  } catch (error) {
    console.error('Cleanup failed:', error.message);
  }
}

cleanupAnalytics();
`;
      
      fs.writeFileSync(cleanupScript, cleanupCode);
      console.log('✅ Created cleanup script');
    } else {
      console.log('✅ Cleanup script already exists');
    }

    // Create health check script
    console.log('\n🏥 Creating health check script...');
    const healthCheckScript = path.join(process.cwd(), 'health-check-analytics.js');
    
    if (!fs.existsSync(healthCheckScript)) {
      const healthCheckCode = `/**
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
      console.log(\`❌ Missing environment variables: \${missingVars.join(', ')}\`);
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
    console.log(\`✅ Found \${sessionFiles.length} session files\`);
  } catch (error) {
    console.log('❌ Error reading session files:', error.message);
    issues++;
  }
  
  console.log('\\n==========================================');
  if (issues === 0) {
    console.log('🎉 Analytics system is healthy!');
  } else {
    console.log(\`⚠️  Found \${issues} issue(s) that need attention\`);
  }
}

healthCheck();
`;
      
      fs.writeFileSync(healthCheckScript, healthCheckCode);
      console.log('✅ Created health check script');
    } else {
      console.log('✅ Health check script already exists');
    }

    console.log('\n🎉 Analytics System Setup Complete!');
    console.log('=====================================');
    console.log('\nNext steps:');
    console.log('1. Run "node setup-admin.js" to configure admin credentials');
    console.log('2. Start your development server with "npm run dev"');
    console.log('3. Access the admin dashboard at /admin/login');
    console.log('4. Navigate to the Analytics section');
    console.log('5. Run "node health-check-analytics.js" to verify everything is working');
    console.log('\nFor more information, see ANALYTICS_SYSTEM_README.md');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

setupAnalytics();
