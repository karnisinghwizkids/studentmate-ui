import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Button } from '../../common/components/Button';
import MessageRenderer from '../../common/components/MessageRenderer';
import { ChevronLeft, ChevronRight, Loader2, AlertCircle, Sparkles, Book, Target, Beaker, CheckCircle2 } from 'lucide-react';
import { Notification } from '../../components/Notification';
import { PointsAnimation } from '../../components/PointsAnimation';
import { useNotifications } from '../../hooks/useNotifications';
import { useStudent } from '../../contexts/StudentContext';
import { LessonAIChat } from './LessonAIChat';
import { MasteryActivity } from './MasteryActivity';
import { AIEvaluation } from './AIEvaluation';
import { Quiz } from './Quiz';
import api from '../../api/client';
import type { LessonContent, QuizEvaluation, AIEvaluation as AIEvaluationType } from '../../mocks/data';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import './Lesson.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

type Phase = 'learning' | 'mastery' | 'evaluation';

interface PhaseInfo {
  icon: React.ReactNode;
  color: string;
  label: string;
  path: string;
}

function Lesson() {
  const contentRef = useRef<HTMLDivElement>(null);
  const { addPoints } = useStudent();
  const [content, setContent] = useState<LessonContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [showPointsAnimation, setShowPointsAnimation] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [completedEvaluations, setCompletedEvaluations] = useState<string[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const { subject, topic, lesson } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications, addNotification, removeNotification } = useNotifications();

  const currentPhase = location.pathname.endsWith('/learn') 
    ? 'learning'
    : location.pathname.endsWith('/master')
    ? 'mastery'
    : location.pathname.endsWith('/evaluate')
    ? 'evaluation'
    : null;

  const phases: Record<Phase, PhaseInfo> = {
    learning: {
      icon: <Book className="w-6 h-6 text-white" />,
      color: 'bg-primary-blue',
      label: 'Learn',
      path: '/learn'
    },
    mastery: {
      icon: <Beaker className="w-6 h-6 text-white" />,
      color: 'bg-primary-pink',
      label: 'Practice',
      path: '/master'
    },
    evaluation: {
      icon: <Target className="w-6 h-6 text-white" />,
      color: 'bg-primary-orange',
      label: 'Evaluate',
      path: '/evaluate'
    }
  };

  const isPhaseCompleted = (phase: Phase): boolean => {
    if (!content) return false;

    switch (phase) {
      case 'learning':
        return currentPhase === 'mastery' || currentPhase === 'evaluation' ||
          (currentPhase === 'learning' && currentSectionIndex === content.phases.learning.sections.length - 1);
      case 'mastery':
        return currentPhase === 'evaluation' || completedEvaluations.length > 0;
      case 'evaluation':
        return completedEvaluations.length === content?.phases.evaluation.methods.length;
      default:
        return false;
    }
  };

  const getPhaseBackground = (phase: Phase): string => {
    if (currentPhase === phase) {
      return phases[phase].color;
    }
    if (isPhaseCompleted(phase)) {
      return 'bg-green-500';
    }
    return 'bg-primary-blue/20 hover:bg-primary-blue/30';
  };

  useEffect(() => {
    if (contentRef.current) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPhase, currentSectionIndex]);

  if (!currentPhase) {
    return <Navigate to={`${location.pathname}/learn`} replace />;
  }

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await api.get(`/lessons/${lesson}/content`);
        setContent(data.content);
        setError(null);
      } catch (err) {
        console.error('Error loading lesson:', err);
        setError('Failed to load lesson content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [lesson]);

  const handleNext = () => {
    if (!content) return;

    if (currentPhase === 'learning') {
      if (currentSectionIndex < content.phases.learning.sections.length - 1) {
        setCurrentSectionIndex(currentSectionIndex + 1);
      } else {
        setShowPointsAnimation(true);
        setEarnedPoints(20);
        navigate(`${location.pathname.replace('/learn', '/master')}`);
      }
    } else if (currentPhase === 'mastery') {
      setShowPointsAnimation(true);
      setEarnedPoints(30);
      navigate(`${location.pathname.replace('/master', '/evaluate')}`);
    }
  };

  const handlePhaseClick = (phase: Phase) => {
    if (!content) return;

    const canAccessMastery = currentPhase === 'mastery' || 
      (currentPhase === 'learning' && currentSectionIndex === content.phases.learning.sections.length - 1) ||
      currentPhase === 'evaluation';

    const canAccessEvaluation = currentPhase === 'evaluation' || 
      (currentPhase === 'mastery' && completedEvaluations.length > 0);

    if (phase === 'learning' || 
        (phase === 'mastery' && canAccessMastery) || 
        (phase === 'evaluation' && canAccessEvaluation)) {
      const basePath = location.pathname.split('/').slice(0, -1).join('/');
      navigate(`${basePath}${phases[phase].path}`);
    }
  };

  const handleAnimationComplete = () => {
    setShowPointsAnimation(false);
    addPoints(earnedPoints);
    addNotification({
      type: 'points',
      title: `${currentPhase === 'learning' ? 'Learning' : 'Activity'} Completed!`,
      message: `+${earnedPoints} points earned!`
    });
  };

  const handleBack = () => {
    if (currentPhase === 'learning' && currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    } else if (currentPhase === 'mastery') {
      navigate(`${location.pathname.replace('/master', '/learn')}`);
      setCurrentSectionIndex(content?.phases.learning.sections.length ?? 0 - 1);
    } else if (currentPhase === 'evaluation') {
      navigate(`${location.pathname.replace('/evaluate', '/master')}`);
    } else {
      navigate(`/fundamentals/${subject}/${topic}`);
    }
  };

  const handleMasteryComplete = () => {
    handleNext();
  };

  const handleEvaluationComplete = (methodType: string, score: number) => {
    setCompletedEvaluations(prev => [...prev, methodType]);
    setTotalScore(prev => prev + score);

    const totalMethods = content?.phases.evaluation.methods.length || 0;
    if (completedEvaluations.length + 1 === totalMethods) {
      setShowPointsAnimation(true);
      setEarnedPoints(totalScore + score);
      addNotification({
        type: 'achievement',
        title: 'Lesson Mastered!',
        message: 'You\'ve successfully completed all phases of this lesson!'
      });
      setTimeout(() => {
        navigate(`/fundamentals/${subject}/${topic}`);
      }, 3000);
    }
  };

  const getExperienceStyles = (experience: string) => {
    switch (experience) {
      case 'curiosity':
        return {
          background: 'bg-primary-bg',
          icon: <Sparkles className="w-6 h-6 text-primary-blue" />,
          title: 'Discover',
          description: 'Let\'s explore something interesting!'
        };
      case 'explanation':
        return {
          background: 'bg-primary-bg',
          icon: <Book className="w-6 h-6 text-primary-orange" />,
          title: 'Learn',
          description: 'Understanding the concepts'
        };
      case 'verification':
        return {
          background: 'bg-primary-pink/10',
          icon: <Target className="w-6 h-6 text-primary-pink" />,
          title: 'Practice',
          description: 'Let\'s apply what we learned'
        };
      default:
        return {
          background: 'bg-primary-pink/10',
          icon: <Book className="w-6 h-6 text-primary-pink" />,
          title: 'Learn',
          description: 'Understanding the concepts'
        };
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-bg">
        <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
          <Loader2 className="w-8 h-8 text-primary-pink animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-primary-bg">
        <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-primary-text">
          <AlertCircle className="w-12 h-12 mb-4 text-primary-pink" />
          <p className="text-xl">{error || 'Lesson not found'}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={handleBack}
          >
            Back to Topics
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-primary-bg ${
      currentPhase === 'learning'
        ? getExperienceStyles(content?.phases.learning.sections[currentSectionIndex].experience || 'explanation').background
        : ''
    }`}>
      {showPointsAnimation && (
        <PointsAnimation points={earnedPoints} onComplete={handleAnimationComplete} />
      )}

      {notifications.map(notification => (
        <Notification
          key={notification.id}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={() => removeNotification(notification.id)}
        />
      ))}

      <div ref={contentRef} className={`lesson-content max-w-4xl mx-auto px-4 py-8 ${currentPhase}`}>
        <div className="bg-primary-blue/10 backdrop-blur-sm rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {(['learning', 'mastery', 'evaluation'] as Phase[]).map((phase, index, arr) => (
                <React.Fragment key={phase}>
                  <button
                    onClick={() => handlePhaseClick(phase)}
                    className={`relative group w-10 h-10 rounded-full flex items-center justify-center transition-colors ${getPhaseBackground(phase)}`}
                  >
                    {isPhaseCompleted(phase) && currentPhase !== phase ? (
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    ) : (
                      phases[phase].icon
                    )}
                    <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-primary-text/70 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {phases[phase].label}
                    </span>
                  </button>
                  {index < arr.length - 1 && (
                    <div className={`w-16 h-0.5 ${
                      isPhaseCompleted(phase) && isPhaseCompleted(arr[index + 1])
                        ? 'bg-green-500'
                        : 'bg-primary-blue/20'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="text-primary-text/70 text-sm">
              {currentPhase === 'learning' && (
                <span>{currentSectionIndex + 1} / {content.phases.learning.sections.length}</span>
              )}
            </div>
          </div>
        </div>

        {currentPhase === 'learning' && (
          <div className="bg-primary-blue/10 backdrop-blur-sm rounded-lg p-8">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary-blue/20 rounded-lg p-2">
                  {getExperienceStyles(content.phases.learning.sections[currentSectionIndex].experience).icon}
                </div>
                <div>
                  <h2 className="text-lg font-medium text-primary-text">
                    {getExperienceStyles(content.phases.learning.sections[currentSectionIndex].experience).title}
                  </h2>
                  <p className="text-sm text-primary-text/60">
                    {getExperienceStyles(content.phases.learning.sections[currentSectionIndex].experience).description}
                  </p>
                </div>
              </div>

              <div className="w-full bg-primary-blue/10 rounded-full h-2">
                <div
                  className="h-2 bg-primary-pink rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentSectionIndex + 1) / content.phases.learning.sections.length) * 100}%`
                  }}
                />
              </div>
            </div>

            <div className="min-h-[400px] flex flex-col">
              <div className={`flex-1 mb-8 ${content.phases.learning.sections[currentSectionIndex].type === 'video' ? '' : 'prose'}`}>
                {content.phases.learning.sections[currentSectionIndex].type === 'text' && (
                  <MessageRenderer content={content.phases.learning.sections[currentSectionIndex].content} />
                )}

                {content.phases.learning.sections[currentSectionIndex].type === 'image' && (
                  <div className="rounded-lg overflow-hidden">
                    <img
                      src={content.phases.learning.sections[currentSectionIndex].content}
                      alt={content.phases.learning.sections[currentSectionIndex].caption || 'Lesson image'}
                      className="w-full h-auto"
                    />
                    {(content.phases.learning.sections[currentSectionIndex].caption || content.phases.learning.sections[currentSectionIndex].description) && (
                      <div className="p-4 bg-primary-pink/10">
                        {content.phases.learning.sections[currentSectionIndex].caption && (
                          <p className="font-medium text-primary-text">{content.phases.learning.sections[currentSectionIndex].caption}</p>
                        )}
                        {content.phases.learning.sections[currentSectionIndex].description && (
                          <p className="text-sm text-primary-text/80 mt-1">{content.phases.learning.sections[currentSectionIndex].description}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {content.phases.learning.sections[currentSectionIndex].type === 'video' && (
                  <MessageRenderer 
                    content={`Title: ${content.phases.learning.sections[currentSectionIndex].caption || 'Video'}\nDescription: ${content.phases.learning.sections[currentSectionIndex].description || ''}\n${content.phases.learning.sections[currentSectionIndex].content}`}
                  />
                )}

                {content.phases.learning.sections[currentSectionIndex].type === 'audio' && (
                  <div className="bg-primary-pink/10 rounded-lg p-4">
                    <audio controls className="w-full">
                      <source src={content.phases.learning.sections[currentSectionIndex].content} type="audio/wav" />
                      Your browser does not support the audio element.
                    </audio>
                    {(content.phases.learning.sections[currentSectionIndex].caption || content.phases.learning.sections[currentSectionIndex].description) && (
                      <div className="mt-2">
                        {content.phases.learning.sections[currentSectionIndex].caption && (
                          <p className="font-medium text-primary-text">{content.phases.learning.sections[currentSectionIndex].caption}</p>
                        )}
                        {content.phases.learning.sections[currentSectionIndex].description && (
                          <p className="text-sm text-primary-text/80 mt-1">{content.phases.learning.sections[currentSectionIndex].description}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {content.phases.learning.sections[currentSectionIndex].type === 'pdf' && (
                  <div className="bg-primary-pink/10 rounded-lg p-4">
                    <div className="mb-4">
                      {content.phases.learning.sections[currentSectionIndex].caption && (
                        <p className="font-medium text-primary-text mb-1">{content.phases.learning.sections[currentSectionIndex].caption}</p>
                      )}
                      {content.phases.learning.sections[currentSectionIndex].description && (
                        <p className="text-sm text-primary-text/80">{content.phases.learning.sections[currentSectionIndex].description}</p>
                      )}
                    </div>
                    <div className="bg-white rounded-lg overflow-hidden">
                      <Document
                        file={content.phases.learning.sections[currentSectionIndex].content}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={
                          <div className="flex items-center justify-center p-8">
                            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                          </div>
                        }
                        error={
                          <div className="flex flex-col items-center justify-center p-8 text-red-500">
                            <AlertCircle className="w-8 h-8 mb-2" />
                            <p>Failed to load PDF</p>
                          </div>
                        }
                      >
                        <Page
                          pageNumber={pageNumber}
                          renderTextLayer={true}
                          renderAnnotationLayer={true}
                        />
                      </Document>
                      {numPages && numPages > 1 && (
                        <div className="flex items-center justify-between p-4 border-t">
                          <Button
                            onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                            disabled={pageNumber <= 1}
                          >
                            Previous
                          </Button>
                          <p className="text-sm text-gray-600">
                            Page {pageNumber} of {numPages}
                          </p>
                          <Button
                            onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
                            disabled={pageNumber >= numPages}
                          >
                            Next
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-auto">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {currentSectionIndex === 0 ? 'Back to Topics' : 'Previous'}
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex items-center gap-2"
                >
                  {currentSectionIndex === content.phases.learning.sections.length - 1 
                    ? 'Start Activity' 
                    : 'Next'
                  }
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {currentPhase === 'mastery' && (
          <MasteryActivity
            activity={content.phases.mastery.activity}
            onComplete={handleMasteryComplete}
          />
        )}

        {currentPhase === 'evaluation' && (
          <div className="space-y-8">
            <div className="bg-primary-blue/10 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-2xl font-bold text-primary-text mb-4">Evaluation Phase</h2>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 bg-primary-blue/10 rounded-full h-2">
                  <div
                    className="bg-primary-orange rounded-full h-2 transition-all duration-300"
                    style={{
                      width: `${(completedEvaluations.length / content.phases.evaluation.methods.length) * 100}%`
                    }}
                  />
                </div>
                <span className="text-primary-text/70 text-sm">
                  {completedEvaluations.length} / {content.phases.evaluation.methods.length} completed
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.phases.evaluation.methods.map((method, index) => (
                  <div
                    key={index}
                    className={`bg-primary-blue/10 rounded-lg p-4 ${
                      completedEvaluations.includes(method.type)
                        ? 'opacity-50'
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {method.type === 'quiz' ? (
                          <Target className="w-5 h-5 text-primary-pink" />
                        ) : (
                          <Sparkles className="w-5 h-5 text-primary-blue" />
                        )}
                        <h3 className="font-semibold text-primary-text">
                          {method.type === 'quiz' ? 'Quiz Assessment' : 'AI-Based Evaluation'}
                        </h3>
                      </div>
                      <span className="text-primary-text/70">{method.points} points</span>
                    </div>
                    {completedEvaluations.includes(method.type) ? (
                      <div className="flex items-center gap-2 text-primary-blue">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Completed</span>
                      </div>
                    ) : (
                      <p className="text-primary-text/80 text-sm">
                        {method.type === 'quiz'
                          ? `Multiple choice quiz`
                          : `AI evaluation based on your activity reflection`
                        }
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-primary-blue/10">
                <div className="flex items-center justify-between text-primary-text">
                  <span>Total Available Points:</span>
                  <span className="font-bold">{content.phases.evaluation.methods.reduce((sum, method) => sum + method.points, 0)}</span>
                </div>
              </div>
            </div>

            {content.phases.evaluation.methods.map((method, index) => {
              if (completedEvaluations.includes(method.type)) return null;
              if (index > 0 && !completedEvaluations.includes(content.phases.evaluation.methods[index - 1].type)) return null;

              return (
                <div key={index}>
                  {method.type === 'quiz' ? (
                    <Quiz
                      evaluation={method as QuizEvaluation}
                      onComplete={(score) => handleEvaluationComplete('quiz', score)}
                    />
                  ) : (
                    <AIEvaluation
                      evaluation={method as AIEvaluationType}
                      onComplete={(score) => handleEvaluationComplete('ai', score)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {currentPhase === 'learning' && (
        <LessonAIChat
          sectionContent={content?.phases.learning.sections[currentSectionIndex].content || ''}
          aiContext={content?.phases.learning.sections[currentSectionIndex].aiContext || ''}
        />
      )}
    </div>
  );
}

export default Lesson;