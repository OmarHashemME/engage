
import React from 'react';
import type { Lesson } from '../../types';
import LessonLayout, { LessonLayoutProps } from '../LessonLayout';
import Quiz from '../Quiz';

// This replaces the old StandardLesson logic
// It wraps the content in the standard LessonLayout which handles Markdown and Smart Words
const ReadingLesson: React.FC<Omit<LessonLayoutProps, 'children'>> = (props) => {
  return (
    <LessonLayout {...props}>
      <div className="grid gap-8 mb-8 grid-cols-1 max-w-2xl">
         <div>
             <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Quiz</h3>
             <Quiz 
                quizData={props.lesson.quiz} 
                onCorrect={props.onComplete}
                isLessonCompleted={props.isCompleted}
            />
         </div>
      </div>
    </LessonLayout>
  );
};

export default ReadingLesson;
