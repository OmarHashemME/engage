import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import Sidebar, { ActiveView } from './Sidebar';
import LessonFactory from './LessonFactory';
import ExamPage from './ExamPage';
import CourseInfoPage from './CourseInfoPage';
import MaterialsPage from './MaterialsPage';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { AcademicCapIcon } from './icons/AcademicCapIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import type { Course, Lesson, Module } from '../types';
import type { Page } from '../App';

interface CourseViewProps {
  course: Course;
  navigate: (page: Page) => void;
}

const CourseView: React.FC<CourseViewProps> = ({ course, navigate }) => {
  const [activeView, setActiveView] = useState<ActiveView>({ type: 'info' });
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(() => {
    const saved = localStorage.getItem(`completed_${course.id}`);
    const initial = saved ? JSON.parse(saved) : [];
    return new Set(initial);
  });
  const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // For desktop
  const [isLessonDropdownOpen, setIsLessonDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);


  // Memoize a flattened list of all lessons for easy navigation and progress calculation.
  const allLessons = useMemo(() => course.modules.flatMap(module => module.lessons), [course.modules]);

  useEffect(() => {
    localStorage.setItem(`completed_${course.id}`, JSON.stringify(Array.from(completedLessons)));
  }, [completedLessons, course.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLessonDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleViewChange = useCallback((view: ActiveView) => {
    setActiveView(view);
    setIsLessonDropdownOpen(false);
  }, []);

  const handleLessonComplete = useCallback((lessonId: string) => {
    setCompletedLessons(prev => {
        const newSet = new Set(prev);
        newSet.add(lessonId);
        return newSet;
    });
  }, []);

  const handleStartCourse = useCallback(() => {
    const firstLessonId = allLessons[0]?.id;
    if (firstLessonId) {
      setActiveView({ type: 'lesson', id: firstLessonId });
    }
  }, [allLessons]);

  const currentLessonIndex = useMemo(() => 
    activeView.type === 'lesson' ? allLessons.findIndex(l => l.id === activeView.id) : -1,
    [activeView, allLessons]
  );
  
  const handleNextLesson = useCallback(() => {
    if (currentLessonIndex !== -1 && currentLessonIndex < allLessons.length - 1) {
      setActiveView({ type: 'lesson', id: allLessons[currentLessonIndex + 1].id });
    }
  }, [currentLessonIndex, allLessons]);

  const handlePrevLesson = useCallback(() => {
    if (currentLessonIndex > 0) {
      setActiveView({ type: 'lesson', id: allLessons[currentLessonIndex - 1].id });
    }
  }, [currentLessonIndex, allLessons]);
  
  const currentLesson: Lesson | undefined = currentLessonIndex !== -1 ? allLessons[currentLessonIndex] : undefined;
  const totalLessons = allLessons.length;
  const progress = totalLessons > 0 ? (completedLessons.size / totalLessons) * 100 : 0;

  const renderContent = () => {
    switch(activeView.type) {
      case 'lesson':
        if (!currentLesson) {
          return <div className="text-center p-8">This course has no lessons yet.</div>
        }
        return (
           <LessonFactory 
              key={currentLesson.id}
              lesson={currentLesson} 
              onComplete={() => handleLessonComplete(currentLesson.id)}
              onNext={handleNextLesson}
              onPrev={handlePrevLesson}
              isFirst={currentLessonIndex === 0}
              isLast={currentLessonIndex === allLessons.length - 1}
              isCompleted={completedLessons.has(currentLesson.id)}
            />
        );
      case 'exam':
        return <ExamPage />;
      case 'info':
        return <CourseInfoPage courseInfoHTML={course.info} modules={course.modules} />;
      case 'materials':
        return <MaterialsPage />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 text-gray-800">
      <Sidebar 
        courseTitle={course.title}
        modules={course.modules}
        activeView={activeView}
        completedLessons={completedLessons}
        onViewChange={handleViewChange}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        progress={progress}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
      />
      <main className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-80'}`}>
        <div className="flex flex-col h-full">
          <header className="relative flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-20">
            {/* Left-aligned controls */}
            <div className="flex items-center space-x-1">
                <button 
                  onClick={() => navigate({ name: 'home' })} 
                  className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                  aria-label="Go to homepage"
                >
                    <BookOpenIcon className="h-6 w-6 text-indigo-600" />
                </button>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none md:hidden"
                    aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
            
            {/* Centered Title */}
            <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center space-x-3 pointer-events-none">
                <AcademicCapIcon className="h-8 w-8 text-indigo-600" />
                <h1 className="text-xl font-semibold text-gray-800 hidden sm:block truncate max-w-[200px] md:max-w-xs">{course.title}</h1>
            </div>

            {/* Right-aligned controls */}
            <div className="relative">
              {activeView.type === 'lesson' && currentLessonIndex !== -1 ? (
                <div>
                  <button
                    onClick={() => setIsLessonDropdownOpen(prev => !prev)}
                    className="flex items-center space-x-1 p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    aria-haspopup="true"
                    aria-expanded={isLessonDropdownOpen}
                  >
                    <div className="text-left">
                      <span className="text-xs text-gray-500 block">Course step</span>
                      <span className="font-semibold text-gray-800">{currentLessonIndex + 1} of {totalLessons}</span>
                    </div>
                    <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${isLessonDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isLessonDropdownOpen && (
                    <div
                      ref={dropdownRef}
                      className="absolute top-full mt-2 right-0 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20 origin-top-right animate-fade-in"
                      style={{ animationDuration: '150ms' }}
                      role="menu" aria-orientation="vertical"
                    >
                      <ul className="py-1 max-h-80 overflow-y-auto" role="none">
                        {allLessons.map((lesson, index) => (
                          <li key={lesson.id} role="none">
                            <button
                              onClick={() => {
                                handleViewChange({ type: 'lesson', id: lesson.id });
                              }}
                              className={`w-full text-left px-4 py-2.5 text-sm flex items-start ${
                                lesson.id === currentLesson?.id ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-800 hover:bg-gray-100'
                              }`}
                              role="menuitem"
                            >
                              <span className={`font-normal mr-3 ${lesson.id === currentLesson?.id ? 'text-indigo-600' : 'text-gray-500'}`}>
                                {index + 1}.
                              </span>
                              <span className="flex-1 truncate">{lesson.title}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                      <div className="border-t border-gray-100" role="none">
                        <button
                          onClick={() => {
                            handleViewChange({ type: 'info' });
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 flex items-center font-medium"
                          role="menuitem"
                        >
                          <ArrowLeftIcon className="h-4 w-4 mr-2" />
                          Back to Course Home
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                totalLessons > 0 && (
                  <button
                    onClick={handleStartCourse}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Start Course
                  </button>
                )
              )}
            </div>
        </header>
          
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseView;