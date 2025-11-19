import React, { useState, useCallback, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './components/HomePage';
import LearningPathsPage from './components/LearningPathsPage';
import CourseView from './components/CourseView';
import HubPage from './components/HubPage';
import CommunityPage from './components/CommunityPage';
import DiscoveryPage from './components/DiscoveryPage';
import ProfilePage from './components/ProfilePage';
import ArticlePage from './components/ArticlePage';
import Footer from './components/Footer';
import LearningPathDetailPage from './components/LearningPathDetailPage';
import { loadAllData } from './data-loader';
import type { AllData } from './data-loader';
import type { Course } from './types';

export type Page =
  | { name: 'home' }
  | { name: 'learningPaths' }
  | { name: 'courses' }
  | { name: 'course'; props: { courseId: string } }
  | { name: 'hub'; props: { hubId: string } }
  | { name: 'community' }
  | { name: 'profile' }
  | { name: 'pathDetail'; props: { pathId: string } }
  | { name: 'article'; props: { articleId: string } };

const getPageFromUrl = (): Page => {
  const params = new URLSearchParams(window.location.search);
  const pageName = params.get('page');

  switch (pageName) {
    case 'courses': return { name: 'courses' };
    case 'learningPaths': return { name: 'learningPaths' };
    case 'community': return { name: 'community' };
    case 'profile': return { name: 'profile' };
    case 'course': 
      const courseId = params.get('courseId');
      return courseId ? { name: 'course', props: { courseId } } : { name: 'courses' };
    case 'hub': 
      const hubId = params.get('hubId');
      return hubId ? { name: 'hub', props: { hubId } } : { name: 'home' };
    case 'pathDetail': 
      const pathId = params.get('pathId');
      return pathId ? { name: 'pathDetail', props: { pathId } } : { name: 'learningPaths' };
    case 'article': 
      const articleId = params.get('articleId');
      return articleId ? { name: 'article', props: { articleId } } : { name: 'courses' };
    default: return { name: 'home' };
  }
};

const App: React.FC = () => {
  const [page, setPage] = useState<Page>(getPageFromUrl);
  const [appData, setAppData] = useState<AllData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // historyKey is used to force child components to re-sync with URL parameters on back/forward navigation
  const [historyKey, setHistoryKey] = useState(0);

  useEffect(() => {
    const init = async () => {
      try {
        const data = await loadAllData();
        setAppData(data);
      } catch (e) {
        console.error("Failed to load app data:", e);
        setError("Could not load course materials. Please check the application configuration and try again.");
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setPage(getPageFromUrl());
      setHistoryKey(prev => prev + 1);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((newPage: Page) => {
    setPage(newPage);
    window.scrollTo(0, 0);

    const params = new URLSearchParams();
    if (newPage.name !== 'home') {
      params.set('page', newPage.name);
      if ('props' in newPage) {
        if (newPage.name === 'course') params.set('courseId', newPage.props.courseId);
        if (newPage.name === 'hub') params.set('hubId', newPage.props.hubId);
        if (newPage.name === 'pathDetail') params.set('pathId', newPage.props.pathId);
        if (newPage.name === 'article') params.set('articleId', newPage.props.articleId);
      }
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.pushState({}, '', newUrl);
    } else {
      window.history.pushState({}, '', window.location.pathname);
    }
  }, []);

  const renderPage = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-full">
            <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-indigo-600 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <h2 className="mt-4 text-xl font-semibold text-gray-700">Loading Courses...</h2>
                <p className="text-gray-500">Preparing your learning experience.</p>
            </div>
        </div>
      );
    }

    if (error || !appData) {
      return (
          <div className="flex items-center justify-center h-full text-center p-4">
              <div>
                  <h2 className="text-2xl font-bold text-red-600">Failed to Load</h2>
                  <p className="text-red-500 mt-2">{error || "An unknown error occurred."}</p>
              </div>
          </div>
      );
    }

    const { courses, hubs, articles, learningPaths, userCourses } = appData;

    switch (page.name) {
      case 'home':
        return <HomePage navigate={navigate} courses={courses} hubs={hubs} />;
      case 'learningPaths':
        return <LearningPathsPage navigate={navigate} learningPaths={learningPaths} />;
      case 'courses':
        return <DiscoveryPage navigate={navigate} courses={courses} hubs={hubs} articles={articles} historyKey={historyKey} />;
      case 'course':
        const course = courses.find(c => c.id === page.props.courseId);
        if (course) {
          return <CourseView course={course} navigate={navigate} />;
        }
        return <DiscoveryPage navigate={navigate} courses={courses} hubs={hubs} articles={articles} historyKey={historyKey} />;
      case 'hub':
        const hub = hubs.find(h => h.id === page.props.hubId);
        if (hub) {
          const hubCourses = courses.filter(c => hub.courseIds.includes(c.id));
          return <HubPage hub={hub} courses={hubCourses} navigate={navigate} />;
        }
        return <HomePage navigate={navigate} courses={courses} hubs={hubs} />;
      case 'community':
        return <CommunityPage />;
      case 'profile':
        return <ProfilePage navigate={navigate} userCourses={userCourses} />;
      case 'pathDetail':
        const path = learningPaths.find(p => p.id === page.props.pathId);
        if (path) {
          const pathCourses = courses.filter(c => path.courseIds.includes(c.id));
          return <LearningPathDetailPage path={path} courses={pathCourses} navigate={navigate} />;
        }
        return <LearningPathsPage navigate={navigate} learningPaths={learningPaths} />;
      case 'article':
        const article = articles.find(a => a.id === page.props.articleId);
        if (article) {
          return <ArticlePage article={article} navigate={navigate} />;
        }
        return <DiscoveryPage navigate={navigate} courses={courses} hubs={hubs} articles={articles} historyKey={historyKey} />;
      default:
        return <HomePage navigate={navigate} courses={courses} hubs={hubs} />;
    }
  };

  const showNavbarAndFooter = page.name !== 'course';
  const mainContentClass = `flex-grow ${showNavbarAndFooter ? 'pt-16' : ''} ${isLoading || error ? 'flex' : ''}`;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      {showNavbarAndFooter && <Navbar navigate={navigate} hubs={appData?.hubs || []} />}
      <main className={mainContentClass}>
        {renderPage()}
      </main>
      {showNavbarAndFooter && <Footer navigate={navigate} hubs={appData?.hubs || []} />}
    </div>
  );
};

export default App;