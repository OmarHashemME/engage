import React from 'react';
import type { Course } from '../types';
import type { Page } from '../App';

interface CourseCardProps {
  course: Course;
  view: 'grid' | 'list';
  navigate: (page: Page) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, view, navigate }) => {
  const handleNavigate = () => {
    navigate({ name: 'course', props: { courseId: course.id } });
  };

  const IconComponent = course.icon;

  if (view === 'grid') {
    return (
      <button 
        onClick={handleNavigate}
        className="text-left w-full bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
        aria-label={`Start course: ${course.title}`}
      >
        <div className="p-5 flex items-start space-x-4">
          <div className="flex-shrink-0">
            <IconComponent className="w-12 h-12" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 truncate">{course.title}</h3>
            <div className="text-sm text-gray-500 mt-1">
              <span>{course.duration}</span>
              {course.details && <span> - {course.details}</span>}
            </div>
          </div>
        </div>
        <div className="px-5 pb-5 mt-auto">
          <p className="text-sm text-gray-600 mb-3 h-10 line-clamp-2">{course.description}</p>
          <p className="text-xs text-gray-400 truncate">{course.prerequisites}</p>
        </div>
      </button>
    );
  }

  return (
    <button 
      onClick={handleNavigate}
      className="text-left w-full bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300 flex items-center space-x-4"
      aria-label={`Start course: ${course.title}`}
    >
      <div className="flex-shrink-0">
        <IconComponent className="w-10 h-10" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-gray-900 truncate">{course.title}</h3>
        <p className="text-sm text-gray-600 mt-1 truncate">{course.description}</p>
      </div>
    </button>
  );
};

export default CourseCard;