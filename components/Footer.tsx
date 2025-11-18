import React from 'react';
import type { Page } from '../App';
import { HUBS_DATA } from '../constants';
import { TwitterIcon } from './icons/TwitterIcon';
import { FacebookIcon } from './icons/FacebookIcon';
import { GitHubIcon } from './icons/GitHubIcon';

interface FooterProps {
  navigate: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const handleNavigate = (page: Page) => {
    navigate(page);
  };

  const socialLinks = [
    { name: 'Facebook', icon: FacebookIcon, href: '#' },
    { name: 'Twitter', icon: TwitterIcon, href: '#' },
    { name: 'GitHub', icon: GitHubIcon, href: '#' },
  ];

  return (
    <footer className="bg-slate-800 text-gray-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Logo and Slogan */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <button onClick={() => handleNavigate({ name: 'home' })} className="flex items-center space-x-2">
              <svg className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-xl font-bold text-white">Engage</span>
            </button>
            <p className="mt-4 text-sm text-gray-400">
              Unlock Your English Potential.
            </p>
          </div>

          {/* Explore Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Explore</h3>
            <ul className="mt-4 space-y-3">
              <li><FooterLink onClick={() => handleNavigate({ name: 'courses' })}>Discovery</FooterLink></li>
              <li><FooterLink onClick={() => handleNavigate({ name: 'learningPaths' })}>Learn Paths</FooterLink></li>
              <li><FooterLink onClick={() => handleNavigate({ name: 'community' })}>Community</FooterLink></li>
            </ul>
          </div>

          {/* Skills Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Skills</h3>
            <ul className="mt-4 space-y-3">
              {HUBS_DATA.slice(0, 3).map(hub => (
                 <li key={hub.id}><FooterLink onClick={() => handleNavigate({ name: 'hub', props: { hubId: hub.id } })}>{hub.title}</FooterLink></li>
              ))}
            </ul>
          </div>
          
           {/* More Skills Links */}
           <div className="col-start-3 md:col-start-auto">
            <h3 className="text-sm font-semibold text-slate-800 tracking-wider uppercase hidden md:block">.</h3>
            <ul className="mt-4 space-y-3">
              {HUBS_DATA.slice(3).map(hub => (
                 <li key={hub.id}><FooterLink onClick={() => handleNavigate({ name: 'hub', props: { hubId: hub.id } })}>{hub.title}</FooterLink></li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom section */}
        <div className="mt-12 border-t border-slate-700 pt-8 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Engage. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            {socialLinks.map((item) => (
              <a key={item.name} href={item.href} className="text-gray-400 hover:text-gray-300">
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button onClick={onClick} className="text-base text-gray-300 hover:text-white transition-colors duration-200">
    {children}
  </button>
);


export default Footer;