
import React, { useEffect, useState } from 'react';
import { SearchBar } from './SearchBar';
import { Category, Language, SponsoredItem } from '../types';
import { adminService } from '../services/adminService';
import { Landmark, BookOpen, GraduationCap, Briefcase, Flag, Map, Users, Music, Loader2, ArrowRight } from 'lucide-react';

interface HomeViewProps {
  onSearch: (query: string) => void;
  selectedCounty: string;
  onCountyChange: (county: string) => void;
  language: Language;
}

const CATEGORIES: Category[] = [
  { id: 'history', name: 'History', icon: 'Landmark', description: 'Presidents, wars, and founding', promptPrefix: 'Tell me about the history of ' },
  { id: 'culture', name: 'Culture', icon: 'Music', description: 'Tribes, food, and traditions', promptPrefix: 'Explain the culture and traditions of ' },
  { id: 'tourism', name: 'Tourism', icon: 'Map', description: 'Places to visit and hotels', promptPrefix: 'What are the best tourism spots in ' },
  { id: 'gov', name: 'Government', icon: 'Flag', description: 'Laws, ministries, and constitution', promptPrefix: 'Give me details about the Liberian government regarding ' },
  { id: 'education', name: 'Education', icon: 'GraduationCap', description: 'Schools, universities, WAEC', promptPrefix: 'Information about education in Liberia specifically ' },
  { id: 'business', name: 'Business', icon: 'Briefcase', description: 'Economy, mining, and agriculture', promptPrefix: 'Business and economic statistics for ' },
  { id: 'people', name: 'Notable People', icon: 'Users', description: 'Leaders, artists, and athletes', promptPrefix: 'Biography and achievements of ' },
  { id: 'laws', name: 'Laws & Rights', icon: 'BookOpen', description: 'Constitution and legal system', promptPrefix: 'What does the Liberian law say about ' },
];

const IconMap: Record<string, React.FC<any>> = {
  Landmark, BookOpen, GraduationCap, Briefcase, Flag, Map, Users, Music
};

export const HomeView: React.FC<HomeViewProps> = ({ onSearch, selectedCounty, onCountyChange, language }) => {
  const [featuredContent, setFeaturedContent] = useState<SponsoredItem[]>([]);
  const [loadingContent, setLoadingContent] = useState(true);

  useEffect(() => {
    const data = adminService.getSponsoredContent();
    setFeaturedContent(data);
    setLoadingContent(false);
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      
      {/* Hero Section - Matching the Image Design Exactly */}
      <div className="w-full bg-[#002868] text-white py-16 md:py-24 px-4 relative overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
            
            {/* Centered Large Logo Icon */}
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl shadow-xl mb-8 flex items-center justify-center animate-in zoom-in duration-500">
                <div className="grid grid-cols-2 grid-rows-2 w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-md border border-gray-100">
                    <div className="bg-[#002868] flex items-center justify-center">
                         <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="bg-[#BF0A30]"></div>
                    <div className="bg-white"></div>
                    <div className="bg-[#BF0A30]"></div>
                </div>
            </div>

            {/* Knowledge Engine Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 mb-10">
                <span className="w-2 h-2 bg-[#BF0A30] rounded-full animate-pulse"></span>
                <span className="text-xs md:text-sm font-bold tracking-tight text-white/90">
                    The First Centralized Digital Knowledge Engine for Liberia
                </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight mb-8">
              Discover <span className="text-[#FFD700] font-sans">Liberia</span>
            </h1>

            {/* Subheading Text */}
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed mb-12 px-4">
              Access verified information about history, culture, government, and business. 
              Your gateway to the Grain Coast.
            </p>
            
            {/* The Integrated Search Bar Wrapper */}
            <div className="w-full max-w-3xl mx-auto">
              <SearchBar 
                onSearch={onSearch} 
                className="shadow-2xl" 
                placeholder="Try 'Who founded Liberia?'" 
                selectedCounty={selectedCounty}
                onCountyChange={onCountyChange}
                language={language}
              />
            </div>
        </div>
      </div>

      {/* Categories Grid - Preserved for functionality */}
      <div className="max-w-7xl mx-auto px-4 py-20 w-full">
        <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-gray-900">Knowledge Categories</h2>
            <div className="h-1 w-16 bg-liberia-red mx-auto mt-4 rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {CATEGORIES.map((cat, index) => {
            const Icon = IconMap[cat.icon];
            return (
              <button
                key={cat.id}
                onClick={() => onSearch(cat.promptPrefix)}
                className="group relative flex flex-col items-start p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm transition-all duration-500 ease-out hover:-translate-y-3 hover:shadow-2xl hover:shadow-liberia-blue/15 hover:border-liberia-blue/30 text-left overflow-hidden"
              >
                <div className="relative p-4 bg-slate-50 text-liberia-blue rounded-2xl mb-6 group-hover:bg-liberia-blue group-hover:text-liberia-gold transition-all duration-500">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-liberia-blue transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                  {cat.description}
                </p>
                <div className="mt-auto flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-liberia-blue group-hover:text-white flex items-center justify-center transition-all duration-500">
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured / Sponsored Section */}
      <div className="max-w-7xl mx-auto px-4 mb-24 w-full">
        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Featured Spotlights</h2>
            </div>
        </div>
        
        {loadingContent ? (
            <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-liberia-blue" />
            </div>
        ) : (
            <div className="grid md:grid-cols-3 gap-8">
                {featuredContent.map((item) => (
                    <div key={item.id} className="relative group overflow-hidden rounded-[2.5rem] shadow-md cursor-pointer bg-slate-900 border border-gray-100">
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent z-10"></div>
                        <img src={item.imageUrl} alt={item.title} className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-1000 ease-out opacity-80" />
                        <div className="absolute bottom-0 left-0 p-8 z-20 text-white w-full">
                            <span className="text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest bg-liberia-gold text-liberia-blue mb-3 inline-block">{item.tag}</span>
                            <h3 className="text-2xl font-bold mb-2 leading-tight">{item.title}</h3>
                            <div className="flex items-center space-x-2 text-xs font-bold text-liberia-gold group-hover:translate-x-1 transition-transform">
                                <span>{item.buttonText || 'Discover More'}</span>
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};
