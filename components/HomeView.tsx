
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
      
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-b from-liberia-blue to-blue-900 text-white py-16 md:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1523527582-036a031d6d30?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
        <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center space-y-6">
            
            <div className="p-3 bg-white rounded-xl shadow-lg mb-2 animate-in zoom-in duration-500">
                <div className="flex -space-x-1">
                    <div className="w-4 h-8 bg-liberia-blue rounded-l-md"></div>
                    <div className="w-4 h-8 bg-gray-100"></div>
                    <div className="w-4 h-8 bg-liberia-red rounded-r-md"></div>
                </div>
            </div>

            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/20 mb-4">
                <span className="w-2 h-2 bg-liberia-red rounded-full animate-pulse"></span>
                <span className="text-sm font-medium tracking-wide uppercase tracking-tighter">Grain Coast Digital Archive</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight">
              Explore <span className="text-liberia-gold">Liberian</span> Heritage
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Ask any question about our history, culture, or future. Powered by verified national records.
            </p>
            
            <div className="pt-6 max-w-2xl mx-auto w-full">
              <SearchBar 
                onSearch={onSearch} 
                className="shadow-xl" 
                placeholder="Try '16 tribes of Liberia' or 'Who was J.J. Roberts?'" 
                selectedCounty={selectedCounty}
                onCountyChange={onCountyChange}
                language={language}
              />
            </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 py-20 w-full">
        <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-gray-900">Knowledge Categories</h2>
            <div className="h-1 w-16 bg-liberia-red mx-auto mt-4 rounded-full"></div>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto">Select a category to begin your research journey with curated information on specific Liberian topics.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {CATEGORIES.map((cat, index) => {
            const Icon = IconMap[cat.icon];
            const animationDelay = `${index * 75}ms`;
            
            return (
              <button
                key={cat.id}
                onClick={() => onSearch(cat.promptPrefix)}
                style={{ animationDelay }}
                className="group relative flex flex-col items-start p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm transition-all duration-500 ease-out hover:-translate-y-3 hover:shadow-2xl hover:shadow-liberia-blue/15 hover:border-liberia-blue/30 text-left overflow-hidden animate-in fade-in slide-in-from-bottom-10"
              >
                {/* Visual Accent Layer: Progress Bar Style */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-50 overflow-hidden">
                    <div className="h-full bg-liberia-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left ease-out"></div>
                </div>

                {/* Liberia Red Corner Accent */}
                <div className="absolute top-0 right-0 w-12 h-12 bg-liberia-red translate-x-10 -translate-y-10 rotate-45 group-hover:translate-x-6 group-hover:-translate-y-6 transition-transform duration-500 opacity-20"></div>
                
                {/* Icon Container with multi-stage animation */}
                <div className="relative p-4 bg-slate-50 text-liberia-blue rounded-2xl mb-6 group-hover:bg-liberia-blue group-hover:text-liberia-gold group-hover:rotate-[10deg] group-hover:scale-110 transition-all duration-500 shadow-sm border border-transparent group-hover:border-white/20">
                  <Icon className="w-7 h-7" />
                  {/* Subtle red dot that pulses on hover */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-liberia-red rounded-full opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 transition-all duration-300 delay-100 ring-2 ring-white"></div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-liberia-blue transition-colors flex items-center">
                  {cat.name}
                </h3>
                
                <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-700 transition-colors mb-6">
                  {cat.description}
                </p>

                {/* Enhanced "Explore" indicator */}
                <div className="mt-auto flex items-center space-x-2">
                    <div className="text-[11px] font-black text-liberia-blue uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                        Dive Deeper
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 group-hover:bg-liberia-blue group-hover:text-white flex items-center justify-center transition-all duration-500 group-hover:translate-x-2">
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
                <p className="text-sm text-gray-500 mt-1">Discover places and institutions shaping Liberia today.</p>
            </div>
            <div className="hidden sm:flex items-center space-x-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                <span className="w-2 h-2 bg-liberia-gold rounded-full"></span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Verified Partners</span>
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
                        <img src={item.imageUrl} alt={item.title} className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-1000 ease-out opacity-80 group-hover:opacity-100" />
                        <div className="absolute bottom-0 left-0 p-8 z-20 text-white w-full">
                            <div className="flex items-center space-x-2 mb-3">
                                <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${item.tag === 'TOURISM' ? 'bg-liberia-gold text-liberia-blue' : 'bg-white text-liberia-blue'}`}>{item.tag}</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-2 leading-tight">{item.title}</h3>
                            <p className="text-sm text-gray-300 line-clamp-2 mb-6 group-hover:text-white transition-colors">{item.description}</p>
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

      {/* Trust & Heritage Section */}
      <div className="w-full bg-slate-900 py-24 border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-liberia-blue via-liberia-red to-liberia-gold opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="grid md:grid-cols-3 gap-12 text-center">
                <div className="p-4 group">
                    <div className="mx-auto w-16 h-16 bg-white/5 text-liberia-gold rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:bg-liberia-gold group-hover:text-liberia-blue transition-all duration-500">
                        <BookOpen className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-xl mb-3 text-white">Academic Veracity</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">Cross-referenced with the University of Liberia archives and official MICAT records.</p>
                </div>
                <div className="p-4 group">
                    <div className="mx-auto w-16 h-16 bg-white/5 text-liberia-red rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:bg-liberia-red group-hover:text-white transition-all duration-500">
                        <Music className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-xl mb-3 text-white">Cultural Custody</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">Preserving the stories of the 16 original tribes and the rich oral traditions of the Grain Coast.</p>
                </div>
                <div className="p-4 group">
                    <div className="mx-auto w-16 h-16 bg-white/5 text-liberia-blue rounded-[1.5rem] flex items-center justify-center mb-6 group-hover:bg-liberia-blue group-hover:text-white transition-all duration-500">
                        <Briefcase className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-xl mb-3 text-white">Future Ready</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">Providing business intelligence for the next generation of Liberian entrepreneurs and investors.</p>
                </div>
            </div>
        </div>
      </div>

    </div>
  );
};
