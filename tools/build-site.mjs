import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const base = 'https://www.yildiz-tn.de';

const routes = {
  home: { de: 'index.html', en: 'en/index.html' },
  services: { de: 'leistungen.html', en: 'en/services.html' },
  projects: { de: 'projekte.html', en: 'en/projects.html' },
  about: { de: 'ueber-uns.html', en: 'en/about-us.html' },
  contact: { de: 'kontakt.html', en: 'en/contact.html' },
  legal: { de: 'impressum.html', en: 'en/legal-notice.html' },
  privacy: { de: 'datenschutz.html', en: 'en/privacy-policy.html' }
};

const common = {
  de: {
    skip: 'Zum Inhalt springen', nav: ['Start', 'Leistungen', 'Projekte', 'Über uns', 'Kontakt'],
    request: 'Projekt anfragen', phone: 'Telefon', email: 'E-Mail', pages: 'Seiten', services: 'Leistungen', legal: 'Rechtliches',
    privacy: 'Datenschutz', notice: 'Impressum', settings: 'Datenschutzeinstellungen', rights: 'Alle Rechte vorbehalten.',
    footer: 'Glasfaser-, Tief- und Straßenbau mit direkter Begleitung auf der Baustelle.', menuOpen: 'Menü öffnen', menuClose: 'Menü schließen',
    cookieTitle: 'Datenschutz nach Ihrer Wahl', cookieText: 'Notwendige Funktionen sind immer aktiv. Google Maps laden wir nur mit Ihrer Einwilligung.',
    accept: 'Alle akzeptieren', reject: 'Nur notwendige', options: 'Einstellungen', save: 'Auswahl speichern', necessary: 'Technisch erforderlich (immer aktiv)', external: 'Externe Inhalte (Google Maps)',
    top: 'Nach oben', whatsapp: 'Kontakt über WhatsApp', crumbHome: 'Startseite'
  },
  en: {
    skip: 'Skip to content', nav: ['Home', 'Services', 'Projects', 'About us', 'Contact'],
    request: 'Request a project consultation', phone: 'Phone', email: 'Email', pages: 'Pages', services: 'Services', legal: 'Legal',
    privacy: 'Privacy policy', notice: 'Legal notice', settings: 'Privacy settings', rights: 'All rights reserved.',
    footer: 'Fibre-optic, civil engineering and road construction with direct on-site support.', menuOpen: 'Open menu', menuClose: 'Close menu',
    cookieTitle: 'Privacy on your terms', cookieText: 'Essential functions are always active. We only load Google Maps with your consent.',
    accept: 'Accept all', reject: 'Essential only', options: 'Settings', save: 'Save selection', necessary: 'Technically essential (always active)', external: 'External content (Google Maps)',
    top: 'Back to top', whatsapp: 'Contact us via WhatsApp', crumbHome: 'Home'
  }
};

const pageMeta = {
  home: {
    de: ['YILDIZ Tief & Netzausbau GmbH | Glasfaser, Tiefbau & Straßenbau', 'YILDIZ aus Darmstadt: Glasfaserausbau, Tiefbau und Straßenbau mit fachgerechter Oberflächenwiederherstellung – deutschlandweit im Einsatz.'],
    en: ['YILDIZ Tief & Netzausbau GmbH | Fibre Optics, Civil & Road Construction', 'YILDIZ in Darmstadt delivers fibre-optic, civil engineering and road construction services with professional surface reinstatement across Germany.']
  },
  services: {
    de: ['Leistungen | YILDIZ Tief & Netzausbau GmbH', 'Tiefbau, Trassenbau, Glasfaser, Hausanschlüsse, Leerrohrsysteme, Straßenbau und Oberflächenwiederherstellung aus einer Hand.'],
    en: ['Services | YILDIZ Tief & Netzausbau GmbH', 'Civil engineering, routes, fibre optics, house connections, duct systems, road construction and professional surface reinstatement.']
  },
  projects: {
    de: ['Projekte & Referenzen | YILDIZ Tief & Netzausbau GmbH', 'Echte Einblicke in Glasfaser-, Tiefbau- und Oberflächenarbeiten sowie bestätigte Projekterfahrung von YILDIZ.'],
    en: ['Projects & References | YILDIZ Tief & Netzausbau GmbH', 'Real insights into fibre-optic, civil engineering and surface works, plus confirmed project experience at YILDIZ.']
  },
  about: {
    de: ['Über uns | YILDIZ Tief & Netzausbau GmbH', 'Seit 2019 im Tief- und Netzausbau: die Entwicklung von Yildiz BBS zur YILDIZ Tief & Netzausbau GmbH.'],
    en: ['About us | YILDIZ Tief & Netzausbau GmbH', 'Working in underground and network infrastructure since 2019: from Yildiz BBS to YILDIZ Tief & Netzausbau GmbH.']
  },
  contact: {
    de: ['Kontakt | YILDIZ Tief & Netzausbau GmbH', 'Projektanfrage an YILDIZ in Darmstadt: telefonisch, per E-Mail, WhatsApp oder über das vorbereitete Kontaktformular.'],
    en: ['Contact | YILDIZ Tief & Netzausbau GmbH', 'Contact YILDIZ in Darmstadt about your project by phone, email, WhatsApp or using the prepared enquiry form.']
  },
  legal: {
    de: ['Impressum | YILDIZ Tief & Netzausbau GmbH', 'Anbieterkennzeichnung und Kontaktangaben der YILDIZ Tief & Netzausbau GmbH.'],
    en: ['Legal notice | YILDIZ Tief & Netzausbau GmbH', 'Provider identification and contact details for YILDIZ Tief & Netzausbau GmbH.']
  },
  privacy: {
    de: ['Datenschutzerklärung | YILDIZ Tief & Netzausbau GmbH', 'Informationen zur Verarbeitung personenbezogener Daten auf der Website der YILDIZ Tief & Netzausbau GmbH.'],
    en: ['Privacy policy | YILDIZ Tief & Netzausbau GmbH', 'Information about the processing of personal data on the YILDIZ Tief & Netzausbau GmbH website.']
  }
};

const navKeys = ['home', 'services', 'projects', 'about', 'contact'];
const href = (lang, key) => lang === 'de' ? routes[key].de : `../${routes[key].en}`.replace('../en/index.html', 'index.html').replace('../en/', '');
const asset = (lang, path) => `${lang === 'en' ? '../' : ''}${path}`;
const canonicalPath = (path) => path === 'index.html' ? '/' : `/${path}`;

