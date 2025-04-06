import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, AlertCircle, Sparkles, Bot } from 'lucide-react';
import { getGeminiResponse } from '../api/gemini';
import MessageRenderer from '../common/components/MessageRenderer';
import { Button } from '../common/components/Button';
import { Breadcrumbs } from '../common/components/Breadcrumbs';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  error?: boolean;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: "Hi there! 👋 I'm your AI tutor, ready to help you learn and explore new things! What would you like to know about? 🌟"
  }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await getGeminiResponse(userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while processing your request';
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: errorMessage,
        error: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="p-4">
        <Breadcrumbs />
      </div>

      {/* Welcome Banner */}
      <div className="bg-primary-blue/10 backdrop-blur-sm m-4 p-6 rounded-lg flex items-center gap-4">
        <div className="bg-primary-blue/20 p-3 rounded-full">
          <Bot className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Your AI Learning Buddy</h1>
          <p className="text-white/80">Ask me anything about your studies! I'm here to help you learn and have fun! 🌟</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : message.error
                  ? 'bg-red-900/50 text-red-200 flex items-center gap-2'
                  : 'bg-primary-blue/10 backdrop-blur-sm text-white'
              }`}
            >
              {message.error && <AlertCircle className="w-5 h-5 text-red-400" />}
              <MessageRenderer content={message.content} />
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-primary-blue/10 backdrop-blur-sm rounded-lg p-4">
              <Loader2 className="w-6 h-6 animate-spin text-white" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-primary-blue/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything! I'm here to help! 😊"
            className="flex-1 bg-primary-blue/10 backdrop-blur-sm text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white/50"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Ask
          </Button>
        </div>
      </form>
    </div>
  );
}