const Jimp = require('jimp');
const fs = require('fs');
const path = 'client/src/assets/bottles/';

console.log("Starting resize process...");

fs.readdir(path, (err, files) => {
  if (err) {
    console.error("Could not find folder:", path);
    process.exit(1);
  }

  files.forEach(file => {
    if (file.toLowerCase().endsWith('.png')) {
      const fullPath = path + file;
      console.log(`Processing: ${file}...`);
      
      Jimp.read(fullPath)
        .then(image => {
          // Resize to height 1080px, width auto-scales to keep aspect ratio
          return image
            .resize(Jimp.AUTO, 1080) 
            .quality(80) // Set JPEG quality (ignored for PNG but good practice)
            .write(fullPath); // Overwrite the file
        })
        .then(() => {
          console.log(`✅ Success: ${file}`);
        })
        .catch(err => {
          console.error(`❌ Error on ${file}:`, err);
        });
    }
  });
});
