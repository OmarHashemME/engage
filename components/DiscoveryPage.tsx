import React, { useState } from 'react';
import type { Page } from '../App';
import { COURSES_DATA, ARTICLES_DATA, HUBS_DATA } from '../constants';
import CourseCard from './CourseCard';
import ArticleCard from './ArticleCard';
import { GridViewIcon } from './icons/GridViewIcon';
import { ListViewIcon } from './icons/ListViewIcon';
import { SearchIcon } from './icons/SearchIcon';

interface DiscoveryPageProps {
  navigate: (page: Page) => void;
}

const DiscoveryPage: React.FC<DiscoveryPageProps> = ({ navigate }) => {
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedHub, setSelectedHub] = useState<string>('all');
    const [duration, setDuration] = useState('all');
    const [difficulty, setDifficulty] = useState('all');

    const lowercasedSearchTerm = searchTerm.toLowerCase();

    const filteredCourses = COURSES_DATA
        .filter(course => { // Hub filter
            if (selectedHub === 'all') {
                return true;
            }
            const hub = HUBS_DATA.find(h => h.id === selectedHub);
            return hub?.courseIds.includes(course.id);
        })
        .filter(course => // Search term filter
            searchTerm === '' ||
            course.title.toLowerCase().includes(lowercasedSearchTerm) ||
            course.description.toLowerCase().includes(lowercasedSearchTerm)
        )
        .filter(course => { // Difficulty filter
            if (difficulty === 'all') return true;
            return course.difficulty === difficulty;
        })
        .filter(course => { // Duration filter
            if (duration === 'all') return true;
            const hours = parseInt(course.duration);
            if (isNaN(hours)) return false;

            if (duration === 'short') return hours < 4;
            if (duration === 'medium') return hours >= 4 && hours <= 5;
            if (duration === 'long') return hours > 5;
            return false;
        });

    const filteredArticles = searchTerm === ''
        ? ARTICLES_DATA
        : ARTICLES_DATA.filter(article =>
            article.title.toLowerCase().includes(lowercasedSearchTerm) ||
            article.snippet.toLowerCase().includes(lowercasedSearchTerm) ||
            article.tags.some(tag => tag.toLowerCase().includes(lowercasedSearchTerm))
        );

    const showArticles = selectedHub === 'all' && duration === 'all' && difficulty === 'all';
    const hasCourseResults = filteredCourses.length > 0;
    const hasArticleResults = showArticles && filteredArticles.length > 0;
    const hasResults = hasCourseResults || hasArticleResults;

    const hubsForFilter = [{ id: 'all', title: 'All Courses' }, ...HUBS_DATA];

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <header className="pb-8 border-b border-gray-200 mb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                            Discover
                        </h1>
                        <p className="mt-4 max-w-3xl text-lg text-gray-500">
                           Explore courses and articles to expand your skills. Use the search bar and filters to find specific topics.
                        </p>
                    </div>
                    <div className="mt-6 flex flex-col md:flex-row md:items-center gap-4">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search courses and articles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                aria-label="Search courses and articles"
                            />
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                             <div>
                                <label htmlFor="duration-filter" className="sr-only">Filter by duration</label>
                                <select id="duration-filter" value={duration} onChange={(e) => setDuration(e.target.value)} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                    <option value="all">Any Duration</option>
                                    <option value="short">Short (&lt;4h)</option>
                                    <option value="medium">Medium (4-5h)</option>
                                    <option value="long">Long (&gt;5h)</option>
                                </select>
                            </div>
                             <div>
                                <label htmlFor="difficulty-filter" className="sr-only">Filter by difficulty</label>
                                <select id="difficulty-filter" value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                    <option value="all">Any Difficulty</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                    <option value="All Levels">All Levels</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center space-x-1 border border-gray-300 rounded-md p-1 bg-white self-end md:self-center">
                            <button
                                onClick={() => setView('list')}
                                className={`p-1.5 rounded-md ${view === 'list' ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
                                aria-label="List view"
                                data-testid="list-view-button"
                            >
                                <ListViewIcon className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setView('grid')}
                                className={`p-1.5 rounded-md ${view === 'grid' ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
                                aria-label="Grid view"
                                data-testid="grid-view-button"
                            >
                                <GridViewIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </header>

                <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Filter by Skill</h3>
                    <div className="flex flex-wrap gap-2">
                        {hubsForFilter.map(hub => (
                            <button
                                key={hub.id}
                                onClick={() => setSelectedHub(hub.id)}
                                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                    selectedHub === hub.id
                                        ? 'bg-indigo-600 text-white shadow-sm'
                                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                }`}
                            >
                                {hub.title}
                            </button>
                        ))}
                    </div>
                </div>

                <main>
                    {!hasResults ? (
                        <div className="text-center py-12 px-6 border-2 border-dashed border-gray-300 rounded-lg bg-white">
                          <h3 className="text-xl font-bold text-gray-700">No results found</h3>
                          <p className="mt-2 text-gray-500">
                            Try adjusting your search term or filters.
                          </p>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {hasCourseResults && (
                                <section>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Courses</h2>
                                    <div className={view === 'grid' 
                                        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                                        : "flex flex-col space-y-4"
                                    }>
                                        {filteredCourses.map(course => (
                                            <CourseCard key={course.id} course={course} view={view} navigate={navigate} />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {hasArticleResults && (
                                <section>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Articles</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {filteredArticles.map(article => (
                                            <ArticleCard key={article.id} article={article} navigate={navigate} />
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default DiscoveryPage;