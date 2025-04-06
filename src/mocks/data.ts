export const topics = [
  {
    id: 'gravity',
    title: 'Gravity',
    description: 'Learn about gravitational forces and their effects',
    lessons: 3,
    progress: 66,
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800'
  },
  {
    id: 'heat',
    title: 'Heat',
    description: 'Explore thermal energy and temperature',
    lessons: 4,
    progress: 100,
    imageUrl: 'https://images.unsplash.com/photo-1524522173746-f628baad3644?w=800'
  },
  {
    id: 'light',
    title: 'Light',
    description: 'Discover the properties of light and optics',
    lessons: 3,
    progress: 33,
    imageUrl: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?w=800'
  },
  {
    id: 'sound',
    title: 'Sound',
    description: 'Study sound waves and acoustics',
    lessons: 3,
    progress: 0,
    imageUrl: 'https://images.unsplash.com/photo-1558584673-c834fb1cc3ca?w=800'
  }
];

export const lessons = [
  {
    id: 'introduction-to-gravity',
    title: 'Introduction',
    description: 'Learn about gravity and how it affects everything around us',
    completed: false,
    progress: 50,
    imageUrl: 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=800'
  },
  {
    id: 'what-is-gravity',
    title: 'What is Gravity',
    description: 'Learn about gravity and how it affects everything around us',
    completed: false,
    progress: 45,
    imageUrl: 'https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?w=800'
  },
  {
    id: 'gravity-in-space',
    title: 'Gravity in Space',
    description: 'Learn about gravity and how it affects everything around us',
    completed: false,
    progress: 0,
    imageUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800'
  }
];

export interface LessonPhase {
  id: string;
  type: 'learning' | 'mastery' | 'evaluation';
  title: string;
  description: string;
}

export interface LearningSection {
  id: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'pdf';
  content: string;
  caption?: string;
  description?: string;
  experience: 'curiosity' | 'explanation' | 'verification';
  aiContext: string;
}

export interface MasteryActivity {
  content: string;
}

export interface EvaluationType {
  type: 'quiz' | 'ai';
  points: number;
}

export interface QuizEvaluation extends EvaluationType {
  type: 'quiz';
  content: string; // Markdown content containing the quiz
}

export interface AIEvaluation extends EvaluationType {
  type: 'ai';
  prompt: string;
  context: string;
  supportedInputs: ('text' | 'image')[];
}

export interface LessonContent {
  id: string;
  title: string;
  phases: {
    learning: {
      sections: LearningSection[];
    };
    mastery: {
      activity: MasteryActivity;
    };
    evaluation: {
      methods: (QuizEvaluation | AIEvaluation)[];
    };
  };
}

