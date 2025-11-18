import React, { useEffect } from 'react';
import type { Module } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { AcademicCapIcon } from './icons/AcademicCapIcon';
import { InformationCircleIcon } from './icons/InformationCircleIcon';
import { DocumentTextIcon } from './icons/DocumentTextIcon';
import { ChevronDoubleLeftIcon } from './icons/ChevronDoubleLeftIcon';

export type ActiveView = { type: 'lesson'; id: string } | { type: 'exam' } | { type: 'info' } | { type: 'materials' };

interface SidebarProps {
  courseTitle: string;
  modules: Module[];
  activeView: ActiveView;
  completedLessons: Set<string>;
  onViewChange: (view: ActiveView) => void;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  progress: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  courseTitle, 
  modules, 
  activeView, 
  completedLessons, 
  onViewChange, 
  isOpen, 
  setIsOpen, 
  progress, 
  isCollapsed,
  onToggleCollapse,
}) => {
  const [openModules, setOpenModules] = React.useState<Set<string>>(() => {
    if (activeView.type === 'lesson') {
      const currentModule = modules.find(m => m.lessons.some(l => l.id === activeView.id));
      return new Set(currentModule ? [currentModule.id] : []);
    }
    return new Set();
  });

  useEffect(() => {
    if (activeView.type === 'lesson') {
      const currentModule = modules.find(m => m.lessons.some(l => l.id === activeView.id));
      if (currentModule && !openModules.has(currentModule.id)) {
        setOpenModules(prev => new Set(prev).add(currentModule.id));
      }
    }
  }, [activeView, modules, openModules]);

  const toggleModule = (moduleId: string) => {
    setOpenModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const courseTools = [
    { type: 'exam', label: 'Exam & Grades', icon: AcademicCapIcon },
    { type: 'info', label: 'Course Info', icon: InformationCircleIcon },
    { type: 'materials', label: 'Materials', icon: DocumentTextIcon },
  ];

  return (
    <>
      <aside className={`fixed top-0 left-0 z-40 h-screen bg-slate-800 text-white flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-80'} ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-4 border-b border-slate-700">
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                <h2 className={`text-xl font-bold truncate ${isCollapsed ? 'hidden' : ''}`}>{courseTitle}</h2>
                <button
                    onClick={onToggleCollapse}
                    className="p-1 text-slate-400 hover:bg-slate-700 rounded-md hidden md:block"
                    aria-label="Collapse menu"
                >
                    <ChevronDoubleLeftIcon className={`h-6 w-6 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
                </button>
            </div>
            <div className={`mt-4 ${isCollapsed ? 'hidden' : ''}`}>
                <span className="text-xs font-semibold text-slate-400">PROGRESS</span>
                <div className="w-full bg-slate-600 rounded-full h-2.5 mt-1">
                    <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <p className="text-sm text-slate-300 mt-1">{Math.round(progress)}% Complete</p>
            </div>
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className={isCollapsed ? 'hidden' : ''}>
            {modules.map((module) => {
                const isModuleOpen = openModules.has(module.id);
                return (
                  <div key={module.id} className="border-b border-slate-700">
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="w-full text-left p-4 flex items-center justify-between bg-slate-900 hover:bg-slate-700 transition-colors"
                    >
                      <span className="font-bold">{module.title}</span>
                      <ChevronDownIcon className={`h-5 w-5 transition-transform ${isModuleOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isModuleOpen && (
                      <ul className="bg-slate-800">
                        {module.lessons.map((lesson, lessonIndex) => {
                          const isActive = activeView.type === 'lesson' && activeView.id === lesson.id;
                          const isCompleted = completedLessons.has(lesson.id);

                          return (
                            <li key={lesson.id}>
                              <button
                                onClick={() => onViewChange({ type: 'lesson', id: lesson.id })}
                                className={`w-full text-left p-4 pl-8 flex items-center justify-between transition-colors duration-200 ${
                                  isActive ? 'bg-indigo-600' : 'hover:bg-slate-700'
                                }`}
                              >
                                <div className="flex items-center min-w-0 flex-1">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs font-bold flex-shrink-0 ${
                                      isActive ? 'bg-white text-indigo-600' : 'bg-slate-600 text-slate-200'
                                    }`}>
                                      {lessonIndex + 1}
                                    </div>
                                  <span className={`flex-1 truncate ${isActive ? 'font-semibold' : ''}`}>{lesson.title}</span>
                                  {isCompleted && <CheckCircleIcon className="h-5 w-5 text-emerald-400 ml-2 flex-shrink-0" />}
                                </div>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>

            <div className={`pt-6 pb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider ${isCollapsed ? 'text-center' : 'px-4'}`}>
              <span className={isCollapsed ? 'hidden' : 'inline'}>Course Tools</span>
            </div>
            <ul>
                {courseTools.map(tool => (
                    <li key={tool.type}>
                        <button
                            onClick={() => onViewChange({ type: tool.type as any })}
                            className={`w-full text-left p-4 flex items-center transition-colors duration-200 ${
                               activeView.type === tool.type ? 'bg-indigo-600 text-white' : 'hover:bg-slate-700'
                            } ${isCollapsed ? 'justify-center' : ''}`}
                        >
                            <tool.icon className="h-6 w-6 flex-shrink-0" />
                            <span className={`ml-3 whitespace-nowrap ${isCollapsed ? 'hidden' : 'inline'}`}>{tool.label}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </nav>

        <div className="mt-auto border-t border-slate-700">
          {/* Footer content can go here if needed in the future */}
        </div>


        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 md:hidden p-1 rounded-full text-slate-400 hover:bg-slate-700"
          aria-label="Close sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </aside>
      {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"></div>}
    </>
  );
};

export default Sidebar;