function header(lang, key) {
  const c = common[lang];
  const brandHome = href(lang, 'home');
  return `<a class="skip-link" href="#main-content">${c.skip}</a>
  <header class="site-header" id="top">
    <div class="contact-rail"><div class="container"><a href="tel:+491776701414">+49 177 670 1414</a><a href="mailto:info@yildiz-tn.de">info@yildiz-tn.de</a></div></div>
    <div class="container nav-shell">
      <a class="brand" href="${brandHome}" aria-label="${c.nav[0]}"><img src="${asset(lang, 'assets/brand/yildiz-logo-white.webp')}" width="900" height="254" alt="YILDIZ Tief &amp; Netzausbau GmbH"></a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-menu-toggle data-label-open="${c.menuOpen}" data-label-close="${c.menuClose}" aria-label="${c.menuOpen}"><span></span><span></span><span></span></button>
      <nav class="site-nav" id="site-nav" aria-label="${lang === 'de' ? 'Hauptnavigation' : 'Main navigation'}"><ul>${navKeys.map((k,i) => `<li><a href="${href(lang,k)}"${k === key ? ' aria-current="page"' : ''}>${c.nav[i]}</a></li>`).join('')}</ul>
        <div class="mobile-actions"><div class="language-switch" aria-label="${lang === 'de' ? 'Sprache wählen' : 'Choose language'}">${languageLinks(lang,key)}</div><a class="btn btn-primary" href="${href(lang,'contact')}#anfrage">${c.request}</a></div>
      </nav>
      <div class="desktop-tools"><div class="language-switch" aria-label="${lang === 'de' ? 'Sprache wählen' : 'Choose language'}">${languageLinks(lang,key)}</div><a class="btn btn-primary btn-small" href="${href(lang,'contact')}#anfrage">${c.request}</a></div>
    </div>
  </header>`;
}

function languageLinks(lang, key) {
  const dePath = lang === 'de' ? routes[key].de : `../${routes[key].de}`;
  const enPath = lang === 'de' ? routes[key].en : routes[key].en.replace('en/','');
  return `<a href="${dePath}" lang="de" hreflang="de"${lang === 'de' ? ' aria-current="true"' : ''}>DE</a><span aria-hidden="true">|</span><a href="${enPath}" lang="en" hreflang="en"${lang === 'en' ? ' aria-current="true"' : ''}>EN</a>`;
}

function footer(lang) {
  const c = common[lang];
  return `<footer class="site-footer"><div class="container footer-grid">
    <div class="footer-brand"><img src="${asset(lang,'assets/brand/yildiz-logo-white.webp')}" width="900" height="254" alt="YILDIZ Tief &amp; Netzausbau GmbH"><p>${c.footer}</p><a class="btn btn-primary" href="${href(lang,'contact')}#anfrage">${c.request}</a></div>
    <nav aria-label="${c.pages}"><h2>${c.pages}</h2>${navKeys.map((k,i)=>`<a href="${href(lang,k)}">${c.nav[i]}</a>`).join('')}</nav>
    <nav aria-label="${c.services}"><h2>${c.services}</h2><a href="${href(lang,'services')}#tiefbau">${lang==='de'?'Tiefbau & Trassenbau':'Civil engineering & routes'}</a><a href="${href(lang,'services')}#glasfaser">${lang==='de'?'Glasfaserausbau':'Fibre-optic deployment'}</a><a href="${href(lang,'services')}#oberflaechen">${lang==='de'?'Oberflächen':'Surface reinstatement'}</a></nav>
    <div><h2>${lang==='de'?'Direkter Kontakt':'Direct contact'}</h2><address>Heidelberger Straße 14<br>64283 Darmstadt<br>Deutschland</address><a href="tel:+491776701414">+49 177 670 1414</a><a href="mailto:info@yildiz-tn.de">info@yildiz-tn.de</a></div>
  </div><div class="container footer-bottom"><p>© <span data-year>2026</span> YILDIZ Tief &amp; Netzausbau GmbH. ${c.rights}</p><div><a href="${href(lang,'legal')}">${c.notice}</a><a href="${href(lang,'privacy')}">${c.privacy}</a><button type="button" data-open-consent>${c.settings}</button></div><p>${lang==='de'?'Webdesign von':'Web design by'} <a href="https://aslandigital.tr" target="_blank" rel="noopener noreferrer">Aslan Digital</a></p></div></footer>
  <a class="quick-contact" href="https://wa.me/491776701414" target="_blank" rel="noopener noreferrer" aria-label="${c.whatsapp}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12.04 2a9.84 9.84 0 0 0-8.42 14.92L2.05 22l5.2-1.53A9.94 9.94 0 1 0 12.04 2Zm0 17.98a8.05 8.05 0 0 1-4.1-1.12l-.3-.18-3.08.91.92-3-.2-.31A8.03 8.03 0 1 1 12.04 20Zm4.42-6.02c-.24-.12-1.44-.71-1.66-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2a7.27 7.27 0 0 1-1.34-1.67c-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.47-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.39 1.37.5.58.18 1.1.16 1.51.1.46-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z"/></svg></a><button class="to-top" type="button" data-to-top aria-label="${c.top}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 14 6-6 6 6"/></svg></button>
  <dialog class="consent-dialog" data-consent-dialog aria-labelledby="consent-title"><form method="dialog"><button class="dialog-close" value="cancel" aria-label="${lang==='de'?'Schließen':'Close'}">×</button><p class="eyebrow">${c.privacy}</p><h2 id="consent-title">${c.cookieTitle}</h2><p>${c.cookieText}</p><div class="consent-options" data-consent-options hidden><label><input type="checkbox" checked disabled> ${c.necessary}</label><label><input type="checkbox" data-external-media> ${c.external}</label></div><div class="dialog-actions"><button class="btn btn-primary" value="accept" data-consent-accept>${c.accept}</button><button class="btn btn-secondary" value="reject" data-consent-reject>${c.reject}</button><button class="btn btn-ghost" value="settings" data-consent-save data-label-save="${c.save}">${c.options}</button></div></form></dialog>`;
}

function head(lang,key) {
  const route = routes[key][lang]; const [title, description] = pageMeta[key][lang]; const other = lang === 'de' ? routes[key].en : routes[key].de;
  const currentUrl = `${base}${canonicalPath(route)}`; const deUrl = `${base}${canonicalPath(routes[key].de)}`; const enUrl = `${base}${canonicalPath(routes[key].en)}`;
  const heroPreload = key === 'home' ? `<link rel="preload" as="image" href="${asset(lang,'assets/images/stock/fibre-optic-hero-poster.webp')}" fetchpriority="high">` : '';
  return `<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title><meta name="description" content="${description}"><meta name="theme-color" content="#111921"><meta name="robots" content="index,follow,max-image-preview:large"><link rel="canonical" href="${currentUrl}"><link rel="alternate" hreflang="de" href="${deUrl}"><link rel="alternate" hreflang="en" href="${enUrl}"><link rel="alternate" hreflang="x-default" href="${deUrl}"><meta property="og:type" content="website"><meta property="og:site_name" content="YILDIZ Tief &amp; Netzausbau GmbH"><meta property="og:locale" content="${lang==='de'?'de_DE':'en_GB'}"><meta property="og:locale:alternate" content="${lang==='de'?'en_GB':'de_DE'}"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:url" content="${currentUrl}"><meta property="og:image" content="${base}/assets/images/stock/fibre-optic-hero-poster.webp"><meta property="og:image:alt" content="${lang==='de'?'Leuchtende Glasfaserleitungen':'Illuminated fibre-optic strands'}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${title}"><meta name="twitter:description" content="${description}"><meta name="twitter:image" content="${base}/assets/images/stock/fibre-optic-hero-poster.webp"><link rel="icon" href="${asset(lang,'favicon.ico')}" sizes="any"><link rel="icon" type="image/png" sizes="32x32" href="${asset(lang,'assets/icons/favicon-32.png')}"><link rel="icon" type="image/png" sizes="16x16" href="${asset(lang,'assets/icons/favicon-16.png')}"><link rel="apple-touch-icon" href="${asset(lang,'assets/icons/apple-touch-icon.png')}"><link rel="manifest" href="${asset(lang,'site.webmanifest')}">${heroPreload}<link rel="stylesheet" href="${asset(lang,'assets/css/site.css')}">`;
}

