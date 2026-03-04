document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.querySelector(".site-header");
  const navToggle = document.getElementById("navToggle");
  const siteNav = document.getElementById("siteNav");
  const pageNavLinks = Array.from(document.querySelectorAll(".site-nav a[data-nav]"));
  const navLinks = document.querySelectorAll('a[href^="#"]');
  const revealElements = Array.from(document.querySelectorAll("[data-reveal]"));
  const counterElements = Array.from(document.querySelectorAll("[data-counter]"));
  const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const prefersReducedMotion = reduceMotionQuery.matches;

  const rotatingWord = document.getElementById("rotatingWord");
  const rotatingWords = [
    "Glasfaser & Hausanschlüsse",
    "MVT- und MFG-Lösungen",
    "Schacht- und Verlegesysteme",
    "Tiefbau mit Qualitätsfokus"
  ];

  const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
  const projectsSection = document.getElementById("projekte");
  const projectGrid = document.getElementById("projectGrid");
  const projectCards = Array.from(document.querySelectorAll(".project-card"));

  const galleryModal = document.getElementById("galleryModal");
  const galleryImage = document.getElementById("galleryModalImage");
  const galleryCaption = document.getElementById("galleryCaption");
  const galleryPrev = document.getElementById("galleryPrev");
  const galleryNext = document.getElementById("galleryNext");
  const contactForm = document.getElementById("contactForm");
  const contactFormStatus = document.getElementById("contactFormStatus");

  let lastFocusedElement = null;
  let filteredCards = [...projectCards];
  let currentModalIndex = 0;
  let hasPlayedProjectsEntrance = false;

  function setCurrentYear() {
    const year = document.getElementById("currentYear");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  function setActiveNavLink() {
    if (pageNavLinks.length === 0) return;

    const pageName = body.dataset.page || "home";
    pageNavLinks.forEach((link) => {
      const matches = link.dataset.nav === pageName;
      link.classList.toggle("is-current", matches);
      if (matches) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function setHeaderState() {
    if (!header) return;
    header.classList.toggle("is-solid", window.scrollY > 18);
  }

  function openNav() {
    if (!navToggle) return;
    body.classList.add("nav-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Menü schließen");
  }

  function closeNav() {
    if (!navToggle) return;
    body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Menü öffnen");
  }

  function toggleNav() {
    if (body.classList.contains("nav-open")) {
      closeNav();
      return;
    }
    openNav();
  }

  function scrollToTarget(hash) {
    const target = document.querySelector(hash);
    if (!target) return;
    const headerHeight = header ? header.offsetHeight : 0;
    const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight + 1;
    window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
  }

  function setupAnchorScroll() {
    navLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        const href = link.getAttribute("href");
        if (!href || !href.startsWith("#") || href === "#") return;

        const target = document.querySelector(href);
        if (!target) return;

        event.preventDefault();
        closeNav();
        scrollToTarget(href);
      });
    });
  }

  function setupWordRotation() {
    if (!rotatingWord || rotatingWords.length === 0) return;

    let wordIndex = 0;
    rotatingWord.textContent = rotatingWords[wordIndex];

    if (prefersReducedMotion || rotatingWords.length === 1) return;

    window.setInterval(() => {
      wordIndex = (wordIndex + 1) % rotatingWords.length;
      rotatingWord.classList.remove("is-swapping");
      requestAnimationFrame(() => {
        rotatingWord.textContent = rotatingWords[wordIndex];
        rotatingWord.classList.add("is-swapping");
      });
    }, 1600);
  }

  function showAllReveals() {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  function setupFallbackReveal() {
    if (prefersReducedMotion) {
      showAllReveals();
      return;
    }

    if (!("IntersectionObserver" in window)) {
      showAllReveals();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -20px 0px" }
    );

    revealElements.forEach((element) => observer.observe(element));
  }

  function setupGsapAnimations() {
    const hasGsap = typeof window.gsap !== "undefined";
    const hasScrollTrigger = typeof window.ScrollTrigger !== "undefined";

    if (!hasGsap || !hasScrollTrigger || prefersReducedMotion) {
      setupFallbackReveal();
      return;
    }

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray("[data-reveal]").forEach((element) => {
      const direction = element.getAttribute("data-reveal");
      const varsFrom = { autoAlpha: 0, y: 32 };

      if (direction === "left") varsFrom.x = -38;
      if (direction === "right") varsFrom.x = 38;

      const revealTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: "top 84%",
          once: true
        }
      });

      revealTimeline.fromTo(
        element,
        varsFrom,
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          duration: 0.62,
          ease: "power2.out"
        },
        0
      );

      revealTimeline.to(
        element,
        {
          filter: "blur(0px)",
          duration: 0.18,
          ease: "power2.out"
        },
        0
      );
    });

    gsap.utils.toArray(".parallax-layer").forEach((element, index) => {
      const triggerSection = element.closest(".hero, .page-hero") || element.closest("section") || element;
      gsap.to(element, {
        yPercent: index === 0 ? 12 : 20,
        ease: "none",
        scrollTrigger: {
          trigger: triggerSection,
          start: "top top",
          end: "bottom top",
          scrub: 0.25
        }
      });
    });
  }

  function animateCounter(element) {
    const target = Number.parseInt(element.getAttribute("data-counter") || "0", 10);
    if (Number.isNaN(target)) return;

    if (prefersReducedMotion) {
      element.textContent = String(target);
      return;
    }

    const duration = 650;
    const start = performance.now();

    function step(timestamp) {
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = String(Math.floor(eased * target));
      if (progress < 1) {
        requestAnimationFrame(step);
        return;
      }
      element.textContent = String(target);
    }

    requestAnimationFrame(step);
  }

  function setupCounters() {
    if (counterElements.length === 0) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      counterElements.forEach(animateCounter);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.45 }
    );

    counterElements.forEach((counter) => observer.observe(counter));
  }

  function updateFilteredCards(filter) {
    projectCards.forEach((card) => {
      const match = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !match);
      card.setAttribute("aria-hidden", String(!match));
    });

    filteredCards = projectCards.filter((card) => !card.classList.contains("is-hidden"));
  }

  function animateProjectCards() {
    if (filteredCards.length === 0 || !projectGrid || prefersReducedMotion) return;

    const hasGsap = typeof window.gsap !== "undefined";
    if (hasGsap) {
      const { gsap } = window;
      gsap.killTweensOf(filteredCards);
      gsap.fromTo(
        filteredCards,
        { autoAlpha: 0, y: 18, scale: 0.985, filter: "blur(4px)" },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.42,
          ease: "power2.out",
          stagger: 0.055,
          overwrite: "auto"
        }
      );
      return;
    }

    filteredCards.forEach((card) => {
      card.classList.remove("is-appearing");
      requestAnimationFrame(() => {
        card.classList.add("is-appearing");
      });
    });
  }

  function updateFilterButtons(activeButton) {
    filterButtons.forEach((button) => {
      const isActive = button === activeButton;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });
  }

  function openModal(card) {
    if (!galleryModal || !galleryImage || !galleryCaption) return;

    filteredCards = projectCards.filter((item) => !item.classList.contains("is-hidden"));
    currentModalIndex = Math.max(0, filteredCards.indexOf(card));
    lastFocusedElement = document.activeElement;

    galleryModal.hidden = false;
    body.style.overflow = "hidden";
    renderModalImage();

    const closeButton = galleryModal.querySelector(".gallery-close");
    if (closeButton) closeButton.focus();
  }

  function closeModal() {
    if (!galleryModal || galleryModal.hidden) return;

    galleryModal.hidden = true;
    body.style.overflow = "";

    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
    }
  }

  function renderModalImage() {
    if (!galleryImage || !galleryCaption || filteredCards.length === 0) return;

    const currentCard = filteredCards[currentModalIndex];
    const image = currentCard.querySelector("img");
    if (!image) return;

    galleryImage.src = image.currentSrc || image.src;
    galleryImage.alt = image.alt;
    galleryCaption.textContent = currentCard.dataset.caption || image.alt;
  }

  function nextModalImage(direction) {
    if (filteredCards.length === 0) return;

    currentModalIndex = (currentModalIndex + direction + filteredCards.length) % filteredCards.length;
    renderModalImage();
  }

  function setupGallery() {
    if (!projectGrid || projectCards.length === 0) return;

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter || "all";
        updateFilterButtons(button);
        updateFilteredCards(filter);
        if (hasPlayedProjectsEntrance) {
          animateProjectCards();
        }
      });
    });

    projectCards.forEach((card) => {
      card.addEventListener("click", () => {
        if (card.classList.contains("is-hidden")) return;
        openModal(card);
      });
    });

    if (galleryPrev) {
      galleryPrev.addEventListener("click", () => nextModalImage(-1));
    }

    if (galleryNext) {
      galleryNext.addEventListener("click", () => nextModalImage(1));
    }

    if (galleryModal) {
      galleryModal.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        if (target.hasAttribute("data-close-modal")) {
          closeModal();
        }
      });
    }

    document.addEventListener("keydown", (event) => {
      if (!galleryModal || galleryModal.hidden) return;

      if (event.key === "Escape") {
        closeModal();
      }
      if (event.key === "ArrowRight") {
        nextModalImage(1);
      }
      if (event.key === "ArrowLeft") {
        nextModalImage(-1);
      }
    });

    updateFilteredCards("all");

    if (prefersReducedMotion || !projectsSection) return;

    const playProjectsEntrance = () => {
      if (hasPlayedProjectsEntrance) return;
      hasPlayedProjectsEntrance = true;
      animateProjectCards();
    };

    const rect = projectsSection.getBoundingClientRect();
    const alreadyInView = rect.top < window.innerHeight * 0.88 && rect.bottom > 0;
    if (alreadyInView) {
      playProjectsEntrance();
      return;
    }

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            playProjectsEntrance();
            observer.unobserve(entry.target);
          });
        },
        { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
      );
      observer.observe(projectsSection);
      return;
    }

    const onScroll = () => {
      const sectionRect = projectsSection.getBoundingClientRect();
      if (sectionRect.top < window.innerHeight * 0.88 && sectionRect.bottom > 0) {
        playProjectsEntrance();
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function setFormStatus(type, message) {
    if (!contactFormStatus) return;
    contactFormStatus.textContent = message;
    contactFormStatus.classList.remove("is-error", "is-success");
    if (type) {
      contactFormStatus.classList.add(type);
    }
  }

  function setupContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const botField = String(formData.get("website") || "").trim();
      if (botField) {
        setFormStatus("is-error", "Senden fehlgeschlagen. Bitte versuchen Sie es erneut.");
        return;
      }

      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const phone = String(formData.get("phone") || "").trim();
      const subject = String(formData.get("subject") || "").trim();
      const message = String(formData.get("message") || "").trim();
      const consent = formData.get("consent");

      if (name.length < 2 || subject.length < 3 || message.length < 10 || !consent) {
        setFormStatus("is-error", "Bitte füllen Sie alle Pflichtfelder korrekt aus.");
        return;
      }

      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailValid) {
        setFormStatus("is-error", "Bitte geben Sie eine gültige E-Mail-Adresse ein.");
        return;
      }

      const bodyLines = [
        `Name: ${name}`,
        `E-Mail: ${email}`,
        `Telefon: ${phone || "-"}`,
        "",
        "Nachricht:",
        message
      ];

      const mailtoUrl = `mailto:info@yildiz-tn.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join("\n"))}`;

      setFormStatus("is-success", "Ihr E-Mail-Programm wird geöffnet...");
      window.location.href = mailtoUrl;
    });
  }

  function setupEvents() {
    if (navToggle) {
      navToggle.addEventListener("click", toggleNav);
    }

    pageNavLinks.forEach((link) => {
      link.addEventListener("click", () => closeNav());
    });

    document.addEventListener("click", (event) => {
      if (!body.classList.contains("nav-open")) return;
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      if (siteNav && siteNav.contains(target)) return;
      if (navToggle && navToggle.contains(target)) return;
      closeNav();
    });

    window.addEventListener("scroll", setHeaderState, { passive: true });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 860) closeNav();
    });
  }

  setCurrentYear();
  setActiveNavLink();
  setHeaderState();
  setupAnchorScroll();
  setupWordRotation();
  setupGsapAnimations();
  setupCounters();
  setupGallery();
  setupContactForm();
  setupEvents();
});
