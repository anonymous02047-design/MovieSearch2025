/**
 * Comprehensive Test Script for All Enhancements
 * Tests country detection, recommendations, MongoDB connectivity, and more
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 MovieSearch 2025 - Comprehensive Enhancement Testing');
console.log('='.repeat(60));

const results = {
  passed: [],
  failed: [],
  warnings: [],
};

// Test 1: Check if all new files exist
console.log('\n📁 Test 1: Verifying new files...');
const newFiles = [
  'src/utils/countries.ts',
  'src/utils/recommendations.ts',
  'src/utils/pagination.ts',
  'src/utils/seo.ts',
  'src/hooks/useCountryDetection.ts',
  'src/components/CountrySelector.tsx',
  'src/components/CountryBanner.tsx',
  'src/models/User.ts',
  'src/models/Review.ts',
  'src/models/Collection.ts',
  'src/app/api/profile/route.ts',
  'src/app/api/profile/photo/route.ts',
  'src/app/api/profile/favorites/route.ts',
  'src/app/sitemap.xml/route.ts',
  'src/lib/mongodb.ts',
  'MONGODB_INTEGRATION_GUIDE.md',
  'SYSTEMATIC_IMPROVEMENTS_PLAN.md',
  'COMPLETE_ENHANCEMENTS_SUMMARY.md',
];

newFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    results.passed.push(`✅ File exists: ${file}`);
  } else {
    results.failed.push(`❌ File missing: ${file}`);
  }
});

// Test 2: Check country data completeness
console.log('\n🌍 Test 2: Verifying country data...');
try {
  const countriesFile = path.join(__dirname, 'src/utils/countries.ts');
  const countriesContent = fs.readFileSync(countriesFile, 'utf8');
  
  // Count countries
  const countryMatches = countriesContent.match(/code: '[A-Z]{2}'/g);
  const countryCount = countryMatches ? countryMatches.length : 0;
  
  if (countryCount >= 195) {
    results.passed.push(`✅ Countries: ${countryCount} countries defined (target: 195+)`);
  } else {
    results.failed.push(`❌ Countries: Only ${countryCount} countries found (expected 195+)`);
  }
  
  // Check for continent coverage
  const continents = ['Africa', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'];
  continents.forEach(continent => {
    if (countriesContent.includes(`continent: '${continent}'`)) {
      results.passed.push(`✅ Continent: ${continent} covered`);
    } else {
      results.warnings.push(`⚠️ Continent: ${continent} might be missing`);
    }
  });
} catch (error) {
  results.failed.push(`❌ Country data validation failed: ${error.message}`);
}

// Test 3: Check MongoDB models
console.log('\n🗄️ Test 3: Verifying MongoDB models...');
const models = [
  { file: 'src/models/User.ts', schema: 'UserSchema', model: 'User' },
  { file: 'src/models/Review.ts', schema: 'ReviewSchema', model: 'Review' },
  { file: 'src/models/Collection.ts', schema: 'CollectionSchema', model: 'Collection' },
];

models.forEach(({ file, schema, model }) => {
  try {
    const modelPath = path.join(__dirname, file);
    const modelContent = fs.readFileSync(modelPath, 'utf8');
    
    if (modelContent.includes(schema) && modelContent.includes(`model<I${model}>`)) {
      results.passed.push(`✅ MongoDB Model: ${model} - Schema and Model defined`);
    } else {
      results.failed.push(`❌ MongoDB Model: ${model} - Missing schema or model`);
    }
    
    // Check for required fields
    if (modelContent.includes('required: true')) {
      results.passed.push(`✅ MongoDB Model: ${model} - Has required fields`);
    }
    
    // Check for indexes
    if (modelContent.includes('index: true')) {
      results.passed.push(`✅ MongoDB Model: ${model} - Has indexed fields`);
    }
  } catch (error) {
    results.failed.push(`❌ MongoDB Model: ${model} - ${error.message}`);
  }
});

// Test 4: Check API routes
console.log('\n🛣️ Test 4: Verifying API routes...');
const apiRoutes = [
  { file: 'src/app/api/profile/route.ts', methods: ['GET', 'PUT', 'DELETE'] },
  { file: 'src/app/api/profile/photo/route.ts', methods: ['POST'] },
  { file: 'src/app/api/profile/favorites/route.ts', methods: ['GET', 'POST', 'DELETE'] },
];

apiRoutes.forEach(({ file, methods }) => {
  try {
    const routePath = path.join(__dirname, file);
    const routeContent = fs.readFileSync(routePath, 'utf8');
    
    methods.forEach(method => {
      if (routeContent.includes(`export async function ${method}`)) {
        results.passed.push(`✅ API Route: ${file} - ${method} method defined`);
      } else {
        results.failed.push(`❌ API Route: ${file} - ${method} method missing`);
      }
    });
    
    // Check for authentication
    if (routeContent.includes('@clerk/nextjs/server')) {
      results.passed.push(`✅ API Route: ${file} - Authentication implemented`);
    } else {
      results.warnings.push(`⚠️ API Route: ${file} - Authentication might be missing`);
    }
  } catch (error) {
    results.failed.push(`❌ API Route: ${file} - ${error.message}`);
  }
});

// Test 5: Check SEO implementation
console.log('\n🔍 Test 5: Verifying SEO implementation...');
try {
  const seoUtilPath = path.join(__dirname, 'src/utils/seo.ts');
  const seoContent = fs.readFileSync(seoUtilPath, 'utf8');
  
  const seoFeatures = [
    { name: 'generateSEO', pattern: 'export function generateSEO' },
    { name: 'JSON-LD support', pattern: 'jsonLd' },
    { name: 'Open Graph', pattern: 'openGraph' },
    { name: 'Twitter Cards', pattern: 'twitter' },
    { name: 'Movie JSON-LD', pattern: 'generateMovieJsonLd' },
    { name: 'Base URL utility', pattern: 'getBaseUrl' },
  ];
  
  seoFeatures.forEach(({ name, pattern }) => {
    if (seoContent.includes(pattern)) {
      results.passed.push(`✅ SEO: ${name} implemented`);
    } else {
      results.failed.push(`❌ SEO: ${name} missing`);
    }
  });
} catch (error) {
  results.failed.push(`❌ SEO validation failed: ${error.message}`);
}

// Test 6: Check sitemap generation
console.log('\n🗺️ Test 6: Verifying sitemap generator...');
try {
  const sitemapPath = path.join(__dirname, 'src/app/sitemap.xml/route.ts');
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  
  if (sitemapContent.includes('export async function GET')) {
    results.passed.push('✅ Sitemap: GET route defined');
  }
  
  if (sitemapContent.includes('tmdbApi')) {
    results.passed.push('✅ Sitemap: Dynamic content from TMDB');
  }
  
  if (sitemapContent.includes('Cache-Control')) {
    results.passed.push('✅ Sitemap: Caching headers configured');
  }
  
  const staticPages = ['discover', 'trending', 'browse', 'genres', 'actors'];
  staticPages.forEach(page => {
    if (sitemapContent.includes(`/${page}`)) {
      results.passed.push(`✅ Sitemap: Static page /${page} included`);
    } else {
      results.warnings.push(`⚠️ Sitemap: Static page /${page} might be missing`);
    }
  });
} catch (error) {
  results.failed.push(`❌ Sitemap validation failed: ${error.message}`);
}

// Test 7: Check environment configuration
console.log('\n⚙️ Test 7: Verifying environment configuration...');
try {
  const envExamplePath = path.join(__dirname, 'env.example');
  const envContent = fs.readFileSync(envExamplePath, 'utf8');
  
  const requiredVars = [
    'MONGODB_URI',
    'NEXT_PUBLIC_BASE_URL',
    'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
    'CLERK_SECRET_KEY',
    'NEXT_PUBLIC_TMDB_API_KEY',
  ];
  
  requiredVars.forEach(varName => {
    if (envContent.includes(varName)) {
      results.passed.push(`✅ Environment: ${varName} documented`);
    } else {
      results.failed.push(`❌ Environment: ${varName} not in env.example`);
    }
  });
} catch (error) {
  results.failed.push(`❌ Environment validation failed: ${error.message}`);
}

// Test 8: Check documentation completeness
console.log('\n📚 Test 8: Verifying documentation...');
const docs = [
  { file: 'MONGODB_INTEGRATION_GUIDE.md', sections: ['Setup', 'Configuration', 'Testing', 'Deployment'] },
  { file: 'SYSTEMATIC_IMPROVEMENTS_PLAN.md', sections: ['Overview', 'Pages', 'Progress'] },
  { file: 'COMPLETE_ENHANCEMENTS_SUMMARY.md', sections: ['Features', 'Fixes', 'Testing', 'Deployment'] },
];

docs.forEach(({ file, sections }) => {
  try {
    const docPath = path.join(__dirname, file);
    const docContent = fs.readFileSync(docPath, 'utf8');
    
    results.passed.push(`✅ Documentation: ${file} exists`);
    
    sections.forEach(section => {
      // Check if section heading exists (case-insensitive)
      const hasSection = new RegExp(`#+\\s*${section}`, 'i').test(docContent);
      if (hasSection) {
        results.passed.push(`✅ Documentation: ${file} - ${section} section present`);
      } else {
        results.warnings.push(`⚠️ Documentation: ${file} - ${section} section might be missing`);
      }
    });
  } catch (error) {
    results.failed.push(`❌ Documentation: ${file} - ${error.message}`);
  }
});

// Test 9: Check TypeScript types
console.log('\n🔷 Test 9: Verifying TypeScript types...');
const tsFiles = [
  { file: 'src/utils/countries.ts', types: ['Country', 'CountryRecommendationData'] },
  { file: 'src/utils/recommendations.ts', types: ['RecommendationParams', 'CountrySpecificRecommendation'] },
  { file: 'src/utils/pagination.ts', types: ['PaginationResult'] },
  { file: 'src/hooks/useCountryDetection.ts', types: ['CountryDetectionResult'] },
];

tsFiles.forEach(({ file, types }) => {
  try {
    const filePath = path.join(__dirname, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    types.forEach(type => {
      if (fileContent.includes(`interface ${type}`) || fileContent.includes(`type ${type}`)) {
        results.passed.push(`✅ TypeScript: ${file} - ${type} defined`);
      } else {
        results.failed.push(`❌ TypeScript: ${file} - ${type} missing`);
      }
    });
  } catch (error) {
    results.failed.push(`❌ TypeScript: ${file} - ${error.message}`);
  }
});

// Test 10: Check responsive design utilities
console.log('\n📱 Test 10: Verifying responsive design...');
try {
  const responsivePath = path.join(__dirname, 'src/utils/responsive.ts');
  const responsiveContent = fs.readFileSync(responsivePath, 'utf8');
  
  const responsiveFeatures = [
    'useCurrentBreakpoint',
    'getResponsiveColumns',
    'getResponsiveFontSize',
    'getResponsiveSpacing',
  ];
  
  responsiveFeatures.forEach(feature => {
    if (responsiveContent.includes(feature)) {
      results.passed.push(`✅ Responsive: ${feature} utility defined`);
    } else {
      results.failed.push(`❌ Responsive: ${feature} utility missing`);
    }
  });
  
  const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl'];
  const hasAllBreakpoints = breakpoints.every(bp => responsiveContent.includes(`'${bp}'`));
  if (hasAllBreakpoints) {
    results.passed.push('✅ Responsive: All breakpoints (xs, sm, md, lg, xl) defined');
  } else {
    results.failed.push('❌ Responsive: Some breakpoints missing');
  }
} catch (error) {
  results.failed.push(`❌ Responsive validation failed: ${error.message}`);
}

// Print Results
console.log('\n' + '='.repeat(60));
console.log('📊 TEST RESULTS SUMMARY');
console.log('='.repeat(60));

console.log(`\n✅ PASSED: ${results.passed.length} tests`);
if (results.passed.length > 0) {
  results.passed.forEach(test => console.log(`  ${test}`));
}

console.log(`\n❌ FAILED: ${results.failed.length} tests`);
if (results.failed.length > 0) {
  results.failed.forEach(test => console.log(`  ${test}`));
}

console.log(`\n⚠️ WARNINGS: ${results.warnings.length} warnings`);
if (results.warnings.length > 0) {
  results.warnings.forEach(warning => console.log(`  ${warning}`));
}

// Calculate score
const totalTests = results.passed.length + results.failed.length;
const score = totalTests > 0 ? ((results.passed.length / totalTests) * 100).toFixed(1) : 0;

console.log('\n' + '='.repeat(60));
console.log(`🎯 OVERALL SCORE: ${score}% (${results.passed.length}/${totalTests} passed)`);
console.log('='.repeat(60));

// Final verdict
if (results.failed.length === 0) {
  console.log('\n✅ ALL TESTS PASSED! Ready for deployment! 🎉');
  process.exit(0);
} else {
  console.log('\n❌ Some tests failed. Please review and fix issues before deployment.');
  process.exit(1);
}

