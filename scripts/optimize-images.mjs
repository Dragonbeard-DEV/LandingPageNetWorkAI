// Resize and convert photos in public/images to WebP (max 1920 px wide, under 300 KB).
// SVG files and PNG logos (brand/, partners/) are left untouched.
// Usage: node scripts/optimize-images.mjs [dir]   (default: public/images)
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(process.argv[2] ?? "public/images");
const MAX_WIDTH = 1920;
const MAX_BYTES = 300 * 1024;
const START_QUALITY = 80;
const MIN_QUALITY = 50;
const LOGO_DIRS = new Set(["brand", "partners"]);
const RASTER = new Set([".jpg", ".jpeg", ".png", ".webp"]);

async function* walk(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

function isLogoPng(file) {
  const top = path.relative(ROOT, file).split(path.sep)[0];
  return LOGO_DIRS.has(top) && path.extname(file).toLowerCase() === ".png";
}

// Work on buffers only: on Windows, sharp's file cache keeps handles open and blocks overwrites.
sharp.cache(false);

async function isAlreadyOptimized(file, input) {
  if (path.extname(file).toLowerCase() !== ".webp") return false;
  const { width = 0 } = await sharp(input).metadata();
  return input.length < MAX_BYTES && width <= MAX_WIDTH;
}

async function encode(input) {
  for (let quality = START_QUALITY; quality >= MIN_QUALITY; quality -= 5) {
    const output = await sharp(input)
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality })
      .toBuffer();
    if (output.length < MAX_BYTES || quality === MIN_QUALITY) return { output, quality };
  }
  throw new Error("Unreachable: no encoding produced");
}

async function optimize(file) {
  const ext = path.extname(file).toLowerCase();
  if (!RASTER.has(ext) || isLogoPng(file)) return "skipped";
  const input = await fs.readFile(file);
  if (await isAlreadyOptimized(file, input)) return "ok";

  const { output, quality } = await encode(input);
  const target = file.slice(0, -ext.length) + ".webp";
  await fs.writeFile(target, output);
  if (target !== file) await fs.unlink(file);
  const kb = Math.round(output.length / 1024);
  const warning = output.length >= MAX_BYTES ? " (still over 300 KB)" : "";
  return `converted q${quality} ${kb} KB${warning}`;
}

let failures = 0;
for await (const file of walk(ROOT)) {
  try {
    const result = await optimize(file);
    if (result !== "skipped" && result !== "ok") {
      console.log(`${path.relative(ROOT, file)}: ${result}`);
    }
  } catch (error) {
    failures += 1;
    console.error(`${path.relative(ROOT, file)}: ${error instanceof Error ? error.message : error}`);
  }
}
process.exitCode = failures > 0 ? 1 : 0;
