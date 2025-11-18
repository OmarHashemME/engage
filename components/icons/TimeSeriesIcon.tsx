import React from 'react';

export const TimeSeriesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 52 52" {...props}>
    <rect width="52" height="52" rx="8" fill="#F0F9FF"></rect>
    <circle cx="26" cy="26" r="11" stroke="#0284C7" strokeWidth="2"></circle>
    <path d="M26 18V26L31 29" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
  </svg>
);