import React from 'react';
import { topics } from '../../mocks/data';
import Card from '../../common/UI/Card/Card';

function Science() {
  return (
    <div className="p-4">
      <div className="cards">
        {topics.map(topic => (
          <Card
            key={topic.id}
            link={`/fundamentals/science/${topic.id}`}
            title={topic.title}
            description={topic.description}
            imageUrl={topic.imageUrl}
            progress={topic.progress}
            lessons={topic.lessons}
          />
        ))}
      </div>
    </div>
  );
}

export default Science;