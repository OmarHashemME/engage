
export interface WordDefinition {
  word: string;
  phonetic?: string;
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string;
    }[];
  }[];
}

// A lightweight client-side map for common course terms to Indonesian.
// Fallback to Google Translate for others.
const ID_DICTIONARY: Record<string, string> = {
  "context": "konteks",
  "artifact": "artefak",
  "archaeologist": "arkeolog",
  "fragile": "rapuh",
  "gist": "intisari",
  "skimming": "membaca sepintas",
  "scanning": "memindai",
  "prefix": "awalan",
  "suffix": "akhiran",
  "verb": "kata kerja",
  "noun": "kata benda",
  "adjective": "kata sifat",
  "adverb": "kata keterangan",
  "vocabulary": "kosakata",
  "essentials": "dasar-dasar",
  "comprehension": "pemahaman",
  "strategies": "strategi",
  "stage": "panggung",
  "fright": "ketakutan",
  "creative": "kreatif",
  "workshop": "lokakarya",
  "academic": "akademik",
  "grammar": "tata bahasa",
  "guide": "panduan",
  "reading": "membaca",
  "listening": "mendengarkan",
  "speaking": "berbicara",
  "writing": "menulis",
  "power": "kekuatan",
  "unlocking": "membuka",
  "phrasal": "frasa",
  "idioms": "idiom",
  "conversation": "percakapan",
  "daily": "sehari-hari",
  "public": "publik",
  "skills": "keterampilan",
  "active": "aktif",
  "mastering": "menguasai",
  "advanced": "lanjutan",
  "mixed": "campuran",
  "conditionals": "pengandaian",
  "formal": "formal",
  "transition": "transisi",
  "words": "kata-kata",
  "cohesion": "kepaduan",
  "show": "tunjukkan",
  "tell": "katakan",
  "descriptive": "deskriptif",
  "overcoming": "mengatasi"
};

export const dictionaryService = {
  /**
   * Fetches English definition from the Free Dictionary API.
   */
  async getEnglishDefinition(word: string): Promise<WordDefinition | null> {
    try {
      // Using free dictionaryapi.dev
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (!response.ok) {
         return null;
      }
      const data = await response.json();
      // Return the first entry
      return data[0] as WordDefinition;
    } catch (error) {
      console.error("Dictionary API error:", error);
      return null;
    }
  },

  /**
   * Returns Indonesian translation from local map or a link to Google Translate.
   */
  async getIndonesianTranslation(word: string): Promise<{text: string, isLink: boolean}> {
    // Simulate network delay for consistency
    await new Promise(resolve => setTimeout(resolve, 100));

    const clean = word.toLowerCase().replace(/[^a-z]/g, '');
    if (ID_DICTIONARY[clean]) {
      return { text: ID_DICTIONARY[clean], isLink: false };
    }
    
    return { 
      text: `https://translate.google.com/?sl=en&tl=id&text=${word}&op=translate`, 
      isLink: true 
    };
  }
};
