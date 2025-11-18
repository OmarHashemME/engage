import React from 'react';
import type { Page } from '../App';
import { ChevronRightIcon } from './icons/ChevronRightIcon';
import type { Course, Hub } from '../types';

interface HomePageProps {
  navigate: (page: Page) => void;
  courses: Course[];
  hubs: Hub[];
}

const HomePage: React.FC<HomePageProps> = ({ navigate, courses, hubs }) => {
  const featuredCourse = courses[0];

  return (
    <div className="animate-fade-in">
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Unlock Your English Potential</span>
            <span className="block text-indigo-600">Start learning today.</span>
          </h1>
          <p className="mt-6 max-w-lg mx-auto text-xl text-gray-500">
            Join our community and master English with interactive courses and skill-based practice hubs.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow">
              <button
                onClick={() => navigate({ name: 'learningPaths' })}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Explore Learn Paths
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Featured Course Section */}
          {featuredCourse && (
            <div className="mb-16">
               <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Featured Course</h2>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900">{featuredCourse.title}</h3>
                    <p className="mt-4 text-gray-600">{featuredCourse.description}</p>
                    <div className="mt-6">
                       <button
                        onClick={() => navigate({ name: 'course', props: { courseId: featuredCourse.id } })}
                        className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Start Learning <ChevronRightIcon className="ml-2 -mr-1 h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
            </div>
          )}
          
          {/* Skill Hubs Section */}
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Practice Hubs</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {hubs.map((hub) => (
                <button
                  key={hub.id}
                  onClick={() => navigate({ name: 'hub', props: { hubId: hub.id } })}
                  className="group p-6 bg-white rounded-lg shadow-md text-left transition-all duration-300 hover:shadow-xl hover:border-indigo-500 border-2 border-transparent"
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                       <hub.icon className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-xl font-bold text-gray-900">{hub.title}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-gray-600">{hub.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