export const lessonContents: Record<string, LessonContent> = {
  'introduction-to-gravity': {
    id: 'introduction-to-gravity',
    title: 'Introduction to Gravity',
    phases: {
      learning: {
        sections: [
          {
            id: 'gravity-intro',
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
            id: 'gravity-explanation',
            type: 'text',
            content: `# Understanding Gravity

Let's dive deeper into how gravity works:

1. Every object with mass has gravity
2. Gravity gets stronger with more mass
3. Gravity gets weaker with distance
4. Gravity never stops working

Think about how the Moon orbits Earth, or how a ball always falls back down when you throw it up!`,
            experience: 'explanation',
            aiContext: 'Explaining the basic principles of gravity in simple terms'
          },
          {
            id: 'gravity-bharatiya',
            type: 'text',
            content: `# Bharatiya context

## Did you know that the first principle of gravity was stated by *"Bhaskaracharya"* and not "Newton."?

![Bhaskaracharya](https://magnificentmaharashtra.wordpress.com/wp-content/uploads/2015/01/bhaskaracharya.jpg)

Bhaskaracharya stated the laws of gravity in the book Surya Siddhanta in 11th century. Thus, the law exists even
before the birth of Sir Isaac Newton (Newton was born in the 16th century). Here are some of the slokas from his
book Surya Siddhanta that mentions how gravitation work:

*"akrsta saktisca mahi taya yat svastham guru svabhimukham svasaktya
akrsyate tatpatativa bhati same samantat kva patatviyam khe"*

[Sidhanta Shiromani, Bhuvanakosa, 6th Sloka]

**This means:** Every object falls on the ground due to earth's force of attraction. This force allows the
sun, earth, moon and constellations to stay in the orbit.

[Reference](https://www.iosrjournals.org/iosr-jhss/papers/Vol.28-Issue2/Ser-2/F2802025658.pdf)
`,
            experience: 'explanation',
            aiContext: 'Explaining the basic principles of gravity in simple terms'
          },
          {
            id: 'gravity-video',
            type: 'video',
            content: 'https://www.youtube.com/watch?v=H9YMgx5T9Sk',
            caption: 'Learn all about how gravitational force works',
            description: 'A simple explanation of how gravity works and its effects on objects.',
            experience: 'explanation',
            aiContext: 'Visual demonstration of gravity concepts'
          },
          {
            id: 'gravity-extra',
            type: 'text',
            content: `## Example Markdown

You can use:
- **Bold text**
- *Italic text*
- ~~Strikethrough~~
- \`inline code\`

### Math Examples
Inline math: $E = mc^2$

Block math:
$$
\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
$$

### HTML Examples
<div style="background-color: #f0f0f0; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
  <h4 style="color: #2563eb;">Custom HTML Content</h4>
  <p>You can use <strong>HTML</strong> directly in your content!</p>
  <ul style="list-style-type: square;">
    <li>Custom styling</li>
    <li>Complex layouts</li>
    <li>Interactive elements</li>
  </ul>
</div>

### Images
![Beautiful landscape](https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&h=800&q=80)

### Videos
To embed a YouTube video, paste the video URL:

https://www.youtube.com/watch?v=dQw4w9WgXcQ

### Tables
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |

### Code Blocks
\`\`\`python
def hello_world():
    print("Hello, World!")
\`\`\`
`,
            experience: 'explanation',
            aiContext: 'Explaining the basic principles of gravity in simple terms'
          }
        ]
      },
      mastery: {
        activity: {
          content: `# Drop Time Challenge!

![Falling Objects](https://i.ibb.co/ZzqBSnbL/teachergravity.jpg)

In this hands-on activity, you'll investigate how different objects fall under gravity.

## Materials Needed

- Paper ball
- Rubber ball
- Marble or small stone
- Measuring tape
- Notebook and pencil
- Phone/camera to record drops (optional)

## Instructions

1. Collect 3 different objects of similar size but different weights
2. Find a safe height to drop objects (about 2 meters)
3. Drop pairs of objects together and observe
4. Record your observations in your notebook
5. Try to explain what you observed

## Duration

30 minutes

## Safety Notes

- Choose a clear area without obstacles
- Don't use fragile or dangerous objects
- Keep a safe distance from falling objects

## Expected Outcome

You should observe that objects fall at nearly the same rate, with slight variations due to air resistance.

## Helpful Tips

- Try dropping objects both simultaneously and separately
- Look carefully at which object hits the ground first
- Consider how air resistance might affect each object differently
- Think about what would happen in a vacuum (no air)`
        }
      },
      evaluation: {
        methods: [
          {
            type: 'quiz',
            points: 50,
            content: `[passing_score]
70

[single]
What happens to objects of different masses in a vacuum?

Watch this video to understand Galileo's famous experiment:

https://www.youtube.com/watch?v=E43-CfukEgs

- (x) They fall at the same rate
- ( ) Heavy objects fall faster
- ( ) Light objects fall faster
- ( ) Objects don't fall in a vacuum

[multiple]
Which factors affect an object's fall on Earth? Select all that apply.

![Falling Objects](https://images.twinkl.co.uk/tw1n/image/private/t_630_eco/website/uploaded/do-heavy-objects-fall-faster-than-lighter-ones-1615806225.jpg)

- [x] Air resistance
- [x] Object's shape
- [x] Surface area
- [ ] Color of the object
- [ ] Time of day

[text]
What is the value of Gravity.

Key points to consider:
- Gravitational force
- Air resistance
- Mass vs Weight
- $F = ma$

R:= 9.8`
          },
          {
            type: 'ai',
            points: 50,
            prompt: "I'll be your AI tutor for this activity. Tell me about your gravity experiment - what did you observe when dropping different objects? You can share both text descriptions and photos of your experiment.",
            context: "The student has completed a hands-on experiment exploring how different objects fall under gravity and the effects of air resistance. They should demonstrate understanding of basic gravity concepts and how air resistance affects falling objects. Ask them questions to help them reflect on their observations.",
            supportedInputs: ['text', 'image']
          }
        ]
      }
    }
  }
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