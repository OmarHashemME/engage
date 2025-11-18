import React, { useState } from 'react';
import type { Module } from '../types';

interface CourseInfoPageProps {
  courseInfoHTML: string;
  modules: Module[];
}

type Tab = 'info' | 'syllabus';

const CourseInfoPage: React.FC<CourseInfoPageProps> = ({ courseInfoHTML, modules }) => {
  const [activeTab, setActiveTab] = useState<Tab>('info');

  const TabButton: React.FC<{ tabName: Tab; label: string }> = ({ tabName, label }) => {
    const isActive = activeTab === tabName;
    return (
      <button
        onClick={() => setActiveTab(tabName)}
        className={`px-4 py-2 text-sm font-medium focus:outline-none transition-colors duration-200
          ${isActive 
            ? 'border-b-2 border-indigo-500 text-indigo-600' 
            : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
          }`}
        aria-current={isActive ? 'page' : undefined}
      >
        {label}
      </button>
    );
  };


  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg animate-fade-in">
      <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            <TabButton tabName="info" label="Course Information" />
            <TabButton tabName="syllabus" label="Syllabus" />
          </nav>
      </div>

      <div className="mt-6 min-h-[400px]">
        {activeTab === 'info' && (
          <div 
            key="info-tab"
            className="prose max-w-none animate-fade-in"
            style={{animationDuration: '300ms'}}
            dangerouslySetInnerHTML={{ __html: courseInfoHTML }}
          />
        )}
        {activeTab === 'syllabus' && (
          <div 
            key="syllabus-tab"
            className="animate-fade-in"
            style={{animationDuration: '300ms'}}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Course Syllabus</h2>
            <div className="space-y-8">
              {modules.map(module => (
                <div key={module.id}>
                  <h3 className="text-xl font-semibold text-gray-700 pb-2 border-b border-gray-200">{module.title}</h3>
                  <ul className="mt-4 space-y-3">
                    {module.lessons.map((lesson, index) => (
                      <li key={lesson.id} className="flex items-center text-gray-600 p-2 rounded-md hover:bg-gray-50">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-200 text-slate-600 text-xs font-bold flex items-center justify-center mr-4">{index + 1}</span>
                        <span>{lesson.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseInfoPage;
