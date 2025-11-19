import React from 'react';
import { PRONUNCIATION_WORDS } from '../constants/pronunciation-words';
import { SpeakerWaveIcon } from './icons/SpeakerWaveIcon';

const PronunciationGuide: React.FC = () => {

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      // Optional: Find a specific voice
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(voice => voice.lang.startsWith('en-'));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      utterance.pitch = 1;
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, your browser doesn't support text-to-speech.");
    }
  };
  
  // Pre-load voices to ensure they are available on the first click
  React.useEffect(() => {
    if ('speechSynthesis' in window && window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices();
        };
    }
  }, []);

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Pronunciation Practice</h2>
      <p className="text-gray-600 mb-6">
        Practice your pronunciation with these commonly tricky words. Click the speaker icon to hear the word spoken.
      </p>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <ul className="divide-y divide-gray-200">
          {PRONUNCIATION_WORDS.map((item, index) => (
            <li key={index} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center">
                <button 
                  onClick={() => handleSpeak(item.word)}
                  className="p-2 rounded-full text-indigo-600 hover:bg-indigo-50 transition-colors"
                  aria-label={`Listen to ${item.word}`}
                >
                  <SpeakerWaveIcon className="h-6 w-6" />
                </button>
                <div className="ml-3">
                  <p className="text-lg font-semibold text-gray-800">{item.word} <span className="ml-2 text-base font-normal text-gray-500">{item.phonetic}</span></p>
                </div>
              </div>
              <p className="mt-2 sm:mt-0 sm:ml-4 text-sm text-gray-600 flex-shrink-0 max-w-xs text-left sm:text-right">{item.tip}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default PronunciationGuide;