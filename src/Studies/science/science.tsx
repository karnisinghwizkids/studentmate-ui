import React from 'react';
import { Link } from 'react-router-dom';
import { Beaker, Cpu, Award, Images, HelpCircle } from 'lucide-react';
import Tile from '../../common/UI/Card/Card';
import { Breadcrumbs } from '../../common/components/Breadcrumbs';

function Science() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="p-4">
        <Breadcrumbs />
      </div>
      <div className="cards">
        <Link to="/funda/science/gravity">
          <Card
            title="Gravity"
            description="Fundamentals of gravity"
            icon={<Beaker className="w-48 h-48 mb-3 text-yellow-300" />}
          />
        </Link>
        <Link to="/funda/science/heat">
          <Card
            title="Heat"
            description="Fundamentals of Heat"
            icon={<Cpu className="w-48 h-48 mb-3 text-yellow-300" />}
          />
        </Link>
        <Link to="/funda/science/light">
          <Card
            title="Light"
            description="Fundamentals of Light"
            icon={<Award className="w-48 h-48 mb-3 text-yellow-300" />}
          />
        </Link>
        <Link to="/funda/science/sound">
          <Card
            title="Sound"
            description="Fundamentals of Sound"
            icon={<Images className="w-48 h-48 mb-3 text-yellow-300" />}
          />
        </Link>
        <Link to="/funda/science/quiz">
          <Card
            title="Quiz"
            description="Test your knowledge"
            icon={<HelpCircle className="w-48 h-48 mb-3 text-yellow-300" />}
          />
        </Link>
      </div>
    </div>
  );
}

export default Science;