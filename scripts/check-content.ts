// Validates /content and messages. Part of `npm run check`; exits non-zero on any error.
//   - every record passes its Zod schema (both locale files) and has an en.mdx
//   - every referenced image exists under public/ and has alt text
//   - cross references (solutions, projects, segments) point to existing records
//   - messages/<locale>.json files have identical keys
import fs from "node:fs";
import path from "node:path";
import {
  contentTypes,
  ContentError,
  listSlugs,
  parseEntryFile,
  readPartnerRecords,
  type ContentType,
} from "@/lib/content";
import { defaultLocale, locales } from "@/site.config";

const ROOT = process.cwd();
const PUBLIC_DIR = path.join(ROOT, "public");
const REQUIRED_PAGES = ["home", "about", "privacy-policy", "cookies"];

const errors: string[] = [];
const warnings: string[] = [];
const usedImages = new Set<string>();
const records: Record<ContentType, Map<string, Record<string, unknown>>> = {
  services: new Map(),
  solutions: new Map(),
  projects: new Map(),
  segments: new Map(),
  news: new Map(),
  jobs: new Map(),
  pages: new Map(),
};

type ImageLike = { src: string; alt: string };

function isImageLike(value: unknown): value is ImageLike {
  return typeof value === "object" && value !== null && "src" in value && "alt" in value;
}

/** Collects every { src, alt } object nested anywhere in a record. */
function collectImages(value: unknown, found: ImageLike[] = []): ImageLike[] {
  if (Array.isArray(value)) value.forEach((item) => collectImages(item, found));
  else if (isImageLike(value)) found.push(value);
  else if (typeof value === "object" && value !== null) Object.values(value).forEach((item) => collectImages(item, found));
  return found;
}

function checkImage(src: string, where: string, alt?: string): void {
  usedImages.add(src);
  if (!fs.existsSync(path.join(PUBLIC_DIR, src))) errors.push(`${where}: image not found: ${src}`);
  if (alt !== undefined && alt.trim() === "") errors.push(`${where}: image ${src} has empty alt text`);
}

function checkRecords(): void {
  for (const type of Object.keys(contentTypes) as ContentType[]) {
    for (const slug of listSlugs(type)) {
      const dir = path.join(ROOT, "content", type, slug);
      if (!fs.existsSync(path.join(dir, `${defaultLocale}.mdx`))) {
        errors.push(`content/${type}/${slug}: missing ${defaultLocale}.mdx (required as fallback)`);
        continue;
      }
      for (const locale of locales) {
        const file = path.join(dir, `${locale}.mdx`);
        if (!fs.existsSync(file)) {
          warnings.push(`content/${type}/${slug}: no ${locale}.mdx, ${defaultLocale} is shown instead`);
          continue;
        }
        try {
          const { data } = parseEntryFile(type, slug, file);
          if (locale === defaultLocale) records[type].set(slug, data);
          for (const image of collectImages(data)) checkImage(image.src, `content/${type}/${slug}/${locale}.mdx`, image.alt);
        } catch (error) {
          errors.push(error instanceof ContentError ? error.message : `${file}: ${String(error)}`);
        }
      }
    }
  }
}

function expectRefs(from: string, type: ContentType, slugs: unknown): void {
  if (!Array.isArray(slugs)) return;
  for (const slug of slugs) {
    if (!records[type].has(String(slug))) errors.push(`${from}: unknown ${type} "${slug}"`);
  }
}

function checkReferences(): void {
  for (const [slug, data] of records.solutions) expectRefs(`solutions/${slug}.relatedProjects`, "projects", data.relatedProjects);
  for (const [slug, data] of records.segments) expectRefs(`segments/${slug}.solutions`, "solutions", data.solutions);
  for (const [slug, data] of records.projects) {
    expectRefs(`projects/${slug}.solutions`, "solutions", data.solutions);
    if (data.segment) expectRefs(`projects/${slug}.segment`, "segments", [data.segment]);
  }
  for (const page of REQUIRED_PAGES) {
    if (!records.pages.has(page)) errors.push(`content/pages/${page}: required page is missing`);
  }
}

function checkPartners(): void {
  try {
    for (const partner of readPartnerRecords()) checkImage(partner.logo, `content/partners.json (${partner.name})`);
  } catch (error) {
    errors.push(error instanceof ContentError ? error.message : `content/partners.json: ${String(error)}`);
  }
}

function flattenKeys(value: unknown, prefix = ""): string[] {
  if (typeof value !== "object" || value === null) return [prefix];
  return Object.entries(value).flatMap(([key, child]) => flattenKeys(child, prefix ? `${prefix}.${key}` : key));
}

function checkMessages(): void {
  const keySets = locales.map((locale) => {
    const file = path.join(ROOT, "messages", `${locale}.json`);
    return { locale, keys: new Set(flattenKeys(JSON.parse(fs.readFileSync(file, "utf8")))) };
  });
  const [reference, ...others] = keySets;
  for (const other of others) {
    for (const key of reference.keys) if (!other.keys.has(key)) errors.push(`messages/${other.locale}.json: missing key "${key}"`);
    for (const key of other.keys) if (!reference.keys.has(key)) errors.push(`messages/${reference.locale}.json: missing key "${key}"`);
  }
}

function listUnusedImages(): string[] {
  const all: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else all.push("/" + path.relative(PUBLIC_DIR, full).split(path.sep).join("/"));
    }
  };
  walk(path.join(PUBLIC_DIR, "images"));
  // Brand files are referenced from site.config.ts and app code rather than /content.
  return all.filter((src) => !usedImages.has(src) && !src.startsWith("/images/brand/"));
}

checkRecords();
checkReferences();
checkPartners();
checkMessages();

const counts = (Object.keys(records) as ContentType[]).map((type) => `${records[type].size} ${type}`).join(", ");
for (const warning of warnings) console.warn(`warn  ${warning}`);
if (process.argv.includes("--unused")) {
  console.log(`Images not referenced by /content:\n  ${listUnusedImages().join("\n  ")}`);
}
if (errors.length > 0) {
  console.error(`\nContent check failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`  ✗ ${error}`);
  process.exit(1);
}
console.log(`Content check passed: ${counts}, ${readPartnerRecords().length} partners, ${usedImages.size} images.`);
