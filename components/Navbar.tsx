import React, { useState, useRef, useEffect } from 'react';
import type { Page } from '../App';
import type { Hub } from '../types';
import { MenuIcon } from './icons/MenuIcon';
import { XIcon } from './icons/XIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { UserIcon } from './icons/UserIcon';


interface NavbarProps {
  navigate: (page: Page) => void;
  hubs: Hub[];
}

const Navbar: React.FC<NavbarProps> = ({ navigate, hubs }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);
  const skillsMenuRef = useRef<HTMLDivElement>(null);

  const handleNavigate = (page: Page) => {
    navigate(page);
    setIsMobileMenuOpen(false);
    setIsSkillsOpen(false);
  }

  // Close skills dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (skillsMenuRef.current && !skillsMenuRef.current.contains(event.target as Node)) {
        setIsSkillsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button onClick={() => handleNavigate({ name: 'home' })} className="flex items-center space-x-2">
               <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-xl font-bold text-gray-800">Engage</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <NavLink onClick={() => handleNavigate({ name: 'courses' })}>Discovery</NavLink>
            <div className="relative" ref={skillsMenuRef}>
              <button
                onClick={() => setIsSkillsOpen(!isSkillsOpen)}
                className="flex items-center text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Skills <ChevronDownIcon className={`h-4 w-4 ml-1 transition-transform ${isSkillsOpen ? 'rotate-180' : ''}`} />
              </button>
              {isSkillsOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 animate-fade-in" style={{animationDuration: '150ms'}}>
                  <div className="py-1">
                    {hubs.map(hub => (
                      <button
                        key={hub.id}
                        onClick={() => handleNavigate({ name: 'hub', props: { hubId: hub.id } })}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {hub.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <NavLink onClick={() => handleNavigate({ name: 'learningPaths' })}>Learn Paths</NavLink>
            <NavLink onClick={() => handleNavigate({ name: 'community' })}>Community</NavLink>
             <button
                onClick={() => handleNavigate({ name: 'profile' })}
                className="ml-4 p-2 rounded-full text-gray-600 hover:text-indigo-600 hover:bg-gray-100 transition-colors"
                aria-label="Your profile"
              >
                <UserIcon className="h-6 w-6" />
              </button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
             <button
                onClick={() => handleNavigate({ name: 'profile' })}
                className="p-2 rounded-full text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                aria-label="Your profile"
              >
                <UserIcon className="h-6 w-6" />
              </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 ml-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100">
              <span className="sr-only">Open menu</span>
              {isMobileMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden animate-fade-in" style={{animationDuration: '200ms'}}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
            <MobileNavLink onClick={() => handleNavigate({ name: 'home' })}>Home</MobileNavLink>
            <MobileNavLink onClick={() => handleNavigate({ name: 'courses' })}>Discovery</MobileNavLink>
            <MobileNavLink onClick={() => handleNavigate({ name: 'learningPaths' })}>Learn Paths</MobileNavLink>
            <MobileNavLink onClick={() => handleNavigate({ name: 'community' })}>Community</MobileNavLink>
            <div className="border-t border-gray-200 pt-3 mt-3">
                 <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Skills</h3>
                 <div className="mt-2 space-y-1">
                    {hubs.map(hub => (
                        <MobileNavLink key={hub.id} onClick={() => handleNavigate({ name: 'hub', props: { hubId: hub.id } })}>
                          <hub.icon className="h-5 w-5 mr-3" />
                          {hub.title}
                        </MobileNavLink>
                    ))}
                 </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

const NavLink: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="text-gray-600 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
  >
    {children}
  </button>
);

const MobileNavLink: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="w-full text-left flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
  >
    {children}
  </button>
);

export default Navbar;
