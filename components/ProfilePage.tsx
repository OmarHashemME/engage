import React from 'react';
import type { Page } from '../App';
import { USER_DATA, USER_COURSES_IDS, COURSES_DATA } from '../constants';
import { BookOpenIcon } from './icons/BookOpenIcon';
import { UserIcon } from './icons/UserIcon';

interface ProfilePageProps {
  navigate: (page: Page) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ navigate }) => {
  const userCourses = COURSES_DATA.filter(course => USER_COURSES_IDS.includes(course.id));

  return (
    <div className="bg-white min-h-screen animate-fade-in">
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

        {/* Current Courses Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Courses</h2>
          <div className="space-y-6">
            {userCourses.length > 0 ? (
              userCourses.map(course => (
                <div key={course.id} className="bg-gray-50 hover:bg-gray-100 p-6 rounded-lg transition-colors duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between">
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
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Continue Course
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 px-4 bg-gray-50 rounded-lg">
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