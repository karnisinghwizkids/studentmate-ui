import React from 'react';
import { Breadcrumbs } from '../common/components/Breadcrumbs';
import { Atom, Code, Lightbulb, Palette, Calculator, AArrowDown as Om, Star, Award, Trophy, Medal, Crown, Brain, FlaskRound as Flask, Microscope, Rocket, Cpu, Laptop, Server, Briefcase, TrendingUp, Users, PenTool, Compass, Music, Pi, FunctionSquare as Function, Infinity, Book, Heart, Bot as Lotus } from 'lucide-react';

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  category: string;
  points: number;
  earned?: boolean;
  earnedAt?: string;
}

const badges: Badge[] = [
  // Science Badges
  {
    id: 'science-1',
    title: 'Physics Pioneer',
    description: 'Complete all physics experiments',
    icon: <Atom className="w-8 h-8" />,
    color: 'from-blue-500 to-purple-500',
    category: 'Science',
    points: 100
  },
  {
    id: 'science-2',
    title: 'Chemistry Champion',
    description: 'Master chemical reactions',
    icon: <Flask className="w-8 h-8" />,
    color: 'from-green-500 to-teal-500',
    category: 'Science',
    points: 100
  },
  {
    id: 'science-3',
    title: 'Biology Expert',
    description: 'Understand living systems',
    icon: <Microscope className="w-8 h-8" />,
    color: 'from-red-500 to-pink-500',
    category: 'Science',
    points: 100
  },
  {
    id: 'science-4',
    title: 'Space Explorer',
    description: 'Journey through astronomy',
    icon: <Rocket className="w-8 h-8" />,
    color: 'from-indigo-500 to-purple-500',
    category: 'Science',
    points: 150
  },

  // Technology Badges
  {
    id: 'tech-1',
    title: 'Code Master',
    description: 'Complete programming challenges',
    icon: <Code className="w-8 h-8" />,
    color: 'from-blue-600 to-blue-400',
    category: 'Technology',
    points: 100
  },
  {
    id: 'tech-2',
    title: 'Digital Creator',
    description: 'Build digital projects',
    icon: <Laptop className="w-8 h-8" />,
    color: 'from-cyan-500 to-blue-500',
    category: 'Technology',
    points: 100
  },
  {
    id: 'tech-3',
    title: 'AI Explorer',
    description: 'Learn about artificial intelligence',
    icon: <Brain className="w-8 h-8" />,
    color: 'from-violet-500 to-purple-500',
    category: 'Technology',
    points: 150
  },
  {
    id: 'tech-4',
    title: 'Cyber Guardian',
    description: 'Master digital safety',
    icon: <Server className="w-8 h-8" />,
    color: 'from-emerald-500 to-green-500',
    category: 'Technology',
    points: 100
  },

  // Entrepreneurship Badges
  {
    id: 'business-1',
    title: 'Young CEO',
    description: 'Lead a mock company',
    icon: <Briefcase className="w-8 h-8" />,
    color: 'from-amber-500 to-orange-500',
    category: 'Entrepreneurship',
    points: 100
  },
  {
    id: 'business-2',
    title: 'Market Wizard',
    description: 'Understand market dynamics',
    icon: <TrendingUp className="w-8 h-8" />,
    color: 'from-green-500 to-emerald-500',
    category: 'Entrepreneurship',
    points: 100
  },
  {
    id: 'business-3',
    title: 'Team Leader',
    description: 'Successfully lead a team project',
    icon: <Users className="w-8 h-8" />,
    color: 'from-blue-500 to-indigo-500',
    category: 'Entrepreneurship',
    points: 150
  },
  {
    id: 'business-4',
    title: 'Innovation Guru',
    description: 'Create innovative solutions',
    icon: <Lightbulb className="w-8 h-8" />,
    color: 'from-yellow-500 to-amber-500',
    category: 'Entrepreneurship',
    points: 100
  },

  // Art Badges
  {
    id: 'art-1',
    title: 'Digital Artist',
    description: 'Create digital artwork',
    icon: <PenTool className="w-8 h-8" />,
    color: 'from-pink-500 to-rose-500',
    category: 'Art',
    points: 100
  },
  {
    id: 'art-2',
    title: 'Design Virtuoso',
    description: 'Master design principles',
    icon: <Palette className="w-8 h-8" />,
    color: 'from-purple-500 to-pink-500',
    category: 'Art',
    points: 100
  },
  {
    id: 'art-3',
    title: 'Music Maestro',
    description: 'Explore musical concepts',
    icon: <Music className="w-8 h-8" />,
    color: 'from-indigo-500 to-blue-500',
    category: 'Art',
    points: 100
  },
  {
    id: 'art-4',
    title: 'Creative Genius',
    description: 'Complete creative projects',
    icon: <Compass className="w-8 h-8" />,
    color: 'from-teal-500 to-cyan-500',
    category: 'Art',
    points: 150
  },

  // Math Badges
  {
    id: 'math-1',
    title: 'Number Ninja',
    description: 'Master arithmetic operations',
    icon: <Calculator className="w-8 h-8" />,
    color: 'from-blue-500 to-cyan-500',
    category: 'Math',
    points: 100
  },
  {
    id: 'math-2',
    title: 'Algebra Ace',
    description: 'Solve algebraic equations',
    icon: <Function className="w-8 h-8" />,
    color: 'from-purple-500 to-violet-500',
    category: 'Math',
    points: 100
  },
  {
    id: 'math-3',
    title: 'Geometry Genius',
    description: 'Understand geometric concepts',
    icon: <Compass className="w-8 h-8" />,
    color: 'from-green-500 to-emerald-500',
    category: 'Math',
    points: 100
  },
  {
    id: 'math-4',
    title: 'Statistics Star',
    description: 'Master data analysis',
    icon: <Pi className="w-8 h-8" />,
    color: 'from-red-500 to-orange-500',
    category: 'Math',
    points: 150
  },

  // Self Discovery Badges (Indian Culture)
  {
    id: 'self-1',
    title: 'Little Ramayana Expert',
    description: 'Learn the lessons of Ramayana',
    icon: <Book className="w-8 h-8" />,
    color: 'from-orange-500 to-red-500',
    category: 'Self Discovery',
    points: 100
  },
  {
    id: 'self-2',
    title: 'Master Shloka Chanter',
    description: 'Memorize and understand shlokas',
    icon: <Om className="w-8 h-8" />,
    color: 'from-yellow-500 to-amber-500',
    category: 'Self Discovery',
    points: 100
  },
  {
    id: 'self-3',
    title: 'Meditation Master',
    description: 'Practice mindfulness regularly',
    icon: <Lotus className="w-8 h-8" />,
    color: 'from-purple-500 to-indigo-500',
    category: 'Self Discovery',
    points: 150
  },
  {
    id: 'self-4',
    title: 'Yoga Warrior',
    description: 'Master basic yoga asanas',
    icon: <Heart className="w-8 h-8" />,
    color: 'from-green-500 to-teal-500',
    category: 'Self Discovery',
    points: 100
  }
];

const categories = ['Science', 'Technology', 'Entrepreneurship', 'Art', 'Math', 'Self Discovery'];

export default function Badges() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="p-4">
        <Breadcrumbs />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Achievement Badges</h1>

        {categories.map(category => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {badges
                .filter(badge => badge.category === category)
                .map(badge => (
                  <div
                    key={badge.id}
                    className={`relative bg-gradient-to-br ${badge.color} rounded-lg p-6 text-white hover:scale-105 transition-transform`}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-white/20 rounded-lg p-2">
                        {badge.icon}
                      </div>
                      <div>
                        <h3 className="font-bold">{badge.title}</h3>
                        <p className="text-sm text-white/80">{badge.points} points</p>
                      </div>
                    </div>
                    <p className="text-sm text-white/90">{badge.description}</p>
                    {!badge.earned && (
                      <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                        <p className="text-white/90 font-medium">Locked</p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}