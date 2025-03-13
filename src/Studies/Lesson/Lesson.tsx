import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../../common/components/Breadcrumbs';
import { Button } from '../../common/components/Button';
import MessageRenderer from '../../common/components/MessageRenderer';
import { ChevronLeft, ChevronRight, Loader2, AlertCircle, Sparkles, Book, Target } from 'lucide-react';
import { Notification } from '../../components/Notification';
import { PointsAnimation } from '../../components/PointsAnimation';
import { useNotifications } from '../../hooks/useNotifications';
import { LessonAIChat } from './LessonAIChat';
import type { LessonContent } from '../../mocks/data';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import axios from 'axios';

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function Lesson() {
  const [content, setContent] = useState<Array | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [showPointsAnimation, setShowPointsAnimation] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const { subject, topic, lesson } = useParams();
  const navigate = useNavigate();
  const { notifications, addNotification, removeNotification } = useNotifications();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        //const response = await fetch(`/api/lessons/${lesson}/content`);
        //const response = await fetch(`http://192.168.29.253:3000/api/students/kitems?studentId=1&topicId=1&lessonId=101`);
        const response = await axios.get(`https://gurukul-sm-api-995034495677.asia-south1.run.app/api/students/kitems?studentId=2&topicId=1&lessonId=101`);
        if (response.status !== 200) {
          throw new Error('Failed to load lesson content');
        }
        console.log('Lesson content:', response.data);

        const data = await response.json();
        //setContent(data.content);
        setContent(data);
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

    if (currentSectionIndex < content.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    } else {
      setShowPointsAnimation(true);
    }
  };

  const handleAnimationComplete = () => {
    setShowPointsAnimation(false);
    addNotification({
      type: 'points',
      title: 'Lesson Completed!',
      message: '+10 points earned for completing the lesson'
    });
    navigate(`/fundamentals/${subject}/${topic}/${lesson}/quiz`);
  };

  const handleBack = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    } else {
      navigate(`/fundamentals/${subject}/${topic}`);
    }
  };

  const getExperienceStyles = (experience: string) => {
    switch (experience) {
      case 'curiosity':
        return {
          background: 'bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-500',
          icon: <Sparkles className="w-6 h-6 text-yellow-300" />,
          title: 'Discover',
          description: 'Let\'s explore something interesting!'
        };
      case 'explanation':
        return {
          background: 'bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500',
          icon: <Book className="w-6 h-6 text-blue-200" />,
          title: 'Learn',
          description: 'Understanding the concepts'
        };
      case 'verification':
        return {
          background: 'bg-gradient-to-br from-green-600 via-green-500 to-emerald-500',
          icon: <Target className="w-6 h-6 text-green-200" />,
          title: 'Practice',
          description: 'Let\'s apply what we learned'
        };
      default:
        return {
          background: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
          icon: <Book className="w-6 h-6 text-white" />,
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="p-4">
          <Breadcrumbs />
        </div>
        <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="p-4">
          <Breadcrumbs />
        </div>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-white">
          <AlertCircle className="w-12 h-12 mb-4" />
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

  const currentSection = content[currentSectionIndex];
  const isLastSection = currentSectionIndex === content.length - 1;
  const experienceStyles = getExperienceStyles(currentSection.experienceType);
  
  return (
    <div className={`min-h-screen transition-colors duration-500 ${experienceStyles.background}`}>
      <div className="p-4">
        <Breadcrumbs />
      </div>

      {showPointsAnimation && (
        <PointsAnimation points={10} onComplete={handleAnimationComplete} />
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-white/20 rounded-lg p-2">
                {experienceStyles.icon}
              </div>
              <div>
                <h2 className="text-lg font-medium text-white/80">{experienceStyles.title}</h2>
                <p className="text-sm text-white/60">{experienceStyles.description}</p>
              </div>
              <div className="ml-auto flex items-center gap-2 text-white/70 text-sm">
                <span>{currentSectionIndex + 1}</span>
                <span>/</span>
                <span>{content.length}</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">{content.title}</h1>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="h-2 bg-white/30 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentSectionIndex + 1) / content.length) * 100}%`
                }}
              />
            </div>
          </div>

          <div className="min-h-[400px] flex flex-col">
            <div className="flex-1 mb-8">
              {currentSection.type === 'text' && (
                <MessageRenderer content={currentSection.content} />
              )}

              {currentSection.type === 'image' && (
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={currentSection.content}
                    alt={currentSection.caption || 'Lesson image'}
                    className="w-full h-auto"
                  />
                  {(currentSection.caption || currentSection.description) && (
                    <div className="p-4 bg-black/20">
                      {currentSection.caption && (
                        <p className="font-medium text-white">{currentSection.caption}</p>
                      )}
                      {currentSection.description && (
                        <p className="text-sm text-white/80 mt-1">{currentSection.description}</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {currentSection.type === 'video' && (
                <MessageRenderer 
                  content={`Title: ${currentSection.caption || 'Video'}\nDescription: ${currentSection.description || ''}\n${currentSection.content}`}
                />
              )}

              {currentSection.type === 'audio' && (
                <div className="bg-black/20 rounded-lg p-4">
                  <audio controls className="w-full">
                    <source src={currentSection.content} type="audio/wav" />
                    Your browser does not support the audio element.
                  </audio>
                  {(currentSection.caption || currentSection.description) && (
                    <div className="mt-2">
                      {currentSection.caption && (
                        <p className="font-medium text-white">{currentSection.caption}</p>
                      )}
                      {currentSection.description && (
                        <p className="text-sm text-white/80 mt-1">{currentSection.description}</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {
                currentSection.kitemType === 'pdf' && (
                  <iframe src={currentSection.kurl.substring(0, currentSection.kurl.length-19) + '/preview'} width="100%" height="600px" />
                )
                /*
                  currentSection.type === 'pdf' && (
                    <div className="bg-black/20 rounded-lg p-4">
                      <div className="mb-4">
                        {currentSection.caption && (
                          <p className="font-medium text-white mb-1">{currentSection.caption}</p>
                        )}
                        {currentSection.description && (
                          <p className="text-sm text-white/80">{currentSection.description}</p>
                        )}
                      </div>
                      <div className="bg-white rounded-lg overflow-hidden">
                        <Document
                          file={currentSection.content}
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
                  )
                  */}
            </div>

            <div className="flex justify-between mt-auto">
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex items-center gap-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50"
              >
                <ChevronLeft className="w-4 h-4" />
                {currentSectionIndex === 0 ? 'Back to Topics' : 'Previous'}
              </Button>
              <Button
                onClick={handleNext}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
              >
                {isLastSection ? 'Take Quiz' : 'Next'}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <LessonAIChat
        sectionContent={currentSection.content}
        aiContext={currentSection.aiContext}
      />
    </div>
  );
}

export default Lesson;