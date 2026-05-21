const { optimize } = require('svgo');
const fs = require('fs');
const path = require('path');

const illustrationsDir = path.join(__dirname, 'public', 'illustrations');

// SVGO configuration
const config = {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // Keep viewBox for responsive scaling
          removeViewBox: false,
          // Keep IDs for potential CSS targeting
          cleanupIds: false,
        },
      },
    },
    // Remove unnecessary metadata
    'removeMetadata',
    // Remove comments
    'removeComments',
    // Remove hidden elements
    'removeHiddenElems',
    // Remove empty attributes
    'removeEmptyAttrs',
    // Remove empty containers
    'removeEmptyContainers',
    // Minify styles
    'minifyStyles',
    // Convert colors to shorter format
    'convertColors',
  ],
};

// Get all SVG files
const files = fs.readdirSync(illustrationsDir).filter(file => file.endsWith('.svg'));

console.log(`Found ${files.length} SVG files to optimize...\n`);

let totalOriginalSize = 0;
let totalOptimizedSize = 0;

files.forEach(file => {
  const filePath = path.join(illustrationsDir, file);
  const originalContent = fs.readFileSync(filePath, 'utf8');
  const originalSize = Buffer.byteLength(originalContent, 'utf8');
  
  try {
    const result = optimize(originalContent, { ...config, path: filePath });
    const optimizedSize = Buffer.byteLength(result.data, 'utf8');
    
    // Write optimized content back to file
    fs.writeFileSync(filePath, result.data, 'utf8');
    
    const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
    console.log(`✓ ${file}: ${originalSize} → ${optimizedSize} bytes (${savings}% smaller)`);
    
    totalOriginalSize += originalSize;
    totalOptimizedSize += optimizedSize;
  } catch (error) {
    console.error(`✗ ${file}: Optimization failed -`, error.message);
  }
});

const totalSavings = ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1);
console.log(`\n✅ Total: ${totalOriginalSize} → ${totalOptimizedSize} bytes (${totalSavings}% smaller)`);
console.log(`💾 Saved ${totalOriginalSize - totalOptimizedSize} bytes total`);
