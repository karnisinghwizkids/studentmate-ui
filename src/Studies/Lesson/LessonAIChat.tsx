import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, ChevronUp, ChevronDown, Loader2, Maximize2, Minimize2 } from 'lucide-react';
import { getGeminiResponse } from '../../api/gemini';
import MessageRenderer from '../../common/components/MessageRenderer';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface LessonAIChatProps {
  sectionContent: string;
  aiContext: string;
}

export function LessonAIChat({ sectionContent, aiContext }: LessonAIChatProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isFullHeight, setIsFullHeight] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Send initial greeting when chat is first opened
    if (isExpanded && messages.length === 0) {
      const greeting = "Hi! 👋 I'm your AI learning buddy for this lesson. Feel free to ask me any questions about what we're learning!";
      setMessages([{ role: 'assistant', content: greeting }]);
    }
  }, [isExpanded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      // Enhance the prompt with section context
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
        : 'bottom-4 right-4 w-24'
    }`}>
      <div className="bg-white/10 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden h-full flex flex-col">
        {/* Header */}
        <div className="px-4 h-14 flex items-center justify-between bg-white/10">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-white" />
            {isExpanded && (
              <span className="font-medium text-white">AI Learning Buddy</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isExpanded && (
              <button
                onClick={toggleFullHeight}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
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
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
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
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/20 text-white'
                    }`}
                  >
                    <MessageRenderer content={message.content} />
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/20 rounded-lg p-3">
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about this lesson!"
                  className="flex-1 bg-white/10 text-white rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-white/50"
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