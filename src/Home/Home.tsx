import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import Card from '../common/UI/Card/Card';
import { Breadcrumbs } from '../common/components/Breadcrumbs';
import { StudentProfile } from '../common/components/StudentProfile';
import { Button } from '../common/components/Button';
import { Book, Star, Calendar, ArrowRight, ChevronUp, ChevronDown } from 'lucide-react';
import './Home.css';

function Home() {
  const [totalPoints] = useState(850);
  const [isExpanded, setIsExpanded] = useState(true);


const [dailyActivity, setDailyActivity] = useState({
  type: 'lesson',
  title: 'Gravity Basics',
  description: 'Learn about the fundamental force that shapes our universe',
  points: 10,
  link: '/fundamentals/science/gravity/introduction-to-gravity',
  progress: 70,
  timeEstimate: '15 minutes',
  performance: 'average', // Initial value
});

// Update performance whenever progress changes
useEffect(() => {
  setDailyActivity(prev => ({
    ...prev,
    performance: prev.progress >= 80 ? 'good' : 
                 prev.progress >= 50 ? 'average' : 'poor',
  }));
}, [dailyActivity.progress]);

console.log(dailyActivity.performance); // 'average'

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="p-4">
        <Breadcrumbs />
        <StudentProfile points={totalPoints} />
      </div>

      <div className="cards">
        <Card
          link="/fundamentals"
          title="Funda"
          description="Fundamentals of Subjects"
          icon="book-open"
        />
        <Card
          link="/activity"
          title="Fundo"
          description="Activity"
          icon="users"
        />
        <Card
          link="/funfrendz"
          title="Fun Frendz"
          description="Spend time with friends"
          icon="user-group"
        />
        <Card
          link="/funtime"
          title="Funtime"
          description="Cultural Events"
          icon="masks-theater"
        />
        <Card
          link="/scorecard"
          title="Funtastic"
          description="Points & Achievements"
          icon="star"
        />
        <Card
          link="/gallery"
          title="Funshow"
          description="Gallery"
          icon="images"
        />
        <Card
          link="/funfacts"
          title="Funfacts"
          description="Amazing Facts"
          icon="lightbulb"
        />
        <Card
          link="/chat"
          title="AI Tutor"
          description="Your friendly learning companion"
          icon="chalkboard-user"
        />
      </div>

      {/* Floating Daily Activity Prompt */}
      <div className="fixed bottom-4 right-4 max-w-sm w-full animate-slide-up">
        <div className="bg-purple-500/95 backdrop-blur-sm rounded-lg shadow-lg">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full p-4 flex items-center justify-between text-white hover:bg-white/5 transition-colors rounded-t-lg"
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-yellow-300" />
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
              <div className="flex items-center justify-end mb-4">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-300" />
                  <span className="text-white font-medium">+{dailyActivity.points} points</span>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-4">
                  <div className="bg-white/10 rounded-lg p-3">
                    <Book className="w-6 h-6 text-blue-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{dailyActivity.title}</h3>
                    <p className="text-white/70 mb-2">{dailyActivity.description}</p>
                    <div className="flex items-center gap-4 text-sm text-white/60">
                      <span>⏱ {dailyActivity.timeEstimate}</span>
                      <span>📚 {dailyActivity.type === 'lesson' ? 'Lesson' : 'Quiz'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {dailyActivity.progress > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-white/70 mb-1">
                    <span>Progress</span>  
                    <span>{dailyActivity.progress}%</span>
                  </div>
                  <div className="bg-white/10 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${dailyActivity.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Performance Indicator */}
              <div className="flex items-center gap-2 mb-4 bg-white/5 rounded-lg px-4 py-2">
                <span className="text-2xl" role="img" aria-label="performance indicator">
                  {getPerformanceEmoji(dailyActivity.performance)}
                </span>
                <span className="text-white/80 text-sm">
                  {getPerformanceText(dailyActivity.performance)}
                </span>
              </div>

              <Link to={dailyActivity.link}>
                <Button className="bg-indigo-600 hover:bg-indigo-700 w-full flex items-center justify-center gap-2">
                  Continue Learning
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;