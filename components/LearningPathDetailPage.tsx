import React, { useState } from 'react';
import type { LearningPath } from '../types';
import type { Page } from '../App';
import { COURSES_DATA } from '../constants';
import CourseCard from './CourseCard';
import { GridViewIcon } from './icons/GridViewIcon';
import { ListViewIcon } from './icons/ListViewIcon';

interface LearningPathDetailPageProps {
  path: LearningPath;
  navigate: (page: Page) => void;
}

const LearningPathDetailPage: React.FC<LearningPathDetailPageProps> = ({ path, navigate }) => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const pathCourses = COURSES_DATA.filter(course => path.courseIds.includes(course.id));

  return (
    <div className="bg-white min-h-screen animate-fade-in">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="pb-8 border-b border-gray-200 mb-8">
          <p className="text-sm font-medium text-indigo-600">Learning Path</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            {path.title}
          </h1>
          <p className="mt-4 max-w-3xl text-xl text-gray-500">
            {path.description}
          </p>
        </div>
        
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Courses in this path</h2>
            <div className="flex items-center space-x-1 border border-gray-300 rounded-md p-1">
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

        <div className={view === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "flex flex-col space-y-4"
        }>
            {pathCourses.map(course => (
                <CourseCard key={course.id} course={course} view={view} navigate={navigate} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default LearningPathDetailPage;