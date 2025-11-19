
import React, { useState } from 'react';
import type { Page } from '../App';
import { USER_DATA, saveUser } from '../constants';
import { UserIcon } from './icons/UserIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import type { Course, CEFRLevel, UserSkillLevels } from '../types';

interface ProfilePageProps {
  navigate: (page: Page) => void;
  userCourses: Course[];
}

const LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const SKILLS: (keyof UserSkillLevels)[] = ['reading', 'listening', 'speaking', 'writing', 'grammar', 'vocabulary'];

const ProfilePage: React.FC<ProfilePageProps> = ({ navigate, userCourses }) => {
  const [generalLevel, setGeneralLevel] = useState<CEFRLevel>(USER_DATA.generalLevel);
  const [skillLevels, setSkillLevels] = useState<UserSkillLevels>(USER_DATA.skillLevels || {});
  const [isEditing, setIsEditing] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  const handleSave = () => {
    USER_DATA.generalLevel = generalLevel;
    USER_DATA.skillLevels = skillLevels;
    saveUser();
    setIsEditing(false);
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  const handleSkillChange = (skill: keyof UserSkillLevels, level: string) => {
    if (level === 'default') {
        const newSkills = { ...skillLevels };
        delete newSkills[skill];
        setSkillLevels(newSkills);
    } else {
        setSkillLevels({ ...skillLevels, [skill]: level as CEFRLevel });
    }
  };

  return (
    <div className="bg-white min-h-screen animate-fade-in relative">
      
      {/* Success Notification */}
      {showSavedMessage && (
          <div className="fixed top-20 right-4 z-[60] bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg flex items-center animate-fade-in">
              <CheckCircleIcon className="w-5 h-5 mr-2" />
              <span className="font-medium">Profile saved successfully!</span>
          </div>
      )}

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        
        {/* User Info Header */}
        <div className="pb-8 border-b border-gray-200 mb-8 md:flex md:items-center md:justify-between">
            <div className="flex items-center">
                <div className="flex-shrink-0 h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
                    <UserIcon className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="ml-4">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Welcome back, {USER_DATA.name}!
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {USER_DATA.email}
                    </p>
                </div>
            </div>
        </div>

        {/* Proficiency Settings */}
        <section className="mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-900">Proficiency Level</h2>
                {!isEditing ? (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline self-start sm:self-auto"
                    >
                        Edit Levels
                    </button>
                ) : (
                    <div className="flex space-x-3 self-start sm:self-auto">
                        <button 
                            onClick={() => {
                                setIsEditing(false);
                                setGeneralLevel(USER_DATA.generalLevel);
                                setSkillLevels(USER_DATA.skillLevels || {});
                            }}
                            className="text-sm font-medium text-gray-600 hover:text-gray-800 px-3 py-2 rounded-md hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            className="text-sm font-medium text-white bg-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-700 shadow-sm transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">General Proficiency</h3>
                            <p className="text-gray-500 text-sm mt-1">This sets the baseline difficulty for your daily lessons.</p>
                        </div>
                        <div>
                             {isEditing ? (
                                <select 
                                    value={generalLevel} 
                                    onChange={(e) => setGeneralLevel(e.target.value as CEFRLevel)}
                                    className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                >
                                    {LEVELS.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                                </select>
                             ) : (
                                <span className="inline-flex items-center px-4 py-2 rounded-full text-xl font-bold bg-indigo-100 text-indigo-800">
                                    {generalLevel}
                                </span>
                             )}
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between bg-slate-50 -mx-6 -mb-6 p-6">
                         <div className="flex items-center mb-4 sm:mb-0">
                             <div className="bg-indigo-900 text-white font-bold p-1 mr-3 text-xs rounded">ES</div>
                             <p className="text-sm text-gray-600">
                                 Don't know your level? Take the official <a href="https://www.englishscore.com/" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline font-medium">EnglishScore test</a>.
                             </p>
                         </div>
                    </div>
                </div>

                {/* Advanced Skills Accordion */}
                <div className="border-t border-gray-200">
                    <button 
                        onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                        className="w-full flex items-center justify-between p-4 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none transition-colors"
                    >
                        <span>Advanced: Set levels by skill (Optional)</span>
                        <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isAdvancedOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isAdvancedOpen && (
                        <div className="p-6 bg-gray-50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in border-t border-gray-200">
                            {SKILLS.map(skill => (
                                <div key={skill}>
                                    <label className="block text-sm font-medium text-gray-700 capitalize mb-2">{skill}</label>
                                    {isEditing ? (
                                        <select
                                            value={skillLevels[skill] || 'default'}
                                            onChange={(e) => handleSkillChange(skill, e.target.value)}
                                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        >
                                            <option value="default">Same as General ({generalLevel})</option>
                                            {LEVELS.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                                        </select>
                                    ) : (
                                        <div className="px-3 py-2 bg-white border border-gray-200 rounded-md text-sm text-gray-800 shadow-sm">
                                            {skillLevels[skill] ? (
                                                <span className="font-semibold text-indigo-600">{skillLevels[skill]}</span>
                                            ) : (
                                                <span className="text-gray-400 italic">Default ({generalLevel})</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>

        {/* Current Courses Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Courses</h2>
          <div className="space-y-6">
            {userCourses.length > 0 ? (
              userCourses.map(course => (
                <div key={course.id} className="bg-gray-50 hover:bg-gray-100 p-6 rounded-lg transition-colors duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between border border-gray-100">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-12 w-12 rounded-md bg-indigo-100 flex items-center justify-center">
                      <course.icon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 max-w-xl">{course.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-6 flex-shrink-0">
                    <button
                      onClick={() => navigate({ name: 'course', props: { courseId: course.id } })}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Continue Course
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 px-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <p className="text-gray-500">You are not enrolled in any courses yet.</p>
                <button
                    onClick={() => navigate({ name: 'courses' })}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    Explore Courses
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;
