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
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Technology solutions");

    // Blocks in the order required by the brief.
    const ids = await page.locator("main > section, main > div > section").evaluateAll((nodes) => nodes.map((node) => node.id || node.getAttribute("aria-labelledby")));
    expect(ids).toEqual(["hero-title", "intro", "solutions", "capability", "featured-projects", "packages", "cta-band-title"]);
    await expect(page.locator("#solutions li")).toHaveCount(6);
    await expect(page.locator("#featured-projects li")).toHaveCount(3);
    await expect(page.locator("#packages li")).toHaveCount(3);
    await expect(page.getByRole("contentinfo")).toBeVisible();
    await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
  });

  test("renders in Vietnamese and switches language", async ({ page }) => {
    await page.goto("/vi");
    await expect(page.locator("html")).toHaveAttribute("lang", "vi");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Giải pháp công nghệ");
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

const detailPages = [
  { path: "solutions/data-center", en: "Data center and servers", vi: "Trung tâm dữ liệu và máy chủ" },
  { path: "projects/sample-beach-resort", en: "[Sample project: beach resort]", vi: "[Dự án mẫu: resort ven biển]" },
  { path: "segments/hospitality", en: "Hospitality", vi: "Khách sạn và nghỉ dưỡng" },
  { path: "news/sample-news-network-upgrade", en: "[Sample news title 1]", vi: "[Tiêu đề tin mẫu 1]" },
  { path: "jobs/sample-network-engineer", en: "[Sample role: Network engineer]", vi: "[Vị trí mẫu: Kỹ sư mạng]" },
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
