import React from 'react';
import { User, Award, Star } from 'lucide-react';

interface StudentProfileProps {
  points?: number;
  // to be added later
  // username?: string;
  // level?: number;
}

export function StudentProfile({ points = 0 }: StudentProfileProps) {
  return (
    <div className="absolute top-4 right-4 flex items-center gap-4">

      {/* Points Display */}
      <div className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
        <Star className="w-5 h-5 text-yellow-300" />
        <span className="text-white font-medium">{points} points</span>
      </div>

      {/* User Profile */}
      <div className="flex items-center gap-3 bg-white/10 rounded-lg p-2">

       {/* Avatar with Award Badge */}
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center">
            <Award className="w-3 h-3 text-yellow-900" />
          </div>
        </div>

        {/* Username & Level */}
        <div className="pr-2">
          <p className="text-white font-medium">ScienceKid123</p>
          <p className="text-xs text-white/70">Level 5</p>
        </div>
      </div>
    </div>
  );
}