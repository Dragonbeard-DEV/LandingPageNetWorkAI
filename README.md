# NetworkAI corporate site

Bilingual (English / Vietnamese) B2B marketing site for NetworkAI, built with Next.js (App Router), TypeScript, Tailwind CSS and next-intl.
All content pages are statically generated; the only server code is the contact-form API, which emails leads through Resend.

- 17 routes under `/en` and `/vi`: home, about, partners, news, jobs, segments, solutions, projects (list + detail where applicable), contact, privacy policy, cookies, HTML sitemap.
- Content lives in `/content` (MDX + JSON) and is validated with Zod at build and check time.
- No database, no login, no third-party CAPTCHA. Leads are only sent by email.

## Getting started

Requirements: Node.js 20.9 or later (developed on Node 24), npm.

```bash
npm install
cp .env.example .env.local   # optional in development
npm run dev                  # http://localhost:3000 → redirects to /en
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm run start` | Production build (static generation) and server |
| `npm run check` | ESLint + `next typegen` + `tsc --noEmit` + content check. Runs in CI on every pull request |
| `npm run content:check` | Validates every record in `/content` (schema, images, alt text, cross references) and that `messages/en.json` and `vi.json` have the same keys. Add `-- --unused` to list images not referenced by content |
| `npm run test:e2e` | Playwright smoke tests. Starts its own `next dev` on port 3300, so stop any other dev server for this project first. First run: `npx playwright install chromium` |
| `npm run images:optimize` | Converts new photos in `public/images` to WebP (max 1920 px, under 300 KB). Run after adding photos |

## Environment variables

Set them in `.env.local` locally and in the Vercel project settings for Preview and Production. See `.env.example`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | Production | Resend API key. Without it (or without `CONTACT_FROM_EMAIL`) the contact API logs the lead on the server and reports success in development, and returns a clear "not configured" error (HTTP 503) in production |
| `CONTACT_TO_EMAIL` | No | Inbox that receives leads. Default `sales@networkai.vn` |
| `CONTACT_FROM_EMAIL` | Production | Sender, e.g. `NetworkAI Website <no-reply@your-domain>`; the domain must be verified in Resend |
| `NEXT_PUBLIC_SITE_URL` | Production | Public origin used for canonical URLs, hreflang, `sitemap.xml`, `robots.txt` and Open Graph. Default `https://example.com` |
| `NEXT_PUBLIC_ANALYTICS_ENABLED` | No | `true` turns on the analytics slot (`components/layout/Analytics.tsx`), which still waits for "Accept all" in the cookie banner |

## Project structure

```text
app/[locale]/          routes only (thin): pages, layout, not-found
app/api/contact/       contact form endpoint (validation, honeypot, rate limit, email)
app/sitemap.ts, robots.ts, globals.css (design tokens), icon.png
components/ui/         Button, Card, Chip, Container, Section, Reveal (know nothing about content)
components/sections/   Hero, SolutionGrid, ProjectGrid, FeaturedProjects, CtaBand, PageHeader, MdxContent, ContactForm, LegalPage…
components/layout/     Header, Footer, LanguageSwitcher, CookieBanner, Analytics
content/               all editable content (see below)
lib/content.ts         Zod schemas + readers: the only code that reads /content
lib/i18n/  lib/seo/  lib/email/  lib/contact.ts  lib/rate-limit.ts  lib/consent.ts
messages/              en.json, vi.json: UI strings (buttons, labels, form errors)
public/images/         imported photos and logos; public/placeholders/ generated placeholders
scripts/               optimize-images.mjs, check-content.ts
tests/e2e/             Playwright smoke tests
site.config.ts         brand name, menu, contact details, social links, locales
```

Dependencies flow one way: `components/ui` → `components/sections` → `app/[locale]`.

## Where to change what

