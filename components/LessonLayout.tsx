import React, { useState, useEffect } from 'react';
import type { Lesson } from '../types';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';
import { AcademicCapIcon } from './icons/AcademicCapIcon';
import MarkdownPlaceholder from './MarkdownPlaceholder';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SmartWord from './SmartWord';

export interface LessonLayoutProps {
  lesson: Lesson;
  onComplete: () => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
  isCompleted: boolean;
  children: React.ReactNode; // Practice tab content (Specific to strategy)
}

type Tab = 'learning' | 'practice';
type Mode = 'support' | 'challenge';

const LessonLayout: React.FC<LessonLayoutProps> = ({ 
  lesson, 
  onComplete, 
  onNext, 
  onPrev, 
  isFirst, 
  isLast, 
  isCompleted,
  children 
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('learning');
  const [mode, setMode] = useState<Mode>('support');
  const [markdownContent, setMarkdownContent] = useState('');
  const [vocabulary, setVocabulary] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selfCheck, setSelfCheck] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      setError(null);
      setVocabulary([]);
      setSelfCheck(false);
      
      try {
        const response = await fetch(lesson.content);
        if (!response.ok) {
          throw new Error(`Failed to load lesson content. Status: ${response.status}`);
        }
        const markdown = await response.text();
        setMarkdownContent(markdown);
        
        // Extract vocabulary from bold text (**word**) for the Word Bank
        const matches = markdown.match(/\*\*(.*?)\*\*/g);
        if (matches) {
             const words = matches.map(m => m.replace(/\*\*/g, '')).filter(w => w.trim().length > 0);
             setVocabulary([...new Set(words)]);
        }

      } catch (err) {
        console.error("Error fetching lesson:", err);
        setError("Could not load lesson content. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [lesson.id, lesson.content]);

  const TabButton: React.FC<{ tabName: Tab; label: string }> = ({ tabName, label }) => {
    const isActive = activeTab === tabName;
    return (
      <button
        onClick={() => setActiveTab(tabName)}
        className={`px-4 py-2 text-sm font-medium rounded-t-lg focus:outline-none transition-colors duration-200
          ${isActive 
            ? 'border-b-2 border-indigo-500 text-indigo-600' 
            : 'text-gray-500 hover:text-gray-700'
          }`}
        aria-current={isActive ? 'page' : undefined}
      >
        {label}
      </button>
    );
  };

  // Helper component to split text nodes into SmartWords
  const TextSplitter = ({ children }: { children?: React.ReactNode }) => {
      return (
          <>
            {React.Children.map(children, (child) => {
                if (typeof child === 'string') {
                    // Split by whitespace but capture delimiters to preserve spacing
                    return child.split(/(\s+)/).map((part, i) => {
                        // Preserve whitespace as string, wrap actual words
                        if (part.match(/^\s+$/)) return part;
                        if (part === '') return null;
                        // Pass the current mode to SmartWord
                        return <SmartWord key={i} mode={mode}>{part}</SmartWord>;
                    });
                }
                return child;
            })}
          </>
      );
  };

  // Configuration for ReactMarkdown
  const markdownComponents = {
      p: ({ children }: any) => <p className="mb-4 leading-relaxed text-gray-800"><TextSplitter>{children}</TextSplitter></p>,
      li: ({ children }: any) => <li className="mb-2 ml-4 list-disc text-gray-800"><TextSplitter>{children}</TextSplitter></li>,
      h1: ({ children }: any) => <h1 className="text-3xl font-bold mb-6 text-gray-900">{children}</h1>,
      h2: ({ children }: any) => <h2 className="text-2xl font-bold mb-4 mt-8 text-gray-900 border-b pb-2">{children}</h2>,
      h3: ({ children }: any) => <h3 className="text-xl font-bold mb-3 mt-6 text-gray-900">{children}</h3>,
      strong: ({ children }: any) => <strong className="font-bold text-indigo-900"><TextSplitter>{children}</TextSplitter></strong>,
      em: ({ children }: any) => <em className="italic text-gray-800"><TextSplitter>{children}</TextSplitter></em>,
      blockquote: ({ children }: any) => <blockquote className="border-l-4 border-indigo-300 pl-4 italic my-6 bg-gray-50 p-4 rounded-r-lg text-gray-700"><TextSplitter>{children}</TextSplitter></blockquote>,
      table: ({ children }: any) => <div className="overflow-x-auto mb-6"><table className="min-w-full divide-y divide-gray-200 border">{children}</table></div>,
      thead: ({ children }: any) => <thead className="bg-gray-50">{children}</thead>,
      th: ({ children }: any) => <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">{children}</th>,
      td: ({ children }: any) => <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-b">{children}</td>,
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
         <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
         
         {/* Support/Challenge Mode Toggle */}
         <div className="inline-flex bg-gray-200 p-1 rounded-lg flex-shrink-0 self-start md:self-center shadow-inner">
            <button
                onClick={() => setMode('support')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center transition-all duration-200 ${
                    mode === 'support' 
                    ? 'bg-white text-indigo-700 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                aria-pressed={mode === 'support'}
            >
                <LightbulbIcon className="w-4 h-4 mr-1.5" />
                Support
            </button>
            <button
                onClick={() => setMode('challenge')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md flex items-center transition-all duration-200 ${
                    mode === 'challenge' 
                    ? 'bg-white text-red-700 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                aria-pressed={mode === 'challenge'}
            >
                <AcademicCapIcon className="w-4 h-4 mr-1.5" />
                Challenge
            </button>
          </div>
      </div>

      {/* Mode Info Banner */}
      <div className={`mb-6 p-4 rounded-lg text-sm border transition-colors duration-300 flex items-start ${
           mode === 'support' 
           ? 'bg-indigo-50 border-indigo-100 text-indigo-800' 
           : 'bg-orange-50 border-orange-100 text-orange-800'
       }`}>
           <div className="mr-3 mt-0.5 flex-shrink-0">
             {mode === 'support' ? <LightbulbIcon className="w-5 h-5" /> : <AcademicCapIcon className="w-5 h-5" />}
           </div>
           <div>
               <span className="font-bold block mb-1">{mode === 'support' ? 'Support Mode Active' : 'Challenge Mode Active'}</span>
               {mode === 'support' 
                 ? 'Click any word to see its Indonesian translation. Key terms are highlighted in the Word Bank.' 
                 : 'Click any word to see its English definition. Scaffolding aids are hidden to encourage immersion.'}
           </div>
       </div>

      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            <TabButton tabName="learning" label="Learning" />
            <TabButton tabName="practice" label="Practice" />
          </nav>
        </div>

        <div className="mt-6 min-h-[300px]">
          {activeTab === 'learning' && (
             <div className="flex flex-col lg:flex-row gap-8">
                <div className="prose max-w-none flex-1">
                  {isLoading ? (
                    <MarkdownPlaceholder />
                  ) : error ? (
                    <div className="text-red-500 p-4 bg-red-50 rounded-md">{error}</div>
                  ) : (
                    <div className="animate-fade-in">
                       <ReactMarkdown 
                            components={markdownComponents}
                            remarkPlugins={[remarkGfm]}
                        >
                            {markdownContent}
                       </ReactMarkdown>
                    </div>
                  )}
                </div>

                {/* Word Bank Scaffold - Visible only in Support Mode */}
                {mode === 'support' && !isLoading && vocabulary.length > 0 && (
                   <aside className="lg:w-64 flex-shrink-0 animate-fade-in">
                      <div className="bg-indigo-50 rounded-lg p-5 border border-indigo-100 sticky top-6">
                          <h3 className="font-bold text-indigo-900 mb-4 flex items-center border-b border-indigo-200 pb-2">
                              <LightbulbIcon className="w-5 h-5 mr-2 text-indigo-600" />
                              Word Bank
                          </h3>
                          <ul className="space-y-2">
                              {vocabulary.map((word, index) => (
                                  <li key={index} className="flex items-start group cursor-help">
                                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 mr-2 flex-shrink-0 group-hover:bg-indigo-600 transition-colors"></span>
                                      <span className="text-sm text-indigo-800 group-hover:text-indigo-900 transition-colors font-medium">
                                        {word}
                                      </span>
                                  </li>
                              ))}
                          </ul>
                          <p className="text-xs text-indigo-400 mt-4 pt-2 border-t border-indigo-200">
                            These terms appear in the text.
                          </p>
                      </div>
                   </aside>
                )}
             </div>
          )}
          {activeTab === 'practice' && (
             <div className="animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Check your understanding</h2>
                {/* Render specific strategy content here */}
                {children}
             </div>
          )}
        </div>
      </div>
      
      {/* Self-Check Section */}
      <div className="mt-6 flex justify-center md:justify-end animate-fade-in">
          <div className={`flex items-center p-4 rounded-lg border-l-4 shadow-sm transition-all duration-300 ${selfCheck ? 'bg-green-50 border-green-500' : 'bg-yellow-50 border-yellow-400'}`}>
            <input
                id="self-check"
                type="checkbox"
                checked={selfCheck}
                onChange={(e) => setSelfCheck(e.target.checked)}
                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
            />
            <label htmlFor="self-check" className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer select-none">
                Self-Check: I can explain this concept in my own words
            </label>
          </div>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={onPrev}
          disabled={isFirst}
          className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeftIcon className="h-5 w-5 mr-2" />
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={isLast || !selfCheck}
          className="flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRightIcon className="h-5 w-5 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default LessonLayout;