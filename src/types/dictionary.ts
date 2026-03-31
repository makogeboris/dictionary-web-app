export interface Phonetic {
  audio?: string;
}

export interface Definition {
  definition: string;
  example?: string;
  synonyms: string[];
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms: string[];
}

export interface WordData {
  word: string;
  phonetic?: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
  sourceUrls: string[];
}

export interface ApiError {
  title?: string;
  message?: string;
  resolution?: string;
}
