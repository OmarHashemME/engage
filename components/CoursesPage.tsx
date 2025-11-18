import React, { useState } from 'react';
import type { Page } from '../App';
import { COURSES_DATA } from '../constants';
import CourseCard from './CourseCard';
import { GridViewIcon } from './icons/GridViewIcon';
import { ListViewIcon } from './icons/ListViewIcon';

interface CoursesPageProps {
  navigate: (page: Page) => void;
}

const CoursesPage: React.FC<CoursesPageProps> = ({ navigate }) => {
    const [view, setView] = useState<'grid' | 'list'>('grid');

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <header className="pb-8 border-b border-gray-200 mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                            Courses
                        </h1>
                        <p className="mt-4 max-w-3xl text-lg text-gray-500">
                            We pare down complex topics to their key practical components, so you gain usable skills in a few hours (instead of weeks or months). The courses are provided at no cost to you, and you can now earn certificates. <a href="#" className="text-indigo-600 font-medium hover:underline">Learn more about courses</a>.
                        </p>
                    </div>
                    <div className="flex items-center space-x-1 border border-gray-300 rounded-md p-1 bg-white">
                        <button
                            onClick={() => setView('list')}
                            className={`p-1.5 rounded-md ${view === 'list' ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
                            aria-label="List view"
                            data-testid="list-view-button"
                        >
                            <ListViewIcon className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setView('grid')}
                            className={`p-1.5 rounded-md ${view === 'grid' ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
                            aria-label="Grid view"
                            data-testid="grid-view-button"
                        >
                            <GridViewIcon className="h-5 w-5" />
                        </button>
                    </div>
                </header>

                <main>
                    <div className={view === 'grid' 
                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        : "flex flex-col space-y-4"
                    }>
                        {COURSES_DATA.map(course => (
                            <CourseCard key={course.id} course={course} view={view} navigate={navigate} />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CoursesPage;