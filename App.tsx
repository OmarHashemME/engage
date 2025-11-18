import React, { useState, useCallback } from 'react';
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
import { COURSES_DATA, HUBS_DATA, ARTICLES_DATA, LEARNING_PATHS_DATA } from './constants';
import LearningPathDetailPage from './components/LearningPathDetailPage';

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

const App: React.FC = () => {
  const [page, setPage] = useState<Page>({ name: 'home' });

  const navigate = useCallback((newPage: Page) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  }, []);

  const renderPage = () => {
    switch (page.name) {
      case 'home':
        return <HomePage navigate={navigate} />;
      case 'learningPaths':
        return <LearningPathsPage navigate={navigate} />;
      case 'courses':
        return <DiscoveryPage navigate={navigate} />;
      case 'course':
        const course = COURSES_DATA.find(c => c.id === page.props.courseId);
        if (course) {
          return <CourseView course={course} navigate={navigate} />;
        }
        return <DiscoveryPage navigate={navigate} />;
      case 'hub':
        const hub = HUBS_DATA.find(h => h.id === page.props.hubId);
        if (hub) {
          return <HubPage hub={hub} navigate={navigate} />;
        }
         return <HomePage navigate={navigate} />;
      case 'community':
        return <CommunityPage />;
      case 'profile':
        return <ProfilePage navigate={navigate} />;
      case 'pathDetail':
        const path = LEARNING_PATHS_DATA.find(p => p.id === page.props.pathId);
        if (path) {
          return <LearningPathDetailPage path={path} navigate={navigate} />;
        }
        return <LearningPathsPage navigate={navigate} />;
      case 'article':
        const article = ARTICLES_DATA.find(a => a.id === page.props.articleId);
        if (article) {
          return <ArticlePage article={article} navigate={navigate} />;
        }
        return <DiscoveryPage navigate={navigate} />; // Fallback to courses if article not found
      default:
        return <HomePage navigate={navigate} />;
    }
  };

  const showNavbarAndFooter = page.name !== 'course';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      {showNavbarAndFooter && <Navbar navigate={navigate} />}
      <main className={`flex-grow ${showNavbarAndFooter ? 'pt-16' : ''}`}>
        {renderPage()}
      </main>
      {showNavbarAndFooter && <Footer navigate={navigate} />}
    </div>
  );
};

export default App;