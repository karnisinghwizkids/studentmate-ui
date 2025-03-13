import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowRight, Award } from 'lucide-react';
import { Button } from '../../common/components/Button';
import MessageRenderer from '../../common/components/MessageRenderer';
import { quizQuestions } from '../../mocks/data';
import { Breadcrumbs } from '../../common/components/Breadcrumbs';
import { useNotifications } from '../../hooks/useNotifications';

interface Question {
  id: number;
  type: 'text' | 'video' | 'image';
  text: string;
  mediaUrl?: string;
  mediaTitle?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

function Quiz() {
  const navigate = useNavigate();
  const { subject, topic, lesson } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<{ question: number; correct: boolean }[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [submittedAnswers, setSubmittedAnswers] = useState<Set<number>>(new Set());
  const { addNotification } = useNotifications();
  const POINTS_PER_QUESTION = 10;

  const handleAnswer = (optionIndex: number) => {
    if (submittedAnswers.has(currentQuestion)) return;
    setSelectedAnswer(optionIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null || submittedAnswers.has(currentQuestion)) return;

    const correct = selectedAnswer === quizQuestions[currentQuestion].correctAnswer;
    if (correct) setScore(score + 1);

    setAnswers([...answers, { question: currentQuestion, correct }]);
    setShowExplanation(true);
    setSubmittedAnswers(new Set([...submittedAnswers, currentQuestion]));
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setShowResult(true);
    }
  };

  const handleFinish = () => {
    const totalPoints = score * POINTS_PER_QUESTION;
    const percentage = (score / quizQuestions.length) * 100;

    // Award points for completing the quiz
    addNotification({
      type: 'points',
      title: 'Quiz Completed!',
      message: `+${totalPoints} points earned!`
    });

    // Award badge if score is high enough
    if (percentage >= 80) {
      addNotification({
        type: 'badge',
        title: 'Quiz Master!',
        message: 'You earned the Quiz Master badge for scoring 80% or higher!'
      });
    }

    // Navigate back to the topic
    navigate(`/fundamentals/${subject}/${topic}`);
  };

  const renderMedia = (question: Question) => {
    if (!question.mediaUrl) return null;

    switch (question.type) {
      case 'video':
        return (
          <MessageRenderer 
            content={`Title: ${question.mediaTitle}\nDescription: Watch carefully and answer the question\n${question.mediaUrl}`} 
          />
        );
      case 'image':
        const imageUrl = question.mediaUrl.includes('images.nasa.gov/details/') 
          ? `https://images-assets.nasa.gov/image/${question.mediaUrl.split('/').pop()}/${question.mediaUrl.split('/').pop()}~medium.jpg`
          : question.mediaUrl;
        
        return (
          <div className="mb-4">
            <img 
              src={imageUrl}
              alt={question.mediaTitle} 
              className="rounded-lg max-w-full h-auto mx-auto"
            />
            <p className="text-sm text-gray-700 mt-2 text-center">{question.mediaTitle}</p>
          </div>
        );
      default:
        return null;
    }
  };

  const getScoreMessage = () => {
    const percentage = (score / quizQuestions.length) * 100;
    if (percentage >= 80) return "Excellent! You're a gravity expert! 🌟";
    if (percentage >= 60) return "Good job! Keep learning! 👍";
    return "Keep practicing! You'll get better! 💪";
  };

  if (showResult) {
    const totalPoints = score * POINTS_PER_QUESTION;

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="p-4">
          <Breadcrumbs />
        </div>

        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg p-8 shadow-lg">
            <div className="text-center mb-8">
              <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2 text-gray-800">Quiz Complete!</h2>
              <div className="space-y-2">
                <p className="text-xl text-gray-700">
                  You scored {score} out of {quizQuestions.length}
                </p>
                <p className="text-lg text-gray-600">{getScoreMessage()}</p>
                <p className="text-lg text-green-600 font-semibold">
                  +{totalPoints} points earned! ({POINTS_PER_QUESTION} points per correct answer)
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {answers.map((answer, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    answer.correct ? 'bg-green-100' : 'bg-red-100'
                  }`}
                >
                  {answer.correct ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className="text-gray-700">{quizQuestions[answer.question].text}</span>
                  {answer.correct && (
                    <span className="ml-auto text-green-600 font-medium">
                      +{POINTS_PER_QUESTION} points
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-4">
              <Button
                onClick={() => navigate(`/fundamentals/${subject}/${topic}/${lesson}`)}
                variant="outline"
              >
                Review Lesson
              </Button>
              <Button onClick={handleFinish}>
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const optionColors = [
    'bg-pink-100 hover:bg-pink-200 text-pink-800',
    'bg-purple-100 hover:bg-purple-200 text-purple-800',
    'bg-blue-100 hover:bg-blue-200 text-blue-800',
    'bg-green-100 hover:bg-green-200 text-green-800'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="p-4">
        <Breadcrumbs />
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Lesson Quiz</h2>
              <span className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {quizQuestions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="mb-8">
            {renderMedia(quizQuestions[currentQuestion])}
            <h3 className="text-xl mb-4 text-gray-800">{quizQuestions[currentQuestion].text}</h3>
            <div className="space-y-3">
              {quizQuestions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={submittedAnswers.has(currentQuestion)}
                  className={`w-full text-left p-4 rounded-lg transition-colors ${
                    selectedAnswer === index
                      ? 'ring-2 ring-offset-2 ring-blue-500 ' + optionColors[index]
                      : optionColors[index]
                  } ${
                    submittedAnswers.has(currentQuestion)
                      ? 'cursor-not-allowed opacity-75'
                      : ''
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            
            {showExplanation && (
              <div className={`mt-4 p-4 rounded-lg ${
                selectedAnswer === quizQuestions[currentQuestion].correctAnswer
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                <p className="text-sm">
                  {quizQuestions[currentQuestion].explanation}
                </p>
                {selectedAnswer === quizQuestions[currentQuestion].correctAnswer && (
                  <p className="text-sm font-medium mt-2 text-green-600">
                    +{POINTS_PER_QUESTION} points earned!
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            {!submittedAnswers.has(currentQuestion) && (
              <Button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className="flex-1"
              >
                Submit Answer
              </Button>
            )}
            {submittedAnswers.has(currentQuestion) && (
              <Button
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-2"
              >
                {currentQuestion === quizQuestions.length - 1 ? 'Finish' : 'Next'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;