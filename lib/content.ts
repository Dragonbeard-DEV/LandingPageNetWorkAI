// The only module that reads /content. Swap the readers below for a headless CMS
// client and keep the exported functions and types: routes and components stay unchanged.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cache } from "react";
import { z } from "zod";
import { techIconNames } from "@/lib/tech-icons";
import { defaultLocale, type Locale } from "@/site.config";

const CONTENT_DIR = path.join(process.cwd(), "content");

// ---------- Schemas ----------

const slugSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be kebab-case");
const dateSchema = z.coerce.date();

export const imageSchema = z.object({
  src: z.string().regex(/^\/(images|placeholders)\/.+\.(webp|png|jpe?g|svg)$/, "image must live in /images or /placeholders"),
  alt: z.string().trim().min(1, "image alt text is required"),
});

export const solutionSchema = z.object({
  slug: slugSchema,
  title: z.string().min(1),
  tagline: z.string().min(1),
  summary: z.string().min(1),
  /** Lists and cards show this icon; the photo appears on the detail page only. */
  icon: z.enum(techIconNames),
  image: imageSchema,
  features: z.array(z.string().min(1)).default([]),
  relatedProjects: z.array(slugSchema).default([]),
  order: z.number().int().default(100),
  /** Optional catalogue of the systems a solution covers, grouped by domain (used by ELV systems). */
  systemGroups: z
    .array(
      z.object({
        title: z.string().min(1),
        text: z.string().min(1),
        items: z
          .array(
            z.object({
              name: z.string().min(1),
              text: z.string().min(1),
              icon: z.enum(techIconNames),
              /** The system connects to the hotel property management software. */
              pms: z.boolean().default(false),
            }),
          )
          .min(1),
      }),
    )
    .optional(),
});

const titledTextSchema = z.object({ title: z.string().min(1), text: z.string().min(1) });

/** The four ways clients engage NetworkAI; each has its own page with scope and process. */
export const serviceSchema = z.object({
  slug: slugSchema,
  title: z.string().min(1),
  /** One line for cards. */
  summary: z.string().min(1),
  /** Lead paragraph on the detail page. */
  description: z.string().min(1),
  icon: z.enum(techIconNames),
  /** Photo under the page header; cards keep the icon. */
  image: imageSchema,
  /** A few more site photos shown after the scope. */
  gallery: z.array(imageSchema).default([]),
  highlights: z.array(z.string().min(1)).min(2).max(5),
  /** Optional consulting directions shown before the scope, e.g. ICT only or the full ELV package. */
  approaches: z.array(titledTextSchema).optional(),
  scope: z.array(titledTextSchema).min(2),
  process: z.array(titledTextSchema).length(4),
  order: z.number().int().default(100),
});

export const projectSchema = z.object({
  slug: slugSchema,
  title: z.string().min(1),
  client: z.string().min(1),
  location: z.string().min(1),
  year: z.number().int().min(1990).max(2100),
  /** Display text when one year is not enough, e.g. "2024 – now". `year` still drives sorting. */
  period: z.string().min(1).optional(),
  summary: z.string().min(1),
  coverImage: imageSchema,
  solutions: z.array(slugSchema).default([]),
  segment: slugSchema.optional(),
  gallery: z.array(imageSchema).default([]),
  featured: z.boolean().default(false),
});

export const segmentSchema = z.object({
  slug: slugSchema,
  title: z.string().min(1),
  summary: z.string().min(1),
  image: imageSchema,
  solutions: z.array(slugSchema).default([]),
});

export const newsSchema = z.object({
  slug: slugSchema,
  title: z.string().min(1),
  date: dateSchema,
  excerpt: z.string().min(1),
  coverImage: imageSchema.optional(),
  tags: z.array(z.string().min(1)).default([]),
});

export const jobSchema = z.object({
  slug: slugSchema,
  title: z.string().min(1),
  location: z.string().min(1),
  type: z.string().min(1),
  description: z.string().min(1),
  postedAt: dateSchema.optional(),
  applyEmail: z.email().optional(),
});

