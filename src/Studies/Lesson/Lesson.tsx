import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../../common/components/Breadcrumbs';
import { Button } from '../../common/components/Button';
import { ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { Notification } from '../../components/Notification';
import { PointsAnimation } from '../../components/PointsAnimation';
import { useNotifications } from '../../hooks/useNotifications';
import { LessonAIChat } from './LessonAIChat';
import { getLessons } from '../../api/client'; // Import from client.tsx
import { Document, Page, pdfjs } from 'react-pdf';

import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

// PDF.js worker setup
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

interface LessonContent {
  id: string;
  type: string;
  content: string;
  caption?: string;
  description?: string;
  kitemType?: string;
  kurl?: string;
  aiContext?: string;
}

function Lesson() {
  const [content, setContent] = useState<LessonContent[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [showPointsAnimation, setShowPointsAnimation] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  const { subject, topic, lesson } = useParams(); // Get params from URL
  const navigate = useNavigate();
  const { notifications, addNotification, removeNotification } = useNotifications();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);

        if (topic && lesson) {
          const response = await getLessons(topic); // Fetch lessons for the topic
          const selectedLesson = response.data.lessons.find(
            (l: LessonContent) => l.id === lesson
          );

          if (!selectedLesson) throw new Error('Lesson not found');
          setContent([selectedLesson]);
          setError(null);
        }
      } catch (err) {
        console.error('Error loading lesson:', err);
        setError('Failed to load lesson content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [topic, lesson]);

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
          <Button onClick={handleBack}>Back to Topics</Button>
        </div>
      </div>
    );
  }

  const currentSection = content[currentSectionIndex];
  const isLastSection = currentSectionIndex === content.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="p-4">
        <Breadcrumbs />
      </div>

      {showPointsAnimation && (
        <PointsAnimation points={10} onComplete={handleAnimationComplete} />
      )}

      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={() => removeNotification(notification.id)}
        />
      ))}

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-4">{currentSection.caption}</h1>

        {currentSection.type === 'text' && <p>{currentSection.content}</p>}

        {currentSection.type === 'image' && (
          <img src={currentSection.content} alt={currentSection.caption || 'Image'} />
        )}

        {currentSection.type === 'video' && (
          <video controls src={currentSection.content} />
        )}

        {currentSection.type === 'audio' && (
          <audio controls src={currentSection.content} />
        )}

        {currentSection.kitemType === 'pdf' && (
          <iframe
            src={`${currentSection.kurl?.substring(0, currentSection.kurl.length - 19)}/preview`}
            width="100%"
            height="600px"
          />
        )}

        {currentSection.type === 'pdf' && (
          <Document file={currentSection.content} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} />
          </Document>
        )}

        <div className="flex justify-between mt-4">
          <Button onClick={handleBack}>
            <ChevronLeft className="w-4 h-4" />
            {currentSectionIndex === 0 ? 'Back to Topics' : 'Previous'}
          </Button>

          <Button onClick={handleNext}>
            {isLastSection ? 'Take Quiz' : 'Next'}
            <ChevronRight className="w-4 h-4" />
          </Button>
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
