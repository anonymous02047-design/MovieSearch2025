// Quick script to verify environment variables
require('dotenv').config({ path: '.env.local' });

console.log('\n🔍 Verifying Environment Variables...\n');

const checks = [
  {
    name: 'Clerk Publishable Key',
    env: 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    expected: 'pk_test_',
    required: true
  },
  {
    name: 'Clerk Secret Key',
    env: 'CLERK_SECRET_KEY',
    expected: 'sk_test_',
    required: true
  },
  {
    name: 'TMDB API Key',
    env: 'NEXT_PUBLIC_TMDB_API_KEY',
    minLength: 30,
    required: true
  },
  {
    name: 'MongoDB URI',
    env: 'MONGODB_URI',
    expected: 'mongodb',
    required: true
  },
  {
    name: 'Tawk.to Property ID',
    env: 'NEXT_PUBLIC_TAWK_PROPERTY_ID',
    required: false
  },
  {
    name: 'Google Analytics ID',
    env: 'NEXT_PUBLIC_GA_MEASUREMENT_ID',
    expected: 'G-',
    required: false
  }
];

let allGood = true;

checks.forEach(check => {
  const value = process.env[check.env];
  const exists = !!value;
  const isValid = value && value.length > 10 && 
    (!check.expected || value.startsWith(check.expected)) &&
    (!check.minLength || value.length >= check.minLength);

  const status = !check.required && !exists ? '⚪' : 
                 isValid ? '✅' : 
                 exists ? '⚠️' : '❌';
  
  console.log(`${status} ${check.name}: ${exists ? (isValid ? 'Valid' : 'Invalid format') : 'Not set'}`);
  
  if (check.required && !isValid) {
    allGood = false;
    if (!exists) {
      console.log(`   → Missing: Add ${check.env} to .env.local`);
    } else if (check.expected && !value.startsWith(check.expected)) {
      console.log(`   → Should start with: ${check.expected}`);
    } else {
      console.log(`   → Check the format/length`);
    }
  }
});

console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('✅ All required variables are set correctly!');
  console.log('🚀 Your app should work perfectly!');
} else {
  console.log('⚠️  Some required variables need attention');
  console.log('📖 Check the guide above to fix them');
}
console.log('='.repeat(50) + '\n');

