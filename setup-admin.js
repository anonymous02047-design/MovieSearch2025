#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupAdmin() {
  console.log('🔐 Admin System Setup');
  console.log('====================\n');

  try {
    // Check if .env.local exists
    const envPath = path.join(process.cwd(), '.env.local');
    let envContent = '';

    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
      console.log('✅ Found existing .env.local file');
    } else {
      console.log('📝 Creating new .env.local file');
    }

    // Get admin credentials
    console.log('\n📋 Admin Credentials Setup:');
    const username = await question('Enter admin username (default: admin): ') || 'admin';
    const password = await question('Enter admin password (default: admin123): ') || 'admin123';
    
    // Generate JWT secret
    const jwtSecret = require('crypto').randomBytes(64).toString('hex');
    
    // Update or create .env.local
    const adminConfig = `
# Admin Authentication
ADMIN_USERNAME=${username}
ADMIN_PASSWORD=${password}
ADMIN_JWT_SECRET=${jwtSecret}

# Clerk Authentication (add your keys here)
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
# CLERK_SECRET_KEY=your_clerk_secret_key
`;

    // Remove existing admin config if it exists
    const lines = envContent.split('\n');
    const filteredLines = lines.filter(line => 
      !line.startsWith('ADMIN_USERNAME=') && 
      !line.startsWith('ADMIN_PASSWORD=') && 
      !line.startsWith('ADMIN_JWT_SECRET=') &&
      !line.startsWith('# Admin Authentication')
    );
    
    const newEnvContent = filteredLines.join('\n') + adminConfig;
    
    fs.writeFileSync(envPath, newEnvContent.trim());
    
    console.log('\n✅ Admin configuration saved to .env.local');
    console.log('\n🔑 Your Admin Credentials:');
    console.log(`   Username: ${username}`);
    console.log(`   Password: ${password}`);
    console.log('\n🌐 Access URLs:');
    console.log('   Admin Login: http://localhost:3000/admin/login');
    console.log('   Admin Dashboard: http://localhost:3000/admin/dashboard');
    
    console.log('\n⚠️  Security Notes:');
    console.log('   - Keep your .env.local file secure and never commit it to version control');
    console.log('   - Change the default password in production');
    console.log('   - The JWT secret has been automatically generated for security');
    
  } catch (error) {
    console.error('❌ Error setting up admin:', error.message);
  } finally {
    rl.close();
  }
}

// Run setup
setupAdmin();
