
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const overlay = document.getElementById("overlay");

if (navToggle && navMenu && overlay) {
  navToggle.addEventListener("click", () => {
    const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", !isExpanded);
    navMenu.classList.toggle("active");
    overlay.classList.toggle("active");
  });

  overlay.addEventListener("click", closeMenu);
}

// Mega menu toggles
const megaTriggers = document.querySelectorAll(".mega-trigger");
if (megaTriggers.length > 0) {
  megaTriggers.forEach(trigger => {
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";
      
      // Close all other mega menus first
      megaTriggers.forEach(other => {
        if (other !== trigger) other.setAttribute("aria-expanded", "false");
      });

      trigger.setAttribute("aria-expanded", !isExpanded);
    });
  });
}

function closeMenu() {
  if (navMenu && navMenu.classList.contains("active")) {
    navMenu.classList.remove("active");
    overlay.classList.remove("active");
    navToggle.setAttribute("aria-expanded", "false");
  }
  // Also close all mega menus
  megaTriggers.forEach(trigger => trigger.setAttribute("aria-expanded", "false"));
}

// Close menus on Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

// Close mega menu when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".has-mega")) {
    megaTriggers.forEach(trigger => trigger.setAttribute("aria-expanded", "false"));
  }
});

// Process Carousel
(function () {
  const slides = document.querySelectorAll(".process-slide");
  const dots = document.querySelectorAll(".process-dot");
  if (!slides.length) return;

  const order = [2, 0, 1]; // blue, yellow, pink — center is index 1 in DOM
  let activeIdx = 0; // which of 0,1,2 is active

  function setActive(idx) {
    activeIdx = idx;
    slides.forEach((s) => s.classList.remove("active"));
    dots.forEach((d) => d.classList.remove("active"));

    // Find the slide with data-index matching idx
    slides.forEach((s) => {
      if (parseInt(s.dataset.index) === idx) {
        s.classList.add("active");
      }
    });
    dots[idx]?.classList.add("active");

    // Reorder: active in center
    const track = document.getElementById("processTrack");
    if (!track) return;

    const allSlides = Array.from(slides);
    const activeSlide = allSlides.find(
      (s) => parseInt(s.dataset.index) === idx
    );
    const others = allSlides.filter((s) => parseInt(s.dataset.index) !== idx);

    // Put active in the middle
    track.innerHTML = "";
    track.appendChild(others[0]);
    track.appendChild(activeSlide);
    track.appendChild(others[1]);
  }

  // Dot click
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      setActive(parseInt(dot.dataset.slide));
    });
  });

  // Slide click
  slides.forEach((slide) => {
    slide.addEventListener("click", () => {
      const idx = parseInt(slide.dataset.index);
      if (idx !== activeIdx) setActive(idx);
    });
  });

  // Auto-play
  let autoPlay = setInterval(() => {
    setActive((activeIdx + 1) % 3);
  }, 4000);

  // Pause on hover
  const carousel = document.querySelector(".process-carousel");
  if (carousel) {
    carousel.addEventListener("mouseenter", () => clearInterval(autoPlay));
    carousel.addEventListener("mouseleave", () => {
      autoPlay = setInterval(() => {
        setActive((activeIdx + 1) % 3);
      }, 4000);
    });
  }
})();