| Task | Where | Code change? |
| --- | --- | --- |
| Add or edit a Solution, Project, Segment, News item or Job | `content/<type>/<slug>/en.mdx` and `vi.mdx`; photos in `public/images/` | No |
| Edit home, about, privacy or cookie page text | `content/pages/<slug>/en.mdx` and `vi.mdx` | No |
| Add or edit a partner | `content/partners.json`; logo in `public/images/partners/` | No |
| Change UI text (buttons, labels, form errors) | `messages/en.json` and `messages/vi.json` (same keys in both) | No |
| Change company name, menu, contact details, social links | `site.config.ts` | No |
| Change colours, font, spacing | Design tokens at the top of `app/globals.css` | One place |
| Add a language | `locales` in `site.config.ts`, `messages/<code>.json`, a `<code>.mdx` per record | Little |
| Add a content type | Schema in `lib/content.ts`, `content/<type>/`, routes in `app/[locale]/` | Yes |
| Add a home page block | Component in `components/sections/`, used in `app/[locale]/page.tsx` | Yes |

A record without a `vi.mdx` falls back to `en.mdx` and shows a short notice. `en.mdx` is required.

## Adding a new Solution

1. Create `content/solutions/<slug>/` (kebab-case slug, e.g. `wifi-design`).
2. Add `en.mdx`:

   ```mdx
   ---
   slug: "wifi-design"              # must equal the folder name
   title: "Wi-Fi design"
   tagline: "One line shown on cards"
   summary: "One or two sentences for the detail page and search engines"
   image:
     src: "/images/solutions/wifi-design.webp"
     alt: "Describe the photo"
   features: ["Feature 1", "Feature 2"]         # optional
   relatedProjects: ["sample-beach-resort"]     # optional, project slugs
   order: 7                                     # optional, position in lists
   ---

   ## Overview

   Body in Markdown/MDX.
   ```

3. Add `vi.mdx` with the same fields translated (keep `slug`, `relatedProjects` and `order` identical).
4. Put the photo in `public/images/solutions/` and run `npm run images:optimize`.
5. To show it in a segment, add the slug to `solutions:` in `content/segments/<segment>/*.mdx`.
6. Run `npm run content:check`, then open `/en/solutions/<slug>` and `/vi/solutions/<slug>` with `npm run dev`.

The solution then appears automatically on the home page grid (first six by `order`), `/solutions`, the sitemaps and related pages.

## Update workflow

1. Create a git branch for the change.
2. Open a pull request: CI (`.github/workflows/ci.yml`) runs `npm run check`, `npm run build` and the Playwright tests; Vercel builds a preview.
3. Check the preview in both `/en` and `/vi`, then merge into `main` to deploy to production.
4. Every quarter: `npm outdated`, upgrade, then `npm run check` and `npm run build` again.

If editors will not use git, replace the readers in `lib/content.ts` with a headless CMS client (Sanity, Payload or Strapi) and keep its exported functions; routes and components do not change.

## Deploying to Vercel

Not deployed by this project. To deploy: import the repository in Vercel (framework preset Next.js, default build command),
set the environment variables above for Production and Preview, then add the domain and set `NEXT_PUBLIC_SITE_URL` to it.

## Lighthouse (mobile, home page)

Measured locally on a production build (`next build && next start`, Lighthouse 12.8.2, mobile preset, Chrome 155 headless),
built with `NEXT_PUBLIC_SITE_URL=http://localhost:3200` so the canonical URL matched the audited host:

| Page | Performance | Accessibility | Best Practices | SEO |
| --- | --- | --- | --- | --- |
| `/en` | 93 / 92 | 100 | 100 | 100 |
| `/vi` | 91 / 91 | 100 | 100 | 100 |

Two runs each. Performance has a small margin; LCP is the hero photo (about 3.2–3.4 s under simulated slow 4G), CLS is 0–0.001.
Real numbers on Vercel will differ; re-check after deploying with PageSpeed Insights.

## Libraries

| Package | Why |
| --- | --- |
| `next`, `react`, `react-dom` | Framework: App Router, static generation, route handlers |
| `tailwindcss`, `@tailwindcss/turbopack` | Styling with design tokens; Turbopack CSS loader generated by create-next-app |
| `next-intl` | Locale routing (`/en`, `/vi`), UI string catalogs in `messages/*.json` |
| `zod` | Schemas for content frontmatter and the contact form (client and server) |
| `react-hook-form`, `@hookform/resolvers` | Contact form state and Zod validation on the client. Resolvers pinned to v5: v6 has an unresolvable optional peer (`effect@4`) with npm |
| `resend` | Sends contact-form leads by email |
| `gray-matter` | Parses MDX frontmatter in `lib/content.ts` |
| `next-mdx-remote` | Renders MDX bodies from `/content` in Server Components |
| `remark-gfm` | Markdown tables in MDX (used by the cookie policy) |
| `sharp` (dev) | `scripts/optimize-images.mjs`: resize and convert photos to WebP |
| `@playwright/test` (dev) | Smoke tests and layout screenshots |
| `tsx` (dev) | Runs `scripts/check-content.ts`, which reuses `lib/content.ts` (TypeScript with `@/` path aliases) |

