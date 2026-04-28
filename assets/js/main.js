(() => {
  const qs = (s, el = document) => el.querySelector(s);
  const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));

  // Footer year
  const yearEl = qs("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Reveal on scroll
  const revealEls = qsa(".reveal");
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  // Back to top
  const toTopBtn = qs(".to-top");
  const onScroll = () => {
    if (!toTopBtn) return;
    const show = window.scrollY > 700;
    toTopBtn.classList.toggle("show", show);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (toTopBtn) {
    toTopBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  // Close navbar on click (mobile)
  const navCollapse = qs("#mainNav");
  const navLinks = qsa("#mainNav .nav-link, #mainNav .btn");
  if (navCollapse && navLinks.length) {
    navLinks.forEach((a) =>
      a.addEventListener("click", () => {
        const isShown = navCollapse.classList.contains("show");
        if (!isShown) return;
        const bs = window.bootstrap;
        if (!bs || !bs.Collapse) return;
        bs.Collapse.getOrCreateInstance(navCollapse).hide();
      })
    );
  }

  // Contact form UX (client-side only)
  const form = qs("#contactForm");
  const toast = qs("#formToast");
  const showToast = (msg, kind = "success") => {
    if (!toast) return;
    toast.classList.remove("d-none");
    toast.classList.toggle("toast-success", kind === "success");
    toast.classList.toggle("toast-error", kind !== "success");
    toast.textContent = msg;
  };
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = qs("#name", form)?.value?.trim() ?? "";
      const email = qs("#email", form)?.value?.trim() ?? "";
      const topic = qs("#topic", form)?.value?.trim() ?? "";
      const message = qs("#message", form)?.value?.trim() ?? "";

      if (!name || !email || !message) {
        showToast("Please fill in your name, email, and message.", "error");
        return;
      }
      const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!okEmail) {
        showToast("Please enter a valid email address.", "error");
        return;
      }

      // Demo behavior: open mail client with prefilled content
      const subject = encodeURIComponent(topic ? `Early YouTubers: ${topic}` : "Early YouTubers: Hello");
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      window.location.href = `mailto:hello@earlyyoutubers.community?subject=${subject}&body=${body}`;
      showToast("Opening your email app…", "success");
      form.reset();
    });
  }

  // Blog search (client-side)
  const blogSearch = qs("#blogSearch");
  if (blogSearch) {
    const cards = qsa("[data-post]");
    blogSearch.addEventListener("input", () => {
      const q = blogSearch.value.trim().toLowerCase();
      for (const c of cards) {
        const hay = (c.getAttribute("data-post") || "").toLowerCase();
        c.classList.toggle("d-none", q && !hay.includes(q));
      }
    });
  }
})();

