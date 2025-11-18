import React from 'react';

const CommunityPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen flex items-center justify-center animate-fade-in">
      <div className="text-center p-8 max-w-4xl mx-auto">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V7a2 2 0 012-2h4l4 4z" />
            </svg>
          </div>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          Community Hub
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
          A place to discuss lessons, ask questions, and connect with fellow learners is coming soon!
        </p>
        <div className="mt-10 p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <h3 className="text-xl font-bold text-gray-700">Discussion Forum Coming Soon</h3>
          <p className="mt-2 text-gray-500">
            We are working on integrating a discussion platform (like Disqus) to allow for interactive conversations. Please check back later!
          </p>
          <div id="disqus_thread" className="mt-4 text-sm text-gray-400">[Disqus comments will load here]</div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;