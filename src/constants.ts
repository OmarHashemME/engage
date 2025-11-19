
import type { User, CEFRLevel, UserSkillLevels } from './types';
import { ARTICLES_DATA } from './constants/articles';

export { ARTICLES_DATA };

// Helper to load user data from local storage or default
const loadUser = (): User => {
  const saved = localStorage.getItem('user_profile');
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    name: 'Alex Doe',
    email: 'alex.doe@example.com',
    generalLevel: 'B1',
    skillLevels: {}
  };
};

export const USER_DATA: User = loadUser();

export const saveUser = () => {
  localStorage.setItem('user_profile', JSON.stringify(USER_DATA));
};

// This now just defines which courses the user is "enrolled" in.
// The actual course data is loaded dynamically.
export const USER_COURSES_IDS: string[] = ["vocabulary-essentials"];
