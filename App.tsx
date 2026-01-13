
import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { ResultsView } from './components/ResultsView';
import { AboutView } from './components/AboutView';
import { BusinessView } from './components/BusinessView';
import { ChatWidget } from './components/ChatWidget';
import { SearchBar } from './components/SearchBar';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthPage } from './components/AuthPage';
import { ProfileView } from './components/ProfileView';
import { searchLiberia } from './services/geminiService';
import { adminService } from './services/adminService';
import { authService } from './services/authService';
import { SearchResult, ViewState, Language, COUNTIES, User } from './types';
import { Loader2, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [viewState, setViewState] = useState<ViewState>(ViewState.HOME);
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCounty, setSelectedCounty] = useState<string>('All Liberia');
  const [language, setLanguage] = useState<Language>('English');
  
  // Guard to prevent multiple searches firing at once
  const searchInProgress = useRef(false);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) setCurrentUser(user);
    setIsCheckingAuth(false);

    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    const c = params.get('county');
    const l = params.get('lang');
    if (params.get('admin')) { setViewState(ViewState.ADMIN); return; }

    if (c && COUNTIES.includes(c as any)) setSelectedCounty(c);
    if (l && (l === 'English' || l === 'Koloqua')) setLanguage(l as Language);
    if (q && user) handleSearch(q, c || 'All Liberia', (l as Language) || 'English');
  }, []);

  const handleSearch = async (newQuery: string, countyOverride?: string, languageOverride?: Language) => {
    if (searchInProgress.current || !newQuery.trim()) return;
    
    const activeCounty = countyOverride || selectedCounty;
    const activeLang = languageOverride || language;
    
    searchInProgress.current = true;
    setQuery(newQuery);
    setViewState(ViewState.RESULTS);
    setLoading(true);
    setSearchResult({ text: '', sources: [] }); 
    
    adminService.logSearch(newQuery, activeCounty, activeLang);

    try {
      const url = new URL(window.location.href);
      url.searchParams.set('q', newQuery);
      if (activeCounty !== 'All Liberia') url.searchParams.set('county', activeCounty);
      if (activeLang !== 'English') url.searchParams.set('lang', activeLang);
      window.history.pushState({}, '', url.toString());
    } catch (e) {}
    
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
        let firstChunkReceived = false;
        const result = await searchLiberia(newQuery, activeCounty, activeLang, (data) => {
            if (!firstChunkReceived) {
                setLoading(false);
                firstChunkReceived = true;
            }
            // Stream the text immediately for "fast" feel
            setSearchResult(data);
        });
        setSearchResult(result);
    } catch (error) {
        setSearchResult({ text: "Sorry, search failed. The Knowledge Base might be busy.", sources: [] });
    } finally {
        setLoading(false);
        searchInProgress.current = false;
    }
  };

  const handleGoHome = () => {
    setViewState(ViewState.HOME);
    setQuery('');
    setSearchResult(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('q');
    window.history.pushState({}, '', url.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAboutClick = () => { setViewState(ViewState.ABOUT); window.scrollTo({ top: 0 }); };
  const handleBusinessClick = () => { setViewState(ViewState.BUSINESS); window.scrollTo({ top: 0 }); };
  const handleProfileClick = () => { setViewState(ViewState.PROFILE); window.scrollTo({ top: 0 }); };

  if (isCheckingAuth) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-8 h-8 animate-spin text-liberia-blue" /></div>;
  if (viewState === ViewState.ADMIN) return <AdminDashboard onLogout={handleGoHome} />;
  if (!currentUser) return <AuthPage onLoginSuccess={setCurrentUser} />;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-liberia-blue/10">
      <Header 
        onLogoClick={handleGoHome} 
        onAboutClick={handleAboutClick} 
        onBusinessClick={handleBusinessClick}
        onProfileClick={handleProfileClick}
        language={language}
        setLanguage={setLanguage}
        currentUser={currentUser}
        onLogout={() => { authService.logout(); setCurrentUser(null); handleGoHome(); }}
      />
      <main className="flex-grow">
        {viewState === ViewState.HOME && <HomeView onSearch={(q) => handleSearch(q)} selectedCounty={selectedCounty} onCountyChange={setSelectedCounty} language={language} />}
        {viewState === ViewState.ABOUT && <AboutView />}
        {viewState === ViewState.BUSINESS && <BusinessView currentUser={currentUser} onUserUpdate={setCurrentUser} />}
        {viewState === ViewState.PROFILE && <ProfileView user={currentUser} />}
        {viewState === ViewState.RESULTS && (
          <div className="w-full">
            <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 py-4 px-4 sticky top-16 z-40 shadow-sm transition-all">
              <div className="max-w-4xl mx-auto">
                 <SearchBar onSearch={(q) => handleSearch(q)} initialQuery={query} isSearching={loading} selectedCounty={selectedCounty} onCountyChange={(c) => { setSelectedCounty(c); if(query) handleSearch(query, c); }} language={language} />
              </div>
            </div>
            {loading && !searchResult?.text ? (
               <div className="max-w-4xl mx-auto px-4 py-32 flex flex-col items-center justify-center space-y-6 text-slate-400">
                  <div className="relative">
                    <Loader2 className="w-12 h-12 animate-spin text-liberia-blue" />
                    <Sparkles className="w-6 h-6 text-liberia-gold absolute -top-2 -right-2 animate-pulse" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-lg font-bold text-slate-700">Connecting to National Archives...</p>
                    <p className="text-sm">Fetching verified records for "{query}"</p>
                  </div>
               </div>
            ) : (
               <ResultsView query={query} result={searchResult} onBusinessClick={handleBusinessClick} />
            )}
          </div>
        )}
      </main>
      <footer className="bg-slate-900 text-slate-400 py-12 text-center border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4">
              <p className="text-sm">&copy; {new Date().getFullYear()} AskLiberia. Information provided for educational purposes. 🇱🇷</p>
              <div className="mt-4 flex justify-center space-x-6 text-xs font-bold uppercase tracking-widest text-slate-600">
                  <a href="#" className="hover:text-liberia-gold transition-colors">Privacy</a>
                  <a href="#" className="hover:text-liberia-gold transition-colors">Terms</a>
                  <a href="#" className="hover:text-liberia-gold transition-colors">API Status</a>
              </div>
          </div>
      </footer>
      <ChatWidget language={language} />
    </div>
  );
};

export default App;
