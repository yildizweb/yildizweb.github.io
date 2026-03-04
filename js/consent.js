(() => {
  const CONSENT_KEY = "yildiz_consent_v1";
  const defaultConsent = {
    essential: true,
    externalMedia: false,
    timestamp: null
  };

  const banner = document.getElementById("cookieBanner");
  const acceptAllButton = document.getElementById("consentAcceptAll");
  const rejectAllButton = document.getElementById("consentRejectAll");
  const openSettingsButton = document.getElementById("consentOpenSettings");
  const saveSettingsButton = document.getElementById("consentSaveSettings");
  const settingsPanel = document.getElementById("consentSettings");
  const externalMediaCheckbox = document.getElementById("consentExternalMedia");
  const openSettingsLinks = Array.from(document.querySelectorAll("[data-open-consent]"));
  const mapWrappers = Array.from(document.querySelectorAll("[data-map-consent]"));
  const externalAcceptButtons = Array.from(document.querySelectorAll('[data-consent-accept="external-media"]'));

  let consent = readConsent();

  function readConsent() {
    try {
      const raw = localStorage.getItem(CONSENT_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return {
        ...defaultConsent,
        ...parsed,
        essential: true
      };
    } catch {
      return null;
    }
  }

  function writeConsent(nextConsent) {
    try {
      const payload = {
        ...defaultConsent,
        ...nextConsent,
        essential: true,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(CONSENT_KEY, JSON.stringify(payload));
      return payload;
    } catch {
      return {
        ...defaultConsent,
        ...nextConsent,
        essential: true,
        timestamp: new Date().toISOString()
      };
    }
  }

  function showBanner() {
    if (!banner) return;
    banner.hidden = false;
  }

  function hideBanner() {
    if (!banner) return;
    banner.hidden = true;
  }

  function syncSettingsUI() {
    if (externalMediaCheckbox) {
      externalMediaCheckbox.checked = Boolean(consent && consent.externalMedia);
    }
  }

  function applyMapConsent() {
    mapWrappers.forEach((wrapper) => {
      const iframe = wrapper.querySelector("[data-map-iframe]");
      const placeholder = wrapper.querySelector("[data-map-placeholder]");
      if (!iframe) return;

      if (consent && consent.externalMedia) {
        if (!iframe.getAttribute("src")) {
          const src = iframe.getAttribute("data-src") || "";
          if (src) iframe.setAttribute("src", src);
        }
        iframe.hidden = false;
        wrapper.classList.add("is-active");
        if (placeholder) placeholder.hidden = true;
        return;
      }

      iframe.removeAttribute("src");
      iframe.hidden = true;
      wrapper.classList.remove("is-active");
      if (placeholder) placeholder.hidden = false;
    });
  }

  function dispatchConsentEvent() {
    window.dispatchEvent(new CustomEvent("consentchange", { detail: consent }));
  }

  function saveConsent(nextConsent, closeBanner = true) {
    consent = writeConsent(nextConsent);
    syncSettingsUI();
    applyMapConsent();
    dispatchConsentEvent();
    if (closeBanner) hideBanner();
  }

  function openSettings() {
    showBanner();
    if (settingsPanel) settingsPanel.hidden = false;
    syncSettingsUI();
  }

  function initBannerState() {
    syncSettingsUI();
    applyMapConsent();

    if (!consent) {
      showBanner();
      if (settingsPanel) settingsPanel.hidden = true;
      return;
    }

    hideBanner();
  }

  if (acceptAllButton) {
    acceptAllButton.addEventListener("click", () => {
      saveConsent({ externalMedia: true }, true);
    });
  }

  if (rejectAllButton) {
    rejectAllButton.addEventListener("click", () => {
      saveConsent({ externalMedia: false }, true);
    });
  }

  if (openSettingsButton) {
    openSettingsButton.addEventListener("click", () => {
      openSettings();
    });
  }

  if (saveSettingsButton) {
    saveSettingsButton.addEventListener("click", () => {
      saveConsent({ externalMedia: Boolean(externalMediaCheckbox && externalMediaCheckbox.checked) }, true);
    });
  }

  openSettingsLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openSettings();
    });
  });

  externalAcceptButtons.forEach((button) => {
    button.addEventListener("click", () => {
      saveConsent({ externalMedia: true }, true);
    });
  });

  initBannerState();
})();
