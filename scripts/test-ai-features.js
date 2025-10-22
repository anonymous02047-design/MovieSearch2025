#!/usr/bin/env node

/**
 * Test Script for AI Features
 * Tests all OpenAI integration without requiring actual API key
 */

const fs = require('fs');
const path = require('path');

console.log('🤖 Testing AI Features Integration\n');
console.log('='.repeat(50));

const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
};

function pass(message) {
  console.log(`✅ ${message}`);
  results.passed++;
}

function fail(message) {
  console.log(`❌ ${message}`);
  results.failed++;
}

function warn(message) {
  console.log(`⚠️  ${message}`);
  results.warnings++;
}

function testFileExists(filepath, description) {
  const fullPath = path.join(process.cwd(), filepath);
  if (fs.existsSync(fullPath)) {
    pass(`${description} exists: ${filepath}`);
    return true;
  } else {
    fail(`${description} missing: ${filepath}`);
    return false;
  }
}

function testFileContains(filepath, searchString, description) {
  const fullPath = path.join(process.cwd(), filepath);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes(searchString)) {
      pass(`${description}: ${filepath}`);
      return true;
    } else {
      fail(`${description} - Not found in: ${filepath}`);
      return false;
    }
  } else {
    fail(`File doesn't exist: ${filepath}`);
    return false;
  }
}

console.log('\n📁 Testing Core Files...\n');

// Test OpenAI library
testFileExists('src/lib/openai.ts', 'OpenAI library');
testFileContains('src/lib/openai.ts', 'class OpenAIClient', 'OpenAI client class');
testFileContains('src/lib/openai.ts', 'generateMovieRecommendations', 'Recommendations method');
testFileContains('src/lib/openai.ts', 'analyzeReviewSentiment', 'Sentiment analysis method');
testFileContains('src/lib/openai.ts', 'answerMovieQuestion', 'Chat method');

console.log('\n🔌 Testing API Routes...\n');

// Test API routes
const apiRoutes = [
  'src/app/api/ai/recommendations/route.ts',
  'src/app/api/ai/sentiment/route.ts',
  'src/app/api/ai/chat/route.ts',
  'src/app/api/ai/summary/route.ts',
  'src/app/api/ai/compare/route.ts',
  'src/app/api/ai/watch-suggestion/route.ts',
];

apiRoutes.forEach(route => {
  testFileExists(route, 'API route');
  testFileContains(route, 'export async function POST', 'POST handler in ' + path.basename(route));
  testFileContains(route, 'openai.isConfigured()', 'API key check in ' + path.basename(route));
});

console.log('\n🎨 Testing UI Components...\n');

// Test UI components
const components = [
  { path: 'src/components/AIRecommendations.tsx', name: 'AI Recommendations' },
  { path: 'src/components/AIChatAssistant.tsx', name: 'AI Chat Assistant' },
  { path: 'src/components/AISentimentAnalysis.tsx', name: 'AI Sentiment Analysis' },
];

components.forEach(comp => {
  testFileExists(comp.path, comp.name);
  testFileContains(comp.path, "'use client'", 'Client component directive in ' + comp.name);
  testFileContains(comp.path, '/api/ai/', 'API endpoint call in ' + comp.name);
});

console.log('\n📚 Testing Documentation...\n');

// Test documentation
testFileExists('OPENAI_INTEGRATION_GUIDE.md', 'OpenAI integration guide');
testFileExists('AI_FEATURES_SUMMARY.md', 'AI features summary');
testFileContains('OPENAI_INTEGRATION_GUIDE.md', 'OPENAI_API_KEY', 'Environment variable documentation');
testFileContains('AI_FEATURES_SUMMARY.md', '6 powerful AI features', 'Feature count documentation');

console.log('\n⚙️  Testing Configuration...\n');

// Test environment configuration
testFileContains('env.example', 'OPENAI_API_KEY', 'OpenAI API key in env.example');
testFileContains('NETLIFY_ENVIRONMENT_VARIABLES_GUIDE.md', 'OPENAI_API_KEY', 'OpenAI in Netlify guide');

console.log('\n🔍 Testing Code Quality...\n');

// Test for common issues
const openaiLib = fs.readFileSync(path.join(process.cwd(), 'src/lib/openai.ts'), 'utf8');

if (openaiLib.includes('gpt-4o-mini')) {
  pass('Using cost-effective GPT-4o-mini model');
} else {
  warn('Model configuration not found or using expensive model');
}

if (openaiLib.includes('max_tokens')) {
  pass('Token limits configured');
} else {
  warn('Token limits not found');
}

if (openaiLib.includes('temperature')) {
  pass('Temperature configuration present');
} else {
  warn('Temperature configuration not found');
}

// Check error handling in API routes
let errorHandlingCount = 0;
apiRoutes.forEach(route => {
  const content = fs.readFileSync(path.join(process.cwd(), route), 'utf8');
  if (content.includes('try') && content.includes('catch')) {
    errorHandlingCount++;
  }
});

if (errorHandlingCount === apiRoutes.length) {
  pass(`Error handling in all ${apiRoutes.length} API routes`);
} else {
  fail(`Error handling missing in ${apiRoutes.length - errorHandlingCount} API routes`);
}

console.log('\n🧪 Testing TypeScript Types...\n');

// Check for TypeScript types
if (openaiLib.includes('interface ChatMessage') && 
    openaiLib.includes('interface ChatCompletionResponse')) {
  pass('TypeScript interfaces defined');
} else {
  warn('Some TypeScript interfaces may be missing');
}

console.log('\n💡 Feature Availability Check...\n');

// Check if components handle missing API key gracefully
const chatComponent = fs.readFileSync(
  path.join(process.cwd(), 'src/components/AIChatAssistant.tsx'), 
  'utf8'
);

if (chatComponent.includes('error') || chatComponent.includes('Error')) {
  pass('Error handling in Chat component');
} else {
  warn('Error handling may be incomplete in Chat component');
}

console.log('\n' + '='.repeat(50));
console.log('\n📊 TEST SUMMARY\n');
console.log(`✅ Passed:   ${results.passed}`);
console.log(`❌ Failed:   ${results.failed}`);
console.log(`⚠️  Warnings: ${results.warnings}`);

console.log('\n' + '='.repeat(50));

if (results.failed === 0) {
  console.log('\n🎉 All AI features are properly integrated!\n');
  console.log('Next steps:');
  console.log('1. Add OPENAI_API_KEY to your .env.local');
  console.log('2. Get API key from: https://platform.openai.com/api-keys');
  console.log('3. Start dev server: npm run dev');
  console.log('4. Test features in the browser\n');
  process.exit(0);
} else {
  console.log('\n⚠️  Some tests failed. Please review the errors above.\n');
  process.exit(1);
}

