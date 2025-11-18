import React, { useState } from 'react';
import type { Hub } from '../types';
import type { Page } from '../App';
import { COURSES_DATA } from '../constants';
import CourseCard from './CourseCard';
import { GridViewIcon } from './icons/GridViewIcon';
import { ListViewIcon } from './icons/ListViewIcon';


interface HubPageProps {
  hub: Hub;
  navigate: (page: Page) => void;
}

const HubPage: React.FC<HubPageProps> = ({ hub, navigate }) => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const hubCourses = COURSES_DATA.filter(course => hub.courseIds.includes(course.id));

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

          <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Relevant Courses</h2>
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
            <div className={view === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "flex flex-col space-y-4"
            }>
                {hubCourses.map(course => (
                    <CourseCard key={course.id} course={course} view={view} navigate={navigate} />
                ))}
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