function schema(lang,key) {
  return `<script type="application/ld+json">${JSON.stringify({
    '@context':'https://schema.org','@type':'LocalBusiness','@id':`${base}/#organisation`,name:'YILDIZ Tief & Netzausbau GmbH',legalName:'Yildiz Tief & Netzausbau GmbH',url:`${base}/`,logo:`${base}/assets/brand/yildiz-logo-carbon.webp`,image:`${base}/assets/images/stock/fibre-optic-hero-poster.webp`,telephone:'+49 177 670 1414',email:'info@yildiz-tn.de',description:pageMeta[key][lang][1],inLanguage:lang==='de'?'de-DE':'en-GB',areaServed:{'@type':'Country',name:lang==='de'?'Deutschland':'Germany'},address:{'@type':'PostalAddress',streetAddress:'Heidelberger Straße 14',postalCode:'64283',addressLocality:'Darmstadt',addressCountry:'DE'}
  })}</script>`;
}

function shell(lang,key,main, bodyClass='') {
  return `<!doctype html><html lang="${lang}"><head>${head(lang,key)}</head><body class="${bodyClass}" data-lang="${lang}" data-page="${key}">${header(lang,key)}<main id="main-content">${main}</main>${footer(lang)}${schema(lang,key)}<script src="${asset(lang,'assets/js/site.js')}" defer></script></body></html>`;
}

const img = (lang, file, alt, cls='') => {
  const stockSwap = {
    'Media/Images/Progress/Road/Road-DeConstruct-2-1200w.webp': 'assets/images/stock/urban-trenching.webp',
    'Media/Images/Team/Team-InAction-2-1200w.webp': 'assets/images/stock/construction-planning.webp',
    'Media/Images/Finished/MVT-Board-Closed-1200w.webp': 'assets/images/stock/fibre-testing.webp',
    'Media/Images/Security/Security-Road-1-1200w.webp': 'assets/images/stock/road-paving-germany.webp'
  };
  file = stockSwap[file] || file;
  const responsive = file.endsWith('-1200w.webp') ? ` srcset="${asset(lang,file.replace('-1200w.webp','-480w.webp'))} 480w, ${asset(lang,file.replace('-1200w.webp','-768w.webp'))} 768w, ${asset(lang,file)} 1200w" sizes="(max-width: 720px) 92vw, (max-width: 1050px) 48vw, 31vw"` : '';
  return `<img class="${cls}" src="${asset(lang,file)}"${responsive} alt="${alt}" width="1200" height="1600" loading="lazy" decoding="async">`;
};
const icon = (n) => `<svg class="service-icon" aria-hidden="true" viewBox="0 0 48 48"><path d="${[
  'M8 36h32M12 31l7-19h10l7 19M17 24h14M24 12v19',
  'M7 34c8-18 26-18 34 0M11 34h26M15 28l9-15 9 15',
  'M8 34h32M12 29h24M16 24h16M20 19h8M24 9v10',
  'M7 33h34M10 26h28M14 19h20M18 12h12'
][n]}"/></svg>`;

const serviceText = {
  de: [
    ['Tiefbau & Trassenbau','Kontrollierte Erd- und Grabenarbeiten für belastbare Leitungswege – abgestimmt auf Baustelle, Bestand und Oberfläche.'],
    ['Glasfaserausbau','Verlegung von Glasfaserkabeln und Leerrohrsystemen, Hausanschlüsse, Kabelverlängerungen sowie MVT-/MFG- und Schachtlösungen.'],
    ['Straßenbau & Oberfläche','Fachgerechte Wiederherstellung von Asphalt-, Pflaster- und weiteren beanspruchten Oberflächen nach dem Leitungsbau.'],
    ['Baustellenbegleitung','Direkte Koordination und persönliche Begleitung durch den Geschäftsführer – von der Abstimmung bis zur Übergabe.']
  ],
  en: [
    ['Civil engineering & routes','Controlled excavation and trenching for resilient cable routes, coordinated with the site, existing infrastructure and surface.'],
    ['Fibre-optic deployment','Installation of fibre-optic cables and duct systems, house connections, cable extensions plus MVT/MFG cabinets and chamber solutions.'],
    ['Road construction & surfaces','Professional reinstatement of asphalt, paving and other working surfaces after underground infrastructure works.'],
    ['On-site project support','Direct coordination and personal support from the managing director, from initial planning through to handover.']
  ]
};

const gallery = [
  ['Media/Images/Team/Team-InAction-3-1200w.webp','glasfaser','Verlegung von Glasfaserkabeln im vorbereiteten Leitungsweg','Fibre-optic cables being installed in a prepared route'],
  ['Media/Images/Progress/Cable/Cable-Placement-0-B-1200w.webp','glasfaser','Leerrohrsysteme während der Verlegearbeiten','Duct systems during installation'],
  ['Media/Images/Progress/Road/Road-DeConstruct-0-B-1200w.webp','tiefbau','Geöffnete Oberfläche für Leitungsarbeiten','Surface opened for underground infrastructure works'],
  ['Media/Images/Finished/Bus-Station-Finished-1200w.webp','oberflaeche','Wiederhergestellte Pflasterfläche nach Abschluss der Arbeiten','Paved surface reinstated after completion'],
  ['Media/Images/Finished/Cable-Beton-Finished-1200w.webp','oberflaeche','Abgeschlossene Oberflächenwiederherstellung','Completed surface reinstatement'],
  ['Media/Images/Finished/MVT-Board-Open-1200w.webp','technik','Geöffneter Netzverteiler im Arbeitsprozess','Open network cabinet during works'],
  ['Media/Images/Team/Team-InAction-1-1200w.webp','team','YILDIZ Team bei Arbeiten an einer innerstädtischen Trasse','YILDIZ team working on an urban route'],
  ['Media/Images/Security/Security-Road-2-1200w.webp','tiefbau','Abgesicherter Arbeitsbereich im Straßenraum','Secured work area in a public road']
];

function serviceCards(lang) { return `<div class="service-grid">${serviceText[lang].map((s,i)=>`<article class="service-card" data-reveal>${icon(i)}<span>0${i+1}</span><h3>${s[0]}</h3><p>${s[1]}</p><a href="${href(lang,'services')}#${['tiefbau','glasfaser','oberflaechen','begleitung'][i]}">${lang==='de'?'Details ansehen':'View details'} <b aria-hidden="true">↗</b></a></article>`).join('')}</div>`; }

