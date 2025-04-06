import React, { useState } from 'react';
import { Breadcrumbs } from '../common/components/Breadcrumbs';
import { Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../common/components/Button';

interface Fact {
  id: number;
  category: 'science' | 'culture' | 'math' | 'technology';
  title: string;
  description: string;
  imageUrl: string;
}

const facts: Fact[] = [
  {
    id: 1,
    category: 'science',
    title: 'The Human Body Has More Than 600 Muscles',
    description: 'Your body is an amazing machine with over 600 muscles that help you move, breathe, and even smile!',
    imageUrl: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800'
  },
  {
    id: 2,
    category: 'culture',
    title: 'The Oldest Sanskrit Text',
    description: 'The Rigveda, composed around 1500 BCE, is one of the oldest known Sanskrit texts and contains over 1,000 hymns.',
    imageUrl: 'https://images.unsplash.com/photo-1544931733-7ee54f4d2eb5?w=800'
  },
  {
    id: 3,
    category: 'math',
    title: 'Zero Was Invented in India',
    description: 'The concept of zero as a number was first developed in ancient India by mathematician Aryabhata.',
    imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800'
  },
  {
    id: 4,
    category: 'technology',
    title: 'India\'s Ancient Contribution to Space Science',
    description: 'Aryabhata\'s work in the 5th century CE included calculations of planetary movements and eclipse predictions.',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800'
  }
];

export default function Funfacts() {
  const [currentFact, setCurrentFact] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredFacts = selectedCategory === 'all' 
    ? facts 
    : facts.filter(fact => fact.category === selectedCategory);

  const nextFact = () => {
    setCurrentFact((prev) => (prev + 1) % filteredFacts.length);
  };

  const previousFact = () => {
    setCurrentFact((prev) => (prev - 1 + filteredFacts.length) % filteredFacts.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="p-4">
        <Breadcrumbs />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Fun Facts</h1>
          <div className="flex gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'primary' : 'outline'}
              onClick={() => setSelectedCategory('all')}
            >
              All
            </Button>
            <Button
              variant={selectedCategory === 'science' ? 'primary' : 'outline'}
              onClick={() => setSelectedCategory('science')}
            >
              Science
            </Button>
            <Button
              variant={selectedCategory === 'culture' ? 'primary' : 'outline'}
              onClick={() => setSelectedCategory('culture')}
            >
              Culture
            </Button>
            <Button
              variant={selectedCategory === 'math' ? 'primary' : 'outline'}
              onClick={() => setSelectedCategory('math')}
            >
              Math
            </Button>
            <Button
              variant={selectedCategory === 'technology' ? 'primary' : 'outline'}
              onClick={() => setSelectedCategory('technology')}
            >
              Technology
            </Button>
          </div>
        </div>

        {filteredFacts.length > 0 ? (
          <div className="bg-primary-blue/10 backdrop-blur-sm rounded-lg overflow-hidden">
            <div className="relative aspect-video">
              <img
                src={filteredFacts[currentFact].imageUrl}
                alt={filteredFacts[currentFact].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {filteredFacts[currentFact].title}
                </h2>
                <p className="text-white/90">
                  {filteredFacts[currentFact].description}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center p-4">
              <button
                onClick={previousFact}
                className="p-2 rounded-full bg-primary-blue/10 hover:bg-primary-blue/20 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <div className="flex gap-2">
                {filteredFacts.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentFact ? 'bg-white' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextFact}
                className="p-2 rounded-full bg-primary-blue/10 hover:bg-primary-blue/20 transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-primary-blue/10 backdrop-blur-sm rounded-lg p-8 text-center">
            <Lightbulb className="w-16 h-16 text-white/50 mx-auto mb-4" />
            <p className="text-white text-lg">No facts found for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}