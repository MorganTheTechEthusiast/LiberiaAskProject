
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { SearchResult } from '../types';
import { BookOpen, Link as LinkIcon, ExternalLink, Share2, Check, Volume2, StopCircle, Loader2, Sparkles } from 'lucide-react';
import { generateSpeech } from '../services/geminiService';

interface ResultsViewProps {
  query: string;
  result: SearchResult | null;
  onBusinessClick?: () => void;
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  if (data.length % 2 !== 0) data = data.slice(0, data.length - 1);
  const dataInt16 = new Int16Array(data.buffer, data.byteOffset, data.byteLength / 2);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ query, result, onBusinessClick }) => {
  const [showCopied, setShowCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    return () => {
      sourceRef.current?.stop();
      audioContextRef.current?.close();
    };
  }, []);

  if (!result) return null;

  const handleShare = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set('q', query);
    try {
        if (navigator.share) await navigator.share({ title: `AskLiberia: ${query}`, url: url.toString() });
        else {
            await navigator.clipboard.writeText(url.toString());
            setShowCopied(true);
            setTimeout(() => setShowCopied(false), 2000);
        }
    } catch (e) {}
  };

  const toggleAudio = async () => {
    if (isPlaying) {
      sourceRef.current?.stop();
      setIsPlaying(false);
      return;
    }
    if (!result.text) return;
    setLoadingAudio(true);
    try {
      if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') await ctx.resume();
      const base64Audio = await generateSpeech(result.text.replace(/[#*`_]/g, ''));
      if (!base64Audio) throw new Error();
      const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.onended = () => { setIsPlaying(false); sourceRef.current = null; };
      source.start();
      sourceRef.current = source;
      setIsPlaying(true);
    } catch (e) {
      alert("Audio generation failed.");
    } finally {
      setLoadingAudio(false);
    }
  };

  return (
    <article className="max-w-6xl mx-auto px-4 py-8 animate-in fade-in duration-300">
      <div className="mb-6 flex items-center space-x-4">
        <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 leading-tight">
                {query}
            </h1>
            <div className="h-1 w-12 bg-liberia-red rounded-full mt-2" aria-hidden="true"></div>
        </div>
        {!result.text && <Loader2 className="w-5 h-5 text-liberia-blue animate-spin" aria-label="Streaming response" />}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 md:p-10">
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                            <Sparkles className="w-3.5 h-3.5 text-liberia-blue" aria-hidden="true" />
                            <span className="text-[10px] font-black text-liberia-blue uppercase tracking-widest">Fast AI Response</span>
                        </div>
                        <button 
                          onClick={toggleAudio}
                          disabled={loadingAudio || !result.text}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-full text-xs font-bold transition-all outline-none focus:ring-2 focus:ring-liberia-blue focus:ring-offset-2 ${
                            isPlaying ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }`}
                          aria-label={loadingAudio ? 'Generating audio' : isPlaying ? 'Stop listening to answer' : 'Listen to answer'}
                        >
                          {loadingAudio ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : isPlaying ? <StopCircle className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                          <span>{loadingAudio ? 'Generating...' : isPlaying ? 'Stop' : 'Listen'}</span>
                        </button>
                    </div>

                    <div 
                      className="prose prose-blue max-w-none text-gray-700 leading-relaxed font-sans text-lg"
                      aria-live="polite"
                    >
                        <ReactMarkdown
                          components={{
                            h2: ({node, ...props}) => <h2 className="text-xl font-bold text-liberia-blue mt-8 mb-4 border-l-4 border-liberia-gold pl-4" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc ml-6 my-6 space-y-3" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
                          }}
                        >
                        {result.text}
                        </ReactMarkdown>
                        {!result.sources.length && result.text && <span className="inline-block w-2 h-5 ml-1 bg-liberia-blue animate-pulse align-middle" aria-hidden="true"></span>}
                    </div>
                </div>

                {result.sources.length > 0 && (
                    <section className="bg-gray-50/50 p-6 md:p-10 border-t border-gray-100" aria-labelledby="sources-heading">
                        <h3 id="sources-heading" className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                            <BookOpen className="w-3 h-3 mr-2" aria-hidden="true" />
                            Knowledge Sources
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {result.sources.map((source, idx) => (
                                <a 
                                  key={idx} 
                                  href={source.uri} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="flex items-center p-3 bg-white rounded-xl border border-gray-100 hover:border-liberia-blue transition-all group shadow-sm focus:outline-none focus:ring-2 focus:ring-liberia-blue"
                                >
                                    <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-liberia-blue mr-3 flex-shrink-0" aria-hidden="true" />
                                    <div className="truncate">
                                        <p className="text-sm font-bold text-gray-800 truncate">{source.title}</p>
                                        <p className="text-[10px] text-gray-400 uppercase tracking-tighter">{new URL(source.uri).hostname}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </section>
                )}

                <div className="px-6 py-4 border-t border-gray-50 flex justify-end space-x-6">
                    <button onClick={handleShare} className="text-xs font-bold text-gray-400 hover:text-liberia-blue flex items-center focus:outline-none focus:ring-2 focus:ring-liberia-blue rounded p-1">
                        <Share2 className="w-4 h-4 mr-1.5" aria-hidden="true" /> Share Response
                    </button>
                    <button onClick={handleShare} className="text-xs font-bold text-gray-400 hover:text-liberia-blue flex items-center focus:outline-none focus:ring-2 focus:ring-liberia-blue rounded p-1">
                        <LinkIcon className="w-4 h-4 mr-1.5" aria-hidden="true" /> {showCopied ? 'Link Copied!' : 'Copy Link'}
                    </button>
                </div>
            </div>
        </div>

        <aside className="md:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-liberia-blue to-blue-900 rounded-2xl p-6 text-white shadow-lg shadow-blue-900/20">
                <div className="flex items-center mb-4">
                    <Sparkles className="w-5 h-5 text-liberia-gold mr-2" aria-hidden="true" />
                    <h4 className="font-bold text-sm tracking-wide uppercase">Real-time Grounding</h4>
                </div>
                <p className="text-xs text-blue-100 leading-relaxed mb-4">
                    This answer was generated in real-time by cross-referencing global Liberian data archives.
                </p>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-liberia-gold w-full animate-pulse"></div>
                </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h4 className="text-sm font-bold text-gray-900 mb-2">Need Business Data?</h4>
                <p className="text-xs text-gray-500 mb-4">Our Pro API offers deeper insights for Nimba and Montserrado businesses.</p>
                <button 
                  onClick={onBusinessClick} 
                  className="w-full py-2 bg-slate-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-liberia-blue"
                >
                  Access API Console
                </button>
            </div>
        </aside>
      </div>
    </article>
  );
};
