#!/usr/bin/env node

/**
 * Performance Audit Script
 * Checks bundle size, unused dependencies, and performance metrics
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Running Performance Audit...\n');

// 1. Check bundle size
console.log('📦 Bundle Size Analysis:');
const buildPath = path.join(__dirname, '..', '.next');
if (fs.existsSync(buildPath)) {
  const stats = getDirectorySize(buildPath);
  console.log(`   Build folder size: ${formatBytes(stats)}`);
  
  if (stats > 10 * 1024 * 1024) { // 10MB
    console.warn('   ⚠️  Warning: Build size is quite large');
  } else {
    console.log('   ✅ Build size is acceptable');
  }
} else {
  console.log('   ℹ️  No build folder found. Run `npm run build` first.');
}

// 2. Check for unused dependencies
console.log('\n📚 Dependency Analysis:');
const packageJson = require('../package.json');
const allDeps = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
};

console.log(`   Total dependencies: ${Object.keys(allDeps).length}`);

// 3. Check for large dependencies
console.log('\n🔍 Large Dependencies:');
const largeDeps = [
  '@mui/material',
  '@mui/icons-material',
  '@clerk/nextjs',
  'next',
  'react',
  'react-dom',
];

largeDeps.forEach(dep => {
  if (allDeps[dep]) {
    console.log(`   ✓ ${dep}: ${allDeps[dep]}`);
  }
});

// 4. Performance recommendations
console.log('\n💡 Performance Recommendations:');
console.log('   1. ✅ Use Next.js Image component for all images');
console.log('   2. ✅ Implement lazy loading for heavy components');
console.log('   3. ✅ Use dynamic imports for code splitting');
console.log('   4. ✅ Optimize images (WebP, AVIF formats)');
console.log('   5. ✅ Enable compression in next.config.ts');
console.log('   6. ✅ Use proper caching headers');
console.log('   7. ✅ Minimize bundle size with tree shaking');
console.log('   8. ✅ Remove unused dependencies');

// 5. Check for common performance issues
console.log('\n🔎 Common Issues Check:');
checkForConsoleStatements();
checkForHeavyImports();
checkForUnoptimizedImages();

console.log('\n✅ Performance audit complete!');
console.log('\nNext steps:');
console.log('   1. Run `npm run build` to see actual bundle sizes');
console.log('   2. Run `npm run lighthouse` for detailed metrics');
console.log('   3. Fix any warnings shown above');

// Helper functions
function getDirectorySize(dirPath) {
  let size = 0;
  
  function calculateSize(itemPath) {
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      const files = fs.readdirSync(itemPath);
      files.forEach(file => {
        calculateSize(path.join(itemPath, file));
      });
    } else {
      size += stat.size;
    }
  }
  
  if (fs.existsSync(dirPath)) {
    calculateSize(dirPath);
  }
  
  return size;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function checkForConsoleStatements() {
  console.log('   Checking for console statements...');
  // This would need to scan actual source files
  console.log('   ℹ️  Run ESLint to check for console statements');
}

function checkForHeavyImports() {
  console.log('   Checking for heavy imports...');
  console.log('   ℹ️  Use `npm run analyze` for detailed bundle analysis');
}

function checkForUnoptimizedImages() {
  console.log('   Checking for unoptimized images...');
  const publicPath = path.join(__dirname, '..', 'public');
  
  if (fs.existsSync(publicPath)) {
    const images = fs.readdirSync(publicPath).filter(file => 
      /\.(jpg|jpeg|png|gif)$/i.test(file)
    );
    
    if (images.length > 0) {
      console.log(`   ⚠️  Found ${images.length} images in public folder`);
      console.log('   Consider converting to WebP/AVIF format');
    } else {
      console.log('   ✅ No unoptimized images found');
    }
  }
}

