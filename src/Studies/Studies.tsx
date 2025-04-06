import React from 'react';
import Card from '../common/UI/Card/Card';
import './Studies.css';

function Studies() {
  return (
    <div className="p-4">
      <div className="cards"> 
        <Card
          link="/fundamentals/science"
          title="Science"
          description="Explore the wonders of the natural world"
          imageUrl="https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800"
        />
        <Card
          link="/fundamentals/technology"
          title="Technology"
          description="Discover and learn modern innovations"
          imageUrl="https://images.unsplash.com/photo-1518770660439-4636190af475?w=800"
        />
        <Card
          link="/fundamentals/enterpreneurship"
          title="Entrepreneurship"
          description="Learn business and innovation"
          imageUrl="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800"
        />
        <Card
          link="/fundamentals/arts"
          title="Arts"
          description="Learn how to express your creativity"
          imageUrl="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800"
        />
        <Card
          link="/fundamentals/mathematics"
          title="Mathematics"
          description="Master numbers patterns and everything math"
          imageUrl="https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800"
        />
        <Card
          link="/fundamentals/self"
          title="Self Development"
          description="Grow personally and spiritually"
          imageUrl="https://images.unsplash.com/photo-1528716321680-815a8cdb8cbe?w=800"
        />
      </div>
    </div>
  );
}

export default Studies;