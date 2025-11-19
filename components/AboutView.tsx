import React, { useState, useRef, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Database, Search, Globe, BookOpen, Smartphone, Users, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

interface TimelineEvent {
  year: string;
  title: string;
  shortDescription: string;
  fullDetails: string;
  type: 'history' | 'project';
}

const TIMELINE_DATA: TimelineEvent[] = [
  {
    year: '1822',
    title: 'Arrival of Settlers',
    shortDescription: 'Free African Americans arrive at Providence Island.',
    fullDetails: 'The American Colonization Society founded Liberia as a place for free African Americans to migrate. The first settlers landed on Providence Island near present-day Monrovia, marking the beginning of modern Liberian history.',
    type: 'history'
  },
  {
    year: '1847',
    title: 'Declaration of Independence',
    shortDescription: 'Liberia becomes the first African republic.',
    fullDetails: 'On July 26, 1847, the settlers issued a Declaration of Independence and promulgated a constitution, establishing the independent Republic of Liberia. It became the first African republic to proclaim its independence.',
    type: 'history'
  },
  {
    year: '1944',
    title: 'President Tubman Era',
    shortDescription: 'The Open Door Policy transforms the economy.',
    fullDetails: 'William V.S. Tubman became president and introduced the "Open Door Policy," which attracted foreign investment, particularly in iron ore mining and rubber, modernizing Liberia\'s infrastructure.',
    type: 'history'
  },
  {
    year: '2006',
    title: 'First Female President',
    shortDescription: 'Ellen Johnson Sirleaf takes office.',
    fullDetails: 'Ellen Johnson Sirleaf was inaugurated as the 24th President of Liberia, becoming the first elected female head of state in Africa and later winning the Nobel Peace Prize.',
    type: 'history'
  },
  {
    year: '2024',
    title: 'AskLiberia Concept',
    shortDescription: 'The vision for a digital knowledge base is born.',
    fullDetails: 'Recognizing the fragmentation of digital information in Liberia, a team of developers conceived AskLiberia. The goal: to bridge the gap between scattered data and the public through AI.',
    type: 'project'
  },
  {
    year: '2025',
    title: 'Official Launch',
    shortDescription: 'AskLiberia goes live for the public.',
    fullDetails: 'AskLiberia officially launches, offering AI-powered search, verified government data, and cultural archives to students, tourists, and researchers worldwide.',
    type: 'project'
  }
];

export const AboutView: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const eventRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const toggleEvent = (event: TimelineEvent) => {
    if (selectedEvent === event) {
        setSelectedEvent(null);
    } else {
        setSelectedEvent(event);
    }
  };

  useEffect(() => {
    if (selectedEvent) {
      const element = eventRefs.current.get(selectedEvent.title);
      if (element) {
        // Short timeout to ensure DOM update is complete (if any animation delays layout)
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }, [selectedEvent]);

  return (
    <div className="w-full bg-white animate-in fade-in duration-500">
      {/* Hero Header */}
      <div className="bg-slate-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            The National Knowledge Engine
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            AskLiberia is the first centralized, intelligent search system built to organize and preserve Liberia's digital history, culture, and government data.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
        
        {/* Problem & Solution Grid */}
        <div className="grid md:grid-cols-2 gap-12 mb-24">
          {/* The Problem */}
          <div className="bg-red-50 p-8 rounded-2xl border border-red-100">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-white rounded-full shadow-sm mr-4">
                <AlertTriangle className="w-6 h-6 text-liberia-red" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">The Problem Today</h2>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-red-100 text-liberia-red text-sm font-bold mr-3 mt-0.5">✕</span>
                <p className="text-gray-700">Information is scattered across random blogs, news sites, and broken government links.</p>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-red-100 text-liberia-red text-sm font-bold mr-3 mt-0.5">✕</span>
                <p className="text-gray-700">Students, researchers, and businesses struggle to find reliable, verified data.</p>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-red-100 text-liberia-red text-sm font-bold mr-3 mt-0.5">✕</span>
                <p className="text-gray-700">No centralized digital library exists for our history, laws, and national heritage.</p>
              </li>
            </ul>
          </div>

          {/* The Solution */}
          <div className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
            <div className="flex items-center mb-6">
               <div className="p-3 bg-white rounded-full shadow-sm mr-4">
                <CheckCircle className="w-6 h-6 text-liberia-blue" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Our Solution</h2>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-liberia-blue text-sm font-bold mr-3 mt-0.5">✓</span>
                <p className="text-gray-700">A centralized digital library for History, Culture, Tourism, and Government.</p>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-liberia-blue text-sm font-bold mr-3 mt-0.5">✓</span>
                <p className="text-gray-700">AI-powered verification to provide fast, clean, and accurate results.</p>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-blue-100 text-liberia-blue text-sm font-bold mr-3 mt-0.5">✓</span>
                <p className="text-gray-700">Accessible anywhere on mobile or desktop for students and tourists.</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Interactive Timeline Section */}
        <div className="mb-24">
            <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Journey & History</h2>
            <p className="text-gray-500 mt-2">Tracing the path of Liberia and the digital evolution leading to AskLiberia.</p>
            <p className="text-sm text-liberia-blue font-medium mt-2 flex items-center justify-center gap-1">
              <span className="animate-pulse">●</span> Click on an event to learn more
            </p>
            </div>

            <div className="relative max-w-4xl mx-auto px-2 md:px-0">
                {/* Vertical Line */}
                <div className="absolute left-6 md:left-1/2 transform md:-translate-x-1/2 top-0 h-full w-0.5 bg-gray-200 rounded-full"></div>

                <div className="space-y-8">
                    {TIMELINE_DATA.map((event, index) => (
                        <div 
                            key={index} 
                            ref={(el) => {
                                if (el) eventRefs.current.set(event.title, el);
                                else eventRefs.current.delete(event.title);
                            }}
                            className={`relative flex items-center md:justify-between ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                        >
                            {/* Dot */}
                            <div className={`absolute left-6 md:left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full border-4 border-white shadow-md z-10 transition-transform duration-300 ${selectedEvent === event ? 'scale-125 ring-4 ring-opacity-20 ring-liberia-blue' : ''} ${event.type === 'history' ? 'bg-liberia-blue' : 'bg-liberia-red'}`}></div>

                            {/* Content Box */}
                            <div 
                                className={`ml-14 md:ml-0 w-full md:w-[45%] p-6 bg-white rounded-xl border transition-all duration-300 cursor-pointer group
                                    ${selectedEvent === event 
                                        ? 'border-liberia-blue shadow-lg ring-1 ring-liberia-blue/20' 
                                        : 'border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300'}`}
                                onClick={() => toggleEvent(event)}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-sm font-bold px-2.5 py-0.5 rounded-full flex items-center ${event.type === 'history' ? 'bg-blue-50 text-liberia-blue' : 'bg-red-50 text-liberia-red'}`}>
                                        <Calendar className="w-3 h-3 mr-1.5" />
                                        {event.year}
                                    </span>
                                    {event.type === 'project' && <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider border border-gray-100 px-1.5 py-0.5 rounded">Project</span>}
                                    
                                    <div className={`transform transition-transform duration-300 ${selectedEvent === event ? 'rotate-180' : ''}`}>
                                        <ChevronDown className="w-4 h-4 text-gray-400" />
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-liberia-blue transition-colors">{event.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{event.shortDescription}</p>
                                
                                <div className={`grid transition-all duration-300 ease-in-out ${selectedEvent === event ? 'grid-rows-[1fr] opacity-100 mt-4 pt-4 border-t border-gray-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                    <div className="overflow-hidden">
                                         <p className="text-sm text-gray-700 leading-relaxed">
                                            {event.fullDetails}
                                         </p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Spacer for the other side on desktop */}
                            <div className="hidden md:block w-[45%]"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* How It Works */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="text-gray-500 mt-2">Three simple steps to accessing knowledge.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all text-center">
              <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-liberia-blue border border-gray-100">
                <Database className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold mb-2">1. Aggregated Data</h3>
              <p className="text-sm text-gray-600">We collect and index data on history, tribes, laws, and statistics from trusted sources.</p>
            </div>

            <div className="relative p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all text-center">
              <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-liberia-blue border border-gray-100">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold mb-2">2. Smart Search</h3>
              <p className="text-sm text-gray-600">Users type or say queries like "Who was the first president?" or "Grand Bassa tourism spots".</p>
            </div>

            <div className="relative p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all text-center">
              <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-liberia-blue border border-gray-100">
                <Smartphone className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold mb-2">3. Instant Answers</h3>
              <p className="text-sm text-gray-600">Get fast, accurate results with sources, available on any device.</p>
            </div>
          </div>
        </div>

        {/* Impact Section */}
        <div className="bg-gradient-to-r from-liberia-blue to-blue-900 rounded-3xl overflow-hidden shadow-xl text-white">
          <div className="p-8 md:p-12 text-center">
            <Globe className="w-12 h-12 mx-auto mb-6 text-liberia-gold opacity-90" />
            <h2 className="text-3xl font-serif font-bold mb-6">Why This Matters for Liberia</h2>
            <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto text-left">
              <div className="flex space-x-4">
                <BookOpen className="w-6 h-6 text-blue-300 flex-shrink-0" />
                <div>
                    <h4 className="font-bold text-lg mb-1">Promotes Digital Literacy</h4>
                    <p className="text-blue-100 text-sm leading-relaxed">Encourages citizens to use digital tools for research and learning.</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <Users className="w-6 h-6 text-blue-300 flex-shrink-0" />
                <div>
                    <h4 className="font-bold text-lg mb-1">Boosts Tourism & Education</h4>
                    <p className="text-blue-100 text-sm leading-relaxed">Helps visitors explore our country and students ace their exams.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};