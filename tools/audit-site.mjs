import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const pages = [
  'index.html','leistungen.html','projekte.html','ueber-uns.html','kontakt.html','impressum.html','datenschutz.html','404.html',
  'en/index.html','en/services.html','en/projects.html','en/about-us.html','en/contact.html','en/legal-notice.html','en/privacy-policy.html','en/404.html'
];
const errors = [];
const localRef = /(?:href|src)="([^"#]+)"/g;

for (const page of pages) {
  const abs = resolve(root,page); const html = readFileSync(abs,'utf8');
  const expectedLang = page.startsWith('en/') ? 'en' : 'de';
  const checks = [
    [new RegExp(`<html lang="${expectedLang}">`), 'incorrect or missing lang'],
    [/<title>[^<]+<\/title>/, 'missing title'],
    [/<meta name="description" content="[^"]+">/, 'missing description'],
    [/<link rel="canonical" href="https:\/\/www\.yildiz-tn\.de[^"]+">/, 'missing canonical'],
    [/<link rel="alternate" hreflang="de"/, 'missing DE hreflang'],
    [/<link rel="alternate" hreflang="en"/, 'missing EN hreflang'],
    [/<meta property="og:locale"/, 'missing OG locale'],
    [/<script type="application\/ld\+json">/, 'missing JSON-LD']
  ];
  checks.forEach(([rx,msg]) => { if (!rx.test(html)) errors.push(`${page}: ${msg}`); });
  const h1 = (html.match(/<h1(?:\s[^>]*)?>/g)||[]).length;
  if (h1 !== 1) errors.push(`${page}: expected one H1, found ${h1}`);
  for (const match of html.matchAll(localRef)) {
    const value = match[1];
    if (/^(?:https?:|mailto:|tel:|#)/.test(value) || value.includes('${')) continue;
    const clean = value.split(/[?#]/)[0];
    if (!existsSync(resolve(dirname(abs),clean))) errors.push(`${page}: missing local target ${value}`);
  }
  for (const json of html.matchAll(/<script type="application\/ld\+json">([^<]+)<\/script>/g)) {
    try { JSON.parse(json[1]); } catch (error) { errors.push(`${page}: invalid JSON-LD (${error.message})`); }
  }
}

const pairs = [
  ['index.html','en/index.html'],['leistungen.html','en/services.html'],['projekte.html','en/projects.html'],['ueber-uns.html','en/about-us.html'],['kontakt.html','en/contact.html'],['impressum.html','en/legal-notice.html'],['datenschutz.html','en/privacy-policy.html']
];
for (const [de,en] of pairs) {
  const a=readFileSync(resolve(root,de),'utf8'), b=readFileSync(resolve(root,en),'utf8');
  for (const selector of ['<header','<footer','class="language-switch"']) {
    if (!a.includes(selector)||!b.includes(selector)) errors.push(`${de} ↔ ${en}: shell parity failed for ${selector}`);
  }
}

if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Audit passed: ${pages.length} pages, ${pairs.length} language pairs, local assets/links, SEO and JSON-LD.`);
