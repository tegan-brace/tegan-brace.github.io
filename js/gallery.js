/* =========================================================
   Tegan Brace — interactive behaviors
   - Mobile menu toggle
   - Hero slideshow (home)
   - Lightbox (gallery pages)
   - Back-to-top button
   ========================================================= */

(function () {
  "use strict";

  /* -------------------- Mobile menu -------------------- */
  const menuToggle = document.querySelector(".menu-toggle");
  const siteNav = document.querySelector(".site-nav");
  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  /* -------------------- Hero slideshow -------------------- */
  const hero = document.querySelector(".hero");
  if (hero) {
    const slides = Array.from(hero.querySelectorAll(".hero-slide"));
    const dotsContainer = hero.querySelector(".hero-controls");
    const prevBtn = hero.querySelector(".hero-arrows .prev");
    const nextBtn = hero.querySelector(".hero-arrows .next");
    let current = 0;
    let timer;

    if (slides.length > 1 && dotsContainer) {
      slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.className = "hero-dot" + (i === 0 ? " active" : "");
        dot.setAttribute("aria-label", `Slide ${i + 1}`);
        dot.addEventListener("click", () => goTo(i));
        dotsContainer.appendChild(dot);
      });
    }

    const dots = Array.from(hero.querySelectorAll(".hero-dot"));

    function goTo(i) {
      slides[current].classList.remove("active");
      if (dots[current]) dots[current].classList.remove("active");
      current = (i + slides.length) % slides.length;
      slides[current].classList.add("active");
      if (dots[current]) dots[current].classList.add("active");
      restartTimer();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function restartTimer() {
      clearInterval(timer);
      if (slides.length > 1) timer = setInterval(next, 5500);
    }

    if (prevBtn) prevBtn.addEventListener("click", prev);
    if (nextBtn) nextBtn.addEventListener("click", next);

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    });

    if (slides.length > 1) restartTimer();
  }

  /* -------------------- Lightbox -------------------- */
  const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
  if (galleryItems.length > 0) {
    const lightbox = document.createElement("div");
    lightbox.className = "lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.innerHTML = `
      <button class="lightbox-close" aria-label="Close">&times;</button>
      <button class="lightbox-prev" aria-label="Previous">&#8249;</button>
      <button class="lightbox-next" aria-label="Next">&#8250;</button>
      <img alt="" />
      <div class="lightbox-counter"></div>
    `;
    document.body.appendChild(lightbox);

    const lbImg = lightbox.querySelector("img");
    const lbCounter = lightbox.querySelector(".lightbox-counter");
    const lbClose = lightbox.querySelector(".lightbox-close");
    const lbPrev = lightbox.querySelector(".lightbox-prev");
    const lbNext = lightbox.querySelector(".lightbox-next");

    let lbIndex = 0;

    function openLightbox(i) {
      lbIndex = i;
      showImage();
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      lightbox.classList.remove("open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    function showImage() {
      const item = galleryItems[lbIndex];
      const img = item.querySelector("img");
      const fullSrc = item.dataset.full || img.src;
      lbImg.src = fullSrc;
      lbImg.alt = img.alt || "";
      lbCounter.textContent = `${lbIndex + 1} / ${galleryItems.length}`;
    }

    function nextImage() {
      lbIndex = (lbIndex + 1) % galleryItems.length;
      showImage();
    }

    function prevImage() {
      lbIndex = (lbIndex - 1 + galleryItems.length) % galleryItems.length;
      showImage();
    }

    galleryItems.forEach((item, i) => {
      item.addEventListener("click", () => openLightbox(i));
    });

    lbClose.addEventListener("click", closeLightbox);
    lbNext.addEventListener("click", nextImage);
    lbPrev.addEventListener("click", prevImage);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    });

    /* Touch swipe */
    let touchStartX = 0;
    lightbox.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    lightbox.addEventListener("touchend", (e) => {
      const diff = e.changedTouches[0].screenX - touchStartX;
      if (Math.abs(diff) > 50) {
        if (diff < 0) nextImage();
        else prevImage();
      }
    }, { passive: true });
  }

  /* -------------------- Back-to-top -------------------- */
  const backToTop = document.querySelector(".back-to-top");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 600) backToTop.classList.add("visible");
      else backToTop.classList.remove("visible");
    });
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
