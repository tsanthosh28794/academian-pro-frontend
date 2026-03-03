
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

// Process Carousel - Infinite loop sliding
(function () {
  const track = document.getElementById("processTrack");
  if (!track) return;

  const dots = document.querySelectorAll(".process-dot");
  const totalOriginal = 3;

  function getSlideWidth() {
    const firstSlide = track.querySelector(".process-slide");
    if (!firstSlide) return 350;
    // Get width plus negative margins
    const style = window.getComputedStyle(firstSlide);
    const width = parseFloat(style.width);
    const marginLeft = parseFloat(style.marginLeft);
    const marginRight = parseFloat(style.marginRight);
    return width + marginLeft + marginRight;
  }

  // No clones for non-infinite carousel
  const allSlides = Array.from(track.children);
  const totalSlides = allSlides.length;
  let currentIndex = 0;
  let isTransitioning = false;

  function getOffset(idx) {
    const slideW = getSlideWidth();
    const containerW = track.parentElement.offsetWidth;
    return -(idx * slideW) + (containerW / 2) - (slideW / 2);
  }

  function updateClasses() {
    allSlides.forEach((s, idx) => {
      s.classList.remove("active", "visible");
      if (idx === currentIndex) {
        s.classList.add("active", "visible");
      } else if (idx === currentIndex - 1 || idx === currentIndex + 1) {
        s.classList.add("visible");
      }
    });

    dots.forEach((d, i) => d.classList.toggle("active", i === currentIndex));
  }

  function goTo(idx, smooth = true) {
    if (isTransitioning || idx < 0 || idx >= totalSlides) return;
    currentIndex = idx;
    track.style.transition = smooth ? "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)" : "none";
    track.style.transform = `translateX(${getOffset(currentIndex)}px)`;
    updateClasses();

    if (smooth) {
      isTransitioning = true;
      setTimeout(() => {
        isTransitioning = false;
        updateClasses();
      }, 720);
    }
  }

  function next() {
    if (currentIndex < totalSlides - 1) {
      goTo(currentIndex + 1);
    } else {
      // Stop at end, or stay at last slide.
      // clearInterval(autoPlay); // Optionally stop auto-play as well
    }
  }

  // Handle Resize
  window.addEventListener("resize", () => {
    track.style.transition = "none";
    track.style.transform = `translateX(${getOffset(currentIndex)}px)`;
  });

  // Initialize position
  goTo(currentIndex, false);

  // Dot clicks
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      goTo(totalOriginal + i);
    });
  });

  // Click on slide to navigate
  allSlides.forEach((slide, i) => {
    slide.addEventListener("click", () => {
      if (allSlides[i].classList.contains("visible") && i !== currentIndex) {
        goTo(i);
      }
    });
  });

  // Touch Support
  let touchStartX = 0;
  let touchMoveX = 0;

  carousel.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
    clearInterval(autoPlay);
  }, { passive: true });

  carousel.addEventListener("touchmove", (e) => {
    touchMoveX = e.touches[0].clientX;
  }, { passive: true });

  carousel.addEventListener("touchend", () => {
    const diff = touchStartX - touchMoveX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else goTo(currentIndex - 1);
    }
    autoPlay = setInterval(next, 5000);
  });

  // Auto-play
  let autoPlay = setInterval(next, 5000);

  if (carousel) {
    carousel.addEventListener("mouseenter", () => clearInterval(autoPlay));
    carousel.addEventListener("mouseleave", () => {
      clearInterval(autoPlay);
      autoPlay = setInterval(next, 5000);
    });
  }
})();

// Feature Grid Dots Sync (Mobile)
(function() {
  const grid = document.querySelector('.features-grid');
  const dots = document.querySelectorAll('.indicators .dot');
  if(!grid || dots.length === 0) return;

  grid.addEventListener('scroll', () => {
    const scrollLeft = grid.scrollLeft;
    const width = grid.offsetWidth;
    const index = Math.round(scrollLeft / width);
    
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      const cardWidth = grid.querySelector('.feature-card').offsetWidth + 20; // width + gap
      grid.scrollTo({
        left: i * cardWidth,
        behavior: 'smooth'
      });
    });
  });
})();
