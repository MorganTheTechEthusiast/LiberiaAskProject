
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
      alert("Voice search is not supported in this browser. Please try Chrome or Edge.");
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      alert("Please allow microphone access to use voice search.");
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
      aria-label="Liberia National Search"
    >
      <div className={`relative flex flex-col md:flex-row items-center w-full bg-white rounded-2xl md:rounded-full border transition-all duration-200 ${isListening ? 'border-liberia-red ring-2 ring-liberia-red/20' : 'border-gray-300 hover:shadow-md focus-within:ring-2 focus-within:ring-liberia-blue/20 focus-within:border-liberia-blue'}`}>
        
        <div className="relative flex-grow w-full flex items-center">
            <label htmlFor="search-input" className="sr-only">Search terms</label>
            <div className="pl-4 text-gray-400" aria-hidden="true">
                <Search className="w-5 h-5" />
            </div>
            <input
              id="search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={isListening ? (language === 'Koloqua' ? "I listening..." : "Listening...") : placeholder}
              className="w-full py-3 px-4 text-gray-700 bg-transparent border-none focus:ring-0 focus:outline-none text-base md:text-lg placeholder-gray-400 rounded-full"
            />
        </div>

        <div className="hidden md:block h-8 w-px bg-gray-200 mx-2" aria-hidden="true"></div>

        <div className="relative w-full md:w-auto border-t md:border-t-0 border-gray-100">
            <div className="flex items-center px-2 py-2 md:py-0">
                <label htmlFor="county-filter" className="sr-only">Filter by County</label>
                <MapPin className="w-4 h-4 text-gray-400 ml-2 md:ml-0" aria-hidden="true" />
                <select
                    id="county-filter"
                    value={selectedCounty}
                    onChange={(e) => onCountyChange(e.target.value)}
                    className="w-full md:w-auto py-2 pl-2 pr-8 bg-transparent border-none focus:ring-0 text-sm font-bold text-gray-700 cursor-pointer appearance-none focus:outline-none"
                >
                    {COUNTIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 md:right-2 pointer-events-none" aria-hidden="true" />
            </div>
        </div>

        <div className="flex items-center p-2 space-x-2 w-full md:w-auto justify-end border-t md:border-t-0 border-gray-100 md:border-none bg-gray-50 md:bg-transparent rounded-b-2xl md:rounded-none">
            <button
                type="button"
                onClick={handleVoiceInput}
                className={`p-2 rounded-full transition-all outline-none focus:ring-2 focus:ring-liberia-red ${isListening ? 'bg-red-100 text-liberia-red animate-pulse' : 'hover:bg-gray-100 text-gray-500'}`}
                aria-label={isListening ? "Listening to voice input" : "Voice Search"}
                aria-pressed={isListening}
            >
                {isListening ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mic className="w-5 h-5" />}
            </button>
            <button
                type="submit"
                disabled={isSearching}
                className="px-6 py-2 bg-liberia-blue text-white rounded-full font-bold hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-liberia-blue focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isSearching ? 'Searching...' : 'Search'}
            </button>
        </div>
      </div>
    </form>
  );
};
