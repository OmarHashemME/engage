
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

export type LessonActivityType = 'reading' | 'listening' | 'speaking' | 'writing' | 'vocabulary' | 'grammar';

export interface Lesson {
  id: string;
  title: string;
  content: string;
  quiz: Quiz;
  activityType?: LessonActivityType;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface Course {
  id:string;
  title: string;
  description: string;
  iconName: string; // Changed from icon component to string name
  icon: React.FC<React.SVGProps<SVGSVGElement>>; // Keep this for the final component
  duration: string;
  level: CEFRLevel;
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

export interface UserSkillLevels {
  reading?: CEFRLevel;
  listening?: CEFRLevel;
  speaking?: CEFRLevel;
  writing?: CEFRLevel;
  grammar?: CEFRLevel;
  vocabulary?: CEFRLevel;
}

export interface User {
  name: string;
  email: string;
  generalLevel: CEFRLevel;
  skillLevels?: UserSkillLevels;
}
