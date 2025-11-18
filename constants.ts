import type { Course, Hub, LearningPath, User, Module } from './types';
import { BookOpenIcon } from './components/icons/BookOpenIcon';
import { HeadphonesIcon } from './components/icons/HeadphonesIcon';
import { MicrophoneIcon } from './components/icons/MicrophoneIcon';
import { PencilIcon } from './components/icons/PencilIcon';
import { LightbulbIcon } from './components/icons/LightbulbIcon';
import { AcademicCapIcon } from './components/icons/AcademicCapIcon';
import { BriefcaseIcon } from './components/icons/BriefcaseIcon';
import { ARTICLES_DATA } from './constants/articles';

export { ARTICLES_DATA };

export const USER_DATA: User = {
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
};

export const USER_COURSES_IDS: string[] = ["vocabulary-essentials"];

const vocabularyEssentialsModules: Module[] = [
    {
        id: "m1", title: "Module 1: Core Concepts", lessons: [
            { id: "l1", title: "The Power of Context", content: "/content/vocabulary-essentials/module1-lesson1.md", quiz: { question: "What is the primary benefit of using context clues?", options: [{text: "It's the only way to learn new words.", isCorrect: false}, {text: "It helps you guess meaning without a dictionary.", isCorrect: true}, {text: "It makes reading slower.", isCorrect: false}], correctFeedback: "Correct! Context helps you make educated guesses and read more smoothly.", incorrectFeedback: "Not quite. While dictionaries are useful, context is a faster, more natural way to learn."} },
            { id: "l2", title: "Unlocking Words with Prefixes", content: "/content/vocabulary-essentials/module1-lesson2.md", quiz: { question: "What does the prefix 're-' mean?", options: [{text: "Before", isCorrect: false}, {text: "Not", isCorrect: false}, {text: "Again", isCorrect: true}], correctFeedback: "That's right! 'Re-' means to do something again, like in 'redo' or 'replay'.", incorrectFeedback: "Try again. Think about the word 'redo'."} },
        ]
    }
];

const phrasalVerbsModules: Module[] = [
    {
        id: "m1", title: "Module 1: Understanding Phrasal Verbs", lessons: [
            { id: "l1", title: "What is a Phrasal Verb?", content: "/content/phrasal-verbs/module1-lesson1.md", quiz: { question: "A phrasal verb combines a verb with a...?", options: [{text: "Noun or Adjective", isCorrect: false}, {text: "Preposition or Adverb", isCorrect: true}], correctFeedback: "Exactly! It's a verb plus a particle like 'up', 'down', 'in', or 'out'.", incorrectFeedback: "That's not it. A phrasal verb uses a particle (a preposition or adverb) to change the verb's meaning."} },
            { id: "l2", title: "Separable vs. Inseparable", content: "/content/phrasal-verbs/module1-lesson2.md", quiz: { question: "Which sentence is grammatically correct?", options: [{text: "I will look your dog after.", isCorrect: false}, {text: "I turned down it.", isCorrect: false}, {text: "She turned it down.", isCorrect: true}], correctFeedback: "Perfect! With separable phrasal verbs, the pronoun must go in the middle.", incorrectFeedback: "Take another look at the rules for pronouns with separable phrasal verbs."} },
        ]
    }
];

const idiomsModules: Module[] = [
    {
        id: "m1", title: "Module 1: Introduction to Idioms", lessons: [
            { id: "l1", title: "What are Idioms?", content: "/content/idioms/module1-lesson1.md", quiz: { question: "What does the idiom 'It's raining cats and dogs' mean?", options: [{text: "It's raining lightly.", isCorrect: false}, {text: "It's raining very heavily.", isCorrect: true}], correctFeedback: "That's right! It's a colorful way to say it's raining a lot.", incorrectFeedback: "Not quite. This idiom describes a very strong rain."} },
            { id: "l2", title: "Common Idioms about Feelings", content: "/content/idioms/module1-lesson2.md", quiz: { question: "If you feel 'under the weather', how do you feel?", options: [{text: "Slightly sick", isCorrect: true}, {text: "Very happy", isCorrect: false}, {text: "Nervous", isCorrect: false}], correctFeedback: "Correct! It's a common way to say you're not feeling well.", incorrectFeedback: "Think about what kind of day you'd want to stay inside. It's for when you feel a bit sick."} },
        ]
    }
];