function references(lang) {
  const items = lang === 'de' ? [
    ['Klenk & Sohn','Bergstraße & Main-Kinzig-Kreis','Glasfaser- und Leerrohrarbeiten in Alsbach-Hähnlein, Bensheim und Auerbach sowie weitere Glasfaserprojekte im MKK.'],
    ['Klinkspiegel / Merck','Seit 2019','Projekterfahrung im Umfeld von Merck. Die Darstellung benennt den bestätigten Projektzusammenhang, nicht pauschal eine Partnerschaft.'],
    ['GHT','Raum Offenbach','Projektarbeiten im Raum Offenbach innerhalb des bestätigten Leistungsspektrums.'],
    ['Euronet','Odenwald','Glasfaserausbau im Odenwald im aktuellen Projektkontext.']
  ] : [
    ['Klenk & Sohn','Bergstraße & Main-Kinzig district','Fibre-optic and duct works in Alsbach-Hähnlein, Bensheim and Auerbach, plus further fibre projects in the Main-Kinzig district.'],
    ['Klinkspiegel / Merck','Since 2019','Project experience in connection with Merck. This wording describes the confirmed project context and does not imply a general partnership.'],
    ['GHT','Offenbach area','Project work in the Offenbach area within the confirmed scope of services.'],
    ['Euronet','Odenwald','Fibre-optic deployment in the Odenwald within the current project context.']
  ];
  return `<div class="reference-grid">${items.map((x,i)=>`<article class="reference-card" data-reveal><span>0${i+1}</span><h3>${x[0]}</h3><p class="reference-region">${x[1]}</p><p>${x[2]}</p></article>`).join('')}</div>`;
}

function galleryBlock(lang, limit=8) {
  const filters = lang==='de' ? [['all','Alle'],['glasfaser','Glasfaser'],['tiefbau','Tiefbau'],['oberflaeche','Straßenbau / Oberfläche'],['team','Team'],['technik','Technik']] : [['all','All'],['glasfaser','Fibre optics'],['tiefbau','Civil engineering'],['oberflaeche','Roads / surfaces'],['team','Team'],['technik','Technology']];
  return `<div class="gallery-filters" role="group" aria-label="${lang==='de'?'Projektfotos filtern':'Filter project photos'}">${filters.map((f,i)=>`<button type="button" class="filter-button${i===0?' is-active':''}" data-filter="${f[0]}" aria-pressed="${i===0}">${f[1]}</button>`).join('')}</div><div class="project-grid" data-gallery>${gallery.slice(0,limit).map((g,i)=>`<button type="button" class="project-card" data-category="${g[1]}" data-index="${i}" data-src="${asset(lang,g[0])}" data-caption="${g[lang==='de'?2:3]}">${img(lang,g[0],g[lang==='de'?2:3])}<span>${g[lang==='de'?2:3]}</span></button>`).join('')}</div>
  <dialog class="lightbox" data-lightbox aria-label="${lang==='de'?'Bildansicht':'Image viewer'}"><button type="button" class="lightbox-close" data-lightbox-close aria-label="${lang==='de'?'Bildansicht schließen':'Close image viewer'}">×</button><button type="button" class="lightbox-prev" data-lightbox-prev aria-label="${lang==='de'?'Vorheriges Bild':'Previous image'}">←</button><figure><img data-lightbox-image alt=""><figcaption><span data-lightbox-caption></span><small data-lightbox-count></small></figcaption></figure><button type="button" class="lightbox-next" data-lightbox-next aria-label="${lang==='de'?'Nächstes Bild':'Next image'}">→</button></dialog>`;
}

function cta(lang) { return `<section class="section final-cta"><div class="container"><p class="eyebrow">${lang==='de'?'Direkt vor Ort':'Directly on site'}</p><h2>${lang==='de'?'Sprechen wir über Ihr nächstes Projekt.':'Let’s discuss your next project.'}</h2><p>${lang==='de'?'Klare Abstimmung, verlässliche Ausführung und ein direkter Ansprechpartner.':'Clear coordination, reliable delivery and one direct point of contact.'}</p><div class="button-row"><a class="btn btn-primary" href="${href(lang,'contact')}#anfrage">${common[lang].request}</a><a class="text-link" href="tel:+491776701414">+49 177 670 1414</a><a class="text-link" href="mailto:info@yildiz-tn.de">info@yildiz-tn.de</a></div></div></section>`; }

function pageHero(lang, eyebrow, title, text) {
  let image = 'assets/images/stock/urban-trenching.webp';
  if (/Projekte|Projects/.test(eyebrow)) image = 'Media/Images/Finished/Bus-Station-6-1200w.webp';
  if (/Über YILDIZ|About YILDIZ/.test(eyebrow)) image = 'assets/images/stock/construction-planning.webp';
  if (/Kontakt|Contact/.test(eyebrow)) image = 'assets/images/stock/fibre-testing.webp';
  if (/Rechtliches|Legal/.test(eyebrow)) image = 'assets/images/stock/fibre-optic-hero-poster.webp';
  return `<section class="page-hero"><div class="page-hero-media">${img(lang,image,'','')}<span></span></div><div class="container page-hero-content"><p class="eyebrow">${eyebrow}</p><h1>${title}</h1><p>${text}</p></div></section>`;
}

