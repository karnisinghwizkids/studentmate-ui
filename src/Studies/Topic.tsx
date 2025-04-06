import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { CheckCircle2, Loader2 } from 'lucide-react';
import Card from '../common/UI/Card/Card';
import api from '../api/client';
import './Topic.css';

interface Lesson {
  id: string;
  title: string;
  description: string;
  icon: string;
  completed?: boolean;
  progress?: number;
  imageUrl: string;
}

export default function Topic() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const { subject, topic } = useParams();

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const { data } = await api.get(`/lessons/${topic}`);
        setLessons(data.lessons);
      } catch (error) {
        console.error('Error fetching lessons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [topic]);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary-bg">
        <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
          <Loader2 className="w-8 h-8 text-primary-pink animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="cards">
        {lessons.map((lesson, index) => {
          const srNo = index + 1;
          return (
            <div key={lesson.id} className="relative">
              {lesson.completed && (
                <div className="w-full h-full absolute z-10">
                  <div className="mx-auto mt-16 w-24 h-24 opacity-40 bg-green-400 rounded-full p-1">
                    <CheckCircle2 className="w-full h-full text-white" />
                  </div>
                </div>
              )}
              <div className="relative">
                <Card
                  link={`/fundamentals/${subject}/${topic}/${lesson.id}/learn`}
                  title={`${srNo}. ${lesson.title}`}
                  description={lesson.description}
                  imageUrl={lesson.imageUrl}
                  progress={lesson.progress}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}