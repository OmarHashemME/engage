import React from 'react';

const MarkdownPlaceholder: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
      
      <div className="space-y-3">
        <div className="h-3 bg-gray-200 rounded-md w-full"></div>
        <div className="h-3 bg-gray-200 rounded-md w-5/6"></div>
        <div className="h-3 bg-gray-200 rounded-md w-full"></div>
      </div>
      
      <div className="h-5 bg-gray-300 rounded-md w-1/2 mt-8"></div>

       <ul className="list-disc list-inside space-y-3 pl-2">
        <li><div className="h-3 bg-gray-200 rounded-md w-4/5 inline-block"></div></li>
        <li><div className="h-3 bg-gray-200 rounded-md w-3/4 inline-block"></div></li>
       </ul>

      <div className="p-4 bg-gray-100 rounded-lg space-y-2">
        <div className="h-3 bg-gray-200 rounded-md w-full"></div>
        <div className="h-3 bg-gray-200 rounded-md w-1/2"></div>
      </div>
    </div>
  );
};

export default MarkdownPlaceholder;
