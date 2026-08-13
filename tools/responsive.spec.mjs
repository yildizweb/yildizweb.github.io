import { test, expect } from '@playwright/test';

const base = 'http://127.0.0.1:4173';
const routes = [
  ['de-home','/'],['de-services','/leistungen.html'],['de-projects','/projekte.html'],['de-about','/ueber-uns.html'],
  ['de-contact','/kontakt.html'],['de-legal','/impressum.html'],['de-privacy','/datenschutz.html'],['de-404','/404.html'],
  ['en-home','/en/'],['en-services','/en/services.html'],['en-projects','/en/projects.html'],['en-about','/en/about-us.html'],
  ['en-contact','/en/contact.html'],['en-legal','/en/legal-notice.html'],['en-privacy','/en/privacy-policy.html'],['en-404','/en/404.html']
];
const viewports = [320,375,390,768,1024,1366,1440,1920].map(width => ({ width, height: width < 600 ? 844 : width < 1100 ? 900 : 1080 }));
const qaDir = process.env.QA_DIR || '';
test.describe.configure({ mode: 'parallel' });

async function settlePage(page) {
  await page.locator('.dialog-close').click().catch(() => {});
  await page.evaluate(async () => {
    const step = Math.max(320, Math.round(innerHeight * .7));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      scrollTo(0, y);
      await new Promise(resolve => setTimeout(resolve, 18));
    }
    scrollTo(0, 0);
  });
  await page.waitForTimeout(80);
}

async function layoutProblems(page) {
  return page.evaluate(() => {
    const root = document.documentElement;
    const issues = [];
    if (root.scrollWidth > root.clientWidth + 1) issues.push(`document overflow ${root.scrollWidth}/${root.clientWidth}`);
    const meaningful = [...document.querySelectorAll('h1,h2,h3,p,a,button,label,li,strong,article,nav,header,footer,form,input,select,textarea,img,video')];
    for (const el of meaningful) {
      const style = getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0 || !el.getClientRects().length) continue;
      if (el.closest('.site-nav') && matchMedia('(max-width:1050px)').matches && !document.body.classList.contains('nav-open')) continue;
      if (el.closest('.fleet-mosaic,.honeypot')) continue;
      const rect = el.getBoundingClientRect();
      if (rect.width > 2 && (rect.left < -1 || rect.right > root.clientWidth + 1)) {
        issues.push(`${el.tagName.toLowerCase()}.${el.className || '-'} bounds ${rect.left.toFixed(1)}..${rect.right.toFixed(1)}`);
      }
      const isTextControl = el.matches('p,a,button,label,li,strong,input,select,textarea');
      if (isTextControl && el.scrollWidth > el.clientWidth + 2 && !['auto','scroll'].includes(style.overflowX)) {
        issues.push(`${el.tagName.toLowerCase()}.${el.className || '-'} internal-x ${el.scrollWidth}/${el.clientWidth}`);
      }
      if (isTextControl && el.scrollHeight > el.clientHeight + 2 && ['hidden','clip'].includes(style.overflowY)) {
        issues.push(`${el.tagName.toLowerCase()}.${el.className || '-'} clipped-y ${el.scrollHeight}/${el.clientHeight}`);
      }
    }
    return [...new Set(issues)].slice(0, 30);
  });
}

for (const [name, route] of routes) {
  for (const viewport of viewports) {
    test(`${name} ${viewport.width}px has no responsive defects`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      const consoleErrors = [];
      const failedRequests = [];
      page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
      page.on('pageerror', error => consoleErrors.push(error.message));
      page.on('requestfailed', request => failedRequests.push(`${request.method()} ${request.url()} ${request.failure()?.errorText || ''}`));
      const response = await page.goto(base + route, { waitUntil: 'networkidle' });
      expect(response?.status()).toBe(200);
      await settlePage(page);
      const broken = await page.locator('img[src]').evaluateAll(images => images.filter(img => img.complete && img.naturalWidth === 0).map(img => img.src));
      const videoBroken = await page.locator('video').evaluateAll(videos => videos.filter(video => video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE).map(video => video.currentSrc));
      if (qaDir) await page.screenshot({ path: `${qaDir}/${name}-${viewport.width}.png`, fullPage: true });
      expect(await page.evaluate(() => document.fonts.check('800 32px "Barlow Condensed"'))).toBe(true);
      expect(await layoutProblems(page)).toEqual([]);
      expect(broken).toEqual([]);
      expect(videoBroken).toEqual([]);
      expect(consoleErrors).toEqual([]);
      expect(failedRequests).toEqual([]);
    });
  }
}

test('interactive states remain inside a 320px viewport', async ({ page }) => {
  await page.setViewportSize({ width:320, height:844 });
  await page.goto(base + '/en/contact.html');
  await page.locator('.dialog-close').click();
  await page.locator('[data-menu-toggle]').click();
  expect(await layoutProblems(page)).toEqual([]);
  await page.keyboard.press('Escape');
  await page.locator('[data-contact-form] button[type=submit]').click();
  expect(await layoutProblems(page)).toEqual([]);
  await page.locator('[data-open-consent]').first().click();
  expect(await layoutProblems(page)).toEqual([]);
  await page.locator('.dialog-close').click();
  await page.goto(base + '/en/projects.html');
  await page.locator('.dialog-close').click();
  await page.locator('.project-card').first().click();
  expect(await layoutProblems(page)).toEqual([]);
});
