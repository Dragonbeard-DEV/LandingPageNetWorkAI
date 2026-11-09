import { expect, test, type Page } from "@playwright/test";

// Pre-accept "essential only" so the cookie banner does not cover the page.
async function dismissCookies(page: Page) {
  await page.addInitScript(() => window.localStorage.setItem("networkai-cookie-consent", "essential"));
}

test.describe("home page", () => {
  test.beforeEach(async ({ page }) => dismissCookies(page));

  test("renders all blocks in English", async ({ page }) => {
    const response = await page.goto("/en");
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("ICT, ELV & Smart Building");

    // Blocks in the order a visitor reads them: promise, proof, offer, reach, projects, fieldwork, why us, CTA.
    const ids = await page.locator("main > section, main > div > section").evaluateAll((nodes) => nodes.map((node) => node.id || node.getAttribute("aria-labelledby")));
    expect(ids).toEqual(["hero-title", "clients-label", "services", "systems", "featured-projects", "fieldwork", "capability", "cta-band-title"]);
    await expect(page.locator('section[aria-labelledby="clients-label"] img')).toHaveCount(8);
    await expect(page.locator("#services li.reveal")).toHaveCount(4);
    await expect(page.locator("#systems li.reveal")).toHaveCount(4);
    await expect(page.locator("#systems li.reveal li")).toHaveCount(16);
    await expect(page.locator("#featured-projects li")).toHaveCount(3);
    // The home page previews; the full photo set lives on the About page.
    await expect(page.locator("#fieldwork figure")).toHaveCount(3);
    await expect(page.locator("#fieldwork").getByRole("link", { name: "See more site photos" })).toHaveAttribute("href", "/en/about#fieldwork");
    await expect(page.getByRole("contentinfo")).toBeVisible();
    await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
  });

  test("renders in Vietnamese and switches language", async ({ page }) => {
    await page.goto("/vi");
    await expect(page.locator("html")).toHaveAttribute("lang", "vi");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("cho khách sạn đẳng cấp quốc tế");
    await page.getByRole("link", { name: "English" }).click();
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("redirects / to the default locale", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/en$/);
  });

  test("has no horizontal scroll and a working mobile menu at 375px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/en");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBe(0);
    await page.getByRole("button", { name: "Open menu" }).click();
    const menu = page.getByRole("dialog", { name: "Menu" });
    await expect(menu).toBeVisible();
    await menu.getByRole("link", { name: "Solutions" }).click();
    await expect(page).toHaveURL(/\/en\/solutions$/);
  });
});

test.describe("home scroll motion", () => {
  test.beforeEach(async ({ page }) => dismissCookies(page));

  test("slides blocks in only when they scroll into view", async ({ page }) => {
    await page.goto("/en");
    const secondCard = page.locator("#services li.reveal").nth(1);
    await expect(secondCard).toHaveCSS("opacity", "0");
    await expect(secondCard).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 40)");
    await expect(secondCard).toHaveCSS("transition-delay", "0.15s");

    await secondCard.scrollIntoViewIfNeeded();
    await expect(secondCard).toHaveCSS("opacity", "1");
    await expect(secondCard).toHaveCSS("transform", "none");
  });

  test("slides a muted grey logo in behind the capability statement", async ({ page }) => {
    await page.goto("/vi");
    const backdrop = page.locator("#capability .reveal-from-right");
    const logo = backdrop.locator('img[src*="networkai-logo-icon"]');
    await expect(logo).toHaveAttribute("alt", "");
    await expect(logo).toHaveCSS("filter", "grayscale(1)");
    await expect(logo).toHaveCSS("opacity", "0.1");
    await expect(backdrop).toHaveCSS("transform", "matrix(1, 0, 0, 1, 80, 0)");

    await page.locator("#capability blockquote").scrollIntoViewIfNeeded();
    await expect(backdrop).toHaveCSS("opacity", "1");
    await expect(page.locator("#capability blockquote")).toBeVisible();
  });

  test("shows everything at once with reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");
    await expect(page.locator("#capability .reveal-from-right")).toHaveCSS("opacity", "1");
    await expect(page.locator("#services li.reveal").first()).toHaveCSS("opacity", "1");
  });

  for (const width of [375, 1280]) {
    test(`has no horizontal scroll while blocks slide in at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto("/en");
      for (const id of ["services", "systems", "fieldwork", "capability"]) {
        await page.locator(`#${id}`).scrollIntoViewIfNeeded();
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow, `overflow at #${id}`).toBe(0);
      }
    });
  }
});

