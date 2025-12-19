const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Target directory
const assetsDir = path.join(__dirname, 'client', 'src', 'assets');

// Helper to walk through folders recursively
function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

console.log("🚀 Starting WebP Conversion...");

walkDir(assetsDir, async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  
  // Convert PNG and JPG to WebP
  if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
    const newPath = filePath.replace(ext, '.webp');
    console.log(`Processing: ${path.basename(filePath)}`);

    try {
      await sharp(filePath)
        .webp({ quality: 85, effort: 6 }) // High quality, best compression
        .toFile(newPath);
        
      // Delete the old heavy file
      fs.unlinkSync(filePath);
      console.log(`✅ Converted & Cleaned: ${path.basename(newPath)}`);
    } catch (err) {
      console.error(`❌ Error converting ${path.basename(filePath)}:`, err.message);
    }
  }
});
