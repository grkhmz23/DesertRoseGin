/**
 * convert-images.cjs
 * Converts all oversized images (SVG with embedded raster, PNG, JPG) to WebP.
 * Run with Node 20: node script/convert-images.cjs
 */

const sharp = require('../node_modules/sharp');
const fs = require('fs');
const path = require('path');

const ONE_MB = 1024 * 1024;

// Files to convert: { src, dest, maxDimension, quality }
const TARGETS = [
  // ── public/ SVGs (path strings in code) ───────────────────────────────────
  {
    src:  'client/public/the-set-cover.svg',
    dest: 'client/public/the-set-cover.webp',
    maxDimension: 900,
    quality: 88,
  },
  {
    src:  'client/public/classic-limited-box-booklet.svg',
    dest: 'client/public/classic-limited-box-booklet.webp',
    maxDimension: 1000,
    quality: 88,
  },
  {
    src:  'client/public/500ml-limited-200ml-classic-booklet.svg',
    dest: 'client/public/500ml-limited-200ml-classic-booklet.webp',
    maxDimension: 1000,
    quality: 88,
  },
  {
    src:  'client/public/2x-500ml-classic-booklet.svg',
    dest: 'client/public/2x-500ml-classic-booklet.webp',
    maxDimension: 1000,
    quality: 88,
  },

  // ── src/assets/products/ SVGs (Vite imports) ──────────────────────────────
  {
    src:  'client/src/assets/products/box-6x500.svg',
    dest: 'client/src/assets/products/box-6x500.webp',
    maxDimension: 1200,
    quality: 88,
  },
  {
    src:  'client/src/assets/products/2x-limited-500ml-single.svg',
    dest: 'client/src/assets/products/2x-limited-500ml-single.webp',
    maxDimension: 1200,
    quality: 88,
  },
  {
    src:  'client/src/assets/products/gift-box-2x500-classic.svg',
    dest: 'client/src/assets/products/gift-box-2x500-classic.webp',
    maxDimension: 1200,
    quality: 88,
  },
  {
    src:  'client/src/assets/products/gift-box-2x500-limited.svg',
    dest: 'client/src/assets/products/gift-box-2x500-limited.webp',
    maxDimension: 1200,
    quality: 88,
  },
  {
    src:  'client/src/assets/products/booklet.svg',
    dest: 'client/src/assets/products/booklet.webp',
    maxDimension: 1200,
    quality: 88,
  },

  // ── src/assets/products/ PNGs ──────────────────────────────────────────────
  {
    src:  'client/src/assets/products/cocktails-booklet.png',
    dest: 'client/src/assets/products/cocktails-booklet.webp',
    maxDimension: 1200,
    quality: 88,
  },

  // ── public/assets/ PNGs ───────────────────────────────────────────────────
  {
    src:  'client/public/assets/Experience/cover-experience.png',
    dest: 'client/public/assets/Experience/cover-experience.webp',
    maxDimension: 1400,
    quality: 85,
  },
  {
    src:  'client/public/assets/logos/gin-guild-member-logo.png',
    dest: 'client/public/assets/logos/gin-guild-member-logo.webp',
    maxDimension: 400,
    quality: 90,
  },

  // ── backgrounds (re-compress oversized WebP) ──────────────────────────────
  {
    src:  'client/public/backgrounds/limited-bg.webp',
    dest: 'client/public/backgrounds/limited-bg.webp',
    maxDimension: 1920,
    quality: 78,
    recompress: true,
  },

  // ── apparel line photography (source: polo-tshirt-images-and-description/) ─
  {
    src:  'polo-tshirt-images-and-description/POLO UOMO.mod.jpg.png',
    dest: 'client/src/assets/products/apparel/polo-mens-flat.webp',
    maxDimension: 1600,
    quality: 90,
  },
  {
    src:  'polo-tshirt-images-and-description/POLO DONNA.mod.jpg.png',
    dest: 'client/src/assets/products/apparel/polo-womens-flat.webp',
    maxDimension: 1600,
    quality: 90,
  },
  {
    src:  'polo-tshirt-images-and-description/T-SHIRT UOMO.mod.jpg.png',
    dest: 'client/src/assets/products/apparel/tshirt-mens-flat.webp',
    maxDimension: 1600,
    quality: 90,
  },
  {
    src:  'polo-tshirt-images-and-description/T-SHIRT DONNA.mod.jpg.png',
    dest: 'client/src/assets/products/apparel/tshirt-womens-flat.webp',
    maxDimension: 1600,
    quality: 90,
  },
  {
    src:  'polo-tshirt-images-and-description/DETTAGLIO COLLO POLO UOMO.mod.jpg.png',
    dest: 'client/src/assets/products/apparel/polo-mens-collar-detail.webp',
    maxDimension: 1600,
    quality: 90,
  },
  {
    src:  'polo-tshirt-images-and-description/DETTAGLIO COLLO POLO DONNA.mod.jpg.png',
    dest: 'client/src/assets/products/apparel/polo-womens-collar-detail.webp',
    maxDimension: 1600,
    quality: 90,
  },
  {
    src:  'polo-tshirt-images-and-description/DETTAGLIO COLLO T-SHIRT UOMO.mod.jpg.png',
    dest: 'client/src/assets/products/apparel/tshirt-mens-collar-detail.webp',
    maxDimension: 1600,
    quality: 90,
  },
  {
    src:  'polo-tshirt-images-and-description/DETTAGLIO COLLO T-SHIRT DONNA.mod.jpg.png',
    dest: 'client/src/assets/products/apparel/tshirt-womens-collar-detail.webp',
    maxDimension: 1600,
    quality: 90,
  },
  {
    src:  'polo-tshirt-images-and-description/LOGO T-SHIRT.mod.jpg.png',
    dest: 'client/src/assets/products/apparel/logo-embroidery-macro.webp',
    maxDimension: 1600,
    quality: 90,
  },
  {
    src:  'polo-tshirt-images-and-description/BUNDLE POLO + 100 ML-3.png',
    dest: 'client/src/assets/products/apparel/bundle-polo-classic-limited.webp',
    maxDimension: 1600,
    quality: 90,
  },
  {
    src:  'polo-tshirt-images-and-description/BUNDLE T-SHIRT + 100 ML-2.png',
    dest: 'client/src/assets/products/apparel/bundle-tshirt-classic-limited.webp',
    maxDimension: 1600,
    quality: 90,
  },
];

