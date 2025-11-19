
import React, { useState } from 'react';
import type { Hub, Course, CEFRLevel } from '../types';
import type { Page } from '../App';
import CourseCard from './CourseCard';
import { GridViewIcon } from './icons/GridViewIcon';
import { ListViewIcon } from './icons/ListViewIcon';
import PronunciationGuide from './PronunciationGuide';
import { levelService } from '../services/levelService';
import { USER_DATA } from '../constants';


interface HubPageProps {
  hub: Hub;
  courses: Course[];
  navigate: (page: Page) => void;
}

const HubPage: React.FC<HubPageProps> = ({ hub, courses: hubCourses, navigate }) => {
  const [view, setView] = useState<'grid' | 'list'>('grid');

  // Determine user level specifically for this hub type (e.g. 'reading', 'listening')
  const effectiveUserLevel = levelService.getEffectiveLevel(USER_DATA, hub.id);

  // Group courses by CEFR Level for better organization
  const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  
  // Create a map of courses by level
  const coursesByLevel: Record<string, Course[]> = {};
  levels.forEach(l => coursesByLevel[l] = []);

  // Categorize
  hubCourses.forEach(course => {
      const normalized = levelService.resolveCourseLevel(course);
      if (coursesByLevel[normalized]) {
          coursesByLevel[normalized].push(course);
      } else {
          // Fallback for any odd mapping
          coursesByLevel['A1'].push(course);
      }
  });

  return (
    <div className="bg-gray-50 min-h-screen animate-fade-in">
       <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <header className="pb-8 border-b border-gray-200 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center">
                <hub.icon className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                  {hub.title}
                </h1>
                <p className="mt-1 max-w-2xl text-lg text-gray-500">
                  {hub.description}
                </p>
              </div>
            </div>
          </header>

          {hub.id === 'speaking' && <PronunciationGuide />}

          <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Course Progression</h2>
              <div className="flex items-center space-x-1 border border-gray-300 rounded-md p-1 bg-white">
                  <button
                      onClick={() => setView('list')}
                      className={`p-1.5 rounded-md ${view === 'list' ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
                      aria-label="List view"
                  >
                      <ListViewIcon className="h-5 w-5" />
                  </button>
                  <button
                      onClick={() => setView('grid')}
                      className={`p-1.5 rounded-md ${view === 'grid' ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
                      aria-label="Grid view"
                  >
                      <GridViewIcon className="h-5 w-5" />
                  </button>
              </div>
          </div>

          {hubCourses.length > 0 ? (
            <div className="space-y-12">
                {levels.map((level) => {
                    const levelCourses = coursesByLevel[level];
                    if (levelCourses.length === 0) return null;

                    const isLevelLocked = levelService.getLevelIndex(level) > levelService.getLevelIndex(effectiveUserLevel) + 1;

                    return (
                        <section key={level} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center mb-4 border-b border-gray-100 pb-2">
                                <span className={`text-lg font-bold w-10 h-10 rounded-full flex items-center justify-center mr-3 ${isLevelLocked ? 'bg-gray-200 text-gray-500' : 'bg-indigo-100 text-indigo-700'}`}>
                                    {level}
                                </span>
                                <h3 className={`text-xl font-bold ${isLevelLocked ? 'text-gray-400' : 'text-gray-900'}`}>
                                    {level} Level Courses
                                </h3>
                                {isLevelLocked && <span className="ml-3 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-100 px-2 py-1 rounded">Locked</span>}
                            </div>
                            
                            <div className={view === 'grid' 
                                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                : "flex flex-col space-y-4"
                            }>
                                {levelCourses.map(course => (
                                    <CourseCard 
                                        key={course.id} 
                                        course={course} 
                                        view={view} 
                                        navigate={navigate} 
                                        isLocked={isLevelLocked}
                                    />
                                ))}
                            </div>
                        </section>
                    );
                })}
            </div>
          ) : (
            <div className="text-center py-12 px-6 border-2 border-dashed border-gray-300 rounded-lg bg-white">
              <h3 className="text-xl font-bold text-gray-700">No Courses Yet</h3>
              <p className="mt-2 text-gray-500">
                We're developing courses for the {hub.title} hub. Please check back soon!
              </p>
            </div>
          )}
        </div>
    </div>
  );
};

export default HubPage;
