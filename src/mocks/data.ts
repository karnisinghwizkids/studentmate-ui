export const topicsContents = {
  'science': [
    {
      id: 'gravity',
      title: 'Gravity',
      icon: 'magnet',
      description: 'Learn about gravitational forces and their effects',
      lessons: 3,
      progress: 66 // Example: 2 out of 3 lessons completed
    },
    {
      id: 'heat',
      title: 'Heat',
      icon: 'fire',
      description: 'Explore thermal energy and temperature',
      lessons: 4,
      progress: 100 // Example: All lessons completed
    },
    {
      id: 'light',
      title: 'Light',
      icon: 'sun',
      description: 'Discover the properties of light and optics',
      lessons: 3,
      progress: 33 // Example: 1 out of 3 lessons completed
    },
    {
      id: 'sound',
      title: 'Sound',
      icon: 'wave-square',
      description: 'Study sound waves and acoustics',
      lessons: 3,
      progress: 0 // Example: No lessons completed
    }
  ],
  'mathematics': [
    {
      id: 'interest',
      title: 'Interest',
      icon: 'percent',
      description: 'Explore interest',
      lessons: 3,
      progress: 66 // Example: All lessons completed
    }
  ]
};

export const lessonsContents = {
  'gravity': [
    {
      id: 'introduction-to-gravity',
      title: 'Introduction',
      description: 'Learn about gravity and how it affects everything around us',
      icon: 'rocket',
      completed: false,
      progress: 50
    },
    {
      id: 'what-is-gravity',
      title: 'What is Gravity',
      description: 'Learn about gravity and how it affects everything around us',
      icon: 'rocket',
      completed: false,
      progress: 45
    },
    {
      id: 'gravity-in-space',
      title: 'Gravity in Space',
      description: 'Learn about gravity and how it affects everything around us',
      icon: 'rocket',
      completed: false,
      progress: 0
    }
  ],
  'sound': [
    {
      id: 'introduction-to-sound',
      title: 'Introduction',
      description: 'Learn about sound',
      icon: 'wave-square',
      completed: false,
      progress: 50
    }
  ],
  'interest': [
    {
      id: 'simple-interest',
      title: 'Simple Interest',
      description: 'Simple Interest',
      icon: 'percent',
      completed: false,
      progress: 50
    }
  ]
};

export const quizQuestions = [
  {
    id: 1,
    type: 'video',
    text: "Watch this video about falling objects and answer: What happens to objects of different masses in a vacuum?",
    mediaUrl: "https://www.youtube.com/watch?v=E43-CfukEgs",
    mediaTitle: "Galileo's Famous Gravity Experiment",
    options: [
      "Heavy objects fall faster",
      "They fall at the same rate",
      "Light objects fall faster",
      "Objects don't fall in a vacuum"
    ],
    correctAnswer: 1,
    explanation: "In a vacuum, all objects fall at the same rate regardless of their mass. This is because there's no air resistance to affect their motion."
  },
  {
    id: 2,
    type: 'image',
    text: "Look at this image of Earth's gravitational field. Which statement is correct?",
    mediaUrl: "https://images.nasa.gov/details/PIA03116",
    mediaTitle: "Earth's Gravitational Field Visualization",
    options: [
      "Gravity is the same everywhere on Earth",
      "Gravity varies across Earth's surface",
      "Gravity only exists at the equator",
      "Gravity is strongest at the poles"
    ],
    correctAnswer: 1,
    explanation: "Earth's gravitational field varies slightly across its surface due to differences in the planet's shape and mass distribution."
  },
  {
    id: 3,
    type: 'image',
    text: "Looking at this diagram of planetary orbits, what determines if an object will stay in orbit around the Sun?",
    mediaUrl: "https://images.nasa.gov/details/PIA17046",
    mediaTitle: "Solar System Orbital Diagram",
    options: [
      "Only the object's mass",
      "Only the object's speed",
      "Both speed and gravitational force",
      "The object's temperature"
    ],
    correctAnswer: 2,
    explanation: "An orbit's stability depends on both the object's velocity and the gravitational force acting upon it. These two factors must be balanced for a stable orbit to occur."
  }
];

export interface LessonContent {
  id: string;
  title: string;
  sections: {
    id: string;
    type: 'text' | 'image' | 'video' | 'audio' | 'pdf';
    content: string;
    caption?: string;
    description?: string;
    experience: 'curiosity' | 'explanation' | 'verification';
    aiContext: string;
  }[];
}

