
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { chatWithLiberiaAI } from '../services/geminiService';
import { ChatMessage, Language } from '../types';
import ReactMarkdown from 'react-markdown';
import { Content } from '@google/genai';

interface ChatWidgetProps {
    language: Language;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ language }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: 'Hello! I am your Liberian Guide. Ask me anything about Liberia.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
        const history: Content[] = messages.map(m => ({
            role: m.role,
            parts: [{ text: m.content }]
        }));

        setMessages(prev => [...prev, { role: 'model', content: '' }]);

        await chatWithLiberiaAI(history, userMsg, language, (chunkText) => {
            setMessages(prev => {
                const newMessages = [...prev];
                const lastIndex = newMessages.length - 1;
                if (newMessages[lastIndex].role === 'model') {
                    newMessages[lastIndex].content = chunkText;
                }
                return newMessages;
            });
        });

    } catch (err) {
        setMessages(prev => {
             const newMessages = prev.filter(m => m.content !== '');
             return [...newMessages, { role: 'model', content: "Sorry, I'm having trouble connecting right now." }];
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setIsOpen(true)}
        className={`w-14 h-14 bg-liberia-blue text-white rounded-full shadow-lg hover:bg-blue-900 transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-liberia-blue focus:ring-offset-2 ${isOpen ? 'hidden' : 'flex'}`}
        aria-label="Open Liberian Assistant Chat"
        aria-expanded={isOpen}
      >
        <MessageSquare className="w-7 h-7" />
      </button>

      {isOpen && (
        <div 
          className="w-[90vw] md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300"
          role="dialog"
          aria-label="Chat with Liberia Assistant"
        >
          <div className="bg-liberia-blue p-4 flex justify-between items-center text-white">
            <div className="flex items-center space-x-2">
                <div className="bg-white/20 p-1.5 rounded-full" aria-hidden="true">
                    <Bot className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-sm">Liberia Assistant</h3>
                    <p className="text-xs text-blue-200" aria-live="polite">
                        {language === 'Koloqua' ? 'Speaking Koloqua' : 'Online'}
                    </p>
                </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-white rounded-lg p-1"
              aria-label="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div 
            className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4"
            aria-live="polite"
          >
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                    className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                        msg.role === 'user' 
                        ? 'bg-liberia-blue text-white rounded-br-none shadow-md' 
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                    }`}
                >
                    <span className="sr-only">{msg.role === 'user' ? 'You said:' : 'Assistant said:'}</span>
                    {msg.role === 'model' ? (
                         <div className="prose prose-sm max-w-none">
                             <ReactMarkdown>
                                 {msg.content}
                             </ReactMarkdown>
                         </div>
                    ) : (
                        msg.content
                    )}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1].content === '' && (
                 <div className="flex justify-start">
                    <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-gray-200 shadow-sm flex space-x-1" aria-label="Assistant is typing">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms'}}></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms'}}></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms'}}></div>
                    </div>
                 </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-gray-100">
            <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center bg-gray-100 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-liberia-blue/20"
            >
                <label htmlFor="chat-input" className="sr-only">Type your message</label>
                <input 
                    id="chat-input"
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about Liberia..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-800 placeholder-gray-500"
                />
                <button 
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="text-liberia-blue hover:text-blue-700 disabled:opacity-50 ml-2 focus:outline-none focus:ring-2 focus:ring-liberia-blue rounded-full p-1"
                    aria-label="Send message"
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
