import React from 'react';
import type { Lesson } from '../types';
import StandardLesson from './StandardLesson';
import SpeakingLesson from './SpeakingLesson';

export interface LessonFactoryProps {
  lesson: Lesson;
  onComplete: () => void;
  onNext: () => void;
  onPrev: () => void;
  isFirst: boolean;
  isLast: boolean;
  isCompleted: boolean;
}

// FACTORY COMPONENT
// This component acts as a dispatcher. It checks the lesson's activity type
// and renders the appropriate Strategy Component.
const LessonFactory: React.FC<LessonFactoryProps> = (props) => {
  const { lesson } = props;
  
  switch (lesson.activityType) {
    case 'speaking':
      return <SpeakingLesson {...props} />;
    case 'reading':
    case 'grammar':
    case 'vocabulary':
    default:
      // Default strategy for Reading, Grammar, and generic lessons
      return <StandardLesson {...props} />;
  }
};

export default LessonFactory;