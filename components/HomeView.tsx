
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
    // Simulate fetch
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
            
            {/* Logo for Home View */}
            <div className="p-3 bg-white rounded-xl shadow-lg mb-2 animate-in zoom-in duration-500">
                <div className="flex -space-x-1">
                    <div className="w-4 h-8 bg-liberia-blue rounded-l-md"></div>
                    <div className="w-4 h-8 bg-gray-100"></div>
                    <div className="w-4 h-8 bg-liberia-red rounded-r-md"></div>
                </div>
            </div>

            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/20 mb-4">
                <span className="w-2 h-2 bg-liberia-red rounded-full animate-pulse"></span>
                <span className="text-sm font-medium tracking-wide">The First Centralized Digital Knowledge Engine for Liberia</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight">
              Discover <span className="text-liberia-gold">Liberia</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
              Access verified information about history, culture, government, and business. 
              Your gateway to the Grain Coast.
            </p>
            
            <div className="pt-6 max-w-2xl mx-auto w-full">
              <SearchBar 
                onSearch={onSearch} 
                className="shadow-xl" 
                placeholder="Try 'Who founded Liberia?' or 'Best hotels in Monrovia'" 
                selectedCounty={selectedCounty}
                onCountyChange={onCountyChange}
                language={language}
              />
            </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-800">Explore by Category</h2>
            <div className="h-1 w-12 bg-liberia-red mx-auto mt-2 rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => {
            const Icon = IconMap[cat.icon];
            return (
              <button
                key={cat.id}
                onClick={() => onSearch(cat.promptPrefix)}
                className="group relative flex flex-col items-start p-7 bg-white rounded-2xl border border-gray-200 shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-liberia-blue/10 hover:border-liberia-blue text-left overflow-hidden"
              >
                {/* Decorative Platform Accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-liberia-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                
                {/* Icon Container */}
                <div className="p-3.5 bg-blue-50 text-liberia-blue rounded-xl mb-5 group-hover:bg-liberia-blue group-hover:text-liberia-gold group-hover:rotate-6 transition-all duration-300 shadow-sm group-hover:shadow-md">
                  <Icon className="w-6 h-6" />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-liberia-blue transition-colors">
                  {cat.name}
                </h3>
                
                <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-700 transition-colors">
                  {cat.description}
                </p>

                {/* Animated "Explore" indicator */}
                <div className="mt-5 flex items-center text-xs font-bold text-liberia-blue uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sponsored / Featured Section */}
      <div className="max-w-7xl mx-auto px-4 mb-16 w-full">
        <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-2">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Featured & Sponsored</h2>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider border border-gray-200 px-2 py-1 rounded bg-gray-50">Partner Content</span>
        </div>
        
        {loadingContent ? (
            <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-liberia-blue" />
            </div>
        ) : (
            <div className="grid md:grid-cols-3 gap-6">
                {featuredContent.map((item) => (
                    <div key={item.id} className="relative group overflow-hidden rounded-xl shadow-sm cursor-pointer bg-gray-100">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10"></div>
                        <img src={item.imageUrl} alt={item.title} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute bottom-0 left-0 p-6 z-20 text-white">
                            <div className="flex items-center space-x-2 mb-2">
                                <span className={`text-black text-[10px] font-bold px-2 py-0.5 rounded ${item.tag === 'TOURISM' ? 'bg-liberia-gold' : 'bg-white'}`}>{item.tag}</span>
                            </div>
                            <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                            <p className="text-xs text-gray-300 line-clamp-2 mb-3">{item.description}</p>
                            <button className="text-xs font-bold underline decoration-liberia-gold underline-offset-4">{item.buttonText || 'Learn More'}</button>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* Features / Trust Section */}
      <div className="w-full bg-gray-50 py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="p-4">
                    <div className="mx-auto w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Verified Information</h3>
                    <p className="text-gray-600 text-sm">Our AI cross-references trusted government and educational sources to bring you accuracy.</p>
                </div>
                <div className="p-4">
                    <div className="mx-auto w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                        <Music className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Cultural Heritage</h3>
                    <p className="text-gray-600 text-sm">Deep dive into the 16 tribes, dialects, festivals, and the rich arts of Liberia.</p>
                </div>
                <div className="p-4">
                    <div className="mx-auto w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Business Intelligence</h3>
                    <p className="text-gray-600 text-sm">Essential data for investors looking into rubber, iron ore, and tourism sectors.</p>
                </div>
            </div>
        </div>
      </div>

    </div>
  );
};