export const COURSES_DATA: Course[] = [
    {
        id: "vocabulary-essentials",
        title: "Vocabulary Essentials",
        description: "Build a strong foundation with essential English vocabulary and learning techniques.",
        icon: LightbulbIcon,
        duration: "3 hours",
        difficulty: "Beginner",
        details: "4 interactive exercises",
        prerequisites: "No prerequisites",
        modules: vocabularyEssentialsModules,
        info: "<h3>Course Info</h3><p>This course provides the fundamental skills you need to expand your vocabulary effectively. Learn about context clues, prefixes, and suffixes to unlock the meaning of new words.</p>",
    },
    {
        id: "phrasal-verbs-in-use",
        title: "Phrasal Verbs in Use",
        description: "Master common phrasal verbs to sound more like a native speaker.",
        icon: AcademicCapIcon,
        duration: "4 hours",
        difficulty: "Intermediate",
        details: "Focus on separable/inseparable verbs",
        prerequisites: "Builds on: Vocabulary Essentials",
        modules: phrasalVerbsModules,
        info: "<h3>Course Info</h3><p>Dive deep into one of the trickiest parts of English. This course breaks down phrasal verbs into understandable categories and provides plenty of practice.</p>",
    },
    {
        id: "idioms-for-daily-conversation",
        title: "Idioms for Daily Conversation",
        description: "Learn and practice common English idioms to understand and participate in natural conversations.",
        icon: BookOpenIcon,
        duration: "3 hours",
        difficulty: "Intermediate",
        details: "Covers 50+ common idioms",
        prerequisites: "Basic understanding of English",
        modules: idiomsModules,
        info: "<h3>Course Info</h3><p>Unlock the colorful, creative side of English by learning the idioms native speakers use every day. This course will help you understand movies, TV shows, and casual chats.</p>",
    },
];

export const HUBS_DATA: Hub[] = [
  {
    id: 'reading',
    title: 'Reading',
    description: 'Improve your comprehension and speed with our collection of texts and exercises.',
    icon: BookOpenIcon,
    courseIds: ["idioms-for-daily-conversation"],
  },
  {
    id: 'listening',
    title: 'Listening',
    description: 'Sharpen your listening skills with audio clips, dialogues, and comprehension questions.',
    icon: HeadphonesIcon,
    courseIds: [],
  },
  {
    id: 'speaking',
    title: 'Speaking',
    description: 'Practice your pronunciation and fluency with interactive speaking challenges.',
    icon: MicrophoneIcon,
    courseIds: ["phrasal-verbs-in-use", "idioms-for-daily-conversation"],
  },
  {
    id: 'writing',
    title: 'Writing',
    description: 'Enhance your writing skills from basic sentences to complex essays with guided practice.',
    icon: PencilIcon,
    courseIds: [],
  },
  {
    id: 'vocabulary',
    title: 'Vocabulary',
    description: 'Expand your word power with themed lists, flashcards, and quizzes.',
    icon: LightbulbIcon,
    courseIds: ["vocabulary-essentials", "phrasal-verbs-in-use", "idioms-for-daily-conversation"],
  },
  {
    id: 'grammar',
    title: 'Grammar',
    description: 'Master the rules of English grammar with clear explanations and targeted drills.',
    icon: AcademicCapIcon,
    courseIds: ["phrasal-verbs-in-use"],
  },
];

export const LEARNING_PATHS_DATA: LearningPath[] = [
  {
    id: 'foundations',
    title: 'English Foundations',
    description: 'Build a strong base in vocabulary and grammar, starting with the absolute essentials for confident communication.',
    courseIds: ["vocabulary-essentials", "phrasal-verbs-in-use"],
  },
  {
    id: 'conversational-english',
    title: 'Conversational English',
    description: 'Learn the phrases, idioms, and phrasal verbs you need to sound natural and confident in everyday conversations.',
    courseIds: ["phrasal-verbs-in-use", "idioms-for-daily-conversation"],
  },
  {
    id: 'comprehensive-vocabulary',
    title: 'Comprehensive Vocabulary',
    description: 'A complete path to mastering English vocabulary, from fundamental techniques to advanced idiomatic expressions.',
    courseIds: ["vocabulary-essentials", "phrasal-verbs-in-use", "idioms-for-daily-conversation"],
  },
];