function home(lang) {
  const de=lang==='de';
  return `<section class="home-hero"><div class="home-hero-media"><video class="hero-video" autoplay muted loop playsinline preload="metadata" poster="${asset(lang,'assets/images/stock/fibre-optic-hero-poster.webp')}" aria-hidden="true"><source src="${asset(lang,'assets/media/fibre-optic-hero.mp4')}" type="video/mp4"></video><div class="hero-overlay"></div></div><div class="container hero-content"><p class="eyebrow" data-reveal>${de?'Glasfaser · Tiefbau · Straßenbau':'Fibre optics · Civil engineering · Roads'}</p><h1 data-reveal>${de?'TIEFBAU.<br>GLASFASER.<br><em>NETZAUSBAU.</em>':'CIVIL ENGINEERING.<br>FIBRE OPTICS.<br><em>NETWORK INFRASTRUCTURE.</em>'}</h1><p class="hero-lead" data-reveal>${de?'Infrastruktur mit Verantwortung. Von der Trasse bis zur fachgerecht wiederhergestellten Oberfläche.':'Infrastructure built with responsibility. From the route through to professionally reinstated surfaces.'}</p><div class="button-row" data-reveal><a class="btn btn-primary" href="${href(lang,'contact')}#anfrage">${common[lang].request}</a><a class="btn btn-secondary" href="tel:+491776701414">${de?'Direkt anrufen':'Call directly'}</a></div></div><div class="service-index" aria-label="${de?'Leistungsschwerpunkte':'Core services'}"><span>01 ${de?'Glasfaserausbau':'Fibre optics'}</span><span>02 ${de?'Tiefbau':'Civil works'}</span><span>03 ${de?'Straßenbau':'Roads'}</span><span>04 ${de?'Oberflächen':'Surfaces'}</span></div></section>
  <section class="trust-strip"><div class="container"><p>${de?'Qualität':'Quality'}</p><i></i><p>${de?'Zuverlässigkeit':'Reliability'}</p><i></i><p>${de?'Termintreue':'On-time delivery'}</p></div></section>
  <section class="section home-positioning"><div class="container home-positioning-grid"><div class="home-positioning-copy"><p class="eyebrow">${de?'Wenn Infrastruktur zählt':'When infrastructure matters'}</p><h2>${de?'KEINE LÜCKEN.<br><em>EIN KLARER EINSATZ.</em>':'NO GAPS.<br><em>ONE CLEAR OPERATION.</em>'}</h2><p class="lead">${de?'Auf der Baustelle zählt nicht, wie viele Leistungen auf einer Liste stehen. Entscheidend ist, dass Verantwortung greifbar bleibt, Abstimmungen funktionieren und jeder Arbeitsschritt sauber in den nächsten übergeht.':'On site, the length of a service list is not what matters. What matters is clear responsibility, effective coordination and every stage connecting cleanly with the next.'}</p><p>${de?'Genau dafür steht YILDIZ: direkte Kommunikation, fachgerechte Ausführung und ein Ergebnis, das auch nach Abschluss der Arbeiten überzeugt.':'That is what YILDIZ stands for: direct communication, professional execution and a result that remains convincing after the work is complete.'}</p></div><figure data-reveal>${img(lang,'assets/images/stock/urban-trenching.webp',de?'Professionell vorbereitete Tiefbautrasse':'Professionally prepared civil engineering route')}</figure></div></section>
  <section class="section home-commitment"><div class="container commitment-intro"><p class="eyebrow">${de?'Unser Arbeitsversprechen':'Our work commitment'}</p><h2>${de?'WAS AUF DER BAUSTELLE<br>DEN UNTERSCHIED MACHT.':'WHAT MAKES THE<br>DIFFERENCE ON SITE.'}</h2></div><div class="container commitment-grid"><article><span>01</span><h3>${de?'Direkter Draht':'Direct contact'}</h3><p>${de?'Kurze Abstimmungswege und ein erreichbarer Ansprechpartner, wenn Entscheidungen anstehen.':'Short communication paths and an accessible contact when decisions are needed.'}</p></article><article><span>02</span><h3>${de?'Klare Verantwortung':'Clear responsibility'}</h3><p>${de?'Ein Einsatz wird nicht nur begonnen, sondern verbindlich begleitet und sauber zu Ende geführt.':'An operation is not merely started; it is managed reliably through to a clean finish.'}</p></article><article><span>03</span><h3>${de?'Saubere Übergabe':'Clean handover'}</h3><p>${de?'Die fertige Fläche gehört zum Ergebnis. Ordnung und Sorgfalt enden nicht an der Trasse.':'The finished surface is part of the result. Order and care do not end at the route.'}</p></article></div></section>
  <section class="section home-start"><div class="container home-start-grid"><figure>${img(lang,'assets/images/stock/construction-planning.webp',de?'Abstimmung eines Infrastrukturprojekts':'Coordinating an infrastructure project')}</figure><div><p class="eyebrow">${de?'Bereit für den nächsten Einsatz':'Ready for the next operation'}</p><h2>${de?'DREI ANGABEN.<br>EIN DIREKTER START.':'THREE DETAILS.<br>ONE DIRECT START.'}</h2><p>${de?'Für eine erste Einschätzung brauchen wir keine lange Ausschreibung per Kontaktformular. Einsatzort, gewünschter Leistungsumfang und geplanter Zeitraum reichen für den Anfang.':'We do not need a lengthy tender through a contact form for an initial assessment. Location, required scope and planned timeframe are enough to begin.'}</p><ol><li><span>01</span>${de?'Wo findet der Einsatz statt?':'Where will the work take place?'}</li><li><span>02</span>${de?'Was soll ausgeführt werden?':'What work is required?'}</li><li><span>03</span>${de?'Wann soll es losgehen?':'When should it begin?'}</li></ol><div class="button-row"><a class="btn btn-primary" href="${href(lang,'contact')}#anfrage">${de?'Projekt kurz schildern':'Tell us about your project'}</a><a class="text-link" href="tel:+491776701414">+49 177 670 1414</a></div></div></div></section>`;
}

function servicesPage(lang) {
  const de=lang==='de'; const details = de ? [
    ['tiefbau','Tiefbau und Trassenbau','Wir öffnen und sichern Leitungswege, führen Erd- und Grabenarbeiten aus und bereiten die Trasse für die nachfolgenden Gewerke vor.','Arbeitsbereich abstimmen|Oberfläche aufnehmen|Graben und Trasse herstellen|Verfüllung vorbereiten','assets/images/stock/urban-trenching.webp'],
    ['glasfaser','Glasfaserausbau und Leerrohrsysteme','Wir verlegen Glasfaserkabel und Leerrohrsysteme und setzen die dazugehörige unterirdische Infrastruktur fachgerecht um.','Leerrohre verlegen|Glasfaserkabel einbringen|Trassen und Kabel verlängern|Dokumentierte Übergabe','assets/images/stock/fibre-testing.webp'],
    ['anschluesse','Hausanschlüsse und Netzkomponenten','Zum bestätigten Leistungsspektrum gehören Glasfaser-Hausanschlüsse, Kabelverlängerungen, MVT-/MFG-Schränke und Schachtlösungen.','Hauszuführung vorbereiten|Kabelwege herstellen|Netzverteiler einbinden|Schachtlösungen umsetzen','assets/images/stock/fibre-optic-hero-poster.webp'],
    ['oberflaechen','Straßenbau und Oberflächen','Nach den Leitungsarbeiten stellen wir Asphalt-, Pflaster- und weitere betroffene Flächen fachgerecht wieder her.','Unterbau vorbereiten|Pflaster setzen|Asphaltflächen schließen|Arbeitsbereich übergeben','assets/images/stock/road-paving-germany.webp'],
    ['begleitung','Baustellenbegleitung','Die Projektkoordination bleibt direkt und greifbar. Der Geschäftsführer begleitet die Ausführung aktiv und ist auf der Baustelle präsent.','Ablauf abstimmen|Ausführung begleiten|Qualität kontrollieren|Direkt kommunizieren','assets/images/stock/construction-planning.webp']
  ] : [
    ['tiefbau','Civil engineering and route construction','We open and secure cable routes, carry out excavation and trenching, and prepare the route for the work that follows.','Coordinate the work area|Lift existing surfaces|Create trenches and routes|Prepare backfilling','assets/images/stock/urban-trenching.webp'],
    ['glasfaser','Fibre-optic deployment and duct systems','We install fibre-optic cables and duct systems and deliver the associated underground infrastructure works professionally.','Install duct systems|Insert fibre-optic cables|Extend routes and cables|Documented handover','assets/images/stock/fibre-testing.webp'],
    ['anschluesse','House connections and network components','Our confirmed scope includes fibre-optic house connections, cable extensions, MVT/MFG cabinets and chamber solutions.','Prepare building entry|Create cable routes|Integrate network cabinets|Deliver chamber solutions','assets/images/stock/fibre-optic-hero-poster.webp'],
    ['oberflaechen','Road construction and surfaces','After underground works, we professionally reinstate asphalt, paving and other affected working surfaces.','Prepare the sub-base|Lay paving|Close asphalt surfaces|Hand over the work area','assets/images/stock/road-paving-germany.webp'],
    ['begleitung','On-site project support','Project coordination remains direct and accessible. The managing director actively supports delivery and is present on site.','Coordinate the workflow|Support delivery|Check quality|Communicate directly','assets/images/stock/construction-planning.webp']
  ];
  return `${pageHero(lang,de?'Leistungen':'Services',de?'Verbindungen entstehen nicht nur unter der Oberfläche.':'Connections are built on more than what lies underground.',de?'YILDIZ verbindet Tiefbau, Glasfasermontage und Oberflächenwiederherstellung zu einem klar abgestimmten Ablauf.':'YILDIZ combines civil engineering, fibre installation and surface reinstatement in one clearly coordinated workflow.')}<section class="section"><div class="container service-detail-list">${details.map((d,i)=>`<article class="service-detail" id="${d[0]}"><figure>${img(lang,d[4],d[1])}</figure><div><span class="detail-number">0${i+1}</span><h2>${d[1]}</h2><p>${d[2]}</p><ul>${d[3].split('|').map(x=>`<li>${x}</li>`).join('')}</ul><div class="button-row"><a class="text-link" href="${href(lang,'projects')}">${de?'Projektfotos ansehen':'View project photos'} →</a><a class="text-link" href="${href(lang,'contact')}#anfrage">${de?'Leistung anfragen':'Enquire about this service'} →</a></div></div></article>`).join('')}</div></section>${cta(lang)}`;
}