test.describe("header on scroll", () => {
  test.beforeEach(async ({ page }) => dismissCookies(page));

  const WHITE = "rgb(255, 255, 255)";
  const STRONG_TEXT = "rgb(15, 29, 51)";

  test("is dark at the top, turns white when scrolled and dark again back at the top", async ({ page }) => {
    await page.goto("/en");
    const header = page.getByRole("banner");
    const navLink = header.getByRole("link", { name: "Solutions" });
    const darkLayer = header.locator("[data-header-dark-layer]");
    const logoOnDark = header.locator('img[src*="networkai-logo-header-on-dark"]');

    await expect(darkLayer).toHaveCSS("opacity", "1");
    await expect(darkLayer).toHaveCSS("background-image", /linear-gradient\(to right, rgb\(17, 17, 17\).*rgb\(77, 77, 77\)/);
    await expect(navLink).toHaveCSS("color", WHITE);
    await expect(logoOnDark).toHaveCSS("opacity", "1");

    await page.evaluate(() => window.scrollTo(0, 600));
    await expect(darkLayer).toHaveCSS("opacity", "0");
    await expect(navLink).toHaveCSS("color", STRONG_TEXT);
    await expect(logoOnDark).toHaveCSS("opacity", "0");
    await expect(header).toHaveCSS("background-color", /rgba?\(255, 255, 255/);

    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(darkLayer).toHaveCSS("opacity", "1");
    await expect(navLink).toHaveCSS("color", WHITE);
  });

  test("starts white when the page opens already scrolled", async ({ page }) => {
    await page.goto("/en");
    await page.evaluate(() => window.scrollTo(0, 600));
    await page.reload();
    await page.evaluate(() => window.scrollTo(0, 600));
    await expect(page.getByRole("banner").locator("[data-header-dark-layer]")).toHaveCSS("opacity", "0");
  });

  test("shows the larger logo without overflowing at any width", async ({ page }) => {
    await page.goto("/vi");
    const logo = page.getByRole("banner").locator('img[src*="networkai-logo-header-on-dark"]');
    await expect(logo).toBeVisible();
    expect((await logo.boundingBox())?.height).toBe(56);

    for (const width of [320, 375, 1024, 1280]) {
      await page.setViewportSize({ width, height: 800 });
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `overflow at ${width}px`).toBe(0);
    }
  });
});

test.describe("hero slideshow", () => {
  test.beforeEach(async ({ page }) => dismissCookies(page));

  const activeSlide = (page: Page) => page.locator('section[aria-labelledby="hero-title"] img[data-active="true"]');

  test("rotates on its own and stops when paused", async ({ page }) => {
    await page.goto("/en");
    const first = await activeSlide(page).getAttribute("src");
    await expect.poll(() => activeSlide(page).getAttribute("src"), { timeout: 10_000 }).not.toBe(first);

    await page.getByRole("button", { name: "Pause photo rotation" }).click();
    await page.mouse.move(0, 0);
    const paused = await activeSlide(page).getAttribute("src");
    await page.waitForTimeout(7_000);
    expect(await activeSlide(page).getAttribute("src")).toBe(paused);
  });

  test("keeps rotating after a photo is chosen with the mouse", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("button", { name: "Show photo 3" }).click();
    await page.mouse.move(0, 0);
    await expect(page.getByRole("button", { name: "Show photo 4" })).toHaveAttribute("aria-current", "true", { timeout: 10_000 });
  });

  test("holds the photo while the pointer stays on the controls after a click", async ({ page }) => {
    await page.goto("/en");
    const third = page.getByRole("button", { name: "Show photo 3" });
    await third.click();
    await page.waitForTimeout(7_000);
    await expect(third).toHaveAttribute("aria-current", "true");
  });

  test("holds the photo while a control has keyboard focus", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("button", { name: "Pause photo rotation" }).focus();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Show photo 1" })).toBeFocused();
    await page.waitForTimeout(7_000);
    await expect(page.getByRole("button", { name: "Show photo 1" })).toHaveAttribute("aria-current", "true");
  });

  test("shows a chosen photo from its control", async ({ page }) => {
    await page.goto("/en");
    const second = page.getByRole("button", { name: "Show photo 2" });
    await second.click();
    await expect(second).toHaveAttribute("aria-current", "true");
    await expect(activeSlide(page)).toHaveAttribute("alt", /seaside resort/);
  });

  test("has four photos and none of the technicians", async ({ page }) => {
    await page.goto("/en");
    await expect(page.getByRole("button", { name: /^Show photo \d$/ })).toHaveCount(4);
    await expect(page.locator('section[aria-labelledby="hero-title"] img[src*="technicians-installing-rack"]')).toHaveCount(0);
  });

  test("does not rotate on its own with reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");
    await expect(page.getByRole("button", { name: "Play photo rotation" })).toBeVisible();
    const first = await activeSlide(page).getAttribute("src");
    await page.waitForTimeout(7_000);
    expect(await activeSlide(page).getAttribute("src")).toBe(first);
  });
});