export const partnerSchema = z.object({
  name: z.string().min(1),
  /** Which block of the page it appears in: hotel groups we serve, or technology vendors we work with. */
  group: z.enum(["client", "partner"]),
  logo: z.string().regex(/^\/images\/partners\/.+\.(webp|png|jpe?g|svg)$/),
  url: z.url(),
  description: z.record(z.string(), z.string().min(1)).optional(),
});

/** Free-standing pages (home, about, legal). Optional blocks are used by the pages that render them. */
export const pageSchema = z.object({
  slug: slugSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  hero: z
    .object({
      titleLine1: z.string().min(1),
      titleLine2: z.string().min(1),
      lead: z.string().min(1),
      image: imageSchema,
      /** Further photos the home hero rotates through after `image`. */
      slides: z.array(imageSchema).default([]),
    })
    .optional(),
  capability: z.object({ quote: z.string().min(1), text: z.string().min(1) }).optional(),
  /** Site photos for the About page gallery; the home page shows the first three. */
  fieldwork: z
    .object({
      intro: z.string().min(1),
      /** `title` names the work shown and `phase` the project stage; `alt` describes the picture itself. */
      photos: z.array(imageSchema.extend({ title: z.string().min(1), phase: z.string().min(1) })).min(3),
    })
    .optional(),
  cta: z.object({ title: z.string().min(1), text: z.string().min(1) }).optional(),
  values: z.array(z.object({ title: z.string().min(1), text: z.string().min(1) })).optional(),
  stats: z.array(z.object({ value: z.string().min(1), label: z.string().min(1) })).optional(),
  updatedAt: dateSchema.optional(),
});

export const contentTypes = {
  services: serviceSchema,
  solutions: solutionSchema,
  projects: projectSchema,
  segments: segmentSchema,
  news: newsSchema,
  jobs: jobSchema,
  pages: pageSchema,
} as const;

export type ContentType = keyof typeof contentTypes;
export type ImageRef = z.infer<typeof imageSchema>;
export type Service = z.infer<typeof serviceSchema>;
export type Solution = z.infer<typeof solutionSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Segment = z.infer<typeof segmentSchema>;
export type NewsItem = z.infer<typeof newsSchema>;
export type Job = z.infer<typeof jobSchema>;
export type Page = z.infer<typeof pageSchema>;
export type PartnerRecord = z.infer<typeof partnerSchema>;
export type Partner = Omit<PartnerRecord, "description"> & { description?: string };

/** A parsed record: frontmatter fields plus the MDX body and which locale file was used. */
export type Entry<T> = T & { body: string; locale: Locale; isFallback: boolean };

export type MdxSection = { title: string; body: string };

