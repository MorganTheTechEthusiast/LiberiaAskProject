
import React, { useEffect, useState } from 'react';
import { SearchBar } from './SearchBar';
import { Category, Language, SponsoredItem } from '../types';
import { adminService } from '../services/adminService';
import { Landmark, BookOpen, GraduationCap, Briefcase, Flag, Map, Users, Music, Loader2, ArrowRight } from 'lucide-react';
import { LogoIcon } from './LogoIcon';

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
    <div className="flex flex-col items-center w-full bg-white">
      
      {/* Hero Section - Restored to the Exact 'Look Design' Screenshot */}
      <div className="w-full bg-[#002868] text-white py-14 md:py-28 px-4 relative overflow-hidden flex flex-col items-center">
        {/* Subtle subtle gradient depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#001c4a] to-[#002868]"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center w-full">
            
            {/* Centered Minimalist Logo Box */}
            <div className="mb-10 animate-in zoom-in duration-500">
                <LogoIcon size="xl" />
            </div>

            {/* Knowledge Engine Badge - Matches Screenshot Pill Style */}
            <div className="inline-flex items-center space-x-2 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-12 shadow-inner">
                <span className="w-2 h-2 bg-liberia-red rounded-full animate-pulse shadow-[0_0_8px_rgba(191,10,48,0.8)]"></span>
                <span className="text-[11px] md:text-sm font-bold tracking-tight text-white uppercase md:normal-case">
                    The First Centralized Digital Knowledge Engine for Liberia
                </span>
            </div>

            {/* Main Heading - Matches Screenshot Mixed Font Style */}
            <h1 className="text-[2.75rem] md:text-7xl mb-8 tracking-tight font-bold">
              <span className="font-serif text-white">Discover </span>
              <span className="font-sans text-[#FFD700]">Liberia</span>
            </h1>

            {/* Subheading Text - Matches Screenshot Spacing/Line Height */}
            <p className="text-base md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed mb-14 px-2 font-sans">
              Access verified information about history, culture, government, and business. 
              Your gateway to the Grain Coast.
            </p>
            
            {/* The Integrated Search Bar Wrapper */}
            <div className="w-full max-w-3xl mx-auto mb-4">
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

      {/* Categories Grid - Responsive Layout */}
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 w-full">
        <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-[2.5rem] font-serif font-bold text-slate-900 leading-tight">Knowledge Categories</h2>
            <div className="h-1 w-12 bg-liberia-red mx-auto mt-5 rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {CATEGORIES.map((cat) => {
            const Icon = IconMap[cat.icon];
            return (
              <button
                key={cat.id}
                onClick={() => onSearch(cat.promptPrefix)}
                className="group relative flex flex-col items-start p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-liberia-blue/20 text-left overflow-hidden active:scale-95"
              >
                <div className="relative p-4 bg-slate-50 text-liberia-blue rounded-2xl mb-6 group-hover:bg-liberia-blue group-hover:text-liberia-gold transition-colors duration-300">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {cat.name}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                  {cat.description}
                </p>
                <div className="mt-auto flex items-center space-x-2 text-liberia-blue font-bold text-xs uppercase tracking-widest">
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured / Sponsored Section */}
      <div className="max-w-7xl mx-auto px-4 mb-24 w-full">
        <div className="flex items-center justify-between mb-10 border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-bold text-gray-900">Featured Spotlights</h2>
            <button className="text-sm font-bold text-liberia-blue hover:underline">View All</button>
        </div>
        
        {loadingContent ? (
            <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-liberia-blue" />
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredContent.map((item) => (
                    <div key={item.id} className="relative group overflow-hidden rounded-[2.5rem] shadow-md cursor-pointer bg-slate-900 border border-gray-100 min-h-[340px]">
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10"></div>
                        <img src={item.imageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out opacity-70" />
                        <div className="absolute bottom-0 left-0 p-8 z-20 text-white w-full">
                            <span className="text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest bg-liberia-gold text-liberia-blue mb-3 inline-block shadow-lg">{item.tag}</span>
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