function projectsPage(lang) { const de=lang==='de'; return `${pageHero(lang,de?'Projekte':'Projects',de?'Arbeit, die man sehen kann.':'Work you can see.',de?'Echte Aufnahmen aus Tiefbau, Glasfaserausbau, Technik und Oberflächenwiederherstellung.':'Real images from civil engineering, fibre-optic deployment, network technology and surface reinstatement.','Media/Images/Finished/Bus-Station-6-1200w.webp')}<section class="section"><div class="container section-heading"><p class="eyebrow">${de?'Galerie':'Gallery'}</p><h2>${de?'Von der offenen Trasse bis zur fertigen Fläche.':'From the open route to the finished surface.'}</h2><p>${de?'Die Fotos dokumentieren reale Arbeitsschritte. Kunden und Orte werden nur dort benannt, wo sie bestätigt sind.':'The photographs document real work stages. Clients and locations are only named where they have been confirmed.'}</p></div><div class="container">${galleryBlock(lang,8)}</div></section><section class="section references"><div class="container section-heading"><p class="eyebrow">${de?'Referenzen':'References'}</p><h2>${de?'Bestätigte Projektzusammenhänge.':'Confirmed project contexts.'}</h2></div><div class="container">${references(lang)}<p class="reference-note">${de?'Weitere Referenzen stellen wir im persönlichen Projektgespräch vor.':'We are happy to present further references during a personal project discussion.'}</p></div></section>${cta(lang)}`; }

function aboutPage(lang) { const de=lang==='de'; return `${pageHero(lang,de?'Über YILDIZ':'About YILDIZ',de?'Verantwortung auf jeder Baustelle.':'Responsibility on every construction site.',de?'Kurze Wege, direkte Begleitung und ein Anspruch, der vom ersten Gespräch bis zur fertigen Oberfläche gilt.':'Direct communication, personal site support and a standard that applies from the first conversation to the finished surface.','Media/Images/Team/Team-InAction-1-1200w.webp')}<section class="section story"><div class="container split"><div><p class="eyebrow">${de?'Unsere Entwicklung':'Our development'}</p><h2>${de?'Aus Erfahrung gewachsen. Persönlich geführt.':'Built on experience. Personally managed.'}</h2></div><div><p class="lead">${de?'2019 begann das Unternehmen als Einzelunternehmen unter dem Namen Yildiz BBS. Seit Januar 2026 wird die Arbeit als YILDIZ Tief & Netzausbau GmbH fortgeführt – mit dem bewährten Fokus auf Glasfaserausbau, Tiefbau und Straßenbau.':'The business began in 2019 as the sole proprietorship Yildiz BBS. Since January 2026, the work has continued as YILDIZ Tief & Netzausbau GmbH, retaining its established focus on fibre-optic deployment, civil engineering and road construction.'}</p></div></div><div class="container timeline"><article><strong>2019</strong><h3>${de?'Gründung Yildiz BBS':'Yildiz BBS founded'}</h3><p>${de?'Start als Einzelunternehmen im Tief- und Netzausbau.':'The business starts as a sole proprietorship in underground and network infrastructure.'}</p></article><i aria-hidden="true"></i><article><strong>2026</strong><h3>${de?'Fortführung als GmbH':'Continued as a GmbH'}</h3><p>${de?'Seit Januar 2026 Fortführung der Tätigkeit als YILDIZ Tief & Netzausbau GmbH.':'Since January 2026, operations have continued as YILDIZ Tief & Netzausbau GmbH.'}</p></article></div></section><section class="section founder-profile"><div class="container founder-grid"><figure>${img(lang,'assets/images/ali-derman-yildiz.webp','Ali Derman YILDIZ, Geschäftsführer der YILDIZ Tief & Netzausbau GmbH')}</figure><div><p class="eyebrow">${de?'Geschäftsführer':'Managing director'}</p><h2>Ali Derman YILDIZ</h2><p class="lead">${de?'Gemeinsam. Präzise. Direkt vor Ort.':'Together. Precise. Directly on site.'}</p><p>${de?'Als Geschäftsführer verfolgt Ali Derman YILDIZ die Projekte aktiv und ist direkt auf den Baustellen präsent. Das schafft klare Entscheidungen, kurze Abstimmungswege und persönliche Verantwortung.':'As managing director, Ali Derman YILDIZ actively follows projects and maintains a direct presence on construction sites. This supports clear decisions, short communication paths and personal accountability.'}</p><p>${de?'Er verfügt über eine Ausnahmebewilligung im Straßenbauer-Handwerk. Diese fachliche Qualifikation wird bewusst genau so benannt und nicht als Meistertitel dargestellt.':'He holds a special authorisation in the road construction trade. This professional qualification is intentionally described precisely and is not presented as a master craftsman title.'}</p></div></div></section><section class="section values"><div class="container section-heading"><p class="eyebrow">${de?'Werte':'Values'}</p><h2>${de?'Was unsere Arbeit trägt.':'What our work is built on.'}</h2></div><div class="container value-grid">${(de?[['Qualität','Sorgfalt in jedem sichtbaren und unsichtbaren Arbeitsschritt.'],['Zuverlässigkeit','Klare Zusagen und direkte Kommunikation im Projekt.'],['Termintreue','Abläufe realistisch planen und verbindlich begleiten.'],['Persönliche Begleitung','Ein verantwortlicher Ansprechpartner bleibt nah an der Baustelle.']]:[['Quality','Care in every visible and hidden stage of the work.'],['Reliability','Clear commitments and direct communication throughout the project.'],['On-time delivery','Plan workflows realistically and support them consistently.'],['Personal support','One accountable contact remains close to the construction site.']]).map((x,i)=>`<article><span>0${i+1}</span><h3>${x[0]}</h3><p>${x[1]}</p></article>`).join('')}</div></section><section class="section fleet"><div class="container section-heading"><p class="eyebrow">${de?'Fuhrpark & Technik':'Fleet & technology'}</p><h2>${de?'Passend zum Projekt eingesetzt.':'Deployed to suit each project.'}</h2></div><div class="container fleet-mosaic"><figure>${img(lang,'Media/Images/Progress/Road/Road-DeConstruct-2-1200w.webp',de?'Maschine bei Tiefbauarbeiten':'Machine during civil works')}</figure><figure>${img(lang,'Media/Images/Team/Team-InAction-2-1200w.webp',de?'Baustellenfahrzeug und Team':'Site vehicle and team')}</figure><figure>${img(lang,'Media/Images/Security/Security-Road-1-1200w.webp',de?'Baustellensicherung im Straßenraum':'Worksite safety in a public road')}</figure></div></section>${cta(lang)}`; }

