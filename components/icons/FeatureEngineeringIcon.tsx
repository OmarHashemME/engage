import React from 'react';

export const FeatureEngineeringIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 52 52" {...props}>
    <rect width="52" height="52" rx="8" fill="#FEFCE8"></rect>
    <circle cx="19" cy="19" r="2.5" stroke="#EAB308" strokeWidth="2"></circle>
    <circle cx="33" cy="19" r="2.5" stroke="#EAB308" strokeWidth="2"></circle>
    <circle cx="19" cy="33" r="2.5" stroke="#EAB308" strokeWidth="2"></circle>
    <circle cx="33" cy="33" r="2.5" stroke="#EAB308" strokeWidth="2"></circle>
    <path d="M21.5 19H30.5" stroke="#EAB308" strokeWidth="2" strokeLinecap="round"></path>
    <path d="M19 21.5V30.5" stroke="#EAB308" strokeWidth="2" strokeLinecap="round"></path>
    <path d="M33 21.5V30.5" stroke="#EAB308" strokeWidth="2" strokeLinecap="round"></path>
    <path d="M21.5 33H30.5" stroke="#EAB308" strokeWidth="2" strokeLinecap="round"></path>
  </svg>
);