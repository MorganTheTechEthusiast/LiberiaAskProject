
import React, { useState, useEffect } from 'react';
import { Search, Mic, Loader2, MapPin, ChevronDown } from 'lucide-react';
import { COUNTIES, Language } from '../types';

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
  isSearching?: boolean;
  placeholder?: string;
  className?: string;
  selectedCounty: string;
  onCountyChange: (county: string) => void;
  language?: Language;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  initialQuery = '', 
  isSearching = false,
  placeholder = "Search history, places, laws, or culture...",
  className = "",
  selectedCounty,
  onCountyChange,
  language = 'English'
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [isListening, setIsListening] = useState(false);
  
  useEffect(() => {
      setQuery(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleVoiceInput = async () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Voice search is not supported in this browser.");
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      alert("Please allow microphone access.");
      return;
    }

    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = language === 'Koloqua' ? 'en-LR' : 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      onSearch(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`relative w-full ${className}`}
      role="search"
    >
      <div className={`flex flex-row items-center w-full bg-white rounded-full p-1 border border-transparent shadow-2xl transition-all duration-200 focus-within:ring-2 focus-within:ring-liberia-gold/30`}>
        
        {/* Search Input Part */}
        <div className="flex flex-row items-center flex-grow pl-4 min-w-0">
            <Search className="w-5 h-5 text-gray-400 flex-shrink-0" aria-hidden="true" />
            <input
              id="search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isListening ? "Listening..." : placeholder}
              className="w-full py-3 px-4 text-gray-800 bg-transparent border-none focus:ring-0 focus:outline-none text-base md:text-lg placeholder-gray-400 truncate"
            />
        </div>

        {/* Vertical Divider */}
        <div className="h-8 w-px bg-gray-200 mx-2 flex-shrink-0" aria-hidden="true"></div>

        {/* Location Picker Part */}
        <div className="flex flex-row items-center px-4 flex-shrink-0 relative group">
            <MapPin className="w-5 h-5 text-gray-400 mr-2" aria-hidden="true" />
            <select
                id="county-filter"
                value={selectedCounty}
                onChange={(e) => onCountyChange(e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-sm md:text-base font-medium text-gray-700 cursor-pointer appearance-none pr-6 focus:outline-none"
            >
                {COUNTIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 pointer-events-none group-hover:text-gray-600 transition-colors" aria-hidden="true" />
        </div>

        {/* Microphone Button */}
        <button
            type="button"
            onClick={handleVoiceInput}
            className={`flex-shrink-0 p-2 mx-2 rounded-full transition-all hover:bg-gray-100 ${isListening ? 'text-liberia-red animate-pulse bg-red-50' : 'text-gray-400'}`}
            aria-label="Voice Search"
        >
            <Mic className="w-6 h-6" />
        </button>

        {/* Search Button */}
        <button
            type="submit"
            disabled={isSearching}
            className="flex-shrink-0 px-8 py-3 bg-[#002868] text-white rounded-full font-bold hover:bg-[#001c44] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
        >
            {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
        </button>
      </div>
    </form>
  );
};
