
import React from 'react';

export const LogoIcon: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xl' }> = ({ size = 'md' }) => {
  const containerClasses = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-16 h-16 rounded-[1.25rem]',
    xl: 'w-24 h-24 rounded-[1.5rem]'
  };

  const innerClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
    xl: 'w-14 h-14'
  };

  return (
    <div className={`${containerClasses[size]} bg-white shadow-lg flex items-center justify-center overflow-hidden flex-shrink-0 ring-1 ring-black/5`}>
      <div className={`${innerClasses[size]} relative overflow-hidden rounded-sm flex`}>
        {/* Blue half with star */}
        <div className="w-1/2 h-full bg-[#002868] flex items-center justify-center">
            <div className="w-1/3 h-1/3 bg-white rounded-full"></div>
        </div>
        {/* Red half */}
        <div className="w-1/2 h-full bg-[#BF0A30]"></div>
      </div>
    </div>
  );
};
