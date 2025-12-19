
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { SearchResult } from '../types';
import { BookOpen, Link as LinkIcon, ExternalLink, Share2, Check, Info, Star, GraduationCap, Volume2, StopCircle, Loader2 } from 'lucide-react';
import { generateSpeech } from '../services/geminiService';

interface ResultsViewProps {
  query: string;
  result: SearchResult | null;
  onBusinessClick?: () => void;
}

// Helper to decode base64 string to byte array
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper to decode raw PCM data into AudioBuffer
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  // Ensure even byte length for 16-bit PCM
  if (data.length % 2 !== 0) {
    data = data.slice(0, data.length - 1);
  }
  const dataInt16 = new Int16Array(data.buffer, data.byteOffset, data.byteLength / 2);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ query, result, onBusinessClick }) => {
  const [showCopied, setShowCopied] = useState(false);
  
  // Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [playbackComplete, setPlaybackComplete] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (sourceRef.current) {
        sourceRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Reset audio state when the result changes
  useEffect(() => {
    if (sourceRef.current) {
        try {
            sourceRef.current.onended = null;
            sourceRef.current.stop();
        } catch (e) {
            // Ignore if already stopped
        }
        sourceRef.current = null;
    }
    setIsPlaying(false);
    setPlaybackComplete(false);
  }, [result]);

  if (!result) return null;

  const copyToClipboard = async (text: string) => {
    // Try modern API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.warn("Clipboard write failed, attempting fallback", err);
        }
    }

    // Fallback method using textarea
    try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        
        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        return successful;
    } catch (err) {
        console.error("Fallback copy failed", err);
        return false;
    }
  };

  const handleCopyLink = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set('q', query);
    
    const success = await copyToClipboard(url.toString());
    
    if (success) {
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } else {
      // Optional: Show user visible error or just log
      console.error('Could not copy link');
    }
  };

  const handleShare = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set('q', query);
    const shareUrl = url.toString();

    const shareData = {
      title: `AskLiberia: ${query}`,
      text: `Check out this information about "${query}" on AskLiberia.`,
      url: shareUrl
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            await handleCopyLink();
        }
    } catch (err) {
        // Fallback to copy if not user cancelled (AbortError)
        if (err instanceof Error && err.name !== 'AbortError') {
            console.warn('Share API failed, falling back to clipboard', err);
            await handleCopyLink();
        }
    }
  };

  const toggleAudio = async () => {
    if (isPlaying) {
      if (sourceRef.current) {
        sourceRef.current.onended = null; // Prevent completion state trigger
        sourceRef.current.stop();
        sourceRef.current = null;
      }
      setIsPlaying(false);
      return;
    }

    if (!result.text) return;

    setPlaybackComplete(false);
    setLoadingAudio(true);
    try {
      // Initialize Audio Context if needed
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const ctx = audioContextRef.current;

      // Resume context if suspended
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      // Generate Speech
      // Remove some markdown chars for cleaner speech if needed, though model is smart
      const cleanText = result.text.replace(/[#*`_]/g, '');
      const base64Audio = await generateSpeech(cleanText);

      if (!base64Audio) {
        throw new Error("Failed to generate audio");
      }

      // Decode and Play
      const audioBytes = decode(base64Audio);
      const audioBuffer = await decodeAudioData(audioBytes, ctx, 24000, 1);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      
      source.onended = () => {
        setIsPlaying(false);
        sourceRef.current = null;
        setPlaybackComplete(true);
        // Revert back to normal state after 4 seconds
        setTimeout(() => setPlaybackComplete(false), 4000);
      };
      
      source.start();
      sourceRef.current = source;
      setIsPlaying(true);

    } catch (error) {
      console.error("Error playing audio:", error);
      alert("Sorry, I couldn't read that out loud right now. Please try again later.");
    } finally {
      setLoadingAudio(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-2">
            {query.charAt(0).toUpperCase() + query.slice(1)}
        </h1>
        <div className="h-1 w-20 bg-liberia-red rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Column */}
        <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Main Text */}
                <div className="p-6 md:p-8">
                    {/* Audio Control Header */}
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-50">
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-liberia-blue animate-pulse"></div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">AI Overview</span>
                        </div>
                        <button 
                          onClick={toggleAudio}
                          disabled={loadingAudio}
                          className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                            isPlaying 
                              ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100' 
                              : playbackComplete
                                ? 'bg-green-50 text-green-600 border border-green-100'
                                : 'bg-blue-50 text-liberia-blue hover:bg-blue-100 border border-blue-100'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {loadingAudio ? (
                             <Loader2 className="w-4 h-4 animate-spin" />
                          ) : isPlaying ? (
                             <StopCircle className="w-4 h-4" />
                          ) : playbackComplete ? (
                             <Check className="w-4 h-4" />
                          ) : (
                             <Volume2 className="w-4 h-4" />
                          )}
                          <span>
                            {loadingAudio ? 'Generating Audio...' : isPlaying ? 'Stop Listening' : playbackComplete ? 'Finished Listening' : 'Listen to Answer'}
                          </span>
                        </button>
                    </div>

                    <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed">
                        <ReactMarkdown
                        components={{
                            h1: ({node, ...props}) => <h2 className="text-xl font-bold text-liberia-blue mt-6 mb-3" {...props} />,
                            h2: ({node, ...props}) => <h3 className="text-lg font-bold text-gray-900 mt-5 mb-2" {...props} />,
                            h3: ({node, ...props}) => <h4 className="text-md font-semibold text-gray-800 mt-4 mb-2" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc list-outside ml-5 my-4 space-y-1" {...props} />,
                            li: ({node, ...props}) => <li className="pl-1" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-semibold text-gray-900" {...props} />,
                            a: ({node, ...props}) => <a className="text-liberia-blue hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                        }}
                        >
                        {result.text}
                        </ReactMarkdown>
                    </div>
                </div>

                {/* Sources Section */}
                {result.sources && result.sources.length > 0 && (
                    <div className="bg-gray-50 p-6 border-t border-gray-100">
                        <div className="flex items-center mb-4">
                            <BookOpen className="w-4 h-4 text-gray-500 mr-2" />
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Verified Sources</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {result.sources.map((source, idx) => (
                                <a 
                                    key={idx} 
                                    href={source.uri}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-start p-3 bg-white rounded-lg border border-gray-200 hover:border-liberia-blue hover:shadow-sm transition-all group"
                                >
                                    <div className="mt-1 mr-3 text-gray-400 group-hover:text-liberia-blue">
                                        <ExternalLink className="w-4 h-4" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-liberia-blue">{source.title}</p>
                                        <p className="text-xs text-gray-500 truncate">{new URL(source.uri).hostname}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-end space-x-4">
                    <button 
                        onClick={handleShare}
                        className="flex items-center text-sm text-gray-600 hover:text-liberia-blue transition-colors"
                    >
                        <Share2 className="w-4 h-4 mr-1.5" /> Share
                    </button>
                    <button 
                    onClick={handleCopyLink}
                    className="flex items-center text-sm text-gray-600 hover:text-liberia-blue transition-colors relative"
                    >
                    {showCopied ? (
                        <>
                        <Check className="w-4 h-4 mr-1.5 text-green-600" />
                        <span className="text-green-600 font-medium">Copied!</span>
                        </>
                    ) : (
                        <>
                        <LinkIcon className="w-4 h-4 mr-1.5" /> Copy Link
                        </>
                    )}
                    </button>
                </div>
            </div>
        </div>

        {/* Sidebar Column for Ads & Growth */}
        <div className="lg:col-span-1 space-y-6">
            
            {/* Sponsored Ad Mockup */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative group">
                <div className="absolute top-0 right-0 bg-gray-100 text-gray-500 text-[10px] px-2 py-0.5 rounded-bl font-medium z-10">Sponsored</div>
                <div className="h-32 bg-slate-200 relative overflow-hidden">
                     <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-105 transition-transform duration-500"></div>
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                     <div className="absolute bottom-3 left-3 text-white font-bold text-lg">Explore Liberia</div>
                </div>
                <div className="p-4">
                    <h4 className="font-bold text-gray-900 mb-1">The Royal Grand Hotel</h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">Experience world-class luxury in the heart of Monrovia. Book your stay today for exclusive business rates.</p>
                    <button className="w-full py-2 bg-liberia-blue text-white rounded-lg text-sm font-medium hover:bg-blue-900 transition-colors">
                        Book Now
                    </button>
                </div>
            </div>
            
            {/* Academic Partner Badge */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-5 text-white relative overflow-hidden shadow-sm">
                <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-white/10 rounded-full blur-xl"></div>
                <div className="flex items-center mb-3">
                   <GraduationCap className="w-5 h-5 text-liberia-gold mr-2" />
                   <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Knowledge Partner</h4>
                </div>
                <p className="text-sm text-gray-300 mb-3">
                    Historical data cross-referenced with the <strong>University of Liberia</strong> digital archives.
                </p>
                <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-liberia-gold w-3/4"></div>
                </div>
            </div>

            {/* Tourism / Business Directory Promo */}
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-5">
                <div className="flex items-start">
                    <div className="p-2 bg-blue-100 rounded-lg text-liberia-blue mr-3">
                        <Star className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 text-sm">Business Directory</h4>
                        <p className="text-xs text-gray-600 mt-1 mb-3">Looking for verified businesses in Montserrado or Nimba?</p>
                        <a href="#" className="text-xs font-bold text-liberia-blue hover:underline">Browse Directory &rarr;</a>
                    </div>
                </div>
            </div>

             {/* API Growth Promo */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center mb-3">
                    <Info className="w-4 h-4 text-gray-400 mr-2" />
                    <h4 className="text-xs font-bold text-gray-500 uppercase">Developers</h4>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                    Building an app for Liberia? Access our history and data via our JSON API.
                </p>
                <button 
                    onClick={onBusinessClick}
                    className="w-full py-1.5 border border-gray-300 rounded text-xs font-medium text-gray-700 hover:border-liberia-blue hover:text-liberia-blue transition-colors"
                >
                    Get API Key
                </button>
            </div>

        </div>
      </div>
    </div>
  );
};
