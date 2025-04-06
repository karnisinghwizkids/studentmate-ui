import React from 'react';
import { Link } from "react-router-dom";
import './Card.css';

interface CardProps {
  link: string;
  title: string;
  imageUrl: string;
  description: string;
  progress?: number;
  completed?: boolean;
  lessons?: number;
}

function Card({ link, title, imageUrl, description, progress, completed, lessons }: CardProps) {
  return (
    <div
      className="card aspect-square"
    >
      <Link to={link} className="block h-full">
        <div className="relative h-full border-8 border-primary-orange bg-primary-blue/10 backdrop-blur-sm rounded-xl overflow-hidden group">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-orange/80 via-primary-orange/50 to-primary-orange/30 group-hover:from-primary-orange/90 transition-colors duration-300" />
          </div>
          
          {/* Content */}
          <div className="relative h-full p-6 flex flex-col justify-end">
            {/* Text content */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary-bg transition-colors">
                {title}
              </h3>
              <p className="text-sm text-white/70 line-clamp-2 mb-3">
                {description}
              </p>

              {/* Progress bar */}
              {typeof progress === 'number' && (
                <div className="mt-auto">
                  <div className="flex justify-between text-sm text-white/70 mb-1">
                    <span>{completed ? 'Completed' : 'In Progress'}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-1.5 bg-primary-blue/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-blue to-primary-orange rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Lessons count */}
              {lessons && (
                <div className="mt-2 inline-flex items-center gap-1 text-sm text-white/70 bg-primary-pink/50 px-2 py-1 rounded-full">
                  <span>{lessons} lessons</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default Card;