## Assumptions

- **Next.js 16.4 without Cache Components.** create-next-app enabled `cacheComponents` and `partialPrefetching`; both were removed.
  Every content page is statically generated with `generateStaticParams`, which is what the brief asks for and works with `next-intl` without extra wiring.
- **Proxy instead of middleware.** Next 16 renamed `middleware.ts` to `proxy.ts`; locale detection and the `/` → `/en` redirect live there.
- **Legacy assets.** The legacy repo was at commit `a71ae97` (matches the brief), file counts matched the brief.
  Only `public/` was extracted (`git archive`), because the full checkout fails on Windows path-length limits in folders we do not use anyway.
- **Image folders are flat per type** (`public/images/projects/…`), as in the Assets table of the brief, rather than one folder per record:
  several records share photos, and the legacy photos are not tied to specific records.
- **Logo colours.** The NetworkAI logo uses navy and a blue-to-cyan gradient, slightly different from `#0f5bff`.
  The brief's palette was kept unchanged; the logo is used as-is. `networkai-logo-full.png` had its transparent padding trimmed (no visual change).
- **Muted text on tinted backgrounds** uses `#5a6d88` (token `--text-muted-on-tint`) instead of `#61748e`, to stay at or above 4.5:1.
- **Contact details.** Address and phone in `site.config.ts` are visible placeholders; the email is `sales@networkai.vn`.
- **Favicon** (`app/icon.png`) is generated from `networkai-logo-icon.png`; the Open Graph image `networkai-og-default.png` (1200×630)
  is generated from `networkai-logo-full.png` on the `--brand-soft` background.
- **Extra content type `pages`** (`content/pages/{home,about,privacy-policy,cookies}`) holds long text for those pages, so no page copy is hard-coded.
- **Sample data is visibly placeholder** (`[…]`). Exceptions that a schema requires as real values: project `year` (2023–2025),
  news and job dates, and solution/segment titles (generic service names, not claims). Replace them with real data.
- **Home hero headline** uses the positioning from the brief ("Technology solutions for B2B enterprises").
- **Partners page** lists all 20 imported logos (vendors and hotel brands) under "Partners"; URLs point to each brand's public site,
  except XPossible and Zafiro (unknown, set to `https://example.com/`).
- **Font**: Be Vietnam Pro (Latin + Vietnamese) with weights 400, 500 and 700, not preloaded, to keep the mobile LCP under budget;
  `font-semibold`/`font-extrabold` render with the 700 file.
- **Images**: `images.qualities` is `[60, 75]`; the hero uses 60 because it sits under a dark overlay.
- **Client messages**: only the `nav`, `header`, `language`, `cookie` and `form` namespaces are sent to the browser.
- **Dates** are formatted in the `Asia/Ho_Chi_Minh` time zone.
- **Smoke tests run against `next dev`**, because the brief requires the "log instead of send" behaviour only in development.
  The production build is verified separately by `npm run build` (CI runs both).
- **Contact form**: phone accepts digits, spaces, `+ ( ) . -` (6–20 characters); message 10–2,000 characters; the honeypot field is `website`.

## Known limitations

- **Contact rate limit is in memory** (`lib/rate-limit.ts`, 5 requests per IP per 10 minutes). Each server instance keeps its own counter,
  so on Vercel (several instances, cold starts) the limit is best-effort. For a strict limit, move the counter to a shared store such as Upstash Redis.
- **No CAPTCHA** in this version (per the brief); spam protection is the honeypot field plus the rate limit.
- **Analytics slot is empty**: `components/layout/Analytics.tsx` renders nothing until a provider is added. Changing consent from
  "Accept all" back to "Essential only" will need a page reload (or explicit teardown) once a provider script is added; consent changes
  are not synced across open tabs.
