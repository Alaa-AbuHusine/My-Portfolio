// Toggle mobile menu
document.addEventListener("DOMContentLoaded", function () {
  const THEME_STORAGE_KEY = "alaa-theme";
  const root = document.documentElement;
  const toggleButton = document.querySelector(".navbar .mobile-menu-toggle");
  const mobileMenu = document.querySelector(".navbar .mobile-menu-items");
  const themeToggle = document.querySelector(".theme-toggle");

  // Theme helpers ---------------------------------------------------------
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  const getStoredTheme = () => localStorage.getItem(THEME_STORAGE_KEY);

  const resolvePreferredTheme = () => {
    const stored = getStoredTheme();
    if (stored === "dark" || stored === "light") return stored;
    return prefersDarkScheme.matches ? "dark" : "light";
  };

  const syncToggleState = (theme) => {
    if (!themeToggle) return;
    themeToggle.setAttribute(
      "aria-pressed",
      theme === "dark" ? "true" : "false"
    );
    themeToggle.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
    );
  };

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    syncToggleState(theme);
  };

  // Initialize theme based on stored value or system preference
  applyTheme(resolvePreferredTheme());

  // Toggle handler: persist choice and update UI
  themeToggle?.addEventListener("click", () => {
    const current =
      root.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem(THEME_STORAGE_KEY, next);
  });

  // Respect system preference changes when user has no manual override
  const handleSystemThemeChange = (event) => {
    if (getStoredTheme()) return;
    applyTheme(event.matches ? "dark" : "light");
  };

  if (prefersDarkScheme.addEventListener) {
    prefersDarkScheme.addEventListener("change", handleSystemThemeChange);
  } else if (prefersDarkScheme.addListener) {
    prefersDarkScheme.addListener(handleSystemThemeChange);
  }

  toggleButton.addEventListener("click", function () {
    mobileMenu.classList.toggle("active");
    toggleButton.classList.toggle("active");
  });

  // Scroll reveal animation with hide on scroll up
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal");
      } else {
        entry.target.classList.remove("reveal");
      }
    });
  }, observerOptions);

  // Observe all sections
  document
    .querySelectorAll(
      ".about, .about-main, .about-sidebar, .info-card, .focus-card, .skill-card, .contact, .contact-card, .contact-form, .contact-social, .social-btn"
    )
    .forEach((el) => {
      el.classList.add("reveal-on-scroll");
      observer.observe(el);
    });

  // Update active nav link on scroll
  const navLinks = document.querySelectorAll(".navbar a[href^='#']");
  const sections = document.querySelectorAll("section[id], header[id]");

  // Smooth scroll to sections with offset for fixed navbar
  const navbar = document.querySelector(".navbar");
  const NAV_OFFSET = 20; // extra spacing below navbar
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const top =
            target.offsetTop - (navbar?.offsetHeight || 0) - NAV_OFFSET;
          window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
          // Close mobile menu after navigation
          mobileMenu?.classList.remove("active");
          toggleButton?.classList.remove("active");
        }
      }
    });
  });

  function updateActiveLink() {
    let currentSection = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (window.scrollY >= sectionTop - 200) {
        currentSection = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentSection}`) {
        link.classList.add("active");
      }
    });
  }

  // Throttle scroll handler to reduce flicker
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateActiveLink();
        ticking = false;
      });
      ticking = true;
    }
  });
  updateActiveLink(); // Initial call
});

// Change navbar background on scroll
window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");

  if (window.scrollY > 0) {
    navbar.classList.add("navbar-scroll");
  } else {
    navbar.classList.remove("navbar-scroll");
  }
});

// Intro overlay: fade out on page load, then remove
window.addEventListener("load", function () {
  const overlay = document.getElementById("intro-overlay");
  if (!overlay) return;

  // Trigger fade-out animation
  overlay.classList.add("hide");

  // Remove overlay after fade-out completes
  overlay.addEventListener("animationend", (e) => {
    if (e.animationName === "introFadeOut") {
      overlay.remove();
    }
  });
});
