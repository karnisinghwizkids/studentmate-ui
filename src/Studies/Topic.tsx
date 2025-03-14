import React, { useEffect, useState } from 'react';
//import axios from 'axios';
import { Link, useParams } from "react-router-dom";
import { CheckCircle2 } from 'lucide-react';
import Card from '../common/UI/Card/Card';
import { Breadcrumbs } from '../common/components/Breadcrumbs';
import { getLessons } from '../api/client'; // Import from client.tsx
import './Topic.css';

interface Lesson {
  id: string;
  title: string;
  description: string;
  icon: string;
  completed?: boolean;
  progress?: number;
}

function Topic() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const { subject, topic } = useParams();  // Get dynamic subject and topic from URL

  const loadLessons = async () => {
    try {
      setLoading(true);
       if (topic) {
         const response = await getLessons(topic); // Pass dynamic topic ID
         setLessons(response.data.lessons);
       }
    } catch (error) {
      console.error('Error loading lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLessons(); // Load lessons on component mount
  }, [topic]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="p-4">
          <Breadcrumbs />
        </div>
        <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
          <div className="text-white text-xl">Loading lessons...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="p-4">
        <Breadcrumbs />
      </div>
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
                  link={`/fundamentals/${subject}/${topic}/${lesson.id}`}
                  title={`${srNo}. ${lesson.title}`}
                  description={lesson.description}
                  icon={lesson.icon}
                />
                {lesson.progress !== undefined && lesson.progress > 0 && lesson.progress < 100 && (
                  <div className="absolute bottom-0 left-0 right-0 px-4 py-2">
                    <div className="w-full bg-white/20 rounded-full h-1.5 mt-1">
                      <div
                        className="bg-green-400 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${lesson.progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Topic;