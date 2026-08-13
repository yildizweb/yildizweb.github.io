(() => {
  'use strict';
  const body = document.body;
  body.classList.add('reveal-ready');
  const lang = body.dataset.lang || 'de';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const heroVideo = document.querySelector('.hero-video');
  if (reduced) heroVideo?.pause();
  const header = document.querySelector('.site-header');
  const menuButton = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('.site-nav');
  let lastFocus = null;

  document.querySelectorAll('[data-year]').forEach(el => el.textContent = String(new Date().getFullYear()));
  document.querySelectorAll('.language-switch a').forEach(link => link.addEventListener('click', () => {
    if (location.hash && ['#anfrage','#tiefbau','#glasfaser','#anschluesse','#oberflaechen','#begleitung'].includes(location.hash)) {
      link.href += location.hash;
    }
  }));
  const onScroll = () => {
    header?.classList.toggle('is-scrolled', scrollY > 16);
    document.querySelector('[data-to-top]')?.classList.toggle('is-visible', scrollY > 500);
    const process = document.querySelector('[data-process]');
    const line = document.querySelector('[data-process-line]');
    if (process && line && !reduced) {
      const rect = process.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (innerHeight * .82 - rect.top) / (rect.height + innerHeight * .35)));
      line.style.strokeDashoffset = String(1000 * (1 - progress));
    }
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  document.querySelector('[data-to-top]')?.addEventListener('click', () => scrollTo({top:0,behavior:reduced?'auto':'smooth'}));

  function closeMenu(returnFocus = false) {
    body.classList.remove('nav-open');
    menuButton?.setAttribute('aria-expanded','false');
    menuButton?.setAttribute('aria-label', menuButton.dataset.labelOpen || 'Open menu');
    if (returnFocus) menuButton?.focus();
  }
  function openMenu() {
    lastFocus = document.activeElement; body.classList.add('nav-open');
    menuButton?.setAttribute('aria-expanded','true');
    menuButton?.setAttribute('aria-label', menuButton.dataset.labelClose || 'Close menu');
    nav?.querySelector('a')?.focus();
  }
  menuButton?.addEventListener('click', () => body.classList.contains('nav-open') ? closeMenu() : openMenu());
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && body.classList.contains('nav-open')) closeMenu(true);
    if (e.key === 'Tab' && body.classList.contains('nav-open') && nav) {
      const focusable = [menuButton, ...nav.querySelectorAll('a,button')].filter(Boolean);
      const first = focusable[0], last = focusable.at(-1);
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  const reveals = document.querySelectorAll('[data-reveal]');
  if (reduced || !('IntersectionObserver' in window)) reveals.forEach(el => el.classList.add('is-visible'));
  else {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold:.12, rootMargin:'0px 0px -30px' });
    reveals.forEach(el => observer.observe(el));
  }

  const gallery = document.querySelector('[data-gallery]');
  const cards = gallery ? [...gallery.querySelectorAll('.project-card')] : [];
  const filters = [...document.querySelectorAll('[data-filter]')];
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(b => { b.classList.toggle('is-active', b === button); b.setAttribute('aria-pressed', String(b === button)); });
    cards.forEach(card => card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter);
  }));

  const lightbox = document.querySelector('[data-lightbox]');
  let visibleCards = cards, current = 0;
  function renderLightbox() {
    const card = visibleCards[current]; if (!card || !lightbox) return;
    const image = lightbox.querySelector('[data-lightbox-image]');
    image.src = card.dataset.src; image.alt = card.dataset.caption;
    lightbox.querySelector('[data-lightbox-caption]').textContent = card.dataset.caption;
    lightbox.querySelector('[data-lightbox-count]').textContent = `${current + 1} / ${visibleCards.length}`;
  }
  function openLightbox(card) {
    if (!lightbox) return; lastFocus = card; visibleCards = cards.filter(c => !c.hidden); current = visibleCards.indexOf(card); renderLightbox(); lightbox.showModal(); lightbox.querySelector('[data-lightbox-close]').focus();
  }
  cards.forEach(card => card.addEventListener('click', () => openLightbox(card)));
  lightbox?.querySelector('[data-lightbox-close]')?.addEventListener('click', () => lightbox.close());
  lightbox?.querySelector('[data-lightbox-prev]')?.addEventListener('click', () => { current=(current-1+visibleCards.length)%visibleCards.length; renderLightbox(); });
  lightbox?.querySelector('[data-lightbox-next]')?.addEventListener('click', () => { current=(current+1)%visibleCards.length; renderLightbox(); });
  lightbox?.addEventListener('close', () => lastFocus?.focus());
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) lightbox.close(); });
  lightbox?.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { current=(current-1+visibleCards.length)%visibleCards.length; renderLightbox(); }
    if (e.key === 'ArrowRight') { current=(current+1)%visibleCards.length; renderLightbox(); }
  });

  const consentKey = 'yildiz-consent-v2';
  const dialog = document.querySelector('[data-consent-dialog]');
  const externalInput = dialog?.querySelector('[data-external-media]');
  const consentOptions = dialog?.querySelector('[data-consent-options]');
  const consentSettingsButton = dialog?.querySelector('[data-consent-save]');
  const readConsent = () => { try { return JSON.parse(localStorage.getItem(consentKey) || 'null'); } catch { return null; } };
  const saveConsent = external => { localStorage.setItem(consentKey, JSON.stringify({ external, savedAt: new Date().toISOString() })); if (external) loadMap(); };
  function openConsent() { const choice = readConsent(); if (externalInput) externalInput.checked = Boolean(choice?.external); if (dialog && !dialog.open) dialog.show(); }
  document.querySelectorAll('[data-open-consent]').forEach(b => b.addEventListener('click', openConsent));
  dialog?.querySelector('[data-consent-accept]')?.addEventListener('click', () => saveConsent(true));
  dialog?.querySelector('[data-consent-reject]')?.addEventListener('click', () => saveConsent(false));
  consentSettingsButton?.addEventListener('click', event => {
    if (consentOptions?.hidden) {
      event.preventDefault();
      consentOptions.hidden = false;
      consentSettingsButton.textContent = consentSettingsButton.dataset.labelSave;
      externalInput?.focus();
      return;
    }
    saveConsent(Boolean(externalInput?.checked));
  });
  if (!readConsent()) openConsent();

  const mapBox = document.querySelector('[data-map]');
  function loadMap() {
    if (!mapBox || mapBox.querySelector('iframe')) return;
    mapBox.innerHTML = `<iframe title="${lang==='de'?'Standort von YILDIZ in Darmstadt':'YILDIZ location in Darmstadt'}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5143.4975875425425!2d8.644596476296742!3d49.86596327148647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47bd707dd7f41099%3A0x5991a0e612343eb1!2sHeidelberger%20Strasse%2014%2C%2064283%20Darmstadt!5e0!3m2!1sde!2sde!4v1735076254701!5m2!1sde!2sde"></iframe>`;
  }
  document.querySelector('[data-load-map]')?.addEventListener('click', () => { saveConsent(true); loadMap(); });
  if (readConsent()?.external) loadMap();

  const form = document.querySelector('[data-contact-form]');
  const status = form?.querySelector('[data-form-status]');
  const messages = lang === 'de' ? { required:'Bitte füllen Sie alle Pflichtfelder aus.', email:'Bitte geben Sie eine gültige E-Mail-Adresse ein.', open:'Ihr E-Mail-Programm wird geöffnet …', subject:'Projektanfrage über yildiz-tn.de', body:['Name','Unternehmen','E-Mail','Telefon','Leistungsart','Nachricht'] } : { required:'Please complete all required fields.', email:'Please enter a valid email address.', open:'Your email application is opening …', subject:'Project enquiry via yildiz-tn.de', body:['Name','Company','Email','Phone','Type of service','Message'] };
  form?.addEventListener('submit', e => {
    e.preventDefault(); const data = new FormData(form); if (String(data.get('website')||'')) return;
    form.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
    const required = [...form.querySelectorAll('[required]')]; const invalid = required.filter(el => !el.checkValidity());
    if (invalid.length) { invalid.forEach(el=>el.setAttribute('aria-invalid','true')); status.textContent = invalid.some(el=>el.type==='email' && el.value) ? messages.email : messages.required; status.className='form-status is-error'; invalid[0].focus(); return; }
    const vals = ['name','company','email','phone','subject','message'].map(k => String(data.get(k)||'-').trim()||'-');
    const bodyText = messages.body.map((label,i)=>`${label}: ${vals[i]}`).join('\n');
    status.textContent=messages.open; status.className='form-status is-ok';
    location.href=`mailto:info@yildiz-tn.de?subject=${encodeURIComponent(messages.subject)}&body=${encodeURIComponent(bodyText)}`;
  });
})();
