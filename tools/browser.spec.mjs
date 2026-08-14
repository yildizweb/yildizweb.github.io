import { test, expect } from '@playwright/test';

const base = 'http://127.0.0.1:4173';
const routes = ['/', '/leistungen.html', '/projekte.html', '/ueber-uns.html', '/kontakt.html', '/impressum.html', '/datenschutz.html', '/en/', '/en/services.html', '/en/projects.html', '/en/about-us.html', '/en/contact.html', '/en/legal-notice.html', '/en/privacy-policy.html'];

for (const route of routes) test(`${route} loads without console or image errors`, async ({ page }) => {
  const errors = [];
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', error => errors.push(error.message));
  const response = await page.goto(base + route, { waitUntil: 'networkidle' });
  expect(response.status()).toBe(200);
  expect(await page.locator('h1').count()).toBe(1);
  await expect(page.locator('header')).toBeVisible();
  const broken = await page.locator('img[src]').evaluateAll(images => images.filter(img => img.complete && img.naturalWidth === 0).map(img => img.src));
  expect(broken).toEqual([]);
  expect(errors).toEqual([]);
});

test('mobile navigation, gallery, consent and form interactions work', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + '/kontakt.html');
  await page.locator('.dialog-close').click();
  await page.locator('[data-menu-toggle]').click();
  await expect(page.locator('[data-menu-toggle]')).toHaveAttribute('aria-expanded','true');
  await expect(page.locator('.site-nav')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-menu-toggle]')).toHaveAttribute('aria-expanded','false');
  expect(await page.locator('[data-map] iframe').count()).toBe(0);
  await page.locator('[data-contact-form] button[type=submit]').click();
  await expect(page.locator('[data-form-status]')).toContainText('Pflichtfelder');
  await page.goto(base + '/projekte.html');
  await page.locator('.dialog-close').click();
  await page.locator('[data-filter="glasfaser"]').click();
  await expect(page.locator('[data-filter="glasfaser"]')).toHaveAttribute('aria-pressed','true');
  await page.locator('.project-card:not([hidden])').first().click();
  await expect(page.locator('[data-lightbox]')).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-lightbox]')).not.toBeVisible();
});
