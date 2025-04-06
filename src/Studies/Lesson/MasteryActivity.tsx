import React from 'react';
import { Button } from '../../common/components/Button';
import MessageRenderer from '../../common/components/MessageRenderer';
import type { MasteryActivity as MasteryActivityType } from '../../mocks/data';

interface MasteryActivityProps {
  activity: MasteryActivityType;
  onComplete: () => void;
}

export function MasteryActivity({ activity, onComplete }: MasteryActivityProps) {
  return (
    <div className="bg-primary-blue/10 backdrop-blur-sm rounded-lg p-8">
      <div className="mb-8">
        <MessageRenderer content={activity.content} />
      </div>

      <div className="flex justify-end">
        <Button onClick={onComplete}>
          I've Completed the Activity
        </Button>
      </div>
    </div>
  );
}