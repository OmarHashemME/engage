export interface PronunciationWord {
  word: string;
  phonetic: string;
  tip: string;
}

export const PRONUNCIATION_WORDS: PronunciationWord[] = [
  { word: 'Though', phonetic: '/ðoʊ/', tip: 'The "gh" is silent. Rhymes with "go".' },
  { word: 'Tough', phonetic: '/tʌf/', tip: 'Pronounced like "tuff". Rhymes with "rough".' },
  { word: 'Thought', phonetic: '/θɔːt/', tip: 'The "o-u-g-h" makes an "awt" sound.' },
  { word: 'Colonel', phonetic: '/ˈkɜːrnəl/', tip: 'Pronounced like "kernel". The first "l" and the "o" are silent.' },
  { word: 'Worcestershire', phonetic: '/ˈwʊstərʃər/', tip: 'Pronounced "WUSS-ter-sher".' },
  { word: 'Anemone', phonetic: '/əˈnɛməni/', tip: 'Stress is on the second syllable: a-NEM-o-nee.' },
  { word: 'Squirrel', phonetic: '/ˈskwɜːrəl/', tip: 'Often tricky; sounds like "SKWUR-ul".' },
  { word: 'Choir', phonetic: '/ˈkwaɪər/', tip: 'Pronounced "kw-AY-er".' },
];