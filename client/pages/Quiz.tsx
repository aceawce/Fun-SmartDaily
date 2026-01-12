import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowLeft, Check, X, RotateCcw } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  correct_answer: string;
  difficulty: string;
  game_type: string;
}

interface QuizData {
  categories: Array<{
    category: string;
    questions: Question[];
  }>;
}

interface QuizProgress {
  category: string;
  currentQuestion: number;
  points: number;
  attemptedQuestions: Set<number>;
}

const STORAGE_KEY = "quiz_progress";

export default function Quiz() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [points, setPoints] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<"correct" | "wrong" | null>(null);
  const [loading, setLoading] = useState(true);
  const [quizComplete, setQuizComplete] = useState(false);
  const [attemptedQuestions, setAttemptedQuestions] = useState<Set<number>>(new Set());
  const [autoProgressTimer, setAutoProgressTimer] = useState<NodeJS.Timeout | null>(null);

  // Load quiz data and restore progress
  useEffect(() => {
    const loadQuizData = async () => {
      try {
        const response = await fetch("/quiz-data.json");
        const data: QuizData = await response.json();
        const categoryData = data.categories.find((c) => c.category === category);
        if (categoryData) {
          setQuizData(categoryData.questions);
          // Restore progress from localStorage
          restoreProgress(category);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error loading quiz data:", error);
        setLoading(false);
      }
    };

    loadQuizData();
  }, [category]);

  // Auto-progress to next question after correct answer
  useEffect(() => {
    if (feedbackMessage === "correct" && !autoProgressTimer) {
      const timer = setTimeout(() => {
        handleNextQuestion();
      }, 1500); // 1.5 seconds
      setAutoProgressTimer(timer);
    }

    return () => {
      if (autoProgressTimer) {
        clearTimeout(autoProgressTimer);
        setAutoProgressTimer(null);
      }
    };
  }, [feedbackMessage]);

  const restoreProgress = (categoryName: string | undefined) => {
    if (!categoryName) return;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const progress: QuizProgress = JSON.parse(saved);
        if (progress.category === categoryName) {
          setCurrentQuestion(progress.currentQuestion);
          setPoints(progress.points);
          setAttemptedQuestions(new Set(progress.attemptedQuestions));
        }
      }
    } catch (error) {
      console.error("Error restoring progress:", error);
    }
  };

  const saveProgress = (questionIndex: number, newPoints: number, attempted: Set<number>) => {
    try {
      const progress: QuizProgress = {
        category: category || "",
        currentQuestion: questionIndex,
        points: newPoints,
        attemptedQuestions: Array.from(attempted),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  };

  const handleAnswerSelect = (option: string) => {
    if (selectedAnswer !== null) return; // Already answered this question

    setSelectedAnswer(option);
    const isCorrect = option === quizData[currentQuestion].correct_answer;

    if (isCorrect) {
      setFeedbackMessage("correct");
      const newPoints = points + 10;
      setPoints(newPoints);
      const newAttempted = new Set(attemptedQuestions);
      newAttempted.add(currentQuestion);
      setAttemptedQuestions(newAttempted);
      saveProgress(currentQuestion, newPoints, newAttempted);
    } else {
      setFeedbackMessage("wrong");
      setShowResult(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      const newQuestion = currentQuestion + 1;
      setCurrentQuestion(newQuestion);
      setSelectedAnswer(null);
      setShowResult(false);
      setFeedbackMessage(null);
      saveProgress(newQuestion, points, attemptedQuestions);
    } else {
      setQuizComplete(true);
      clearQuizProgress();
    }
  };

  const handleResetGame = () => {
    if (window.confirm("Are you sure you want to reset your progress? This will clear all your points.")) {
      setCurrentQuestion(0);
      setPoints(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setFeedbackMessage(null);
      setAttemptedQuestions(new Set());
      setQuizComplete(false);
      clearQuizProgress();
    }
  };

  const clearQuizProgress = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing progress:", error);
    }
  };

  const handleBackToHome = () => {
    clearQuizProgress();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground text-lg">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (quizComplete) {
    const percentage = Math.round((points / (quizData.length * 10)) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center border-0 shadow-xl">
          <div className="mb-6">
            <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4">
              {percentage}%
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">{category} Quiz Complete! ✅</h2>
            <p className="text-muted-foreground">
              You earned <span className="font-bold text-primary">{points} points</span> out of {quizData.length * 10}
            </p>
          </div>

          <div className="mb-8">
            <p className="text-sm text-muted-foreground mb-4">
              {percentage >= 80
                ? "🎉 Excellent performance!"
                : percentage >= 60
                  ? "👍 Good job!"
                  : "💪 Keep practicing!"}
            </p>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleBackToHome} variant="outline" className="flex-1">
              Back to Home
            </Button>
            <Button onClick={handleResetGame} className="flex-1">
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (quizData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center border-0 shadow-xl">
          <p className="text-foreground mb-4">Quiz data not found</p>
          <Button onClick={handleBackToHome} className="w-full">
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  const question = quizData[currentQuestion];
  const progress = ((currentQuestion + 1) / quizData.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handleBackToHome}
              className="flex items-center gap-2 text-primary hover:text-secondary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <Button
              onClick={handleResetGame}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-foreground">{category}</h1>
            <div className="text-right">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                {points}
              </div>
              <p className="text-sm text-muted-foreground">Points</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">
              Question {currentQuestion + 1} of {quizData.length}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="p-8 mb-8 border-0 shadow-xl bg-card">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-semibold",
                  question.difficulty === "Easy"
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                    : question.difficulty === "Medium"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
                      : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                )}
              >
                {question.difficulty}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                {question.game_type}
              </span>
            </div>
            <h2 className="text-xl font-bold text-foreground">{question.question}</h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
              const isSelected = selectedAnswer === optionLetter;
              const isCorrect = optionLetter === question.correct_answer;
              const isWrong = isSelected && optionLetter !== question.correct_answer;
              const isDisabled = selectedAnswer !== null;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(optionLetter)}
                  disabled={isDisabled}
                  className={cn(
                    "w-full p-4 text-left rounded-lg border-2 transition-all font-medium",
                    !isDisabled && "hover:border-primary cursor-pointer",
                    isDisabled && "cursor-default",
                    !isSelected && !isDisabled && "border-border hover:border-primary/50",
                    isSelected && !isDisabled && "border-primary bg-primary/5",
                    isSelected && isCorrect && "border-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-200 ring-2 ring-green-400",
                    isSelected && isWrong && "border-red-500 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-200 ring-2 ring-red-400",
                    isDisabled && !isSelected && !isCorrect && "border-border opacity-50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {isSelected && isCorrect && <Check className="w-5 h-5 text-green-600 dark:text-green-400 animate-pulse" />}
                    {isSelected && isWrong && <X className="w-5 h-5 text-red-600 dark:text-red-400 animate-pulse" />}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Feedback Message */}
        {feedbackMessage && (
          <div className="space-y-4 mb-4">
            <div
              className={cn(
                "p-4 rounded-lg text-center font-semibold text-lg animate-in fade-in duration-300",
                feedbackMessage === "correct"
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                  : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
              )}
            >
              {feedbackMessage === "correct" ? "Well done! ✅" : "Try again ❌"}
            </div>
            {feedbackMessage === "correct" && (
              <p className="text-center text-sm text-muted-foreground">
                You earned 10 points! Moving to next question...
              </p>
            )}
          </div>
        )}

        {/* Action Buttons - Only show for wrong answers */}
        {feedbackMessage === "wrong" && (
          <div className="space-y-4">
            <Button
              onClick={() => {
                setSelectedAnswer(null);
                setShowResult(false);
                setFeedbackMessage(null);
              }}
              className="w-full"
              size="lg"
              variant="outline"
            >
              Try Another Answer
            </Button>
            <Button
              onClick={handleNextQuestion}
              className="w-full"
              size="lg"
              variant="secondary"
            >
              {currentQuestion === quizData.length - 1 ? "See Results" : "Skip to Next"}
            </Button>
          </div>
        )}

        {/* Auto-progress indicator for correct answers */}
        {feedbackMessage === "correct" && (
          <div className="flex justify-center">
            <div className="text-center">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
