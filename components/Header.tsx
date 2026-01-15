
import React, { useState } from 'react';
import { Menu, Star, Globe, X, User as UserIcon, LogOut, Settings } from 'lucide-react';
import { Language, User } from '../types';
import { LogoIcon } from './LogoIcon';

interface HeaderProps {
  onLogoClick: () => void;
  onAboutClick: () => void;
  onBusinessClick: () => void;
  onProfileClick: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogoClick, onAboutClick, onBusinessClick, onProfileClick, language, setLanguage, currentUser, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const toggleLanguage = () => {
      setLanguage(language === 'English' ? 'Koloqua' : 'English');
  };

  const handleNavClick = (action: () => void) => {
      action();
      setIsMenuOpen(false);
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button 
            className="flex items-center cursor-pointer outline-none focus:ring-2 focus:ring-liberia-blue focus:ring-offset-2 rounded-lg p-1 transition-all" 
            onClick={onLogoClick}
            aria-label="AskLiberia Home"
          >
            <LogoIcon size="sm" />
            <span className="text-xl font-serif font-bold text-liberia-blue tracking-tight ml-2">
              Ask<span className="text-liberia-red">Liberia</span>
            </span>
          </button>
          
          <div className="flex items-center space-x-2 md:space-x-4">
             <button 
                onClick={toggleLanguage}
                className="flex items-center justify-center w-10 h-10 md:w-auto md:px-3 md:py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-sm font-medium text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-liberia-blue"
                aria-label={`Switch language. Current: ${language}`}
             >
                <Globe className="w-4 h-4 md:w-3.5 md:h-3.5 text-liberia-blue md:mr-1.5" />
                <span className="hidden md:inline">{language === 'English' ? 'English' : 'Koloqua'}</span>
             </button>

             {currentUser && (
                <div className="relative">
                    <button 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-liberia-blue rounded-full p-0.5"
                        aria-expanded={isProfileOpen}
                        aria-haspopup="true"
                        aria-label="User profile menu"
                    >
                        <div className="w-9 h-9 md:w-8 md:h-8 rounded-full border-2 border-liberia-blue/10 bg-liberia-blue text-white flex items-center justify-center text-[10px] font-bold uppercase overflow-hidden">
                           {currentUser.avatar ? <img src={currentUser.avatar} alt="" className="w-full h-full object-cover" /> : currentUser.name.substring(0,2)}
                        </div>
                    </button>

                    {isProfileOpen && (
                        <div 
                          className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 animate-in slide-in-from-top-2 duration-200 z-50"
                          role="menu"
                        >
                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="text-xs text-gray-500 uppercase font-bold">Signed in as</p>
                                <p className="text-sm font-bold text-gray-900 truncate" title={currentUser.email}>{currentUser.email}</p>
                            </div>
                            <button 
                                onClick={() => { onProfileClick(); setIsProfileOpen(false); }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center focus:bg-blue-50 focus:outline-none"
                                role="menuitem"
                            >
                                <UserIcon className="w-4 h-4 mr-2 text-gray-400" /> My Profile
                            </button>
                            <button 
                                onClick={() => { onLogout(); setIsProfileOpen(false); }}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center focus:bg-red-50 focus:outline-none"
                                role="menuitem"
                            >
                                <LogOut className="w-4 h-4 mr-2" /> Sign Out
                            </button>
                        </div>
                    )}
                </div>
             )}

             <button 
                className="text-gray-600 hover:text-liberia-blue p-2 focus:outline-none focus:ring-2 focus:ring-liberia-blue rounded-lg"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-expanded={isMenuOpen}
                aria-label="Toggle mobile menu"
             >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
             </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-xl animate-in slide-in-from-top-5 duration-200 z-40">
          <nav className="px-4 pt-2 pb-6 space-y-2" aria-label="Mobile navigation">
            <button 
              onClick={() => handleNavClick(onLogoClick)} 
              className="w-full text-left px-4 py-4 rounded-xl text-base font-bold text-gray-700 hover:text-liberia-blue hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
            >
              Home
            </button>
            <button 
              onClick={() => handleNavClick(onAboutClick)} 
              className="w-full text-left px-4 py-4 rounded-xl text-base font-bold text-gray-700 hover:text-liberia-blue hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
            >
              About
            </button>
            <button 
              onClick={() => handleNavClick(onBusinessClick)} 
              className="w-full text-left px-4 py-4 rounded-xl text-base font-bold text-gray-700 hover:text-liberia-blue hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
            >
              Business & API
            </button>
            <div className="h-px bg-gray-100 my-2"></div>
            <button 
                onClick={() => { onLogout(); setIsMenuOpen(false); }}
                className="w-full text-left px-4 py-4 rounded-xl text-base font-bold text-red-600 hover:bg-red-50 focus:bg-red-50 focus:outline-none flex items-center"
            >
                <LogOut className="w-5 h-5 mr-3" /> Sign Out
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
