
import React, { useState, useEffect } from 'react';
import type { Page } from '../App';
import type { Course, Article, Hub } from '../types';
import CourseCard from './CourseCard';
import ArticleCard from './ArticleCard';
import { GridViewIcon } from './icons/GridViewIcon';
import { ListViewIcon } from './icons/ListViewIcon';
import { SearchIcon } from './icons/SearchIcon';
import { levelService } from '../services/levelService';
import { USER_DATA } from '../constants';

interface DiscoveryPageProps {
  navigate: (page: Page) => void;
  courses: Course[];
  hubs: Hub[];
  articles: Article[];
  historyKey?: number;
}

const LEVELS = ['All', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const DiscoveryPage: React.FC<DiscoveryPageProps> = ({ navigate, courses, hubs, articles, historyKey }) => {
    const [view, setView] = useState<'grid' | 'list'>('grid');
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedHub, setSelectedHub] = useState<string>('all');
    const [duration, setDuration] = useState('all');
    const [level, setLevel] = useState<string>('all');

    // Sync state from URL on mount and when historyKey changes (back/forward button)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setSearchTerm(params.get('q') || '');
        setSelectedHub(params.get('hub') || 'all');
        setDuration(params.get('duration') || 'all');
        setLevel(params.get('level') || 'all');
    }, [historyKey]);

    const updateUrl = (key: string, value: string) => {
        const params = new URLSearchParams(window.location.search);
        
        if (value && value !== 'all') {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        
        // Ensure page param is preserved or set
        if (!params.get('page')) {
            params.set('page', 'courses');
        }

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState({}, '', newUrl);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        updateUrl('q', value);
    };

    const handleHubChange = (hubId: string) => {
        setSelectedHub(hubId);
        updateUrl('hub', hubId);
    };

    const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setDuration(value);
        updateUrl('duration', value);
    };

    const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setLevel(value);
        updateUrl('level', value);
    };

    const lowercasedSearchTerm = searchTerm.toLowerCase();

    const filteredCourses = courses
        .filter(course => { // Hub filter
            if (selectedHub === 'all') {
                return true;
            }
            const hub = hubs.find(h => h.id === selectedHub);
            return hub?.courseIds.includes(course.id);
        })
        .filter(course => // Search term filter
            searchTerm === '' ||
            course.title.toLowerCase().includes(lowercasedSearchTerm) ||
            course.description.toLowerCase().includes(lowercasedSearchTerm)
        )
        .filter(course => { // Level filter
            if (level === 'all') return true;
            return course.level === level;
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
        ? articles
        : articles.filter(article =>
            article.title.toLowerCase().includes(lowercasedSearchTerm) ||
            article.snippet.toLowerCase().includes(lowercasedSearchTerm) ||
            article.tags.some(tag => tag.toLowerCase().includes(lowercasedSearchTerm))
        );

    const showArticles = selectedHub === 'all' && duration === 'all' && level === 'all';
    const hasCourseResults = filteredCourses.length > 0;
    const hasArticleResults = showArticles && filteredArticles.length > 0;
    const hasResults = hasCourseResults || hasArticleResults;

    const hubsForFilter = [{ id: 'all', title: 'All Courses' }, ...hubs];

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <header className="pb-8 border-b border-gray-200 mb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                            Discover
                        </h1>
                        <p className="mt-4 max-w-3xl text-lg text-gray-500">
                           Explore courses and articles to expand your skills. Use the search bar and filters to find specific topics suitable for your level ({USER_DATA.generalLevel}).
                        </p>
                    </div>
                    <div className="mt-6 flex flex-col lg:flex-row lg:items-end gap-6">
                        <div className="relative flex-grow">
                            <label htmlFor="search" className="sr-only">Search</label>
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="search"
                                type="text"
                                placeholder="Search courses and articles..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                             {/* Duration Filter */}
                             <div className="w-full sm:w-40">
                                <label htmlFor="duration-filter" className="block text-xs font-medium text-gray-500 mb-1">Duration</label>
                                <select id="duration-filter" value={duration} onChange={handleDurationChange} className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2">
                                    <option value="all">Any Duration</option>
                                    <option value="short">Short (&lt;4h)</option>
                                    <option value="medium">Medium (4-5h)</option>
                                    <option value="long">Long (&gt;5h)</option>
                                </select>
                            </div>

                            {/* Level Filter */}
                            <div className="w-full sm:w-48">
                                <label htmlFor="level-filter" className="block text-xs font-medium text-gray-500 mb-1">Level</label>
                                <select 
                                    id="level-filter" 
                                    value={level} 
                                    onChange={handleLevelChange} 
                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2"
                                >
                                    <option value="all">All Levels</option>
                                    <option value="A1">A1 - Beginner</option>
                                    <option value="A2">A2 - Elementary</option>
                                    <option value="B1">B1 - Intermediate</option>
                                    <option value="B2">B2 - Upper Intermediate</option>
                                    <option value="C1">C1 - Advanced</option>
                                    <option value="C2">C2 - Mastery</option>
                                </select>
                            </div>

                            {/* View Toggle */}
                            <div className="flex items-center space-x-1 border border-gray-300 rounded-md p-1 bg-white h-[38px] self-end">
                                <button
                                    onClick={() => setView('list')}
                                    className={`p-1.5 rounded-md ${view === 'list' ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
                                    aria-label="List view"
                                >
                                    <ListViewIcon className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => setView('grid')}
                                    className={`p-1.5 rounded-md ${view === 'grid' ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
                                    aria-label="Grid view"
                                >
                                    <GridViewIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="mb-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Filter by Skill</h3>
                    <div className="flex flex-wrap gap-2">
                        {hubsForFilter.map(hub => (
                            <button
                                key={hub.id}
                                onClick={() => handleHubChange(hub.id)}
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
                                            <CourseCard 
                                                key={course.id} 
                                                course={course} 
                                                view={view} 
                                                navigate={navigate}
                                                isLocked={levelService.isLocked(course, levelService.getEffectiveLevel(USER_DATA))}
                                            />
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
