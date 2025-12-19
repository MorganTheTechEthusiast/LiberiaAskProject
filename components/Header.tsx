
import React, { useState } from 'react';
import { Menu, Star, Globe, X, User as UserIcon, LogOut, Settings } from 'lucide-react';
import { Language, User } from '../types';

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
                <span className="text-xl font-serif font-bold text-liberia-blue tracking-tight">
                Ask<span className="text-liberia-red">Liberia</span>
                </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 md:space-x-6">
             {/* Language Toggle */}
             <button 
                onClick={toggleLanguage}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-sm font-medium text-gray-700 transition-colors"
                title="Switch Language / Dialect"
             >
                <Globe className="w-3.5 h-3.5 text-liberia-blue" />
                <span className="hidden md:inline">{language === 'English' ? 'English' : 'Koloqua'}</span>
             </button>

             {/* Desktop Nav */}
             <nav className="hidden md:flex space-x-6 items-center">
                <a href="#" onClick={(e) => { e.preventDefault(); onLogoClick(); }} className="text-gray-600 hover:text-liberia-blue font-medium text-sm">Home</a>
                <a href="#about" onClick={(e) => { e.preventDefault(); onAboutClick(); }} className="text-gray-600 hover:text-liberia-blue font-medium text-sm">About</a>
                <a href="#business" onClick={(e) => { e.preventDefault(); onBusinessClick(); }} className="text-gray-600 hover:text-liberia-blue font-medium text-sm">Business</a>
             </nav>
             
             <div className="h-6 w-px bg-gray-200 hidden md:block"></div>

             {/* User Profile */}
             {currentUser ? (
                <div className="relative">
                    <button 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center space-x-2 focus:outline-none"
                    >
                        <img 
                            src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}`} 
                            alt={currentUser.name} 
                            className="w-8 h-8 rounded-full border border-gray-200 object-cover"
                        />
                        <span className="text-sm font-bold text-gray-800 hidden md:block max-w-[100px] truncate">{currentUser.name}</span>
                    </button>

                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 animate-in slide-in-from-top-2 duration-200">
                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="text-xs text-gray-500 uppercase font-bold">Signed in as</p>
                                <p className="text-sm font-bold text-gray-900 truncate">{currentUser.email}</p>
                            </div>
                            <button 
                                onClick={() => { onProfileClick(); setIsProfileOpen(false); }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                            >
                                <UserIcon className="w-4 h-4 mr-2 text-gray-400" /> My Profile
                            </button>
                            <button 
                                onClick={() => { onLogout(); setIsProfileOpen(false); }}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                            >
                                <LogOut className="w-4 h-4 mr-2" /> Sign Out
                            </button>
                        </div>
                    )}
                </div>
             ) : (
                 /* Should theoretically not be reached due to App wrapper, but good safety */
                 <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
             )}

             {/* Mobile Menu Button */}
             <button 
                className="md:hidden text-gray-600 hover:text-liberia-blue p-1"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
             >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-xl animate-in slide-in-from-top-5 duration-200 z-40">
          <div className="px-4 pt-2 pb-6 space-y-2">
             <div className="py-3 border-b border-gray-100 mb-2 flex items-center space-x-3" onClick={() => { onProfileClick(); setIsMenuOpen(false); }}>
                {currentUser && (
                    <>
                        <img 
                            src={currentUser.avatar} 
                            alt={currentUser.name} 
                            className="w-10 h-10 rounded-full object-cover" 
                        />
                        <div>
                            <div className="font-bold text-gray-900">{currentUser.name}</div>
                            <div className="text-xs text-gray-500">{currentUser.email}</div>
                        </div>
                    </>
                )}
             </div>

            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); handleNavClick(onLogoClick); }} 
              className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-liberia-blue hover:bg-blue-50 transition-colors"
            >
              Home
            </a>
            <a 
              href="#about" 
              onClick={(e) => { e.preventDefault(); handleNavClick(onAboutClick); }} 
              className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-liberia-blue hover:bg-blue-50 transition-colors"
            >
              About
            </a>
            <a 
              href="#business" 
              onClick={(e) => { e.preventDefault(); handleNavClick(onBusinessClick); }} 
              className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-liberia-blue hover:bg-blue-50 transition-colors"
            >
              Business & API
            </a>
             <button 
                onClick={() => { onProfileClick(); setIsMenuOpen(false); }}
                className="w-full text-left px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
            >
                <UserIcon className="w-5 h-5 mr-2 text-gray-400" /> My Profile
            </button>
            <button 
                onClick={() => { onLogout(); setIsMenuOpen(false); }}
                className="w-full text-left px-3 py-3 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center"
            >
                <LogOut className="w-5 h-5 mr-2" /> Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
