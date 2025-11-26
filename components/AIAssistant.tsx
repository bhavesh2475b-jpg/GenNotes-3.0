import React, { useState, useEffect, useRef } from 'react';
import { CloseIcon, SendIcon, SparklesIcon } from './Icons';
import { chatWithAI } from '../services/geminiService';

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  pageContent: string; // Text representation of current page for context
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose, pageContent }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: 'Hi! I can help you summarize your notes, explain concepts, or brainstorm ideas. What do you need?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await chatWithAI(userMsg, pageContent);
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, I encountered an error." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-surfaceContainerHigh shadow-2xl transform transition-transform z-50 flex flex-col border-l border-outline/10">
      
      {/* Header */}
      <div className="p-4 bg-surface flex items-center justify-between border-b border-outline/10">
        <div className="flex items-center gap-2 text-primary font-bold text-lg">
          <SparklesIcon className="animate-pulse" />
          <span>Gemini Assistant</span>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-surfaceContainer rounded-full transition-colors">
          <CloseIcon />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-primary text-onPrimary rounded-br-none' 
                  : 'bg-white text-onPrimaryContainer rounded-bl-none shadow-sm'
              }`}
            >
              <pre className="whitespace-pre-wrap font-sans">{msg.text}</pre>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm text-sm text-secondary flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-150"></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-surface border-t border-outline/10">
        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
            placeholder="Ask about your notes..."
            className="w-full bg-surfaceContainerHigh border-none rounded-2xl pl-4 pr-12 py-3 focus:ring-2 focus:ring-primary resize-none h-14"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="absolute right-2 top-2 p-2 bg-primary text-onPrimary rounded-full disabled:opacity-50 hover:shadow-lg transition-all"
          >
            <SendIcon />
          </button>
        </div>
        <p className="text-xs text-center text-outline mt-2">
          Gemini can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
};

export default AIAssistant;
