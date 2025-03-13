import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from "react-router-dom";
import './Card.css';

function Card({ link, title, icon, description }) {
  return (
    <div title={description} className="card aspect-square p-4">
      <Link className="link" to={link}>
        <div className="bg-white/20 rounded-lg p-4 h-full transform hover:scale-105 transition-all relative group">
          <div className="flex flex-col items-start h-full">
            <div className="icon-container">
              <FontAwesomeIcon icon={`fa-solid fa-${icon}`} className="w-32 h-32 mb-3 text-yellow-300" />
            </div>
            <h3 className="text-xl font-semibold text-white">{title}</h3>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Card;