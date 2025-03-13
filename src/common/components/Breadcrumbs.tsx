import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const routeLabels: { [key: string]: string } = {
  fundamentals: 'Fundamentals',
  fundo: 'Activities',
  funtastic: 'Scorecard',
  funshow: 'Gallery',
  chat: 'AI Chat',
  lessons: 'Lessons',
  science: 'Science',
  technology: 'Technology',
  gravity: 'Gravity'
};

export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="flex items-center space-x-2 px-4 py-3 bg-white/10 backdrop-blur-sm rounded-lg mb-4">
      <Link
        to="/"
        className="text-white/80 hover:text-white flex items-center transition-colors"
      >
        <Home className="w-4 h-4" />
      </Link>
      {pathnames.length > 0 && (
        <ChevronRight className="w-4 h-4 text-white/50" />
      )}
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return (
          <React.Fragment key={name}>
            <Link
              to={routeTo}
              className={`${
                isLast
                  ? 'text-white font-medium'
                  : 'text-white/80 hover:text-white'
              } transition-colors`}
            >
              {routeLabels[name] || name}
            </Link>
            {!isLast && (
              <ChevronRight className="w-4 h-4 text-white/50" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}