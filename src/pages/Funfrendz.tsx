//import React from 'react';
import React, { useState } from 'react';
import { Breadcrumbs } from '../common/components/Breadcrumbs';
import { 
  Beaker, Book, Heart, Palette, Trophy, Theater, Calculator, Clock,
  Users, Calendar, MapPin, Award, Star
} from 'lucide-react';
import { Button } from '../common/components/Button';

interface Club {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  members: number;
  meetingTime: string;
  location: string;
  achievements: string[];
}

const clubs: Club[] = [
  {
    id: 'science',
    name: 'Science Club',
    description: 'Explore the wonders of science through experiments, projects, and fascinating discoveries. Join us in our quest to understand the world around us!',
    icon: <Beaker className="w-8 h-8" />,
    color: 'from-blue-500 to-cyan-500',
    members: 25,
    meetingTime: 'Every Tuesday, 3:30 PM',
    location: 'Science Lab',
    achievements: [
      'First place in District Science Fair',
      'Successfully conducted 20+ experiments',
      'Published school science magazine'
    ]
  },
  {
    id: 'book',
    name: 'Book Club',
    description: 'Dive into the world of literature! Read, discuss, and share your thoughts on amazing books from various genres and authors.',
    icon: <Book className="w-8 h-8" />,
    color: 'from-amber-500 to-orange-500',
    members: 20,
    meetingTime: 'Every Wednesday, 4:00 PM',
    location: 'Library',
    achievements: [
      'Read 50+ books collectively',
      'Organized book fair',
      'Started mini library'
    ]
  },
  {
    id: 'charity',
    name: 'Charity Club',
    description: 'Make a difference in your community! Participate in various social service activities and help those in need.',
    icon: <Heart className="w-8 h-8" />,
    color: 'from-red-500 to-pink-500',
    members: 30,
    meetingTime: 'Every Friday, 3:00 PM',
    location: 'Activity Room',
    achievements: [
      'Raised funds for local orphanage',
      'Organized clothing drive',
      'Started school recycling program'
    ]
  },
{
    id: 'art',
    name: 'Art Club',
    description: 'Express your creativity through various art forms! Learn painting, sketching, sculpture, and digital art while developing your unique artistic style.',
    icon: <Palette className="w-8 h-8" />,
    color: 'from-purple-500 to-pink-500',
    members: 28,
    meetingTime: 'Every Monday, 3:30 PM',
    location: 'Art Studio',
    achievements: [
      'Best School Art Exhibition Award',
      'Created School Mural Project',
      'Won District Art Competition'
    ]
  },
  {
    id: 'sports',
    name: 'Sports Club',
    description: 'Develop athletic skills, teamwork, and sportsmanship through various sports activities and competitions. Stay fit and have fun!',
    icon: <Trophy className="w-8 h-8" />,
    color: 'from-green-500 to-emerald-500',
    members: 35,
    meetingTime: 'Every Thursday, 4:00 PM',
    location: 'Sports Ground',
    achievements: [
      'District Champions in Basketball',
      'Organized Inter-school Sports Meet',
      'Best School Sports Team Award'
    ]
  },
  {
    id: 'drama',
    name: 'Drama Club',
    description: 'Discover your inner actor! Learn acting, stage presence, and theatrical techniques while performing in exciting productions.',
    icon: <Theater className="w-8 h-8" />,
    color: 'from-violet-500 to-purple-500',
    members: 22,
    meetingTime: 'Every Tuesday, 4:00 PM',
    location: 'Auditorium',
    achievements: [
      'Best School Drama Performance Award',
      'Staged 5 successful productions',
      'Won State-level Theater Competition'
    ]
  },
  {
    id: 'math',
    name: 'Math Club',
    description: 'Make mathematics fun and engaging! Solve challenging problems, participate in competitions, and discover the beauty of numbers.',
    icon: <Calculator className="w-8 h-8" />,
    color: 'from-blue-600 to-indigo-600',
    members: 18,
    meetingTime: 'Every Wednesday, 3:30 PM',
    location: 'Math Lab',
    achievements: [
      'First place in Math Olympiad',
      'Perfect score in Math League',
      'Published Math puzzle book'
    ]
  },
  {
    id: 'history',
    name: 'History Club',
    description: 'Travel through time and explore fascinating historical events! Learn about different cultures, civilizations, and their impact on today.',
    icon: <Clock className="w-8 h-8" />,
    color: 'from-amber-600 to-brown-600',
    members: 20,
    meetingTime: 'Every Monday, 4:00 PM',
    location: 'History Room',
    achievements: [
      'Best Historical Exhibition Award',
      'Created School History Archive',
      'Published Historical Research Paper'
    ]
  }
]

export default function Funfrendz() {
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="p-4">
        <Breadcrumbs />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Fun Frendz Clubs</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {clubs.map((club) => (
            <div
              key={club.id}
              className={`bg-gradient-to-br ${club.color} rounded-lg p-6 text-white hover:scale-105 transition-transform cursor-pointer`}
              onClick={() => setSelectedClub(club)}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-white/20 rounded-lg p-2">
                  {club.icon}
                </div>
                <div>
                  <h3 className="font-bold">{club.name}</h3>
                  <p className="text-sm text-white/80">{club.members} members</p>
                </div>
              </div>
              <p className="text-sm text-white/90 line-clamp-2">{club.description}</p>
            </div>
          ))}
        </div>

        {/* Club Details Modal */}
        {selectedClub && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className={`bg-gradient-to-br ${selectedClub.color} rounded-lg p-3`}>
                  {selectedClub.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedClub.name}</h2>
                  <p className="text-gray-600">{selectedClub.members} members</p>
                </div>
              </div>

              <p className="text-gray-700 mb-6">{selectedClub.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Meeting Time</p>
                    <p className="font-medium text-gray-900">{selectedClub.meetingTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium text-gray-900">{selectedClub.location}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Achievements</h3>
                <div className="space-y-2">
                  {selectedClub.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                      <p className="text-gray-700">{achievement}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedClub(null)}
                >
                  Close
                </Button>
                <Button>
                  Join Club
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