/** Splits an MDX body at its `## ` headings. Text before the first heading is dropped. */
export function splitMdxSections(body: string): MdxSection[] {
  return body
    .split(/^## +/m)
    .slice(1)
    .map((chunk) => {
      const lineEnd = chunk.indexOf("\n");
      return { title: chunk.slice(0, lineEnd).trim(), body: chunk.slice(lineEnd + 1).trim() };
    });
}

// ---------- Readers ----------

export class ContentError extends Error {}

function recordDir(type: ContentType, slug: string): string {
  return path.join(CONTENT_DIR, type, slug);
}

/** Slugs are the folder names under content/<type>/. */
export function listSlugs(type: ContentType): string[] {
  const dir = path.join(CONTENT_DIR, type);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

/** Parses one locale file; throws a ContentError naming the file when validation fails. */
export function parseEntryFile<T extends ContentType>(type: T, slug: string, file: string) {
  const schema = contentTypes[type];
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  const result = schema.safeParse(data);
  if (!result.success) {
    const issues = result.error.issues.map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`);
    throw new ContentError(`${path.relative(process.cwd(), file)}\n  - ${issues.join("\n  - ")}`);
  }
  if (result.data.slug !== slug) {
    throw new ContentError(`${path.relative(process.cwd(), file)}: slug "${result.data.slug}" must match folder "${slug}"`);
  }
  if (content.trim().length === 0) {
    throw new ContentError(`${path.relative(process.cwd(), file)}: body is empty`);
  }
  return { data: result.data as z.infer<(typeof contentTypes)[T]>, body: content };
}

function readEntry<T extends ContentType>(type: T, slug: string, locale: Locale): Entry<z.infer<(typeof contentTypes)[T]>> | null {
  const dir = recordDir(type, slug);
  const localized = path.join(dir, `${locale}.mdx`);
  const fallback = path.join(dir, `${defaultLocale}.mdx`);
  const file = fs.existsSync(localized) ? localized : fs.existsSync(fallback) ? fallback : null;
  if (!file) return null;
  const { data, body } = parseEntryFile(type, slug, file);
  return { ...data, body, locale, isFallback: file === fallback && locale !== defaultLocale };
}

const readAll = cache(<T extends ContentType>(type: T, locale: Locale) =>
  listSlugs(type)
    .map((slug) => readEntry(type, slug, locale))
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null),
);

const readOne = cache(<T extends ContentType>(type: T, slug: string, locale: Locale) =>
  listSlugs(type).includes(slug) ? readEntry(type, slug, locale) : null,
);

// ---------- Public API ----------

export function getServices(locale: Locale): Entry<Service>[] {
  return [...readAll("services", locale)].sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, locale));
}

export function getService(locale: Locale, slug: string): Entry<Service> | null {
  return readOne("services", slug, locale);
}

export function getSolutions(locale: Locale): Entry<Solution>[] {
  return [...readAll("solutions", locale)].sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, locale));
}

export function getSolution(locale: Locale, slug: string): Entry<Solution> | null {
  return readOne("solutions", slug, locale);
}

export function getProjects(locale: Locale): Entry<Project>[] {
  return [...readAll("projects", locale)].sort((a, b) => b.year - a.year || a.title.localeCompare(b.title, locale));
}

export function getFeaturedProjects(locale: Locale, limit = 3): Entry<Project>[] {
  return getProjects(locale).filter((project) => project.featured).slice(0, limit);
}

export function getProject(locale: Locale, slug: string): Entry<Project> | null {
  return readOne("projects", slug, locale);
}

export function getSegments(locale: Locale): Entry<Segment>[] {
  return [...readAll("segments", locale)].sort((a, b) => a.title.localeCompare(b.title, locale));
}

export function getSegment(locale: Locale, slug: string): Entry<Segment> | null {
  return readOne("segments", slug, locale);
}

/** Newest first. */
export function getNews(locale: Locale): Entry<NewsItem>[] {
  return [...readAll("news", locale)].sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function getNewsItem(locale: Locale, slug: string): Entry<NewsItem> | null {
  return readOne("news", slug, locale);
}

export function getJobs(locale: Locale): Entry<Job>[] {
  return [...readAll("jobs", locale)].sort(
    (a, b) => (b.postedAt?.getTime() ?? 0) - (a.postedAt?.getTime() ?? 0) || a.title.localeCompare(b.title, locale),
  );
}

export function getJob(locale: Locale, slug: string): Entry<Job> | null {
  return readOne("jobs", slug, locale);
}

export function getPage(locale: Locale, slug: string): Entry<Page> | null {
  return readOne("pages", slug, locale);
}

export const readPartnerRecords = cache((): PartnerRecord[] => {
  const file = path.join(CONTENT_DIR, "partners.json");
  let raw: unknown;
  try {
    raw = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    throw new ContentError(`content/partners.json: invalid JSON (${error instanceof Error ? error.message : String(error)})`);
  }
  const result = z.array(partnerSchema).safeParse(raw);
  if (!result.success) {
    const issues = result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
    throw new ContentError(`content/partners.json\n  - ${issues.join("\n  - ")}`);
  }
  return result.data;
});

export function getPartners(locale: Locale): Partner[] {
  return readPartnerRecords().map(({ description, ...partner }) => ({
    ...partner,
    description: description?.[locale] ?? description?.[defaultLocale],
  }));
}

/** Resolves slugs to records, skipping unknown ones (the content check reports those). */
export function pickBySlug<T extends { slug: string }>(items: T[], slugs: string[]): T[] {
  return slugs.map((slug) => items.find((item) => item.slug === slug)).filter((item): item is T => item !== undefined);
}
