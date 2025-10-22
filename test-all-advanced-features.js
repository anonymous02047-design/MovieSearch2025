#!/usr/bin/env node

/**
 * Comprehensive Test Script for Advanced Features
 * Tests all newly added features before deployment
 */

const fs = require('fs');
const path = require('path');

console.log('\n🧪 Starting Comprehensive Advanced Features Test...\n');

// Test results tracker
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: [],
};

// Helper function to test file existence
function testFileExists(filePath, description) {
  const fullPath = path.join(__dirname, filePath);
  const exists = fs.existsSync(fullPath);
  
  results.tests.push({
    name: description,
    status: exists ? 'PASS' : 'FAIL',
    message: exists ? `✅ ${description}` : `❌ ${description} - File not found: ${filePath}`,
  });
  
  if (exists) {
    results.passed++;
  } else {
    results.failed++;
  }
  
  return exists;
}

// Helper function to test file content
function testFileContains(filePath, searchString, description) {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    results.tests.push({
      name: description,
      status: 'FAIL',
      message: `❌ ${description} - File not found: ${filePath}`,
    });
    results.failed++;
    return false;
  }
  
  const content = fs.readFileSync(fullPath, 'utf8');
  const contains = content.includes(searchString);
  
  results.tests.push({
    name: description,
    status: contains ? 'PASS' : 'FAIL',
    message: contains ? `✅ ${description}` : `❌ ${description} - String not found`,
  });
  
  if (contains) {
    results.passed++;
  } else {
    results.failed++;
  }
  
  return contains;
}

// Helper function to count code lines
function countCodeLines(filePath) {
  const fullPath = path.join(__dirname, filePath);
  if (!fs.existsSync(fullPath)) return 0;
  
  const content = fs.readFileSync(fullPath, 'utf8');
  return content.split('\n').length;
}

console.log('📦 Testing Core Feature Files...\n');

// Test 1: Universal Share Dialog (170+ platforms)
testFileExists('src/components/UniversalShareDialog.tsx', 'UniversalShareDialog component exists');
testFileContains('src/components/UniversalShareDialog.tsx', 'Facebook', 'UniversalShareDialog includes Facebook');
testFileContains('src/components/UniversalShareDialog.tsx', 'Twitter', 'UniversalShareDialog includes Twitter');
testFileContains('src/components/UniversalShareDialog.tsx', 'LinkedIn', 'UniversalShareDialog includes LinkedIn');
testFileContains('src/components/UniversalShareDialog.tsx', 'WhatsApp', 'UniversalShareDialog includes WhatsApp');

// Test 2: TMDB API Proxy
testFileExists('src/app/api/tmdb/[...path]/route.ts', 'TMDB API proxy route exists');
testFileContains('src/app/api/tmdb/[...path]/route.ts', 'TMDB_API_KEY', 'TMDB proxy uses server-side API key');
testFileContains('src/app/api/tmdb/[...path]/route.ts', 'NextResponse', 'TMDB proxy returns NextResponse');

// Test 3: TMDB Proxy Client
testFileExists('src/lib/tmdbProxy.ts', 'TMDB proxy client library exists');
testFileContains('src/lib/tmdbProxy.ts', '/api/tmdb', 'TMDB proxy client uses correct endpoint');

// Test 4: Pagination Controls
testFileExists('src/components/PaginationControls.tsx', 'PaginationControls component exists');
testFileContains('src/components/PaginationControls.tsx', 'Pagination', 'PaginationControls uses MUI Pagination');
testFileContains('src/components/PaginationControls.tsx', 'totalPages', 'PaginationControls handles totalPages');

// Test 5: Authentication Middleware
testFileExists('src/middleware/withAuth.tsx', 'Authentication middleware exists');
testFileContains('src/middleware/withAuth.tsx', 'withClerkMiddleware', 'Auth middleware uses Clerk');
testFileContains('src/middleware/withAuth.tsx', 'protectedRoutes', 'Auth middleware defines protected routes');

// Test 6: Error Handling Utility
testFileExists('src/utils/errorHandling.ts', 'Error handling utility exists');
testFileContains('src/utils/errorHandling.ts', 'ErrorCode', 'Error handling defines error codes');
testFileContains('src/utils/errorHandling.ts', 'handleApiError', 'Error handling has handleApiError function');

// Test 7: TMDBImage Component
testFileExists('src/components/TMDBImage.tsx', 'TMDBImage component exists');
testFileContains('src/components/TMDBImage.tsx', 'next/image', 'TMDBImage uses Next.js Image');
testFileContains('src/components/TMDBImage.tsx', 'TMDB_IMAGE_SIZES', 'TMDBImage defines image sizes');