test.describe("about page", () => {
  test.beforeEach(async ({ page }) => dismissCookies(page));

  const sections = [
    { locale: "en", first: "Who we are", second: "What we do", firstText: /based in Da Nang/, secondText: /end-to-end project delivery/, team: "Our team" },
    { locale: "vi", first: "Chân dung doanh nghiệp", second: "Giải pháp / Dịch vụ", firstText: /có trụ sở tại Đà Nẵng/, secondText: /triển khai trọn gói/, team: "Đội ngũ" },
  ];

  for (const { locale, first, second, firstText, secondText, team } of sections) {
    test(`shows one open section at a time and no team (${locale})`, async ({ page }) => {
      await page.goto(`/${locale}/about`);
      const main = page.getByRole("main");
      await expect(main.locator("details")).toHaveCount(2);
      await expect(main.locator('img[src*="control-cabinet-wiring"]')).toBeVisible();
      await expect(main.getByText(firstText)).toBeVisible();
      await expect(main.getByText(secondText)).toBeHidden();

      await main.getByRole("heading", { name: second }).click();
      await expect(main.getByText(secondText)).toBeVisible();
      await expect(main.getByText(firstText)).toBeHidden();

      await main.getByRole("heading", { name: first }).click();
      await expect(main.getByText(firstText)).toBeVisible();

      await expect(page.locator("#team")).toHaveCount(0);
      await expect(main.getByRole("heading", { name: team })).toHaveCount(0);
    });
  }

  test("opens a section from the keyboard", async ({ page }) => {
    await page.goto("/en/about");
    const main = page.getByRole("main");
    await main.locator("summary").nth(1).focus();
    await page.keyboard.press("Enter");
    await expect(main.getByText(/end-to-end project delivery/)).toBeVisible();
  });
});

test.describe("partners page", () => {
  test.beforeEach(async ({ page }) => dismissCookies(page));

  const headings = [
    { locale: "en", clients: "Clients", partners: "Technology partners" },
    { locale: "vi", clients: "Khách hàng", partners: "Đối tác công nghệ" },
  ];

  for (const { locale, clients, partners } of headings) {
    test(`separates hotel clients from technology partners (${locale})`, async ({ page }) => {
      await page.goto(`/${locale}/partners`);
      const clientSection = page.locator("#clients");
      const partnerSection = page.locator("#partners");

      await expect(clientSection.getByRole("heading", { level: 2, name: clients, exact: true })).toBeVisible();
      await expect(partnerSection.getByRole("heading", { level: 2, name: partners, exact: true })).toBeVisible();
      await expect(clientSection.locator("li")).toHaveCount(8);
      await expect(partnerSection.locator("li")).toHaveCount(24);

      await expect(clientSection.getByRole("link", { name: /Hilton/ })).toBeVisible();
      await expect(clientSection.getByRole("link", { name: /Cisco/ })).toHaveCount(0);
      await expect(partnerSection.getByRole("link", { name: /Cisco Meraki/ })).toBeVisible();
      await expect(partnerSection.getByRole("link", { name: /Hilton/ })).toHaveCount(0);

      const clientsAreFirst = await clientSection.evaluate((node, other) => Boolean(node.compareDocumentPosition(other!) & Node.DOCUMENT_POSITION_FOLLOWING), await partnerSection.elementHandle());
      expect(clientsAreFirst).toBe(true);
    });
  }
});

