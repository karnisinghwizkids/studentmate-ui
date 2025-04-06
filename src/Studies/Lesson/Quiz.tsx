import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { Button } from '../../common/components/Button';
import MessageRenderer from '../../common/components/MessageRenderer';
import type { QuizEvaluation } from '../../mocks/data';
import { useStudent } from '../../contexts/StudentContext';

interface QuizProps {
  evaluation: QuizEvaluation;
  onComplete: (score: number) => void;
}

interface ParsedQuestion {
  type: 'single' | 'multiple' | 'text';
  content: string;
  options?: string[];
  correctAnswers?: number[];
  correctText?: string;
}

export function Quiz({ evaluation, onComplete }: QuizProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const { addPoints } = useStudent();
  const [passingScore] = useState(() => {
    const match = evaluation.content.match(/\[passing_score\]\s*(\d+)/);
    return match ? parseInt(match[1]) : 70;
  });

  const [questions] = useState<ParsedQuestion[]>(() => {
    const questionBlocks = evaluation.content.split(/\[(single|multiple|text)\]/).slice(1);
    const parsedQuestions: ParsedQuestion[] = [];

    for (let i = 0; i < questionBlocks.length; i += 2) {
      const type = questionBlocks[i] as 'single' | 'multiple' | 'text';
      const content = questionBlocks[i + 1].trim();

      if (type === 'text') {
        const [questionContent, answer] = content.split('R:=').map(s => s.trim());
        parsedQuestions.push({
          type,
          content: questionContent,
          correctText: answer
        });
      } else {
        const lines = content.split('\n');
        const optionLines = lines.filter(line => 
          type === 'single' ? line.trim().startsWith('- (') : line.trim().startsWith('- ['));
        
        const options = optionLines.map(line => 
          line.replace(/^-\s*[\[(][x ][\])]/, '').trim());
        
        const correctAnswers = optionLines
          .map((line, index) => 
            type === 'single' 
              ? line.includes('(x)') ? index : -1
              : line.includes('[x]') ? index : -1)
          .filter(index => index !== -1);

        const questionContent = lines
          .slice(0, lines.findIndex(line => 
            type === 'single' ? line.trim().startsWith('- (') : line.trim().startsWith('- [')))
          .join('\n')
          .trim();

        parsedQuestions.push({
          type,
          content: questionContent,
          options,
          correctAnswers
        });
      }
    }

    return parsedQuestions;
  });

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [textAnswer, setTextAnswer] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [submittedAnswers, setSubmittedAnswers] = useState<Set<number>>(new Set());
  const [score, setScore] = useState(0);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
      if (contentRef.current) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, [currentQuestion]);

  const handleAnswer = (optionIndex: number) => {
    if (submittedAnswers.has(currentQuestion)) return;

    const question = questions[currentQuestion];
    if (question.type === 'single') {
      setSelectedAnswers([optionIndex]);
    } else if (question.type === 'multiple') {
      setSelectedAnswers(prev => 
        prev.includes(optionIndex)
          ? prev.filter(i => i !== optionIndex)
          : [...prev, optionIndex]
      );
    }
  };

  const handleSubmit = () => {
    if (submittedAnswers.has(currentQuestion)) return;

    const question = questions[currentQuestion];
    let isCorrect = false;

    if (question.type === 'text') {
      const correctAnswer = question.correctText!.trim().toLowerCase();
      const userAnswer = textAnswer.trim().toLowerCase();
      isCorrect = correctAnswer === userAnswer;
    } else {
      const selected = new Set(selectedAnswers);
      isCorrect = question.type === 'single'
        ? selected.has(question.correctAnswers![0])
        : question.correctAnswers!.length === selected.size &&
          question.correctAnswers!.every(answer => selected.has(answer));
    }

    if (isCorrect) {
      const questionPoints = evaluation.points / questions.length;
      setScore(score + questionPoints);
      addPoints(questionPoints);
    }

    setLastAnswerCorrect(isCorrect);
    setSubmittedAnswers(new Set([...submittedAnswers, currentQuestion]));
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswers([]);
      setTextAnswer('');
      setShowExplanation(false);
      setLastAnswerCorrect(null);
    } else {
      const finalScore = (score / evaluation.points) * 100;
      if (finalScore >= passingScore) {
        onComplete(score);
      } else {
        setShowResults(true);
      }
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setTextAnswer('');
    setShowExplanation(false);
    setLastAnswerCorrect(null);
    setSubmittedAnswers(new Set());
    setScore(0);
    setShowResults(false);
  };

  const question = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  if (showResults) {
    const finalScore = (score / evaluation.points) * 100;
    return (
      <div className="bg-primary-blue/10 backdrop-blur-sm rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-primary-text mb-4">Quiz Results</h2>
          <div className="inline-block bg-primary-blue/20 rounded-full px-6 py-3 mb-4">
            <p className="text-3xl font-bold text-primary-text">{Math.round(finalScore)}%</p>
            <p className="text-sm text-primary-text/70">Your Score</p>
          </div>
          <div className={`p-4 rounded-lg ${
            finalScore >= passingScore ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}>
            <p className="text-lg text-primary-text mb-2">
              {finalScore >= passingScore
                ? '🎉 Congratulations! You passed the quiz!'
                : '😕 You need to score at least ' + passingScore + '% to pass.'}
            </p>
            <p className="text-primary-text/80">
              {finalScore >= passingScore
                ? 'Great job on completing the quiz successfully!'
                : 'Don\'t worry! You can try again to improve your score.'}
            </p>
          </div>
        </div>

        <Button
          onClick={handleRetry}
          className="w-full flex items-center justify-center gap-2 h-12"
        >
          <RefreshCw className="w-5 h-5" />
          Try Again
        </Button>
      </div>
    );
  }

  const renderChoiceQuestion = () => {
    if (question.type === 'single') {
      return (
        <div className="space-y-4">
          {question.options!.map((option, index) => (
            <label
              key={index}
              className={`flex items-center gap-3 w-full p-4 rounded-lg transition-colors cursor-pointer ${
                submittedAnswers.has(currentQuestion)
                  ? question.correctAnswers!.includes(index)
                    ? 'bg-green-500/20 text-primary-text'
                    : selectedAnswers.includes(index)
                      ? 'bg-red-500/20 text-primary-text'
                      : 'bg-primary-blue/10 text-primary-text'
                  : selectedAnswers.includes(index)
                    ? 'bg-primary-blue/20 text-primary-text'
                    : 'bg-primary-blue/10 hover:bg-primary-blue/20 text-primary-text'
              }`}
            >
              <div className="relative flex items-center justify-center flex-shrink-0">
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  checked={selectedAnswers.includes(index)}
                  onChange={() => handleAnswer(index)}
                  disabled={submittedAnswers.has(currentQuestion)}
                  className="appearance-none w-4 h-4 border-2 border-primary-text/50 rounded-full checked:border-primary-pink checked:bg-primary-pink transition-colors focus:outline-none focus:ring-2 focus:ring-primary-pink focus:ring-offset-2 focus:ring-offset-transparent"
                />
                <div className={`absolute w-2 h-2 rounded-full bg-white transform scale-0 transition-transform ${
                  selectedAnswers.includes(index) ? 'scale-100' : ''
                }`} />
              </div>
              <span className="flex-1">{option}</span>
              {submittedAnswers.has(currentQuestion) && (
                question.correctAnswers!.includes(index) ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : selectedAnswers.includes(index) ? (
                  <XCircle className="w-5 h-5 text-red-400" />
                ) : null
              )}
            </label>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {question.options!.map((option, index) => (
          <label
            key={index}
            className={`flex items-center gap-3 w-full p-4 rounded-lg transition-colors cursor-pointer ${
              submittedAnswers.has(currentQuestion)
                ? question.correctAnswers!.includes(index)
                  ? 'bg-green-500/20 text-primary-text'
                  : selectedAnswers.includes(index)
                    ? 'bg-red-500/20 text-primary-text'
                    : 'bg-primary-blue/10 text-primary-text'
                : selectedAnswers.includes(index)
                  ? 'bg-primary-blue/20 text-primary-text'
                  : 'bg-primary-blue/10 hover:bg-primary-blue/20 text-primary-text'
            }`}
          >
            <div className="relative flex items-center justify-center flex-shrink-0">
              <input
                type="checkbox"
                checked={selectedAnswers.includes(index)}
                onChange={() => handleAnswer(index)}
                disabled={submittedAnswers.has(currentQuestion)}
                className="appearance-none w-4 h-4 border-2 border-primary-text/50 rounded checked:border-primary-pink checked:bg-primary-pink transition-colors focus:outline-none focus:ring-2 focus:ring-primary-pink focus:ring-offset-2 focus:ring-offset-transparent"
              />
              <div className={`absolute w-2 h-2 text-white transform scale-0 transition-transform ${
                selectedAnswers.includes(index) ? 'scale-100' : ''
              }`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-2 h-2"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>
            <span className="flex-1">{option}</span>
            {submittedAnswers.has(currentQuestion) && (
              question.correctAnswers!.includes(index) ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : selectedAnswers.includes(index) ? (
                <XCircle className="w-5 h-5 text-red-400" />
              ) : null
            )}
          </label>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-primary-blue/10 backdrop-blur-sm rounded-lg p-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-primary-text">Quiz Assessment</h2>
          <span className="text-primary-text/70">
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>
        <div className="w-full bg-primary-blue/10 rounded-full h-2">
          <div
            className="bg-primary-pink rounded-full h-2 transition-all duration-300"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`
            }}
          />
        </div>
      </div>

      <div className="mb-8">
        <div className="mb-6" ref={contentRef}>
          <MessageRenderer content={question.content} />
        </div>

        {question.type === 'text' ? (
          <div>
            <input
              type="text"
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              disabled={submittedAnswers.has(currentQuestion)}
              placeholder="Type your answer here..."
              className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-pink transition-colors ${
                submittedAnswers.has(currentQuestion)
                  ? lastAnswerCorrect
                    ? 'bg-green-500/20 text-primary-text'
                    : 'bg-red-500/20 text-primary-text'
                  : 'bg-primary-blue/10 text-primary-text'
              }`}
            />
            {submittedAnswers.has(currentQuestion) && (
              <div className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${
                lastAnswerCorrect ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                {lastAnswerCorrect ? (
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                )}
                <div>
                  <p className="text-primary-text font-medium mb-1">
                    {lastAnswerCorrect ? 'Correct!' : 'Not quite right'}
                  </p>
                  <p className="text-primary-text/90">
                    {lastAnswerCorrect 
                      ? 'Great job! Your answer matches the expected response.'
                      : `The correct answer is: ${question.correctText}`
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : renderChoiceQuestion()}
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className="h-12 min-w-[120px] flex items-center justify-center gap-2"
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </Button>

        {!submittedAnswers.has(currentQuestion) ? (
          <Button
            onClick={handleSubmit}
            disabled={
              question.type === 'text'
                ? !textAnswer.trim()
                : selectedAnswers.length === 0
            }
            className="h-12 min-w-[120px] flex items-center justify-center gap-2"
          >
            Submit Answer
          </Button>
        ) : (
          <Button 
            onClick={handleNext}
            className="h-12 min-w-[120px] flex items-center justify-center gap-2"
          >
            {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
            <ChevronRight className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default Quiz;