function contactPage(lang) { const de=lang==='de'; return `${pageHero(lang,de?'Kontakt':'Contact',de?'Ihr Projekt. Unser direkter Draht.':'Your project. One direct line.',de?'Schildern Sie uns kurz Ihr Vorhaben. Wir melden uns persönlich zurück und klären die nächsten Schritte.':'Tell us briefly about your project. We will respond personally and clarify the next steps.','Media/Images/Team/Team-InAction-2-1200w.webp')}<section class="section contact-section"><div class="container contact-layout"><aside><p class="eyebrow">${de?'Direkter Kontakt':'Direct contact'}</p><h2>${de?'Ein Ansprechpartner. Kurze Wege.':'One contact. Short communication paths.'}</h2><div class="contact-cards"><a href="tel:+491776701414"><span>${common[lang].phone}</span><strong>+49 177 670 1414</strong></a><a href="mailto:info@yildiz-tn.de"><span>${common[lang].email}</span><strong>info@yildiz-tn.de</strong></a><a href="https://wa.me/491776701414" target="_blank" rel="noopener noreferrer"><span>WhatsApp</span><strong>${de?'Nachricht senden':'Send a message'}</strong></a><div><span>${de?'Adresse':'Address'}</span><strong>Heidelberger Straße 14<br>64283 Darmstadt</strong></div></div></aside><div class="form-panel" id="anfrage"><p class="eyebrow">${de?'Projektanfrage':'Project enquiry'}</p><h2>${de?'Wie können wir Sie unterstützen?':'How can we help?'}</h2><p class="form-note">${de?'Beim Absenden öffnet sich Ihr E-Mail-Programm mit den eingegebenen Daten. Es findet noch keine serverseitige Übermittlung statt.':'Submitting opens your email application with the entered details. No server-side transmission takes place yet.'}</p><form data-contact-form novalidate><div class="honeypot" aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div><div class="form-grid"><label><span>${de?'Name *':'Name *'}</span><input name="name" autocomplete="name" required></label><label><span>${de?'Unternehmen':'Company'}</span><input name="company" autocomplete="organization"></label><label><span>${de?'E-Mail *':'Email *'}</span><input type="email" name="email" autocomplete="email" required></label><label><span>${de?'Telefon':'Phone'}</span><input type="tel" name="phone" autocomplete="tel"></label><label class="full"><span>${de?'Leistungsart':'Type of service'}</span><select name="subject"><option value="">${de?'Bitte wählen':'Please select'}</option>${serviceText[lang].map(x=>`<option>${x[0]}</option>`).join('')}</select></label><label class="full"><span>${de?'Nachricht *':'Message *'}</span><textarea name="message" rows="6" required placeholder="${de?'Projekt, Ort und gewünschter Zeitraum':'Project, location and preferred timeframe'}"></textarea></label></div><label class="form-consent"><input type="checkbox" name="privacy" required><span>${de?`Ich habe die <a href="${href(lang,'privacy')}">Datenschutzerklärung</a> gelesen und stimme der Verarbeitung zur Kontaktaufnahme zu.`:`I have read the <a href="${href(lang,'privacy')}">privacy policy</a> and consent to my details being used to respond to my enquiry.`}</span></label><button class="btn btn-primary" type="submit">${de?'E-Mail vorbereiten':'Prepare email'}</button><p class="form-status" data-form-status aria-live="polite"></p></form></div></div></section><section class="section map-section"><div class="container map-consent" data-map><div><p class="eyebrow">${de?'Standort':'Location'}</p><h2>Heidelberger Straße 14<br>64283 Darmstadt</h2><p>${de?'Die Google-Karte wird erst nach Ihrer ausdrücklichen Zustimmung geladen. Dabei können Daten an Google übertragen werden.':'The Google map is only loaded after your explicit consent. This may transfer data to Google.'}</p><button class="btn btn-dark" type="button" data-load-map>${de?'Google Maps laden':'Load Google Maps'}</button><a class="text-link" href="https://www.google.com/maps/search/?api=1&query=Heidelberger+Stra%C3%9Fe+14%2C+64283+Darmstadt" target="_blank" rel="noopener noreferrer">${de?'Route extern öffnen':'Open directions externally'} ↗</a></div></div></section>`; }

function legalPage(lang) { const de=lang==='de'; return `${pageHero(lang,de?'Rechtliches':'Legal',de?'Impressum':'Legal notice',de?'Anbieterkennzeichnung gemäß § 5 DDG und § 18 MStV.':'Provider identification under section 5 DDG and section 18 MStV.','Media/Images/Finished/Finished-Stone-2-1200w.webp')}<section class="section legal-section"><div class="container legal-content">${de?`<h2>Angaben gemäß § 5 DDG</h2><p><strong>Yildiz Tief &amp; Netzausbau GmbH</strong><br>Heidelberger Straße 14<br>64283 Darmstadt<br>Deutschland</p><h2>Kontakt</h2><p>Telefon: <a href="tel:+491776701414">+49 177 670 1414</a><br>E-Mail: <a href="mailto:info@yildiz-tn.de">info@yildiz-tn.de</a></p><h2>Vertretung und redaktionelle Verantwortung</h2><p>Geschäftsführer und verantwortlich für den Inhalt nach § 18 Abs. 2 MStV:<br><strong>Ali Derman YILDIZ</strong><br>Heidelberger Straße 14, 64283 Darmstadt</p><h2>Verbraucherstreitbeilegung</h2><p>Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>`:`<h2>Provider information under section 5 DDG</h2><p><strong>Yildiz Tief &amp; Netzausbau GmbH</strong><br>Heidelberger Straße 14<br>64283 Darmstadt<br>Germany</p><h2>Contact</h2><p>Phone: <a href="tel:+491776701414">+49 177 670 1414</a><br>Email: <a href="mailto:info@yildiz-tn.de">info@yildiz-tn.de</a></p><h2>Representation and editorial responsibility</h2><p>Managing director and person responsible for content under section 18(2) MStV:<br><strong>Ali Derman YILDIZ</strong><br>Heidelberger Straße 14, 64283 Darmstadt</p><h2>Consumer dispute resolution</h2><p>We are neither obliged nor willing to participate in dispute resolution proceedings before a consumer arbitration board.</p>`}</div></section>`; }

