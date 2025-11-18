import React, { useState, useEffect } from 'react';
import type { Lesson } from '../types';
import Quiz from './Quiz';
import { ChevronLeftIcon } from './icons/ChevronLeftIcon';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import MarkdownPlaceholder from './MarkdownPlaceholder';

interface LessonContentProps {
  lesson: Lesson;
  onComplete: () => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
  isCompleted: boolean;
}

type Tab = 'learning' | 'practice';

const LessonContent: React.FC<LessonContentProps> = ({ lesson, onComplete, onNext, onPrev, isFirst, isLast, isCompleted }) => {
  const [activeTab, setActiveTab] = useState<Tab>('learning');
  const [htmlContent, setHtmlContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(lesson.content);
        if (!response.ok) {
          throw new Error(`Failed to load lesson content. Status: ${response.status}`);
        }
        const markdown = await response.text();
        // Use the 'marked' library, which is loaded from CDN in index.html
        const html = (window as any).marked.parse(markdown);
        setHtmlContent(html);
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

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{lesson.title}</h1>
        
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            <TabButton tabName="learning" label="Learning" />
            <TabButton tabName="practice" label="Practice" />
          </nav>
        </div>

        <div className="mt-6 min-h-[300px]">
          {activeTab === 'learning' && (
             <div className="prose max-w-none text-gray-600">
              {isLoading ? (
                <MarkdownPlaceholder />
              ) : error ? (
                <div className="text-red-500 p-4 bg-red-50 rounded-md">{error}</div>
              ) : (
                <div
                  key={lesson.id}
                  className="animate-fade-in"
                  style={{ animationDuration: '300ms' }}
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              )}
            </div>
          )}
          {activeTab === 'practice' && (
             <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Check your understanding</h2>
                <Quiz 
                  quizData={lesson.quiz} 
                  onCorrect={onComplete}
                  isLessonCompleted={isCompleted}
                />
             </div>
          )}
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
          disabled={isLast}
          className="flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRightIcon className="h-5 w-5 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default LessonContent;