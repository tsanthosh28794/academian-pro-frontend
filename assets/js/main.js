
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

// Mega menu toggle
const megaTrigger = document.querySelector(".mega-trigger");
if (megaTrigger) {
  megaTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    const isExpanded = megaTrigger.getAttribute("aria-expanded") === "true";
    megaTrigger.setAttribute("aria-expanded", !isExpanded);
  });
}

function closeMenu() {
  if (navMenu && navMenu.classList.contains("active")) {
    navMenu.classList.remove("active");
    overlay.classList.remove("active");
    navToggle.setAttribute("aria-expanded", "false");
  }
  // Also close mega menu
  if (megaTrigger) {
    megaTrigger.setAttribute("aria-expanded", "false");
  }
}

// Close menus on Escape
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

// Close mega menu when clicking outside
document.addEventListener("click", (e) => {
  if (megaTrigger && !e.target.closest(".has-mega")) {
    megaTrigger.setAttribute("aria-expanded", "false");
  }
});
