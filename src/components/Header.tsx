import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, LogOut, Star, Trophy, User } from 'lucide-react';
import { useStudent } from '../contexts/StudentContext';
import { Notifications } from '../common/Header/Notifications';

export function Header() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { name, points, level } = useStudent();

  return (
    <header className="bg-primary-bg backdrop-blur-sm relative z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="mt-8 ml-4">
          <Link to="/">
            <img
                src="https://www.wizkids.guru/assets/images/favicons/apple-touch-icon.png"
                alt="WizKids StudentMate"
                className="w-[64px] h-[72px]"
              />
          </Link>
        </div>
        <div className="relative mr-6 mt-4 flex items-center gap-4">
          <Notifications />
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 bg-primary-orange/20 rounded-lg px-4 py-2 hover:bg-primary-blue/20 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-primary-orange" />
              <span className="text-primary-orange font-medium">{Math.round(points)} points</span>
            </div>
            <div className="w-px h-6 bg-primary-orange/10" />
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-primary-blue" />
              <span className="text-primary-blue font-medium">Level {level}</span>
            </div>
            <div className="w-px h-6 bg-primary-orange/10" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary-pink flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <span className="text-primary-pink font-medium">{name}</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-primary-pink transition-transform ${
              showProfileMenu ? 'rotate-180' : ''
            }`} />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-primary-orange/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden z-50">
              <Link
                to="/scorecard"
                className="flex items-center gap-2 px-4 py-3 text-white hover:bg-white/5 transition-colors"
              >
                <Trophy className="w-4 h-4" />
                View Scorecard
              </Link>
              <button
                onClick={() => {/* Handle logout */}}
                className="w-full flex items-center gap-2 px-4 py-3 text-white hover:bg-white/5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}