import React from 'react';

const ExamPage: React.FC = () => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Exam & Grades</h1>
      <div className="text-center py-12 px-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
        <h2 className="text-xl font-bold text-gray-700">Coming Soon!</h2>
        <p className="mt-2 text-gray-500">
          This section will contain the final exam and your grade information once you've completed the course.
        </p>
      </div>
    </div>
  );
};

export default ExamPage;
