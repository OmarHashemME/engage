import React from 'react';
import type { Page } from '../App';
import { LEARNING_PATHS_DATA } from '../constants';

interface LearningPathsPageProps {
  navigate: (page: Page) => void;
}

const LearningPathsPage: React.FC<LearningPathsPageProps> = ({ navigate }) => {
  return (
    <div className="bg-white min-h-screen animate-fade-in">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Learning Paths
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Follow a structured path to achieve your learning goals. Each path is a curated collection of courses and exercises.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {LEARNING_PATHS_DATA.map((path) => {
             return (
              <div key={path.id} className="flex flex-col rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-indigo-600">
                      Path
                    </p>
                    <div className="block mt-2">
                      <p className="text-xl font-semibold text-gray-900">{path.title}</p>
                      <p className="mt-3 text-base text-gray-500">{path.description}</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={() => { 
                          navigate({ name: 'pathDetail', props: { pathId: path.id } });
                       }}
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      View Path
                    </button>
                  </div>
                </div>
              </div>
             );
            })}
           {/* Placeholder for more paths */}
           <div className="flex flex-col rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 overflow-hidden">
             <div className="flex-1 p-6 flex flex-col justify-center items-center text-center">
                <p className="text-lg font-semibold text-gray-500">More learning paths are on the way!</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPathsPage;