import React from 'react';
import Card from '../common/UI/Card/Card';
import { Breadcrumbs } from '../common/components/Breadcrumbs';
import './Studies.css';

function Studies() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="p-4">
        <Breadcrumbs />
      </div>
      <div className="cards"> 
        <Card
          link="/fundamentals/science"
          title="Science"
          description="Fundamentals of Science"
          icon="flask"
        />
        <Card
          link="/fundamentals/technology"
          title="Technology"
          description="Fundamentals of Technology"
          icon="microchip"
        />
        <Card
          link="/fundamentals/enterpreneurship"
          title="Enterpreneurship"
          description="Fundamentals of Enterpreneurship"
          icon="warehouse"
        />
        <Card
          link="/fundamentals/arts"
          title="Arts"
          description="Fundamentals of Arts"
          icon="palette"
        />
        <Card
          link="/fundamentals/mathematics"
          title="Mathematics"
          description="Fundamentals of Mathematics"
          icon="infinity"
        />
        <Card
          link="/fundamentals/self"
          title="Self"
          description="Fundamentals of Self Development"
          icon="dharmachakra"
        />
      </div>
    </div>
  );
}

export default Studies;