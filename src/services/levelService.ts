
import { CEFRLevel, User, Course } from '../types';
import oxfordData from '../data/oxford_5000.json';

// CEFR Levels ordered from easiest to hardest
const LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

// Map for O(1) access
const WORD_DATA: Record<string, string> = oxfordData;

export const levelService = {
  /**
   * Returns the CEFR level of a word (e.g., 'A1', 'B2').
   * Defaults to 'C2' if not found in the common list (assuming unknown = hard).
   */
  getWordLevel(word: string): CEFRLevel {
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    
    if (!cleanWord) return 'A1'; // Punctuation/numbers are neutral
    
    const level = WORD_DATA[cleanWord];
    return (level as CEFRLevel) || 'C2'; 
  },

  /**
   * Returns the numeric index of a CEFR level (0-5).
   */
  getLevelIndex(level: CEFRLevel): number {
    return LEVELS.indexOf(level);
  },

  /**
   * Returns true if the content level is harder than the user's level.
   * e.g. Content 'B2' is difficult for User 'B1'.
   */
  isDifficult(contentLevel: CEFRLevel, userLevel: CEFRLevel): boolean {
    const contentIndex = LEVELS.indexOf(contentLevel);
    const userIndex = LEVELS.indexOf(userLevel);
    
    return contentIndex > userIndex;
  },

  /**
   * Helper that combines lookup and comparison.
   */
  isWordDifficult(word: string, userLevel: CEFRLevel): boolean {
    const wordLevel = this.getWordLevel(word);
    return this.isDifficult(wordLevel, userLevel);
  },

  /**
   * Resolves the effective CEFR level of a course.
   */
  resolveCourseLevel(course: Course): CEFRLevel {
    return course.level;
  },

  /**
   * Determines if a course should be locked based on user level.
   * Returns true if course is > 1 level higher than user.
   */
  isLocked(course: Course, userLevel: CEFRLevel): boolean {
      const cLevel = this.resolveCourseLevel(course);
      const uIndex = this.getLevelIndex(cLevel);
      const uIndexCurrent = this.getLevelIndex(userLevel);
      
      // User can access their current level and the immediate next level
      return uIndex > uIndexCurrent + 1;
  },

  /**
   * Determines the effective user level for a specific activity or hub context.
   * Cascades from specific skill level -> general level.
   */
  getEffectiveLevel(user: User, context?: string): CEFRLevel {
    if (context && user.skillLevels) {
      const skill = context as keyof typeof user.skillLevels;
      if (user.skillLevels[skill]) {
        return user.skillLevels[skill]!;
      }
    }
    return user.generalLevel || 'A1';
  }
};
