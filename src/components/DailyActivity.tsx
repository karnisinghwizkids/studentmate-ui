import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Button } from '../common/components/Button';
import { Book, Star, Calendar, ArrowRight, ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import { getStudentActivity } from '../api/client';

interface DailyActivity {
  type: 'lesson' | 'quiz';
  title: string;
  description: string;
  points: number;
  link: string;
  progress: number;
  timeEstimate: string;
  performance: 'good' | 'average' | 'poor';
}

export function DailyActivity() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [dailyActivity, setDailyActivity] = useState<DailyActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDailyActivity = async () => {
      try {
        const activity = await getStudentActivity('1');
        setDailyActivity(activity);
        setError(null);
      } catch (error) {
        console.error('Error loading daily activity:', error);
        setError('Failed to load daily activity');
      } finally {
        setLoading(false);
      }
    };

    loadDailyActivity();
  }, []);

  const getPerformanceEmoji = (performance: string) => {
    switch (performance) {
      case 'good':
        return '😊';
      case 'average':
        return '😐';
      case 'poor':
        return '😟';
      default:
        return '😊';
    }
  };

  const getPerformanceText = (performance: string) => {
    switch (performance) {
      case 'good':
        return 'Great progress!';
      case 'average':
        return 'Keep going!';
      case 'poor':
        return 'Need some help?';
      default:
        return 'Keep learning!';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 max-w-sm w-full animate-slide-up">
      <div className="bg-primary-orange/90 backdrop-blur-sm rounded-lg shadow-lg">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 flex items-center justify-between text-white hover:bg-white/5 transition-colors rounded-t-lg"
        >
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-yellow-200" />
            <h2 className="text-xl font-bold">Today's Activity</h2>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-white/70" />
          ) : (
            <ChevronUp className="w-5 h-5 text-white/70" />
          )}
        </button>

        <div className="collapse-content" data-expanded={isExpanded}>
          <div className="p-6 pt-2">
            {loading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            ) : error ? (
              <div className="text-white text-center p-4">
                {error}
              </div>
            ) : dailyActivity && (
              <>
                <div className="flex items-center justify-end mb-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-200" />
                    <span className="text-white font-medium">+{dailyActivity.points} points</span>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-white/10 rounded-lg p-3">
                      <Book className="w-6 h-6 text-yellow-200" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{dailyActivity.title}</h3>
                      <p className="text-white/90 mb-2">{dailyActivity.description}</p>
                      <div className="flex items-center gap-4 text-sm text-white/90">
                        <span>⏱ {dailyActivity.timeEstimate}</span>
                        <span>📚 {dailyActivity.type === 'lesson' ? 'Lesson' : 'Quiz'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {dailyActivity.progress > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-white/90 mb-1">
                      <span>Progress</span>
                      <span>{dailyActivity.progress}%</span>
                    </div>
                    <div className="bg-white/10 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ width: `${dailyActivity.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 mb-4 bg-white/5 rounded-lg px-4 py-2">
                  <span className="text-2xl" role="img" aria-label="performance indicator">
                    {getPerformanceEmoji(dailyActivity.performance)}
                  </span>
                  <span className="text-white/80 text-sm">
                    {getPerformanceText(dailyActivity.performance)}
                  </span>
                </div>

                <Link to={dailyActivity.link}>
                  <Button className="bg-primary-bhagwa/60 hover:bg-primary-bhagwa/100 w-full flex items-center justify-center gap-2">
                    Continue Learning
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}