
import React from 'react';
import type { Course } from '../types';
import type { Page } from '../App';
import { LockClosedIcon } from './icons/LockClosedIcon';

interface CourseCardProps {
  course: Course;
  view: 'grid' | 'list';
  navigate: (page: Page) => void;
  isLocked?: boolean;
}

interface ContentWrapperProps {
  children: React.ReactNode;
  isLocked: boolean;
}

const ContentWrapper: React.FC<ContentWrapperProps> = ({ children, isLocked }) => (
  <div className={`relative transition-all duration-300 ${isLocked ? 'opacity-60 grayscale pointer-events-none select-none' : 'opacity-100'}`}>
      {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="bg-slate-800/90 text-white rounded-full p-3 shadow-2xl ring-4 ring-white/50 backdrop-blur-sm">
                  <LockClosedIcon className="w-8 h-8" />
              </div>
          </div>
      )}
      {children}
  </div>
);

const CourseCard: React.FC<CourseCardProps> = ({ course, view, navigate, isLocked = false }) => {
  const handleNavigate = () => {
    if (!isLocked) {
        navigate({ name: 'course', props: { courseId: course.id } });
    }
  };

  // Determine badge color based on CEFR level group
  let badgeColor = 'bg-gray-100 text-gray-800';
  if (['A1', 'A2'].includes(course.level)) badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
  else if (['B1', 'B2'].includes(course.level)) badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
  else badgeColor = 'bg-rose-100 text-rose-800 border-rose-200'; // C1, C2

  const renderTooltip = (text: string) => (
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 w-64 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
      <div className="bg-slate-800 text-white text-xs rounded-md py-2 px-3 shadow-xl text-center leading-snug relative">
        {text}
        <div className="w-2 h-2 bg-slate-800 transform rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1"></div>
      </div>
    </div>
  );

  if (view === 'grid') {
    return (
      <button 
        onClick={handleNavigate}
        disabled={isLocked}
        className={`group relative text-left w-full bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full ${isLocked ? 'cursor-not-allowed bg-gray-50' : 'cursor-pointer'}`}
        aria-label={`${isLocked ? 'Locked course' : 'Start course'}: ${course.title}`}
      >
        {renderTooltip(isLocked ? `Locked: Recommended for ${course.level} level or higher.` : course.description)}
        <ContentWrapper isLocked={isLocked}>
            <div className="p-5 flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg">
                <course.icon className="w-8 h-8 text-indigo-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-gray-900 truncate pr-2">{course.title}</h3>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${badgeColor}`}>
                        {course.level}
                    </span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                <span>{course.duration}</span>
                {course.details && <span> • {course.details}</span>}
                </div>
            </div>
            </div>
            <div className="px-5 pb-5 mt-auto">
            <p className="text-sm text-gray-600 mb-3 h-10 line-clamp-2">{course.description}</p>
            <p className="text-xs text-gray-400 truncate font-medium">{course.prerequisites}</p>
            </div>
        </ContentWrapper>
      </button>
    );
  }

  return (
    <button 
      onClick={handleNavigate}
      disabled={isLocked}
      className={`group relative text-left w-full bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 flex items-center space-x-4 ${isLocked ? 'cursor-not-allowed bg-gray-50' : 'cursor-pointer'}`}
      aria-label={`${isLocked ? 'Locked course' : 'Start course'}: ${course.title}`}
    >
      {renderTooltip(isLocked ? "This course is locked." : course.description)}
      <ContentWrapper isLocked={isLocked}>
        <div className="flex items-center space-x-4 w-full">
            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 rounded-md">
                <course.icon className="w-6 h-6 text-indigo-600" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-gray-900 truncate">{course.title}</h3>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${badgeColor}`}>
                        {course.level}
                    </span>
                </div>
                <p className="text-sm text-gray-600 mt-1 truncate">{course.description}</p>
            </div>
        </div>
      </ContentWrapper>
    </button>
  );
};

export default CourseCard;
