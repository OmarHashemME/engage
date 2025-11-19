
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { vocabularyService } from '../services/vocabularyService';
import { dictionaryService, WordDefinition } from '../services/dictionaryService';
import { levelService } from '../services/levelService';
import { SpeakerWaveIcon } from './icons/SpeakerWaveIcon';
import type { CEFRLevel } from '../types';

interface SmartWordProps {
    children: string;
    mode: 'support' | 'challenge';
    userLevel: CEFRLevel;
}

const SmartWord: React.FC<SmartWordProps> = ({ children, mode, userLevel }) => {
    const [loading, setLoading] = useState(false);
    const [definition, setDefinition] = useState<WordDefinition | null>(null);
    const [translation, setTranslation] = useState<{text: string, isLink: boolean} | null>(null);
    
    const wordRef = useRef<HTMLElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    const cleanWord = vocabularyService.cleanWord(children);
    
    // Calculate difficulty gap based on the specific context (userLevel) provided
    const wordLevel = useMemo(() => levelService.getWordLevel(children), [children]);
    const difficultyGap = useMemo(() => {
        const userLevelIndex = levelService.getLevelIndex(userLevel);
        const wordLevelIndex = levelService.getLevelIndex(wordLevel);
        return wordLevelIndex - userLevelIndex;
    }, [wordLevel, userLevel]);

    // Determine underline style based on gap
    const underlineClass = useMemo(() => {
        if (difficultyGap >= 2) return 'border-red-400 hover:border-red-600'; // Too Hard
        if (difficultyGap === 1) return 'border-yellow-400 hover:border-yellow-600'; // Target Zone
        return 'border-indigo-200 hover:border-indigo-400'; // Default/Mildly Difficult
    }, [difficultyGap]);

    useEffect(() => {
        // Close popover if mode changes
        if (popoverRef.current) {
            try {
                // @ts-ignore
                popoverRef.current.hidePopover();
            } catch (e) { /* ignore */ }
        }
    }, [mode]);

    // Close popover on scroll to prevent detachment
    useEffect(() => {
        const handleScroll = () => {
            if (popoverRef.current && popoverRef.current.matches(':popover-open')) {
                 // @ts-ignore
                popoverRef.current.hidePopover();
            }
        };
        // Use capture to detect scroll on any parent element
        window.addEventListener('scroll', handleScroll, { capture: true });
        return () => window.removeEventListener('scroll', handleScroll, { capture: true });
    }, []);

    const handleSpeak = (e: React.MouseEvent) => {
        e.stopPropagation();
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(cleanWord);
            utterance.lang = 'en-US';
            window.speechSynthesis.speak(utterance);
        }
    };

    const updatePopoverPosition = () => {
        if (wordRef.current && popoverRef.current) {
            const rect = wordRef.current.getBoundingClientRect();
            const popRect = popoverRef.current.getBoundingClientRect();
            
            // Calculate centered position above the word
            let top = rect.top - popRect.height - 12;
            let left = rect.left + (rect.width / 2) - (popRect.width / 2);

            // Boundary checks to keep it on screen
            if (left < 10) left = 10;
            if (left + popRect.width > window.innerWidth) left = window.innerWidth - popRect.width - 10;
            if (top < 10) top = rect.bottom + 12; // Flip to bottom if no space on top

            popoverRef.current.style.position = 'fixed';
            popoverRef.current.style.left = `${left}px`;
            popoverRef.current.style.top = `${top}px`;
            popoverRef.current.style.margin = '0';
        }
    };

    const handleClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        
        const popover = popoverRef.current as any; // Cast for TS access to popover methods
        if (!popover) return;

        // Toggle logic
        if (popover.matches && popover.matches(':popover-open')) {
            popover.hidePopover();
            return;
        }

        // Don't fetch for very short words
        if (cleanWord.length < 2) return;

        setLoading(true);
        
        // Show first to allow measurement
        popover.showPopover();
        updatePopoverPosition();

        try {
            if (mode === 'challenge') {
                if (!definition) {
                    const data = await dictionaryService.getEnglishDefinition(cleanWord);
                    setDefinition(data);
                }
            } else {
                if (!translation) {
                    const data = await dictionaryService.getIndonesianTranslation(cleanWord);
                    setTranslation(data);
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            // Re-calculate position after content renders (height changes)
            requestAnimationFrame(() => updatePopoverPosition());
        }
    };

    return (
        <>
            <span
                ref={wordRef}
                onClick={handleClick}
                className={`
                    cursor-pointer rounded-sm px-0.5 transition-all duration-200 inline-block relative
                    hover:bg-indigo-50 select-none border-b-2 border-dotted ${underlineClass}
                `}
                role="button"
                aria-label={`Define ${children}`}
            >
                {children}
            </span>
            
            {/* Native Popover Element */}
            <div 
                ref={popoverRef}
                // @ts-ignore
                popover="auto"
                className="bg-white rounded-xl shadow-2xl border border-indigo-100 w-80 p-0 text-left text-gray-800 z-[100] max-w-[90vw] overflow-hidden"
            >
                 {loading ? (
                     <div className="flex justify-center items-center h-24">
                         <svg className="animate-spin h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                         </svg>
                     </div>
                 ) : (
                    <div className="p-4">
                         <div className="absolute top-3 right-3">
                            <span className={`inline-block px-2 py-0.5 text-xs font-bold rounded-md border ${
                                difficultyGap >= 2 ? 'bg-red-50 text-red-700 border-red-200' :
                                difficultyGap === 1 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                                {wordLevel}
                            </span>
                         </div>
                         
                         {mode === 'challenge' ? (
                             definition ? (
                                <div>
                                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100 pr-8">
                                        <div className="flex flex-col">
                                            <h4 className="font-bold text-indigo-900 text-2xl leading-none">{definition.word}</h4>
                                            {definition.phonetic && <span className="text-sm text-gray-500 font-mono mt-1">{definition.phonetic}</span>}
                                        </div>
                                        <button 
                                            onClick={handleSpeak}
                                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            title="Listen to pronunciation"
                                        >
                                            <SpeakerWaveIcon className="w-6 h-6" />
                                        </button>
                                    </div>
                                    <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                                        {definition.meanings.slice(0, 3).map((meaning, idx) => (
                                            <div key={idx}>
                                                <span className="inline-block px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs rounded-md mb-1 font-bold uppercase tracking-wide">{meaning.partOfSpeech}</span>
                                                <p className="text-sm text-gray-700 leading-relaxed">{meaning.definitions[0].definition}</p>
                                                {meaning.definitions[0].example && (
                                                    <p className="text-xs text-gray-500 italic mt-1 pl-2 border-l-2 border-gray-200">"{meaning.definitions[0].example}"</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                             ) : (
                                 <div className="text-center py-2 text-gray-500">
                                     <p>No definition found.</p>
                                     <button onClick={handleSpeak} className="text-indigo-600 text-sm mt-2 hover:underline">Try pronouncing it</button>
                                 </div>
                             )
                         ) : (
                             // Support Mode (Indonesian)
                             <div>
                                 <div className="flex items-center justify-between mb-2 pr-8">
                                     <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Indonesian Translation</span>
                                     <button 
                                            onClick={handleSpeak}
                                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            title="Listen to English pronunciation"
                                        >
                                            <SpeakerWaveIcon className="w-5 h-5" />
                                    </button>
                                 </div>
                                 {translation?.isLink ? (
                                     <div className="py-2">
                                        <a 
                                            href={translation.text} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors w-full justify-center"
                                        >
                                            Translate on Google
                                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                        </a>
                                     </div>
                                 ) : (
                                     <p className="text-xl font-bold text-gray-900 capitalize mt-1">{translation?.text}</p>
                                 )}
                             </div>
                         )}
                    </div>
                 )}
            </div>
        </>
    );
};

export default SmartWord;
