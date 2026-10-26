import { expect, test } from "@playwright/test";

// A distinct client IP per test keeps the in-memory rate limiter out of the way.
let ipCounter = 0;
test.beforeEach(async ({ page }) => {
  ipCounter += 1;
  await page.setExtraHTTPHeaders({ "X-Forwarded-For": `198.51.100.${ipCounter}` });
  await page.addInitScript(() => window.localStorage.setItem("networkai-cookie-consent", "essential"));
});

test("submits the contact form successfully (en)", async ({ page }) => {
  await page.goto("/en/contact");
  const form = page.getByRole("form", { name: "Send us a message" });
  await form.getByRole("textbox", { name: "Full name", exact: true }).fill("Test Person");
  await form.getByRole("textbox", { name: "Company", exact: true }).fill("Example Co");
  await form.getByRole("textbox", { name: "Work email", exact: true }).fill("test@example.com");
  await form.getByRole("textbox", { name: "Phone", exact: true }).fill("+84 90 123 4567");
  await form.getByRole("textbox", { name: "How can we help?", exact: true }).fill("We would like a network survey for a hotel.");
  await form.getByRole("checkbox").check();

  const responsePromise = page.waitForResponse("**/api/contact");
  await form.getByRole("button", { name: "Send message" }).click();
  const response = await responsePromise;
  expect(response.status()).toBe(200);
  await expect(form.getByRole("status")).toContainText("Thank you, your message has been sent.");
});

test("blocks invalid input with clear messages (vi)", async ({ page }) => {
  await page.goto("/vi/contact");
  const form = page.getByRole("form", { name: "Gửi tin nhắn cho chúng tôi" });
  let apiCalled = false;
  page.on("request", (request) => {
    if (request.url().endsWith("/api/contact")) apiCalled = true;
  });

  await form.getByRole("textbox", { name: "Email công việc", exact: true }).fill("not-an-email");
  await form.getByRole("button", { name: "Gửi tin nhắn" }).click();

  await expect(form.getByText("Vui lòng nhập họ và tên.")).toBeVisible();
  await expect(form.getByText("Vui lòng nhập địa chỉ email hợp lệ.")).toBeVisible();
  await expect(form.getByText("Vui lòng đồng ý với chính sách quyền riêng tư để tiếp tục.")).toBeVisible();
  await expect(form.locator('[aria-invalid="true"]')).toHaveCount(6);
  expect(apiCalled).toBe(false);
});

test("API rejects invalid data and accepts a honeypot without sending", async ({ request }) => {
  const invalid = await request.post("/api/contact", {
    headers: { "X-Forwarded-For": "198.51.100.200" },
    data: { name: "A", company: "", email: "nope", phone: "abc", message: "short", consent: false, locale: "en" },
  });
  expect(invalid.status()).toBe(400);
  const body = await invalid.json();
  expect(body.error).toBe("invalid");
  expect(Object.keys(body.fieldErrors).sort()).toEqual(["company", "consent", "email", "message", "name", "phone"]);

  const honeypot = await request.post("/api/contact", {
    headers: { "X-Forwarded-For": "198.51.100.201" },
    data: { name: "Bot Name", company: "Bot", email: "bot@example.com", phone: "0901234567", message: "spam spam spam", consent: true, website: "http://spam", locale: "en" },
  });
  expect(honeypot.status()).toBe(200);
});
