
import React from 'react';
import { Menu, Star, Globe } from 'lucide-react';
import { Language } from '../types';

interface HeaderProps {
  onLogoClick: () => void;
  onAboutClick: () => void;
  onBusinessClick: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogoClick, onAboutClick, onBusinessClick, language, setLanguage }) => {
  
  const toggleLanguage = () => {
      setLanguage(language === 'English' ? 'Koloqua' : 'English');
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center cursor-pointer" onClick={onLogoClick}>
            {/* Abstract flag representation or logo */}
            <div className="flex -space-x-1 mr-2">
               <div className="w-3 h-6 bg-liberia-blue rounded-l-sm"></div>
               <div className="w-3 h-6 bg-white"></div>
               <div className="w-3 h-6 bg-liberia-red rounded-r-sm"></div>
            </div>
            <div className="relative">
                <Star className="w-4 h-4 text-white absolute -left-8 top-1 fill-white" />
                <span className="text-xl font-serif font-bold text-liberia-blue tracking-tight">
                Ask<span className="text-liberia-red">Liberia</span>
                </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 md:space-x-8">
             {/* Language Toggle */}
             <button 
                onClick={toggleLanguage}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-sm font-medium text-gray-700 transition-colors"
                title="Switch Language / Dialect"
             >
                <Globe className="w-3.5 h-3.5 text-liberia-blue" />
                <span>{language === 'English' ? 'English' : 'Koloqua'}</span>
             </button>

             <nav className="hidden md:flex space-x-8">
                <a href="#" onClick={(e) => { e.preventDefault(); onLogoClick(); }} className="text-gray-600 hover:text-liberia-blue font-medium">Home</a>
                <a href="#about" onClick={(e) => { e.preventDefault(); onAboutClick(); }} className="text-gray-600 hover:text-liberia-blue font-medium">About</a>
                <a href="#business" onClick={(e) => { e.preventDefault(); onBusinessClick(); }} className="text-gray-600 hover:text-liberia-blue font-medium">Business & API</a>
             </nav>

             <button className="md:hidden text-gray-600 hover:text-liberia-blue">
                <Menu className="w-6 h-6" />
             </button>
          </div>
        </div>
      </div>
    </header>
  );
};
