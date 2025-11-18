import React from 'react';
import type { Article } from '../types';
import type { Page } from '../App';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface ArticlePageProps {
  article: Article;
  navigate: (page: Page) => void;
}

const ArticlePage: React.FC<ArticlePageProps> = ({ article, navigate }) => {
  return (
    <div className="bg-white min-h-screen animate-fade-in">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button 
            onClick={() => navigate({ name: 'courses' })}
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Discovery
          </button>
        </div>
        
        <article>
          <header className="mb-8">
            <div className="flex space-x-2 mb-3">
              {article.tags.map(tag => (
                <span key={tag} className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              {article.title}
            </h1>
            <div className="mt-6 flex items-center text-sm text-gray-500">
              <span>By {article.author}</span>
              <span className="mx-2">&middot;</span>
              <span>{article.publishedDate}</span>
              <span className="mx-2">&middot;</span>
              <span>{article.readTime}</span>
            </div>
          </header>

          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
      </div>
    </div>
  );
};

export default ArticlePage;