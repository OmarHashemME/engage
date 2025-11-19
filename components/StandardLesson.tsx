import React from 'react';
import LessonLayout, { LessonLayoutProps } from './LessonLayout';
import Quiz from './Quiz';

// Standard Lesson Strategy: Used for Reading, Grammar, Vocabulary, etc.
// Displays only the Quiz in the practice section.
const StandardLesson: React.FC<Omit<LessonLayoutProps, 'children'>> = (props) => {
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

export default StandardLesson;
