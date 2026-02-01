import "./style.css";

// Dark mode toggle
const toggle = document.getElementById("theme-toggle");
const html = document.documentElement;

const isDark =
  localStorage.theme === "dark" ||
  (!localStorage.theme &&
    window.matchMedia("(prefers-color-scheme: dark)").matches);

if (isDark) {
  html.classList.add("dark");
  toggle.checked = true;
}

toggle.addEventListener("change", () => {
  if (toggle.checked) {
    html.classList.add("dark");
    localStorage.theme = "dark";
  } else {
    html.classList.remove("dark");
    localStorage.theme = "light";
  }
});

// Font select
const fontButton = document.getElementById("font-button");
const fontOptions = document.getElementById("font-options");
const arrow = document.getElementById("dropdown-arrow");
const currentFontLabel = document.getElementById("current-font-label");
const app = document.getElementById("dictionary-app");

function selectFont(value, label) {
  if (currentFontLabel) {
    currentFontLabel.innerText = label;
  }

  app.classList.remove("font-inter", "font-lora", "font-inconsolata");

  app.classList.add(value);

  localStorage.setItem("dictionary-font", value);
  localStorage.setItem("dictionary-font-label", label);
}

const toggleMenu = () => {
  const isExpanded = fontButton.getAttribute("aria-expanded") === "true";
  fontButton.setAttribute("aria-expanded", !isExpanded);

  fontOptions.classList.toggle("hidden");
  fontOptions.classList.toggle("flex");
  arrow.classList.toggle("rotate-180");
};

fontButton.addEventListener("click", toggleMenu);

fontOptions.addEventListener("click", (e) => {
  const option = e.target.closest('[role="option"]');
  if (!option) return;

  selectFont(option.dataset.value, option.dataset.label);
  toggleMenu();
});

fontOptions.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const option = e.target.closest('[role="option"]');
    if (!option) return;

    selectFont(option.dataset.value, option.dataset.label);
    toggleMenu();
    fontButton.focus();
  }
});

window.addEventListener("click", (e) => {
  const wrapper = document.getElementById("font-dropdown-wrapper");
  if (!wrapper.contains(e.target)) {
    fontOptions.classList.add("hidden");
    fontOptions.classList.remove("flex");
    fontButton.setAttribute("aria-expanded", "false");
    arrow.classList.remove("rotate-180");
  }
});

const savedFont = localStorage.getItem("dictionary-font");
const savedLabel = localStorage.getItem("dictionary-font-label");

if (savedFont && savedLabel) {
  selectFont(savedFont, savedLabel);
}
