import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { CheckCircle2, Loader2 } from 'lucide-react';
import Card from '../common/UI/Card/Card';
import api from '../api/client';
import './Subject.css';

interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons: number;
  progress: number;
  imageUrl: string;
}

function Subject() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { subject } = useParams();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const { data } = await api.get(`/topics/${subject}`);
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
      <div className="min-h-screen bg-primary-bg">
        <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
          <Loader2 className="w-8 h-8 text-primary-pink animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-primary-bg">
        <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
          <div className="text-primary-text text-xl">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
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
                imageUrl={topic.imageUrl}
              />
              {topic.progress > 0 && (
                <div className="absolute bottom-0 left-0 right-0 px-4 py-2">
                  <div className="w-full bg-primary-blue/20 rounded-full h-1.5 mt-1">
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