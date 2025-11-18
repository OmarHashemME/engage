import type { User } from './types';
import { ARTICLES_DATA } from './constants/articles';

export { ARTICLES_DATA };

export const USER_DATA: User = {
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
};

// This now just defines which courses the user is "enrolled" in.
// The actual course data is loaded dynamically.
export const USER_COURSES_IDS: string[] = ["vocabulary-essentials"];
