import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const root = process.cwd();
const canvas = { width: 1200, height: 1600 };
const bottomPadding = 80;

const specs = [
  {
    input: "client/src/assets/bottles/2025-05-27_Desert_Rose_-_Mockup_Bottiglia_500ml_1765299128312.webp",
    output: "client/src/assets/products/classic-500-normalized.webp",
    fit: { width: 820, height: 1380 },
  },
  {
    input: "client/src/assets/bottles/bottle-limited.webp",
    output: "client/src/assets/products/limited-500-normalized.webp",
    fit: { width: 820, height: 1380 },
  },
  {
    input: "client/public/assets/bottles/bottle-200.webp",
    output: "client/src/assets/products/classic-200-normalized.webp",
    fit: { width: 760, height: 1260 },
  },
  {
    input: "client/public/assets/box/gift-box-500ml.webp",
    output: "client/src/assets/products/classic-gift-normalized.webp",
    fit: { width: 1080, height: 1380 },
  },
  {
    input: "client/public/assets/box/gift-box-500ml-limited-edition.webp",
    output: "client/src/assets/products/limited-gift-normalized.webp",
    fit: { width: 1080, height: 1380 },
  },
  {
    input: "client/public/assets/box/box_6_bottiglie_550x825.webp",
    output: "client/src/assets/products/box-6x500-normalized.webp",
    fit: { width: 1100, height: 860 },
  },
];

async function normalizeProductImage({ input, output, fit }) {
  const inputPath = path.join(root, input);
  const outputPath = path.join(root, output);
  const outputDir = path.dirname(outputPath);

  await fs.mkdir(outputDir, { recursive: true });

  const resized = await sharp(inputPath)
    .resize({
      width: fit.width,
      height: fit.height,
      fit: "inside",
      withoutEnlargement: false,
    })
    .toBuffer({ resolveWithObject: true });

  const left = Math.round((canvas.width - resized.info.width) / 2);
  const top = canvas.height - bottomPadding - resized.info.height;

  await sharp({
    create: {
      width: canvas.width,
      height: canvas.height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: resized.data,
        left,
        top: Math.max(0, top),
      },
    ])
    .webp({ quality: 92 })
    .toFile(outputPath);

  return {
    input,
    output,
    outputSize: `${canvas.width}x${canvas.height}`,
    placedSize: `${resized.info.width}x${resized.info.height}`,
  };
}

async function main() {
  const results = [];

  for (const spec of specs) {
    results.push(await normalizeProductImage(spec));
  }

  for (const result of results) {
    console.log(
      `${result.input} -> ${result.output} | canvas ${result.outputSize} | content ${result.placedSize}`,
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
