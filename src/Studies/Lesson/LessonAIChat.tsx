import React, { useState, useRef, useEffect } from 'react';
import { Send, ChevronUp, ChevronDown, Loader2, Maximize2, Minimize2 } from 'lucide-react';
import { getGeminiResponse } from '../../api/gemini';
import MessageRenderer from '../../common/components/MessageRenderer';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface LessonAIChatProps {
  sectionContent: string;
  aiContext: string;
  role?: 'learning' | 'evaluation';
}

interface AvatarConfig {
  image: string;
  color: string;
  title: string;
  description: string;
}

const avatarConfigs: Record<'learning' | 'evaluation', AvatarConfig> = {
  learning: {
    image: 'https://images.unsplash.com/photo-1578885564199-db62248858cf?w=400&q=80',
    color: 'from-primary-blue to-blue-600',
    title: 'Krishna',
    description: 'Your Learning Buddy'
  },
  evaluation: {
    image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400&q=80',
    color: 'from-amber-600 to-yellow-600',
    title: 'Evaluation Guide',
    description: 'Here to help you reflect and grow'
  }
};

export function LessonAIChat({ sectionContent, aiContext, role = 'learning' }: LessonAIChatProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFullHeight, setIsFullHeight] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const avatarConfig = avatarConfigs[role];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isExpanded && messages.length === 0) {
      const greeting = role === 'learning' 
        ? "Hi! 👋 I'm Krishna! Your learning guide for this lesson. Feel free to ask me any questions about what we're learning!"
        : "Hello! 👋 I'm here to help you reflect on your activities and deepen your understanding. Let's discuss what you've learned!";
      setMessages([{ role: 'assistant', content: greeting }]);
    }
  }, [isExpanded, role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const contextualPrompt = `
Current lesson section content: ${sectionContent}
Teaching context: ${aiContext}
Student question: ${userMessage}

Remember to:
1. Keep explanations simple and engaging for a young student
2. Use examples and analogies they can relate to
3. Encourage curiosity and critical thinking
4. Stay focused on the current topic
5. Be encouraging and supportive
`;

      const response = await getGeminiResponse(contextualPrompt);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 
        'I had trouble understanding that. Could you try asking in a different way?';
      setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setIsFullHeight(false);
    }
  };

  const toggleFullHeight = () => {
    setIsFullHeight(!isFullHeight);
  };

  return (
    <div className={`fixed transition-all duration-300 ${
      isExpanded 
        ? isFullHeight
          ? 'inset-4'
          : 'left-1/2 right-4 bottom-4 top-1/2'
        : 'bottom-4 right-4 w-96'
    }`}>
      <div className="bg-primary-bg backdrop-blur-sm rounded-lg shadow-lg overflow-hidden h-full flex flex-col">
        {/* Header */}
        <div className={`px-4 h-14 flex items-center justify-between bg-gradient-to-r ${avatarConfig.color}`}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              <img
                src={avatarConfig.image}
                alt={avatarConfig.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="font-medium text-white">{avatarConfig.title}</span>
              {!isExpanded && (
                <p className="text-xs text-white/70">{avatarConfig.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isExpanded && (
              <button
                onClick={toggleFullHeight}
                className="p-2 text-white/70 hover:text-white hover:bg-primary-blue/10 rounded-lg transition-colors"
              >
                {isFullHeight ? (
                  <Minimize2 className="w-5 h-5" />
                ) : (
                  <Maximize2 className="w-5 h-5" />
                )}
              </button>
            )}
            <button
              onClick={toggleExpand}
              className="p-2 text-white/70 hover:text-white hover:bg-primary-blue/10 rounded-lg transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronUp className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? 'flex-1 opacity-100' : 'opacity-0 h-0'
        }`}>
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={avatarConfig.image}
                          alt={avatarConfig.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div
                      className={`rounded-lg p-3 ${
                        message.role === 'user'
                          ? 'bg-blue-600/20 text-white'
                          : 'bg-primary-blue/20 text-white'
                      }`}
                    >
                      <MessageRenderer content={message.content} />
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 rounded-lg overflow-hidden">
                      <img
                        src={avatarConfig.image}
                        alt={avatarConfig.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="bg-primary-blue/20 rounded-lg p-3">
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-primary-blue/10">
              <div className="flex gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about this lesson!"
                  className="flex-1 bg-primary-blue/10 text-black rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-black/50"
                  rows={1}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}