export const lessonContents: Record<string, LessonContent> = {
  'introduction-to-gravity': {
    id: 'introduction-to-gravity',
    title: 'Introduction to Gravity',
    sections: [
      {
        id: 'intro',
        type: 'text',
        content: `# Introduction to Gravity

Gravity is one of the fundamental forces of nature that shapes our universe. It's the force that:

- Keeps planets orbiting around the Sun
- Makes objects fall to the ground
- Holds our atmosphere in place
- Influences the tides

In this lesson, we'll explore the basic concepts of gravity and how it affects our daily lives.`,
        experience: 'curiosity',
        aiContext: 'This is an introduction to gravity, walking the student through basics of gravity',
      },
      {
        id: 'explanation',
        type: 'text',
        content: `# Explanation of Gravity

Gravity is one of the fundamental forces of nature that shapes our universe. It's the force that:

- Keeps planets orbiting around the Sun
- Makes objects fall to the ground
- Holds our atmosphere in place
- Influences the tides

In this lesson, we'll explore the basic concepts of gravity and how it affects our daily lives.`,
        experience: 'explanation',
        aiContext: 'A simple explanation of how gravity works and its effects on objects.'
      },
      {
        id: 'newton-apple',
        type: 'image',
        content: 'https://images.unsplash.com/photo-1444392061186-9fc38f84f726',
        caption: 'Newton\'s Apple Tree at Trinity College',
        description: 'Legend has it that Isaac Newton was inspired to formulate his theory of gravitation when he saw an apple fall from a tree.',
        experience: 'explanation',
        aiContext: 'A simple explanation of how gravity works and its effects on objects.'
      },
      {
        id: 'gravity-explanation',
        type: 'video',
        content: 'https://www.youtube.com/watch?v=P9dpTTpjymE',
        caption: 'Understanding Gravity',
        description: 'A simple explanation of how gravity works and its effects on objects.',
        experience: 'explanation',
        aiContext: 'A simple explanation of how gravity works and its effects on objects.'
      },
      {
        id: 'gravity-sound',
        type: 'audio',
        content: 'https://www.nasa.gov/wav/123391main_em-spectrum.wav',
        caption: 'Gravitational Waves',
        description: 'The sound of two black holes merging, as detected by LIGO (converted to audible frequencies).',
        experience: 'verification',
        aiContext: 'A simple explanation of how gravity works and its effects on objects.'
      },
      {
        id: 'gravity-notes',
        type: 'pdf',
        content: 'https://drive.google.com/file/d/1FHVn9Mp-BHiUuKaBjIgUBB_2FtfT6mM8/preview',
        caption: 'Detailed Notes on Gravity',
        description: 'A comprehensive guide to understanding gravitational forces.',
        experience: 'verification',
        aiContext: 'Detailed notes about gravity for students to review and study.'
      }
    ]
  },
  'simple-interest': {
    id: 'simple-interest',
    title: 'Simple Interest',
    sections: [
      {
        id: 'intro',
        type: 'pdf',
        content: 'https://drive.google.com/file/d/1SwVp__qjK3fNMPr0F5fVG68xKX_DctMR/preview',
        experience: 'curiosity',
        aiContext: 'This is an introduction to simple interest, walking the student through basics of simple interest',
      },
      {
        id: 'explanation',
        type: 'pdf',
        content: 'https://drive.google.com/file/d/1FHVn9Mp-BHiUuKaBjIgUBB_2FtfT6mM8/preview',
        experience: 'explanation',
        aiContext: 'A simple explanation of how simple interest works and its benefits in practical life.'
      },
      {
        id: 'simple-interest-explanation',
        type: 'video',
        content: 'https://www.youtube.com/watch?v=jtFE94lf7Vw',
        caption: 'Understanding Simple Interest',
        description: 'A simple explanation of how simple interest works and its benefits in practical life.',
        experience: 'explanation',
        aiContext: 'A simple explanation of how simple interest works and its benefits in practical life.'
      }
    ]
  },
  'introduction-to-sound': {
    id: 'introduction-to-sound',
    title: 'Sound Introduction',
    sections: [
      {
        id: 'sound-intro',
        type: 'pdf',
        content: 'https://drive.google.com/file/d/1fk0tYoFumXeqTlP-oqhvMN3SgY1aUFcC/preview',
        experience: 'curiosity',
        aiContext: 'This is an introduction to sound, walking the student through basics of sound',
      },
      {
        id: 'sound-explanation',
        type: 'pdf',
        content: 'https://drive.google.com/file/d/1Ws8VicwXugAqeYRDOzZ_l-T06kApivLE/preview',
        experience: 'explanation',
        aiContext: 'This is an introduction to sound, walking the student through basics of sound',
      },
      {
        id: 'simple-interest-explanation',
        type: 'video',
        content: 'https://www.youtube.com/watch?v=3-xKZKxXuu0',
        caption: 'Understanding Sound',
        description: 'This is an introduction to sound, walking the student through basics of sound',
        experience: 'explanation',
        aiContext: 'This is an introduction to sound, walking the student through basics of sound',
      }
    ]
  }
};