import React from 'react';
import type { Article } from '../types';
import type { Page } from '../App';


interface ArticleCardProps {
  article: Article;
  navigate: (page: Page) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, navigate }) => {
  return (
    <button 
      onClick={() => navigate({ name: 'article', props: { articleId: article.id } })}
      className="text-left flex flex-col rounded-lg shadow-md overflow-hidden h-full bg-white transform hover:-translate-y-1 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <div className="flex space-x-2 mb-2">
            {article.tags.map(tag => (
              <span key={tag} className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{article.title}</h3>
          <p className="mt-2 text-sm text-gray-600">{article.snippet}</p>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center text-xs text-gray-500">
            <span>{article.author}</span>
            <span className="mx-2">&middot;</span>
            <span>{article.publishedDate}</span>
            <span className="mx-2">&middot;</span>
            <span>{article.readTime}</span>
          </div>
        </div>
      </div>
    </button>
  );
};

export default ArticleCard;