- **No Content-Security-Policy or other security headers** are configured yet; add them in `next.config.ts` (`headers()`) once the
  analytics provider and final domains are known.
- **Rate-limit key**: the client IP comes from `x-real-ip` (set by Vercel) or the first `X-Forwarded-For` entry, validated as an IP.
  Behind another proxy that does not overwrite these headers, a client could spoof them; configure the proxy accordingly.
- **Legal pages are templates** and show a "needs legal review" notice on the page.
- **Dev server caches optimized images** (`.next/cache/images`, 4-hour TTL in Next 16): after replacing an image file under the
  same name, delete that folder or rename the file to see the change locally.

## Needs a person before going live

- Resend: create the account, verify the sending domain, set `RESEND_API_KEY` and `CONTACT_FROM_EMAIL`.
- Domain: buy/configure it and set `NEXT_PUBLIC_SITE_URL`.
- Legal: have counsel review and complete the privacy and cookie policies; fill in the company's legal name.
- Rights: confirm the right to use every partner and hotel logo, and photos that show hotel brands.
- Content: replace every `[placeholder]`, the sample years and dates, the address and phone in `site.config.ts`, and the social links.

## Assets

Imported from the legacy repo `letatkhoa3000/networkai-full` (commit `a71ae97`, `public/` only), de-duplicated by MD5,
renamed to kebab-case and optimized with `npm run images:optimize` (WebP, max 1920 px, under 300 KB; SVG and PNG logos untouched).
Alt text in both languages lives with the content that uses the image (see `content/`); the table below is the reference copy.

> Partner and hotel logos, and photos showing hotel brands, are third-party trademarks. The company must confirm the right to use them before going live.

### Brand (`public/images/brand/`)

| File | Used in | Alt (en) | Alt (vi) |
| --- | --- | --- | --- |
| `networkai-logo-full.png` | Header, footer | NetworkAI logo | Logo NetworkAI |
| `networkai-logo-icon.png` | Favicon (`app/icon.png`), JSON-LD logo | NetworkAI symbol | Biểu tượng NetworkAI |
| `networkai-og-default.png` | Default Open Graph image (generated) | NetworkAI logo | Logo NetworkAI |
| `networkai-logo-full-dark.png` | Unused | NetworkAI logo on a navy background | Logo NetworkAI trên nền xanh navy |
| `networkai-logo-icon-dark.png` | Unused | NetworkAI symbol on a navy background | Biểu tượng NetworkAI trên nền xanh navy |
| `networkai-logo-wordmark.png` | Unused | NetworkAI wordmark | Chữ NetworkAI |
| `networkai-logo-wordmark-dark.png` | Unused | NetworkAI wordmark on a navy background | Chữ NetworkAI trên nền xanh navy |

### Home (`public/images/home/`)

| File | Used in | Alt (en) | Alt (vi) |
| --- | --- | --- | --- |
| `technicians-installing-rack.webp` | Home hero, About | Two technicians installing equipment in a network rack | Hai kỹ thuật viên lắp thiết bị vào tủ mạng |
| `technicians-installing-rack-alt.webp` | Unused (near-duplicate) | Same as above | Như trên |
| `technicians-installing-rack-alt-2.webp` | Unused (near-duplicate) | Same as above | Như trên |

### Solutions (`public/images/solutions/`)

| File | Used in | Alt (en) | Alt (vi) |
| --- | --- | --- | --- |
| `ict-system-design-illustration.webp` | Solution: ICT system design | Illustration of a server linked to network devices | Hình minh hoạ máy chủ kết nối với thiết bị mạng |
| `ict-system-design-icon.svg` | Unused (icon version of the illustration) | Server and network icon | Biểu tượng máy chủ và mạng |

### Projects and infrastructure photos (`public/images/projects/`)

