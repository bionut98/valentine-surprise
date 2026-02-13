function smoothScrollTo(selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function initIntroOverlay() {
  const overlay = document.getElementById("introOverlay");
  const openBtn = document.getElementById("openSurpriseBtn");
  const storyBtn = document.getElementById("scrollToStoryBtn");

  if (!overlay || !openBtn) return;

  openBtn.addEventListener("click", () => {
    // Start the music when opening the surprise
    startMusic();
    
    overlay.classList.add("is-hidden");
    setTimeout(() => {
      smoothScrollTo("#story");
    }, 200);
  });

  if (storyBtn) {
    storyBtn.addEventListener("click", () => smoothScrollTo("#story"));
  }
}

function initReasons() {
  const container = document.getElementById("reasonsGrid");
  if (!container) return;

  container.addEventListener("click", (event) => {
    const card = event.target.closest(".reason-card");
    if (!card) return;

    const text = card.querySelector(".reason-text");
    const reason = card.getAttribute("data-reason");
    if (!text || !reason) return;

    const isRevealed = card.classList.contains("is-revealed");
    if (!isRevealed) {
      card.classList.add("is-revealed");
      text.textContent = reason;
    } else {
      card.classList.remove("is-revealed");
      text.textContent = "Tap to reveal";
    }
  });
}

// YouTube player control
let musicStarted = false;

function startMusic() {
  if (musicStarted) return;
  musicStarted = true;
  
  const iframe = document.getElementById("youtubePlayer");
  if (!iframe) return;

  // Add autoplay parameter to existing iframe src
  const currentSrc = iframe.src;
  if (currentSrc && !currentSrc.includes("autoplay=1")) {
    const separator = currentSrc.includes("?") ? "&" : "?";
    iframe.src = currentSrc + separator + "autoplay=1";
  }
}

function initGallery(galleryId, prevBtnId, nextBtnId, onNavigate) {
  const inner = document.getElementById(galleryId);
  const prev = document.getElementById(prevBtnId);
  const next = document.getElementById(nextBtnId);

  if (!inner || !prev || !next) return;

  const items = Array.from(inner.querySelectorAll(".gallery-item"));
  if (!items.length) return;

  let current = items.findIndex((item) => item.classList.contains("is-active"));
  if (current < 0) current = 0;

  function show(index) {
    items.forEach((item, i) => {
      item.classList.toggle("is-active", i === index);
    });
    if (onNavigate) {
      onNavigate();
    }
  }

  prev.addEventListener("click", () => {
    current = (current - 1 + items.length) % items.length;
    show(current);
  });

  next.addEventListener("click", () => {
    current = (current + 1) % items.length;
    show(current);
  });
}

function initGalleries() {
  // First gallery (original photos)
  initGallery("galleryInner", "prevPhotoBtn", "nextPhotoBtn", startMusic);
}

function initPhotoGrid() {
  const grid = document.getElementById("photoGrid");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  if (!grid || !lightbox || !lightboxImage) return;

  const thumbnails = Array.from(grid.querySelectorAll(".photo-thumbnail"));
  const photos = thumbnails.map((thumb) => thumb.querySelector("img").src);
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    lightboxImage.src = photos[index];
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
    startMusic();
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % photos.length;
    lightboxImage.src = photos[currentIndex];
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + photos.length) % photos.length;
    lightboxImage.src = photos[currentIndex];
  }

  // Click on thumbnails
  thumbnails.forEach((thumb, index) => {
    thumb.addEventListener("click", () => openLightbox(index));
  });

  // Close button
  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  // Navigation arrows
  if (lightboxNext) {
    lightboxNext.addEventListener("click", showNext);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", showPrev);
  }

  // Close on background click
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;

    if (e.key === "Escape") {
      closeLightbox();
    } else if (e.key === "ArrowLeft") {
      showPrev();
    } else if (e.key === "ArrowRight") {
      showNext();
    }
  });
}

function initNoteActions() {
  const hugBtn = document.getElementById("hugButton");
  const toast = document.getElementById("toast");
  const topBtn = document.getElementById("backToTopBtn");
  let toastTimeout;

  if (hugBtn && toast) {
    hugBtn.addEventListener("click", () => {
      toast.classList.add("is-visible");
      clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        toast.classList.remove("is-visible");
      }, 2600);
    });
  }

  if (topBtn) {
    topBtn.addEventListener("click", () => smoothScrollTo("#top"));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initIntroOverlay();
  initReasons();
  initGalleries();
  initPhotoGrid();
  initNoteActions();
});
