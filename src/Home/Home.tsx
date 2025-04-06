import React from 'react';
import Card from '../common/UI/Card/Card';
import { DailyActivity } from '../components/DailyActivity';
import './Home.css';

function Home() {
  return (
    <div className="p-4">
      <div className="cards">
        <Card
          link="/fundamentals"
          title="Fundamentals"
          description="Core concepts of Science, Technology, and more"
          imageUrl="https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800"
        />
        <Card
          link="/activity"
          title="Activities"
          description="Fun learning activities and experiments"
          imageUrl="https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800"
        />
        <Card
          link="/funfrendz"
          title="Fun Friends"
          description="Learn, play and have fun with friends"
          imageUrl="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800"
        />
        <Card
          link="/funtime"
          title="Fun Time"
          description="Cultural events and celebrations"
          imageUrl="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800"
        />
        <Card
          link="/scorecard"
          title="Achievements"
          description="Track your progress and rewards"
          imageUrl="https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=800"
        />
        <Card
          link="/gallery"
          title="Gallery"
          description="Showcase your creative work to friends"
          imageUrl="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800"
        />
        <Card
          link="/funfacts"
          title="Fun Facts"
          description="Amazing discoveries and knowledge"
          imageUrl="https://images.unsplash.com/photo-1492962827063-e5ea0d8c01f5?w=800"
        />
        <Card
          link="/chat"
          title="AI Tutor"
          description="Your friendly learning companion"
          imageUrl="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800"
        />
      </div>

      <DailyActivity />
    </div>
  );
}

export default Home;