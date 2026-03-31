import "./style.css";

import type { WordData, ApiError } from "./types/dictionary";
import { renderWord, renderLoading, renderError } from "./ui/render";
import { initTheme } from "./ui/theme";
import { initFont } from "./ui/font";

const toggle = document.getElementById("theme-toggle") as HTMLInputElement;
const fontButton = document.getElementById("font-button") as HTMLButtonElement;
const fontOptions = document.getElementById("font-options") as HTMLElement;
const arrow = document.getElementById("dropdown-arrow") as HTMLElement;
const currentFontLabel = document.getElementById(
  "current-font-label",
) as HTMLElement;
const app = document.getElementById("dictionary-app") as HTMLElement;
const form = document.getElementById("form") as HTMLFormElement;
const search = document.getElementById("search") as HTMLInputElement;
const errorMessage = document.getElementById("errorMessage") as HTMLElement;
const displayEl = document.querySelector<HTMLElement>(".word-info");

if (!displayEl) {
  throw new Error("Display element not found");
}

const display = displayEl;

initTheme(toggle);
initFont(fontButton, fontOptions, arrow, app, currentFontLabel);

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const word = search.value.trim();
  if (!word) {
    errorMessage.textContent = "Whoops, can't be empty…";
    return;
  }

  errorMessage.textContent = "";
  getWord(word);
});

async function getWord(word: string): Promise<void> {
  renderLoading(display);

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
    );

    if (!response.ok) {
      const errorData: ApiError = await response.json();
      throw errorData;
    }

    const data: WordData[] = await response.json();
    renderWord(data[0], display);
  } catch (error) {
    const err = error as ApiError;

    renderError(display, err);
    console.error(err);
  }

  search.value = "";
}

document.addEventListener("click", (e) => {
  if ((e.target as Element).closest(".play-button")) {
    const audioEl = document.getElementById("audio") as HTMLAudioElement | null;
    audioEl?.play();
  }
});