function privacyPage(lang) { const de=lang==='de'; const sections = de ? [
  ['1. Verantwortlicher','Yildiz Tief & Netzausbau GmbH<br>Heidelberger Straße 14, 64283 Darmstadt<br>E-Mail: <a href="mailto:info@yildiz-tn.de">info@yildiz-tn.de</a><br>Telefon: <a href="tel:+491776701414">+49 177 670 1414</a>'],
  ['2. Hosting der Website','Diese Website wird über GitHub Pages bereitgestellt. Beim Aufruf können technisch erforderliche Server-Logdaten wie IP-Adresse, Zeitpunkt, angeforderte Ressource und Browserinformationen verarbeitet werden. Dies dient der sicheren Bereitstellung der Website auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.'],
  ['3. Cookies und lokale Speicherung','Wir verwenden keine Analyse- oder Marketing-Cookies. Ausschließlich Ihre Auswahl zu den Datenschutzeinstellungen wird im Local Storage Ihres Browsers gespeichert, damit die Entscheidung berücksichtigt werden kann.'],
  ['4. Externe Inhalte – Google Maps','Die Karte auf der Kontaktseite wird erst nach Ihrer ausdrücklichen Einwilligung geladen. Erst dann wird eine Verbindung zu Google aufgebaut; dabei können personenbezogene Daten, insbesondere die IP-Adresse, übermittelt werden. Rechtsgrundlage ist Art. 6 Abs. 1 lit. a DSGVO.'],
  ['5. Kontaktaufnahme','Bei einer Kontaktaufnahme per E-Mail, Telefon, WhatsApp-Link oder über die mailto-Funktion des Formulars verarbeiten wir Ihre Angaben zur Bearbeitung des Anliegens. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO bei vorvertraglichen Maßnahmen beziehungsweise Art. 6 Abs. 1 lit. f DSGVO aufgrund unseres Interesses an der Bearbeitung Ihrer Anfrage. Das Formular sendet keine Daten an einen Website-Server.'],
  ['6. Speicherdauer','Personenbezogene Daten werden nur so lange gespeichert, wie dies für die genannten Zwecke erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen.'],
  ['7. Ihre Rechte','Sie haben insbesondere Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Eine Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen.'],
  ['8. Beschwerderecht','Sie können sich bei einer Datenschutz-Aufsichtsbehörde beschweren, insbesondere am Ort Ihres Aufenthalts, Arbeitsplatzes oder des mutmaßlichen Verstoßes.'],
  ['9. Stand','Stand dieser Datenschutzerklärung: 13. August 2026.']
  ] : [
  ['1. Controller','Yildiz Tief & Netzausbau GmbH<br>Heidelberger Straße 14, 64283 Darmstadt, Germany<br>Email: <a href="mailto:info@yildiz-tn.de">info@yildiz-tn.de</a><br>Phone: <a href="tel:+491776701414">+49 177 670 1414</a>'],
  ['2. Website hosting','This website is provided via GitHub Pages. When the site is accessed, technically essential server log data such as the IP address, time, requested resource and browser information may be processed. This supports secure website provision under Article 6(1)(f) GDPR.'],
  ['3. Cookies and local storage','We do not use analytics or marketing cookies. Only your privacy settings selection is stored in your browser’s local storage so that your decision can be respected.'],
  ['4. External content – Google Maps','The map on the contact page is only loaded after your explicit consent. Only then is a connection to Google established; personal data, particularly your IP address, may be transferred. The legal basis is Article 6(1)(a) GDPR.'],
  ['5. Contacting us','If you contact us by email, telephone, WhatsApp link or the form’s mailto function, we process your details to respond to the enquiry. The legal basis is Article 6(1)(b) GDPR for pre-contractual steps or Article 6(1)(f) GDPR based on our legitimate interest in responding. The form does not send data to a website server.'],
  ['6. Retention','Personal data is retained only for as long as necessary for the stated purposes or for statutory retention obligations.'],
  ['7. Your rights','You have rights including access, rectification, erasure, restriction of processing, data portability and objection. You may withdraw consent at any time with future effect.'],
  ['8. Right to complain','You may lodge a complaint with a data protection supervisory authority, particularly in the place of your residence, workplace or the alleged infringement.'],
  ['9. Version','This privacy policy is current as of 13 August 2026.']
  ]; return `${pageHero(lang,de?'Rechtliches':'Legal',de?'Datenschutzerklärung':'Privacy policy',de?'Transparent erklärt: welche Daten wann verarbeitet werden.':'A transparent explanation of which data is processed and when.','Media/Images/Finished/Finished-Stone-1-1200w.webp')}<section class="section legal-section"><div class="container legal-content">${sections.map(s=>`<h2>${s[0]}</h2><p>${s[1]}</p>`).join('')}<button class="btn btn-dark" type="button" data-open-consent>${common[lang].settings}</button></div></section>`; }

const renderers = { home, services: servicesPage, projects: projectsPage, about: aboutPage, contact: contactPage, legal: legalPage, privacy: privacyPage };
for (const lang of ['de','en']) for (const key of Object.keys(routes)) {
  const out = resolve(root, routes[key][lang]); mkdirSync(dirname(out), {recursive:true}); writeFileSync(out, shell(lang,key,renderers[key](lang)));
}

const notFound = (lang) => shell(lang,'home',`<section class="not-found"><div class="container"><p class="eyebrow">404</p><h1>${lang==='de'?'Diese Seite ist nicht verbunden.':'This page is not connected.'}</h1><p>${lang==='de'?'Die angeforderte Adresse wurde nicht gefunden.':'The requested address could not be found.'}</p><a class="btn btn-primary" href="${href(lang,'home')}">${lang==='de'?'Zur Startseite':'Go to home page'}</a></div></section>`).replace('<meta name="robots" content="index,follow,max-image-preview:large">','<meta name="robots" content="noindex,follow">').replace(pageMeta.home[lang][0], lang==='de'?'Seite nicht gefunden | YILDIZ':'Page not found | YILDIZ');
writeFileSync(resolve(root,'404.html'), notFound('de'));
writeFileSync(resolve(root,'en/404.html'), notFound('en'));

console.log('Generated 16 bilingual static pages.');
