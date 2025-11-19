
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { ResultsView } from './components/ResultsView';
import { AboutView } from './components/AboutView';
import { BusinessView } from './components/BusinessView';
import { ChatWidget } from './components/ChatWidget';
import { SearchBar } from './components/SearchBar';
import { searchLiberia } from './services/geminiService';
import { SearchResult, ViewState, Language, COUNTIES } from './types';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>(ViewState.HOME);
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCounty, setSelectedCounty] = useState<string>('All Liberia');
  const [language, setLanguage] = useState<Language>('English');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    const c = params.get('county');
    const l = params.get('lang');

    if (c && COUNTIES.includes(c as any)) setSelectedCounty(c);
    if (l && (l === 'English' || l === 'Koloqua')) setLanguage(l as Language);

    if (q) {
      handleSearch(q, c || 'All Liberia', (l as Language) || 'English');
    }
  }, []);

  const handleSearch = async (newQuery: string, countyOverride?: string, languageOverride?: Language) => {
    const activeCounty = countyOverride || selectedCounty;
    const activeLang = languageOverride || language;
    
    setQuery(newQuery);
    setViewState(ViewState.RESULTS);
    setLoading(true);
    
    // Update URL safely
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('q', newQuery);
      if (activeCounty !== 'All Liberia') url.searchParams.set('county', activeCounty);
      else url.searchParams.delete('county');
      
      if (activeLang !== 'English') url.searchParams.set('lang', activeLang);
      else url.searchParams.delete('lang');

      window.history.pushState({}, '', url.toString());
    } catch (error) {
      console.warn('Unable to update URL history:', error);
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const result = await searchLiberia(newQuery, activeCounty, activeLang);
    setSearchResult(result);
    setLoading(false);
  };

  const handleGoHome = () => {
    setViewState(ViewState.HOME);
    setQuery('');
    setSearchResult(null);
    
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('q');
      window.history.pushState({}, '', url.toString());
    } catch (error) {
      console.warn('Unable to update URL history:', error);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAboutClick = () => {
    setViewState(ViewState.ABOUT);
    setQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBusinessClick = () => {
    setViewState(ViewState.BUSINESS);
    setQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Wrapper to handle search from SearchBar where only query comes up
  const onSearchWrapper = (q: string) => {
    handleSearch(q, selectedCounty, language);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col">
      <Header 
        onLogoClick={handleGoHome} 
        onAboutClick={handleAboutClick} 
        onBusinessClick={handleBusinessClick}
        language={language}
        setLanguage={(l) => {
            setLanguage(l);
            // Update URL if we are already in results
            if (viewState === ViewState.RESULTS && query) {
                handleSearch(query, selectedCounty, l);
            }
        }}
      />
      
      <main className="flex-grow">
        {viewState === ViewState.HOME && (
          <HomeView 
            onSearch={onSearchWrapper} 
            selectedCounty={selectedCounty}
            onCountyChange={setSelectedCounty}
            language={language}
          />
        )}

        {viewState === ViewState.ABOUT && (
          <AboutView />
        )}

        {viewState === ViewState.BUSINESS && (
          <BusinessView />
        )}

        {viewState === ViewState.RESULTS && (
          <div className="w-full">
            {/* Sticky Search Header for Results Page */}
            <div className="bg-white border-b border-gray-200 py-4 px-4 shadow-sm sticky top-16 z-40">
              <div className="max-w-4xl mx-auto">
                 <SearchBar 
                    onSearch={onSearchWrapper} 
                    initialQuery={query} 
                    isSearching={loading}
                    className="max-w-2xl"
                    selectedCounty={selectedCounty}
                    onCountyChange={(c) => {
                        setSelectedCounty(c);
                        // Trigger search immediately on filter change if query exists
                        if (query) handleSearch(query, c, language);
                    }}
                    language={language}
                 />
              </div>
            </div>

            {loading ? (
               <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col items-center justify-center space-y-4 text-gray-500">
                  <Loader2 className="w-10 h-10 animate-spin text-liberia-blue" />
                  <p className="animate-pulse font-medium">Searching the Liberia Knowledge Base...</p>
                  {language === 'Koloqua' && <p className="text-sm text-liberia-red italic">Looking for da information for you...</p>}
               </div>
            ) : (
               <ResultsView 
                  query={query} 
                  result={searchResult} 
                  onBusinessClick={handleBusinessClick}
               />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} AskLiberia. All rights reserved.</p>
          <p className="text-sm mt-2">
            Information verified by AI Grounding using Google Search. 
            Promoting Digital Literacy in Liberia 🇱🇷
          </p>
          <div className="mt-4 text-xs text-slate-600 space-x-4">
             <a href="#" onClick={(e) => { e.preventDefault(); handleBusinessClick(); }} className="hover:text-slate-300">API</a>
             <a href="#" onClick={(e) => { e.preventDefault(); handleBusinessClick(); }} className="hover:text-slate-300">Advertise</a>
             <a href="#" onClick={(e) => { e.preventDefault(); handleBusinessClick(); }} className="hover:text-slate-300">Partners</a>
          </div>
        </div>
      </footer>

      <ChatWidget language={language} />
    </div>
  );
};

export default App;
