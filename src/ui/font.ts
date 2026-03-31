export function initFont(
  fontButton: HTMLButtonElement,
  fontOptions: HTMLElement,
  arrow: HTMLElement,
  app: HTMLElement,
  currentFontLabel: HTMLElement,
): void {
  function selectFont(value: string, label: string): void {
    currentFontLabel.innerText = label;

    app.classList.remove("font-inter", "font-lora", "font-inconsolata");
    app.classList.add(value);

    localStorage.setItem("dictionary-font", value);
    localStorage.setItem("dictionary-font-label", label);
  }

  function toggleMenu(): void {
    const isExpanded = fontButton.getAttribute("aria-expanded") === "true";

    fontButton.setAttribute("aria-expanded", String(!isExpanded));
    fontOptions.classList.toggle("hidden");
    fontOptions.classList.toggle("flex");
    arrow.classList.toggle("rotate-180");
  }

  fontButton.addEventListener("click", toggleMenu);

  fontOptions.addEventListener("click", (e) => {
    const option = (e.target as Element).closest<HTMLElement>(
      '[role="option"]',
    );
    if (!option) return;

    selectFont(option.dataset.value!, option.dataset.label!);
    toggleMenu();
  });

  fontOptions.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const option = (e.target as Element).closest<HTMLElement>(
        '[role="option"]',
      );
      if (!option) return;

      selectFont(option.dataset.value!, option.dataset.label!);
      toggleMenu();
      fontButton.focus();
    }
  });

  window.addEventListener("click", (e) => {
    const wrapper = document.getElementById("font-dropdown-wrapper")!;
    if (!wrapper.contains(e.target as Node)) {
      fontOptions.classList.add("hidden");
      fontOptions.classList.remove("flex");
      fontButton.setAttribute("aria-expanded", "false");
      arrow.classList.remove("rotate-180");
    }
  });

  // Load saved font
  const savedFont = localStorage.getItem("dictionary-font");
  const savedLabel = localStorage.getItem("dictionary-font-label");

  if (savedFont && savedLabel) {
    selectFont(savedFont, savedLabel);
  }
}
