
import React from 'react';
import type { Lesson } from '../../types';

interface Props {
  lesson: Lesson;
  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
  isFirst: boolean;
  isLast: boolean;
  isCompleted: boolean;
}

const ListeningLesson: React.FC<Props> = ({ lesson, onNext }) => {
  return (
    <div className="p-8 bg-indigo-50 rounded-xl animate-fade-in">
      <h1 className="text-3xl font-bold mb-4 text-indigo-900">🎧 {lesson.title}</h1>
      <div className="bg-slate-900 text-white p-12 rounded-lg text-center mb-8 shadow-lg">
        <p className="text-xl font-mono">[Audio Player Placeholder]</p>
        <p className="text-sm text-gray-400 mt-2">Audio content loading...</p>
      </div>
      <p className="mb-8 text-lg text-gray-700">Listen to the audio above carefully, then proceed to the exercises.</p>
      <button 
        onClick={onNext} 
        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 transition-colors"
      >
        Next Lesson
      </button>
    </div>
  );
};

export default ListeningLesson;
