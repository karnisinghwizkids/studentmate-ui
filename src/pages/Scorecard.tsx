import React, { useState } from 'react';
import { Breadcrumbs } from '../common/components/Breadcrumbs';
import { Trophy, Star, Award, Target, Flag, Book, Brain, Zap, Crown } from 'lucide-react';
import { Button } from '../common/components/Button';
import { 
  FacebookShareButton, 
  TwitterShareButton, 
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon
} from 'react-share';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  total: number;
  unlocked: boolean;
  milestones: {
    at: number;
    reward: number;
    achieved: boolean;
  }[];
}

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  earned: boolean;
  earnedAt?: string;
}

interface Activity {
  id: string;
  type: 'lesson_complete' | 'quiz_complete';
  title: string;
  timestamp: string;
  points: number;
  score?: number;
}

export default function Scorecard() {
  const [studentData] = useState({
    name: 'ScienceKid123',
    totalPoints: 850,
    level: 5,
    lessonsCompleted: 12,
    quizzesTaken: 8,
    averageQuizScore: 85,
    streak: 5,
    dailyBonus: 25,
    nextStreakMilestone: 7,
    leaderboardPosition: 3,
    recentActivities: [
      {
        id: 'act1',
        type: 'lesson_complete' as const,
        title: 'Gravity Basics',
        points: 10,
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'act2',
        type: 'quiz_complete' as const,
        title: 'Gravity Quiz',
        points: 25,
        score: 90,
        timestamp: new Date(Date.now() - 7200000).toISOString()
      }
    ],
    badges: [
      {
        id: '1',
        title: 'Science Explorer',
        description: 'Complete your first science lesson',
        icon: 'brain',
        color: 'bg-blue-500',
        earned: true,
        earnedAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: '2',
        title: 'Quiz Master',
        description: 'Score 90% or higher on 3 quizzes',
        icon: 'star',
        color: 'bg-yellow-500',
        earned: true,
        earnedAt: new Date(Date.now() - 172800000).toISOString()
      },
      {
        id: '3',
        title: 'Perfect Score',
        description: 'Get 100% on any quiz',
        icon: 'crown',
        color: 'bg-purple-500',
        earned: false
      }
    ],
    achievements: [
      {
        id: '1',
        title: 'Science Champion',
        description: 'Complete all science lessons',
        icon: 'trophy',
        progress: 12,
        total: 20,
        unlocked: false,
        milestones: [
          { at: 5, reward: 50, achieved: true },
          { at: 10, reward: 100, achieved: true },
          { at: 15, reward: 150, achieved: false },
          { at: 20, reward: 250, achieved: false }
        ]
      },
      {
        id: '2',
        title: 'Quiz Wizard',
        description: 'Score 100% on 5 quizzes',
        icon: 'star',
        progress: 3,
        total: 5,
        unlocked: false,
        milestones: [
          { at: 1, reward: 25, achieved: true },
          { at: 3, reward: 75, achieved: true },
          { at: 5, reward: 150, achieved: false }
        ]
      }
    ],
    leaderboard: [
      { name: 'MathWhiz99', points: 1200, rank: 1 },
      { name: 'BrainiacKid', points: 1050, rank: 2 },
      { name: 'ScienceKid123', points: 850, rank: 3 },
      { name: 'LearningPro', points: 800, rank: 4 },
      { name: 'CuriousStudent', points: 750, rank: 5 }
    ]
  });

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'brain': return <Brain className="w-6 h-6" />;
      case 'star': return <Star className="w-6 h-6" />;
      case 'crown': return <Crown className="w-6 h-6" />;
      case 'zap': return <Zap className="w-6 h-6" />;
      case 'trophy': return <Trophy className="w-6 h-6" />;
      default: return <Star className="w-6 h-6" />;
    }
  };

  const generateCertificate = async () => {
    const certificateNode = document.getElementById('certificate');
    if (!certificateNode) return;

    try {
      const dataUrl = await toPng(certificateNode);
      const pdf = new jsPDF('l', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${studentData.name}-certificate.pdf`);
    } catch (error) {
      console.error('Error generating certificate:', error);
    }
  };

  const shareUrl = window.location.href;
  const shareTitle = `Check out my progress! Level ${studentData.level} with ${studentData.totalPoints} points!`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="p-4">
        <Breadcrumbs />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Student Overview */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{studentData.name}</h1>
              <p className="text-white/70">Level {studentData.level} Scholar</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-3xl font-bold text-white">{studentData.totalPoints}</p>
              <p className="text-white/70">Total Points</p>
            </div>
          </div>

          {/* Daily Streak */}
          <div className="bg-white/5 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Daily Streak: {studentData.streak} days</h3>
                <p className="text-sm text-white/70">
                  Next milestone in {studentData.nextStreakMilestone - studentData.streak} days
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-400">+{studentData.dailyBonus} bonus points</p>
                <p className="text-sm text-white/70">Today's reward</p>
              </div>
            </div>
            <div className="mt-2 bg-white/10 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${(studentData.streak / studentData.nextStreakMilestone) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white/5 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Top 5 Learners</h3>
            <div className="space-y-2">
              {studentData.leaderboard.map((player, index) => (
                <div
                  key={player.name}
                  className={`flex items-center justify-between p-2 rounded ${
                    player.name === studentData.name ? 'bg-white/20' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-white/90">#{player.rank}</span>
                    <span className="text-white">{player.name}</span>
                  </div>
                  <span className="text-white/90">{player.points} points</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <Book className="w-6 h-6 text-blue-400 mb-2" />
              <p className="text-2xl font-bold text-white">{studentData.lessonsCompleted}</p>
              <p className="text-sm text-white/70">Lessons Completed</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <Target className="w-6 h-6 text-green-400 mb-2" />
              <p className="text-2xl font-bold text-white">{studentData.quizzesTaken}</p>
              <p className="text-sm text-white/70">Quizzes Taken</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <Award className="w-6 h-6 text-yellow-400 mb-2" />
              <p className="text-2xl font-bold text-white">{studentData.averageQuizScore}%</p>
              <p className="text-sm text-white/70">Average Quiz Score</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <Flag className="w-6 h-6 text-red-400 mb-2" />
              <p className="text-2xl font-bold text-white">{studentData.streak} Days</p>
              <p className="text-sm text-white/70">Learning Streak</p>
            </div>
          </div>
        </div>

        {/* Certificate */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
          <div id="certificate" className="bg-white rounded-lg p-8 text-center mb-4">
            <div className="border-8 border-double border-gray-200 p-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Certificate of Achievement</h2>
              <p className="text-lg text-gray-600 mb-8">This certifies that</p>
              <p className="text-2xl font-bold text-gray-900 mb-4">{studentData.name}</p>
              <p className="text-lg text-gray-600 mb-8">has achieved Level {studentData.level} Scholar status</p>
              <div className="flex justify-center gap-4 mb-8">
                <Award className="w-12 h-12 text-yellow-500" />
                <Trophy className="w-12 h-12 text-blue-500" />
                <Star className="w-12 h-12 text-purple-500" />
              </div>
              <p className="text-sm text-gray-500">
                Awarded on {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <Button onClick={generateCertificate}>
              Download Certificate
            </Button>
            <div className="flex gap-2">
              <FacebookShareButton url={shareUrl} quote={shareTitle}>
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <TwitterShareButton url={shareUrl} title={shareTitle}>
                <TwitterIcon size={32} round />
              </TwitterShareButton>
              <LinkedinShareButton url={shareUrl} title={shareTitle}>
                <LinkedinIcon size={32} round />
              </LinkedinShareButton>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {studentData.recentActivities.map(activity => (
              <div
                key={activity.id}
                className="flex items-center gap-4 text-white"
              >
                <div className="bg-white/10 rounded-full p-2">
                  {activity.type === 'lesson_complete' ? (
                    <Book className="w-5 h-5" />
                  ) : (
                    <Star className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-white/70">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-400">+{activity.points} points</p>
                  {activity.score && (
                    <p className="text-sm text-white/70">Score: {activity.score}%</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Earned Badges</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {studentData.badges.map((badge) => (
              <div
                key={badge.id}
                className={`relative ${
                  badge.earned ? badge.color : 'bg-gray-700'
                } rounded-lg p-4 text-center hover:scale-105 transition-transform`}
              >
                <div className="flex justify-center mb-2">
                  {getIconComponent(badge.icon)}
                </div>
                <p className="text-white font-medium">{badge.title}</p>
                {!badge.earned && (
                  <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                    <p className="text-white/70 text-sm">Locked</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Achievements</h2>
          <div className="space-y-4">
            {studentData.achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:translate-y-[-2px] transition-transform"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-white/10 rounded-lg p-2">
                    {getIconComponent(achievement.icon)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-white/70">{achievement.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">
                      {achievement.progress}/{achievement.total}
                    </p>
                  </div>
                </div>
                <div className="mt-2 bg-white/5 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(achievement.progress / achievement.total) * 100}%`,
                    }}
                  />
                </div>
                <div className="mt-4 space-y-2">
                  {achievement.milestones.map((milestone, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between text-sm ${
                        milestone.achieved ? 'text-green-400' : 'text-white/50'
                      }`}
                    >
                      <span>Reach {milestone.at} {achievement.title}</span>
                      <span>+{milestone.reward} points</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}