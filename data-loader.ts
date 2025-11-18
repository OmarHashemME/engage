import type { Course, Hub, LearningPath, Module, Lesson, Article } from './types';
import * as Icons from './components/icons';
import { ARTICLES_DATA } from './constants/articles';
import { USER_COURSES_IDS } from './constants';

export interface AllData {
    courses: Course[];
    hubs: Hub[];
    learningPaths: LearningPath[];
    articles: Article[];
    userCourses: Course[];
}

// A map to resolve icon names from JSON to actual React components
const iconMap: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
  'BookOpenIcon': Icons.BookOpenIcon,
  'HeadphonesIcon': Icons.HeadphonesIcon,
  'MicrophoneIcon': Icons.MicrophoneIcon,
  'PencilIcon': Icons.PencilIcon,
  'LightbulbIcon': Icons.LightbulbIcon,
  'AcademicCapIcon': Icons.AcademicCapIcon,
  'BriefcaseIcon': Icons.BriefcaseIcon,
};

async function fetchJSON<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    return response.json();
}

export async function loadAllData(): Promise<AllData> {
    // 1. Fetch the manifest of all course directories
    const courseIds = await fetchJSON<string[]>('/content/manifest.json');

    // 2. Fetch the course.json for each course in parallel
    const coursePromises = courseIds.map(id => fetchJSON<any>(`/content/${id}/course.json`));
    const rawCoursesData = await Promise.all(coursePromises);
    
    // 3. Process the raw course data into the final Course[] structure
    const courses: Course[] = rawCoursesData.map(courseData => {
        // Resolve relative lesson content paths to absolute paths
        const processedModules: Module[] = courseData.modules.map((module: any) => ({
            ...module,
            lessons: module.lessons.map((lesson: any) => ({
                ...lesson,
                content: `/content/${courseData.id}/${lesson.content}`,
            })),
        }));

        return {
            ...courseData,
            modules: processedModules,
            icon: iconMap[courseData.iconName] || Icons.BookOpenIcon, // Map icon name to component
        };
    });

    // 4. Dynamically generate Hubs based on course tags/categories
    const hubsMap: Map<string, Hub> = new Map();
    const rawHubs: any[] = [ // This could also be loaded from a file if it becomes complex
        { id: 'reading', title: 'Reading', description: 'Improve your comprehension and speed.', iconName: 'BookOpenIcon' },
        { id: 'listening', title: 'Listening', description: 'Sharpen your listening skills.', iconName: 'HeadphonesIcon' },
        { id: 'speaking', title: 'Speaking', description: 'Practice your pronunciation and fluency.', iconName: 'MicrophoneIcon' },
        { id: 'writing', title: 'Writing', description: 'Enhance your writing skills.', iconName: 'PencilIcon' },
        { id: 'vocabulary', title: 'Vocabulary', description: 'Expand your word power.', iconName: 'LightbulbIcon' },
        { id: 'grammar', title: 'Grammar', description: 'Master the rules of English grammar.', iconName: 'AcademicCapIcon' },
    ];

    rawHubs.forEach(hubInfo => {
        hubsMap.set(hubInfo.id, {
            ...hubInfo,
            icon: iconMap[hubInfo.iconName] || Icons.BookOpenIcon,
            courseIds: [],
        });
    });

    courses.forEach(course => {
        if(course.tags && Array.isArray(course.tags)) {
            course.tags.forEach((tag: string) => {
                if(hubsMap.has(tag)) {
                    hubsMap.get(tag)!.courseIds.push(course.id);
                }
            });
        }
    });

    const hubs = Array.from(hubsMap.values());
    
    // 5. Dynamically generate Learning Paths
    // This could also be driven by a separate manifest file
    const learningPaths: LearningPath[] = [
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

    // 6. Filter user's enrolled courses
    const userCourses = courses.filter(course => USER_COURSES_IDS.includes(course.id));

    return {
        courses,
        hubs,
        learningPaths,
        articles: ARTICLES_DATA,
        userCourses,
    };
}