async function convertOne(target) {
  const srcAbs  = path.resolve(target.src);
  const destAbs = path.resolve(target.dest);

  if (!fs.existsSync(srcAbs)) {
    console.warn(`  SKIP (not found): ${target.src}`);
    return;
  }

  const srcSize = fs.statSync(srcAbs).size;

  try {
    let pipeline = sharp(srcAbs, { density: 150 }); // density for SVG rasterisation

    const meta = await pipeline.metadata();
    const w = meta.width  || 1000;
    const h = meta.height || 1000;

    if (w > target.maxDimension || h > target.maxDimension) {
      pipeline = pipeline.resize(target.maxDimension, target.maxDimension, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    pipeline = pipeline.webp({ quality: target.quality, effort: 5 });

    // Write to temp first if recompressing in place
    const writeDest = target.recompress ? destAbs + '.tmp' : destAbs;
    await pipeline.toFile(writeDest);

    if (target.recompress) {
      fs.renameSync(writeDest, destAbs);
    }

    const destSize = fs.statSync(destAbs).size;
    const saved = ((1 - destSize / srcSize) * 100).toFixed(1);
    console.log(
      `  ✓ ${path.basename(target.src).padEnd(50)} ` +
      `${(srcSize / ONE_MB).toFixed(1)} MB → ${(destSize / 1024).toFixed(0)} KB  (${saved}% saved)`
    );
  } catch (err) {
    console.error(`  ✗ ${target.src}: ${err.message}`);
  }
}

(async () => {
  console.log('\n=== Desert Rose Gin — Image Conversion ===\n');
  for (const t of TARGETS) {
    await convertOne(t);
  }
  console.log('\nDone. Update code references from .svg/.png → .webp where listed above.\n');
})();
