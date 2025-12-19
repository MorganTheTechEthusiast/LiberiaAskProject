
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
        // Convert to proper History Content format
        const history: Content[] = messages.map(m => ({
            role: m.role,
            parts: [{ text: m.content }]
        }));

        // Add placeholder for streaming response
        setMessages(prev => [...prev, { role: 'model', content: '' }]);

        await chatWithLiberiaAI(history, userMsg, language, (chunkText) => {
            // Update the last message (the placeholder) with the streaming text
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
        // If error, remove the placeholder or append error message
        setMessages(prev => {
             // Remove the empty placeholder if it exists
             const newMessages = prev.filter(m => m.content !== '');
             return [...newMessages, { role: 'model', content: "Sorry, I'm having trouble connecting to the knowledge base right now." }];
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-liberia-blue text-white rounded-full shadow-lg hover:bg-blue-900 transition-all flex items-center justify-center z-50 ${isOpen ? 'hidden' : 'flex'}`}
        aria-label="Open Chat"
      >
        <MessageSquare className="w-7 h-7" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[90vw] md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="bg-liberia-blue p-4 flex justify-between items-center text-white">
            <div className="flex items-center space-x-2">
                <div className="bg-white/20 p-1.5 rounded-full">
                    <Bot className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-sm">Liberia Assistant</h3>
                    <p className="text-xs text-blue-200">
                        {language === 'Koloqua' ? 'Speaking Koloqua' : 'Online'}
                    </p>
                </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                    className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                        msg.role === 'user' 
                        ? 'bg-liberia-blue text-white rounded-br-none' 
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
                    }`}
                >
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
                    <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-gray-200 shadow-sm flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms'}}></div>
                    </div>
                 </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100">
            <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center bg-gray-100 rounded-full px-4 py-2"
            >
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about Liberia..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-gray-800 placeholder-gray-500"
                />
                <button 
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="text-liberia-blue hover:text-blue-700 disabled:opacity-50 ml-2"
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
