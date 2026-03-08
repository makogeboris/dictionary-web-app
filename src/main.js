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

// Dictionary functionality
const form = document.getElementById("form");
const search = document.getElementById("search");
const errorMessage = document.getElementById("errorMessage");
const display = document.querySelector(".word-info");
import sadFace from "./assets/images/😕.png";
import newWindow from "./assets/images/icon-new-window.svg";

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const word = search.value;
  if (!word) {
    errorMessage.textContent = "Whoops, can’t be empty…";
    return;
  }

  errorMessage.textContent = "";

  getWord(word);
});

async function getWord(word) {
  display.innerHTML = `<div class="loader">
    <span></span><span></span><span></span>
  </div>`;

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }

    const data = await response.json();
    renderWord(data[0]);
    search.value = "";
  } catch (error) {
    display.innerHTML = `
    <div class="flex items-center flex-col text-center mt-20">
      <img src="${sadFace}" alt="" />

      <p class="text-base xs:text-xl font-bold text-neutral-800 mt-12">
        ${error.title || "Something went wrong"}
      </p>

      <p class="text-sm xs:text-lg font-normal text-neutral-500 mt-5">
        ${error.message || ""} ${error.resolution || ""}
      </p>
    </div>
    `;
    console.error(error.message);
  }
}

function renderWord(data) {
  const audioUrl = data.phonetics.find((p) => p.audio)?.audio;

  const meaningsHTML = data.meanings
    .map((meaning) => {
      const definitionsHTML = meaning.definitions
        .map(
          (def) => `
      <li class="font-normal pl-2 text-base tracking-tight text-neutral-800">
        ${def.definition}
        ${def.example ? `<p class="text-neutral-500 mt-2">"${def.example}"</p>` : ""}
      </li>
    `,
        )
        .join("");

      const synonyms = [
        ...meaning.synonyms,
        ...meaning.definitions.flatMap((def) => def.synonyms),
      ];
      const uniqueSynonyms = [...new Set(synonyms)];
      const synonymsHTML =
        uniqueSynonyms.length > 0
          ? `
      <div class="flex items-start gap-6 mt-6 sm:mt-12">
        <p class="text-base font-normal sm:text-xl text-neutral-500">Synonyms</p>
        <span class="text-base font-bold sm:text-xl text-purple-500">
          ${uniqueSynonyms.join(", ")}
        </span>
      </div>`
          : "";

      return `
      <div class="mt-7.5 sm:mt-12.5">
        <div class="flex items-center gap-5">
          <h2 class="text-lg font-bold sm:text-2xl text-neutral-800">${meaning.partOfSpeech}</h2>
          <div class="w-full h-px bg-neutral-200"></div>
        </div>

        <p class="text-base font-normal sm:text-xl text-neutral-500 mt-8 sm:mt-10">Meaning</p>

        <ul class="mt-6 space-y-3 sm:pl-11.5 list-disc list-inside sm:list-outside [&>li]:marker:text-purple-500">
          ${definitionsHTML}
        </ul>

        ${synonymsHTML}
      </div>
    `;
    })
    .join("");

  display.innerHTML = `
    <div class="mt-6 sm:mt-12 flex items-center justify-between">
      <div class="flex flex-col items-start">
        <h1 class="text-[2rem] sm:text-[4rem] text-neutral-800 font-bold">${data.word}</h1>
        <p class="italic font-normal text-lg sm:text-2xl text-purple-500">${data.phonetic || ""}</p>
      </div>

      <div>
        <audio id="audio" style="position: absolute; opacity: 0; pointer-events: none">
          <source src="${audioUrl || ""}" />
        </audio>

        <button
          type="button"
          aria-label="Play pronunciation"
          class="play-button group focus-visible:outline-2 focus-visible:outline-purple-500 focus-visible:outline-offset-3 rounded-full cursor-pointer"
          style="${audioUrl ? "" : "display:none"}"
        >
          <svg class="w-12 h-12 sm:w-18.5 sm:h-18.5 text-purple-500 group-hover:[&_circle]:opacity-100 group-hover:[&_path]:fill-white" viewBox="0 0 75 75" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle class="opacity-25 group-hover:opacity-100 transition-opacity duration-200" cx="37.5" cy="37.5" r="37.5" fill="currentColor" />
            <path class="fill-current group-hover:fill-white transition-colors duration-200" fill-rule="evenodd" clip-rule="evenodd" d="M29 27V48L50 37.5L29 27Z" />
          </svg>
        </button>
      </div>
    </div>

    ${meaningsHTML}

    <div class="w-full h-px bg-neutral-200 mt-8 sm:mt-12"></div>

    <div
  class="flex items-start sm:items-center flex-col sm:flex-row gap-2 sm:gap-5 mt-8 sm:mt-5"
>
  <p class="text-neutral-500 font-normal text-sm underline underline-offset-4">
    Source
  </p>

  <a
    id="source"
    class="flex items-center gap-2.5 text-neutral-800 font-normal text-sm underline underline-offset-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-purple-500 focus-visible:outline-offset-3 rounded"
    href='${data.sourceUrls[0]}'
    target="_blank"
  >
    <span id="sourceUrl">${data.sourceUrls[0]}</span>
    <img src="${newWindow}" alt="" />
  </a>
</div>
  `;
}

document.addEventListener("click", (e) => {
  if (e.target.closest(".play-button")) {
    const audioEl = document.getElementById("audio");
    if (audioEl) audioEl.play();
  }
});