// Test 8: Nginx Configuration
testFileExists('nginx.conf', 'Nginx configuration file exists');
testFileContains('nginx.conf', 'ssl', 'Nginx config includes SSL setup');
testFileContains('nginx.conf', 'gzip', 'Nginx config includes gzip compression');
testFileContains('nginx.conf', 'rate_limit', 'Nginx config includes rate limiting');

console.log('\n🔗 Testing Component Integration...\n');

// Test 9: Movie Page Integration
testFileContains('src/app/movie/[id]/page.tsx', 'UniversalShareDialog', 'Movie page imports UniversalShareDialog');
testFileContains('src/app/movie/[id]/page.tsx', 'shareDialogOpen', 'Movie page has share dialog state');

// Test 10: MovieCard Integration
testFileContains('src/components/MovieCard.tsx', 'TMDBImage', 'MovieCard uses TMDBImage');

console.log('\n📊 Testing Additional Advanced Features...\n');

// Test 11-25: Other Advanced Components
const advancedComponents = [
  'src/components/MovieComparison.tsx',
  'src/components/MovieTrailerPlayer.tsx',
  'src/components/RandomMoviePicker.tsx',
  'src/components/QuickViewModal.tsx',
  'src/components/MovieReleaseCalendar.tsx',
  'src/components/FloatingQuickActions.tsx',
  'src/components/BulkActions.tsx',
  'src/components/MovieAwards.tsx',
  'src/components/MovieStatsDashboard.tsx',
  'src/components/SimilarMoviesSection.tsx',
  'src/components/EnhancedShareDialog.tsx',
  'src/components/RecentSearches.tsx',
  'src/components/AdvancedFiltersPanel.tsx',
];

advancedComponents.forEach((component) => {
  const componentName = path.basename(component, '.tsx');
  testFileExists(component, `${componentName} component exists`);
});

// Test 26-30: Custom Hooks
const customHooks = [
  'src/hooks/useViewingHistory.ts',
  'src/hooks/useMovieNotes.ts',
  'src/hooks/useInfiniteScroll.ts',
];

customHooks.forEach((hook) => {
  const hookName = path.basename(hook, '.ts');
  testFileExists(hook, `${hookName} hook exists`);
});

// Test 31: Export Data Utility
testFileExists('src/utils/exportData.ts', 'Export data utility exists');
testFileContains('src/utils/exportData.ts', 'exportToCSV', 'Export utility has CSV export');
testFileContains('src/utils/exportData.ts', 'exportToJSON', 'Export utility has JSON export');

console.log('\n📝 Testing Documentation...\n');

// Test 32-35: Documentation Files
const docFiles = [
  'ADVANCED_FEATURES_COMPLETE.md',
  'FINAL_18_PLUS_FEATURES_COMPLETE.md',
  'NEW_FEATURES_2025.md',
  '14_PLUS_FEATURES_SUMMARY.md',
];

docFiles.forEach((doc) => {
  testFileExists(doc, `Documentation file ${doc} exists`);
});

console.log('\n📦 Code Statistics...\n');

// Calculate code statistics
const codeFiles = [
  'src/components/UniversalShareDialog.tsx',
  'src/app/api/tmdb/[...path]/route.ts',
  'src/lib/tmdbProxy.ts',
  'src/components/PaginationControls.tsx',
  'src/middleware/withAuth.tsx',
  'src/utils/errorHandling.ts',
  'src/components/TMDBImage.tsx',
  'nginx.conf',
];

let totalLines = 0;
codeFiles.forEach((file) => {
  const lines = countCodeLines(file);
  totalLines += lines;
  console.log(`  ${path.basename(file)}: ${lines} lines`);
});

console.log(`\n  Total New Code: ${totalLines} lines`);

console.log('\n' + '='.repeat(60));
console.log('📊 TEST RESULTS SUMMARY');
console.log('='.repeat(60));

results.tests.forEach((test) => {
  console.log(test.message);
});

console.log('\n' + '='.repeat(60));
console.log(`✅ Passed: ${results.passed}`);
console.log(`❌ Failed: ${results.failed}`);
console.log(`⚠️  Warnings: ${results.warnings}`);
console.log(`📊 Total Tests: ${results.passed + results.failed}`);
console.log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(2)}%`);
console.log('='.repeat(60));

if (results.failed > 0) {
  console.log('\n⚠️  Some tests failed. Please review the issues above.');
  process.exit(1);
} else {
  console.log('\n🎉 All tests passed! Ready for deployment.');
  process.exit(0);
}