| File | Planned use | Alt (en) | Alt (vi) |
| --- | --- | --- | --- |
| `network-switches-rack-cabling.webp` | Solution: network infrastructure | Network switches with patch cables in a rack | Bộ chuyển mạch mạng và dây nhảy trong tủ rack |
| `server-rack-cabinet-room.webp` | Solution: data center | Open server cabinet in an equipment room | Tủ máy chủ mở trong phòng thiết bị |
| `control-panel-cabinet-pcb.webp` | Solution: smart building control | Control cabinet with circuit boards and wiring | Tủ điều khiển với bo mạch và dây dẫn |
| `rack-cable-management.webp` | Solution: structured cabling | Neatly routed cables inside a rack | Cáp được đi gọn gàng bên trong tủ rack |
| `rack-console-kvm.webp` | Solution: IT operations | Rack-mounted console with keyboard | Bàn điều khiển gắn tủ rack có bàn phím |
| `server-rack-closed.webp` | Home: Package A | Closed server rack beside a wall | Tủ rack đóng cạnh tường |
| `control-cabinet-wiring.webp` | Home: Package B | Wiring and controllers inside an equipment cabinet | Dây dẫn và bộ điều khiển trong tủ thiết bị |
| `bright-hotel-lobby-lounge.webp` | Home: Package C | Bright hotel lobby lounge with sofas | Sảnh khách sạn sáng sủa với ghế sofa |
| `resort-pool-sunset-aerial.webp` | Segment: hospitality | Aerial view of a resort pool at sunset | Toàn cảnh hồ bơi resort lúc hoàng hôn |
| `glass-tower-hotel-render.webp` | Segment: enterprise | Rendering of glass high-rise towers | Phối cảnh toà nhà cao tầng kính |
| `lagoon-resort-aerial.webp` | Project 1 cover | Aerial view of a lagoon-side resort | Toàn cảnh resort bên đầm phá |
| `beach-resort-pool-aerial.webp` | Project 1 gallery | Resort pool beside a white-sand beach | Hồ bơi resort cạnh bãi cát trắng |
| `palm-infinity-pool-sea.webp` | Project 1 gallery | Infinity pool among palm trees facing the sea | Hồ bơi vô cực giữa hàng dừa nhìn ra biển |
| `high-rise-hotel-city-day.webp` | Project 2 cover | High-rise hotel above a city in daylight | Khách sạn cao tầng giữa thành phố ban ngày |
| `rooftop-terrace-bar-city.webp` | Project 2 gallery | Rooftop terrace bar overlooking the city | Quầy bar sân thượng nhìn ra thành phố |
| `ornate-hotel-lobby-bar.webp` | Project 2 gallery | Ornate hotel lobby bar with a chandelier | Quầy bar sảnh khách sạn trang trí cầu kỳ với đèn chùm |
| `infinity-pool-pavilion-hills.webp` | Project 3 cover | Infinity pool and pavilion facing green hills | Hồ bơi vô cực và nhà chòi nhìn ra đồi xanh |
| `lake-pavilion-walkway.webp` | Project 3 gallery | Lit walkway leading to a lakeside pavilion | Lối đi có đèn dẫn tới nhà chòi bên hồ |
| `rock-garden-resort-dusk.webp` | Project 3 gallery | Resort terrace among large rocks at dusk | Sân hiên resort giữa những tảng đá lớn lúc chạng vạng |
| `server-rear-cabling.webp` | News 1 cover | Rear of a server with network and power cables | Mặt sau máy chủ với cáp mạng và cáp nguồn |
| `residential-towers-garden-pool.webp` | News 2 cover | Residential towers around a garden and pool | Các toà căn hộ quanh khu vườn và hồ bơi |
| `city-hotel-tower-night.webp` | News 3 cover | Hotel tower lit up at night | Toà khách sạn sáng đèn về đêm |
| `beach-hotel-facade-balconies.webp` | Unused | Beachfront hotel facade with balconies | Mặt tiền khách sạn ven biển có ban công |
| `bay-resort-beach-hillside.webp` | Unused | Resort villas on a hillside above a bay | Biệt thự resort trên sườn đồi cạnh vịnh |
| `beach-resort-aerial-lawn.webp` | Unused | Aerial view of a beach resort lawn | Toàn cảnh bãi cỏ resort ven biển |
| `beachfront-resort-aerial.webp` | Unused | Aerial view of a beachfront resort | Toàn cảnh resort sát biển |
| `boutique-hotel-white-facade.webp` | Unused | White facade of a boutique hotel | Mặt tiền trắng của khách sạn boutique |
| `casino-gaming-floor.webp` | Unused | Hotel casino gaming floor | Khu trò chơi casino trong khách sạn |
| `city-hotel-towers-night-traffic.webp` | Unused | Hotel towers above evening traffic | Toà khách sạn phía trên dòng xe buổi tối |
| `coastal-resort-garden-promenade.webp` | Unused | Garden promenade of a coastal resort | Lối dạo trong vườn resort ven biển |
| `garden-night-lighting-aerial.webp` | Unused | Garden lighting seen from above at night | Đèn sân vườn nhìn từ trên cao về đêm |
| `green-terrace-villas-garden.webp` | Unused | Villas with planted terraces and a garden | Biệt thự có sân hiên trồng cây và khu vườn |
| `green-terrace-villas-palms.webp` | Unused | Villas with planted terraces among palms | Biệt thự có sân hiên trồng cây giữa hàng dừa |
| `green-terrace-villas-sky.webp` | Unused | Villas with planted terraces against the sky | Biệt thự có sân hiên trồng cây trên nền trời |
| `high-rise-hotel-city-dusk.webp` | Unused | High-rise hotel above a city at dusk | Khách sạn cao tầng giữa thành phố lúc chạng vạng |
| `hillside-beach-resort-villas.webp` | Unused | Hillside villas above a beach | Biệt thự trên sườn đồi cạnh bãi biển |
| `hilltop-resort-aerial.webp` | Unused | Aerial view of a hilltop resort and pool | Toàn cảnh resort trên đồi và hồ bơi |
| `hotel-entrance-garden-driveway.webp` | Unused | Hotel entrance with a garden driveway | Lối vào khách sạn có đường xe và vườn |
| `hotel-entrance-night-signage.webp` | Unused | Hotel entrance with illuminated signage at night | Lối vào khách sạn với biển hiệu sáng đèn về đêm |
| `mediterranean-resort-pool.webp` | Unused | Resort with arched facade and pool | Resort có mặt tiền vòm và hồ bơi |
| `networkai-logo-banner.webp` | Unused (logo, not a project photo) | NetworkAI logo banner | Băng rôn logo NetworkAI |
| `resort-hotel-landscape-aerial.webp` | Unused | Aerial view of a resort hotel in landscaped grounds | Toàn cảnh khách sạn resort giữa cảnh quan |
| `rooftop-pool-night.webp` | Unused | Rooftop pool lit at night | Hồ bơi sân thượng sáng đèn về đêm |
| `sea-view-terrace-lounge.webp` | Unused | Terrace lounge facing the sea | Khu ghế ngồi sân hiên nhìn ra biển |
| `villa-garden-sea-view.webp` | Unused | Villa garden with sea view | Vườn biệt thự nhìn ra biển |

