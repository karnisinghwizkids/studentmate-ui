import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { CheckCircle2 } from 'lucide-react';
import Card from '../common/UI/Card/Card';
import { Breadcrumbs } from '../common/components/Breadcrumbs';
import './Subject.css';

interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons: number;
  progress: number;
}

function Subject() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { subject } = useParams();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch(`/api/topics/${subject}`);
        if (!response.ok) {
          throw new Error('Failed to fetch topics');
        }
        const data = await response.json();
        setTopics(data.topics);
        setError(null);
      } catch (error) {
        console.error('Error fetching topics:', error);
        setError('Failed to load topics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [subject]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="p-4">
          <Breadcrumbs />
        </div>
        <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
          <div className="text-white text-xl">Loading topics...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="p-4">
          <Breadcrumbs />
        </div>
        <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
          <div className="text-white text-xl">{error}</div>
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
        {topics.map((topic) => (
          <div key={topic.id} className="relative">
            {topic.progress === 100 && (
              <div className="w-full h-full absolute z-10">
                <div className="mx-auto mt-16 w-24 h-24 opacity-40 bg-green-400 rounded-full p-1">
                  <CheckCircle2 className="w-full h-full text-white" />
                </div>
              </div>
            )}
            <div className="relative">
              <Card
                link={`/fundamentals/${subject}/${topic.id}`}
                title={topic.title}
                description={topic.description}
                icon={topic.icon}
              />
              {topic.progress > 0 && (
                <div className="absolute bottom-0 left-0 right-0 px-4 py-2">
                <div className="w-full bg-white/20 rounded-full h-1.5 mt-1">
                  <div
                    className="bg-green-400 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${topic.progress}%` }}
                  />
                </div>
              </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Subject;