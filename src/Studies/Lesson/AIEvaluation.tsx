import React, { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Send, Image as ImageIcon, Loader2, MessageCircleQuestion, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Button } from '../../common/components/Button';
import { getGeminiResponse } from '../../api/gemini';
import MessageRenderer from '../../common/components/MessageRenderer';
import type { AIEvaluation as AIEvaluationType } from '../../mocks/data';
import { useStudent } from '../../contexts/StudentContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  type?: 'text' | 'image';
  imageUrl?: string;
}

interface AIEvaluationProps {
  evaluation: AIEvaluationType;
  onComplete: (score: number) => void;
}

const avatarConfig = {
  image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400&q=80',
  color: 'from-amber-600 to-yellow-600',
  title: 'Yaksha',
  description: 'Your Evaluation Guide'
};

export function AIEvaluation({ evaluation, onComplete }: AIEvaluationProps) {
  const { addPoints } = useStudent();
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: evaluation.prompt
  }]);
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<File[]>([]);

  const onDrop = (acceptedFiles: File[]) => {
    setImages(prev => [...prev, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 3
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async () => {
    if ((!input.trim() && images.length === 0) || isSubmitting) return;

    const userMessage = input.trim();
    setInput('');
    setImages([]);

    // Add user's message and images to chat
    const newMessages: Message[] = [];
    if (userMessage) {
      newMessages.push({ role: 'user', content: userMessage, type: 'text' });
    }
    images.forEach(image => {
      newMessages.push({
        role: 'user',
        content: 'Uploaded image from activity',
        type: 'image',
        imageUrl: URL.createObjectURL(image)
      });
    });

    setMessages(prev => [...prev, ...newMessages]);
    setIsSubmitting(true);

    try {
      // Construct prompt with context
      const prompt = `
Context: ${evaluation.context}
Previous messages: ${messages.map(m => `${m.role}: ${m.content}`).join('\n')}
Current response: ${userMessage}
${images.length > 0 ? `The student has also shared ${images.length} image(s) from their activity.` : ''}

Provide encouraging and specific feedback that helps the student understand gravity concepts better.
`;

      const response = await getGeminiResponse(prompt);
      
      // Update score based on response quality
      const newScore = Math.min(
        evaluation.points,
        currentScore + (evaluation.points * 0.2)
      );
      
      const pointsEarned = newScore - currentScore;
      if (pointsEarned > 0) {
        addPoints(pointsEarned);
      }
      
      setCurrentScore(newScore);

      // Add AI response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);

      // Check if evaluation should be completed
      if (newScore >= evaluation.points * 0.8) {
        setIsComplete(true);
        onComplete(newScore);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I had trouble processing that. Could you try expressing it differently?'
      }]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-primary-blue/10 backdrop-blur-sm rounded-lg overflow-hidden">
      <div className={`p-4 bg-gradient-to-r ${avatarConfig.color} flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden">
            <img
              src={avatarConfig.image}
              alt={avatarConfig.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="font-semibold text-white">{avatarConfig.title}</h2>
            <p className="text-sm text-white/70">
              {isComplete ? 'Evaluation Complete' : 'In Progress'} • {Math.round(currentScore)} points
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-white" />
          ) : (
            <ChevronUp className="w-5 h-5 text-white" />
          )}
        </button>
      </div>

      {isExpanded && (
        <>
          <div className="h-[500px] overflow-y-auto p-4 space-y-4">
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
                    className={`rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-primary-orange text-primary-text'
                        : 'bg-primary-blue/10 text-primary-text'
                    }`}
                  >
                    {message.type === 'image' ? (
                      <div>
                        <img
                          src={message.imageUrl}
                          alt="Activity documentation"
                          className="rounded-lg max-w-full h-auto mb-2"
                        />
                        <p className="text-sm opacity-80">{message.content}</p>
                      </div>
                    ) : (
                      <MessageRenderer content={message.content} />
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isSubmitting && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-lg overflow-hidden">
                    <img
                      src={avatarConfig.image}
                      alt={avatarConfig.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="bg-primary-blue/10 rounded-lg p-4">
                    <Loader2 className="w-5 h-5 animate-spin text-primary-text" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-primary-blue/10">
            {images.length > 0 && (
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {images.map((file, index) => (
                  <div key={index} className="relative flex-shrink-0">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Upload ${index + 1}`}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setImages(images.filter((_, i) => i !== index))}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <div {...getRootProps()} className="flex-shrink-0">
                <button
                  type="button"
                  className={`p-2 rounded-lg transition-colors ${
                    isDragActive
                      ? 'bg-primary-pink text-white'
                      : 'bg-primary-blue/10 text-primary-text hover:bg-primary-blue/20'
                  }`}
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
                <input {...getInputProps()} />
              </div>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Share your thoughts about the activity..."
                className="flex-1 bg-primary-blue/10 text-primary-text rounded-lg px-4 py-2 placeholder-primary-text/50 focus:outline-none focus:ring-2 focus:ring-primary-pink"
              />

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || (!input.trim() && images.length === 0)}
                className="flex-shrink-0"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}