Near-duplicate photos (same scene, different file) are kept but unused: every file ending in `-alt` or `-alt-2`
(`boutique-hotel-white-facade-alt`, `casino-gaming-floor-alt`, `green-terrace-villas-garden-alt`, `hotel-entrance-night-signage-alt`,
`lagoon-resort-aerial-alt`, `mediterranean-resort-pool-alt`, `ornate-hotel-lobby-bar-alt`, `ornate-hotel-lobby-bar-alt-2`,
`resort-hotel-landscape-aerial-alt`, `resort-pool-sunset-aerial-alt`).

### Partners (`public/images/partners/`)

All used on the Partners page via `content/partners.json`, except `microsoft-square.png` and `cisco-meraki-square.webp`
(second versions of logos already present). Alt text is "<Name> logo" / "Logo <Name>".

`accor.png`, `aman-resorts.svg`, `alcatel-lucent-enterprise.webp`, `cisco-meraki.svg`, `commscope.svg`, `dell-technologies.svg`,
`hilton-hotels-resorts.svg`, `hpe-aruba-networking.svg`, `hyatt.svg`, `ihg-hotels-resorts.svg`, `lg.svg`, `marriott-international.svg`,
`microsoft.svg`, `nutanix.webp`, `radisson-hotel-group.webp`, `ruckus-networks.svg`, `samsung.png`, `wyndham-hotels-resorts.webp`,
`xpossible.webp`, `zafiro.webp`.

Removed: Next.js sample files (`next.svg`, `window.svg`, `globe.svg`, `vercel.svg`, `file.svg`), 6 duplicate project photos and
1 duplicate CommScope logo (identical MD5).
