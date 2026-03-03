
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
