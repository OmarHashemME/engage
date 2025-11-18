import React from 'react';

export const IntroToProgIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 52 52" {...props}>
    <rect width="52" height="52" rx="8" fill="#F0F9FF"></rect>
    <rect x="13" y="17" width="26" height="18" rx="2" stroke="#0284C7" strokeWidth="2"></rect>
    <path d="M19 23L23 27L19 31" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
    <path d="M26 31H32" stroke="#0284C7" strokeWidth="2" strokeLinecap="round"></path>
  </svg>
);