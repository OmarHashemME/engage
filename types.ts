// FIX: Import React types to resolve namespace error for React.FC and React.SVGProps.
import type * as React from 'react';

export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface Quiz {
  question: string;
  options: QuizOption[];
  correctFeedback: string;
  incorrectFeedback: string;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  quiz: Quiz;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export type CourseDifficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';

export interface Course {
  id:string;
  title: string;
  description: string;
  iconName: string; // Changed from icon component to string name
  icon: React.FC<React.SVGProps<SVGSVGElement>>; // Keep this for the final component
  duration: string;
  difficulty: CourseDifficulty;
  details: string;
  prerequisites: string;
  modules: Module[];
  info: string;
  // FIX: Add optional tags property to course type. This property exists in the source JSON
  // data and is used in data-loader.ts for creating skill hubs.
  tags?: string[];
}

export interface Hub {
  id: string;
  title: string;
  description: string;
  iconName: string; // Changed from icon component to string name
  icon: React.FC<React.SVGProps<SVGSVGElement>>; // Keep this for the final component
  courseIds: string[];
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  courseIds: string[];
}

export interface Article {
  id: string;
  title: string;
  snippet: string;
  author: string;
  publishedDate: string;
  readTime: string;
  tags: string[];
  content: string;
}

export interface User {
  name: string;
  email: string;
}