test("technology cards use icons and the photo appears on the detail page", async ({ page }) => {
  await dismissCookies(page);
  await page.goto("/en/solutions");
  await expect(page.locator("main article img")).toHaveCount(0);
  await expect(page.locator("main article svg").first()).toBeVisible();

  await page.goto("/en/solutions/data-center");
  await expect(page.getByRole("img", { name: "Server racks in a server room" })).toBeVisible();
});

test.describe("pages that hold the detail the home page previews", () => {
  test.beforeEach(async ({ page }) => dismissCookies(page));

  test("services overview links to four service pages with scope and a four-step process", async ({ page }) => {
    await page.goto("/en/services");
    const main = page.getByRole("main");
    await expect(main.locator("li.reveal h2")).toHaveCount(4);
    await main.getByRole("link", { name: "Design consultancy" }).click();
    await expect(page).toHaveURL(/\/en\/services\/design-consultancy$/);
    await expect(page.locator("#approaches li")).toHaveCount(2);
    await expect(page.locator("#scope li")).toHaveCount(4);
    await expect(page.locator("#process li")).toHaveCount(4);
    await expect(page.locator("#other-services li")).toHaveCount(3);
  });

  test("ELV solution lists all sixteen systems with descriptions", async ({ page }) => {
    await page.goto("/vi/solutions/elv-systems");
    await expect(page.locator("#systems h2")).toHaveText("16 hệ thống, 4 nhóm");
    await expect(page.locator("#systems li")).toHaveCount(16);
    await expect(page.locator("#systems").getByText("Kết nối PMS", { exact: true })).toHaveCount(3);
  });

  test("About shows every site photo labelled by work and phase", async ({ page }) => {
    await page.goto("/en/about");
    await expect(page.locator("#fieldwork figure")).toHaveCount(9);
    await expect(page.locator("#fieldwork figcaption").first()).toHaveText("Security monitoring centre");
  });

  test("contact page lists what to include in a first message", async ({ page }) => {
    await page.goto("/vi/contact");
    const prepare = page.getByRole("complementary", { name: "Thông tin nên gửi kèm" });
    await expect(prepare.locator("li")).toHaveCount(4);
  });
});

const detailPages = [
  { path: "services/design-consultancy", en: "Design consultancy", vi: "Tư vấn thiết kế" },
  { path: "solutions/data-center", en: "Data center and cloud", vi: "Trung tâm dữ liệu và đám mây" },
  { path: "projects/amanoi-resort", en: "Amanoi Resort", vi: "Amanoi Resort" },
  { path: "segments/hospitality", en: "Hospitality", vi: "Khách sạn và nghỉ dưỡng" },
  {
    path: "news/novotel-naman-village-brand-conversion",
    en: "Novotel Naman Village: supporting a successful brand conversion for Accor",
    vi: "Novotel Naman Village: đồng hành cùng Accor trong chuyển đổi thương hiệu thành công",
  },
  { path: "jobs/network-system-engineer", en: "Network and system engineer", vi: "Kỹ sư mạng và hệ thống" },
];

test.describe("detail pages", () => {
  test.beforeEach(async ({ page }) => dismissCookies(page));

  for (const detail of detailPages) {
    for (const locale of ["en", "vi"] as const) {
      test(`${locale}/${detail.path}`, async ({ page }) => {
        const response = await page.goto(`/${locale}/${detail.path}`);
        expect(response?.status()).toBe(200);
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(detail[locale]);
        await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`/${locale}/${detail.path}$`));
      });
    }
  }

  test("unknown slug and unknown path return 404", async ({ page }) => {
    expect((await page.goto("/en/solutions/does-not-exist"))?.status()).toBe(404);
    const response = await page.goto("/vi/khong-ton-tai");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Không tìm thấy trang");
  });
});

test("cookie banner defaults to essential only and remembers the choice", async ({ page }) => {
  await page.goto("/en");
  const banner = page.getByRole("region", { name: "Cookies on this site" });
  await expect(banner).toBeVisible();
  await banner.getByRole("button", { name: "Essential only" }).click();
  await expect(banner).toBeHidden();
  expect(await page.evaluate(() => window.localStorage.getItem("networkai-cookie-consent"))).toBe("essential");
  await page.reload();
  await expect(page.getByRole("region", { name: "Cookies on this site" })).toBeHidden();
});
