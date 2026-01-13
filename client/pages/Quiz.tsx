import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowLeft, Check, X } from "lucide-react";

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
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      const newQuestion = currentQuestion + 1;
      setCurrentQuestion(newQuestion);
      setSelectedAnswer(null);
      setFeedbackMessage(null);
      saveProgress(newQuestion, points, attemptedQuestions);
    } else {
      setQuizComplete(true);
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-luxurious-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/30 border-t-primary mx-auto mb-6"></div>
          <p className="text-foreground text-xl font-bold">Loading your quiz...</p>
          <p className="text-foreground/60 mt-2">Get ready for an exciting challenge!</p>
        </div>
      </div>
    );
  }

  // Full Success Screen - shown when user answers correctly
  if (feedbackMessage === "correct") {
    return (
      <div className="min-h-screen bg-luxurious-gradient flex items-center justify-center p-4">
        <div className="text-center max-w-2xl">
          {/* Trophy Animation */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/30 rounded-full blur-3xl animate-pulse"></div>
              <div className="relative animate-bounce text-7xl">🏆</div>
            </div>
          </div>

          {/* Success Message */}
          <h2 className="text-5xl sm:text-6xl font-black text-foreground mb-3 leading-tight">
            Completed!
          </h2>
          <p className="text-2xl text-primary font-bold mb-8">Well Done! 🎉</p>

          {/* Points Card */}
          <Card className="p-8 mb-8 border-2 border-primary/40 shadow-2xl bg-card-gradient backdrop-blur">
            <p className="text-sm text-foreground/70 font-semibold uppercase tracking-widest mb-3">Points Earned</p>
            <div className="text-7xl font-black bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
              +10
            </div>
            <p className="text-foreground/60 mt-4 text-lg font-semibold">Excellent Answer!</p>
          </Card>

          {/* Progress Info */}
          <div className="mb-8 bg-white/20 backdrop-blur rounded-2xl p-6 border border-white/30">
            <div className="flex justify-between items-center mb-4">
              <p className="text-foreground/80 font-semibold">Question Progress</p>
              <p className="text-lg font-bold text-primary">{Math.round(((currentQuestion + 1) / quizData.length) * 100)}%</p>
            </div>
            <p className="text-foreground/70 mb-3 font-semibold">
              Question {currentQuestion + 1} of {quizData.length}
            </p>
            <Progress value={((currentQuestion + 1) / quizData.length) * 100} className="h-3" />
          </div>

          {/* Total Points */}
          <div className="mb-8 text-center">
            <p className="text-foreground/70 font-semibold mb-2">Total Points</p>
            <p className="text-5xl font-black text-primary">{points}</p>
          </div>

          {/* Loading Indicator for Auto-progression */}
          <div className="flex justify-center">
            <div className="text-center">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-8 w-8 border-3 border-primary/30 border-t-primary"></div>
              </div>
              <p className="text-foreground/60 mt-3 font-semibold">Moving to next question...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (quizComplete) {
    const percentage = Math.round((points / (quizData.length * 10)) * 100);
    return (
      <div className="min-h-screen bg-luxurious-gradient flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-10 sm:p-16 border-2 border-primary/40 shadow-2xl bg-card-gradient backdrop-blur">
          {/* Trophy */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/30 rounded-full blur-3xl"></div>
              <div className="relative text-8xl">🏆</div>
            </div>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-5xl sm:text-6xl font-black text-foreground mb-4">
              Quiz Complete!
            </h2>
            <p className="text-2xl text-primary font-bold mb-6">You Mastered It! 🌟</p>

            {/* Score */}
            <div className="bg-white/30 backdrop-blur rounded-2xl p-8 mb-8 border border-white/40">
              <p className="text-foreground/70 font-semibold mb-3">Final Score</p>
              <div className="text-7xl font-black bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent mb-4">
                {percentage}%
              </div>
              <p className="text-lg font-semibold text-foreground">
                <span className="text-primary font-black">{points}</span> points out of {quizData.length * 10}
              </p>
            </div>

            {/* Performance Message */}
            <div className="text-lg font-bold text-foreground mb-8 p-4 bg-white/20 backdrop-blur rounded-xl border border-white/30">
              {percentage >= 80
                ? "🏅 Outstanding Performance! You're a knowledge master!"
                : percentage >= 60
                  ? "👏 Great Job! You've shown strong knowledge!"
                  : "💪 Good Effort! Keep practicing to improve!"}
            </div>
          </div>

          <Button onClick={handleBackToHome} className="w-full py-6 text-lg font-bold rounded-xl">
            Return to Home
          </Button>
        </Card>
      </div>
    );
  }

  if (quizData.length === 0) {
    return (
      <div className="min-h-screen bg-luxurious-gradient flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 border-2 border-primary/40 shadow-xl bg-card-gradient backdrop-blur text-center">
          <p className="text-foreground mb-6 font-semibold text-lg">Quiz data not found</p>
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
    <div className="min-h-screen bg-luxurious-gradient p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 text-foreground hover:text-primary transition-colors font-bold mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Categories
          </button>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-foreground">{category}</h1>
              <p className="text-foreground/60 font-semibold mt-1">Fun & Smart Daily</p>
            </div>
            <Card className="p-4 sm:p-6 border-2 border-primary/30 bg-white/40 backdrop-blur">
              <p className="text-foreground/70 text-sm font-bold uppercase tracking-wide mb-1">Total Points</p>
              <div className="text-4xl font-black text-primary">{points}</div>
            </Card>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 bg-white/30 backdrop-blur rounded-xl p-4 border border-white/40">
          <div className="flex justify-between items-center mb-3">
            <span className="font-bold text-foreground">
              Question {currentQuestion + 1} of {quizData.length}
            </span>
            <span className="font-bold text-primary">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Question Card */}
        <Card className="p-8 mb-8 border-2 border-primary/30 shadow-xl bg-card-gradient backdrop-blur">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider",
                  question.difficulty === "Easy"
                    ? "bg-green-100/60 text-green-900"
                    : question.difficulty === "Medium"
                      ? "bg-amber-100/60 text-amber-900"
                      : "bg-orange-100/60 text-orange-900"
                )}
              >
                {question.difficulty} Level
              </span>
              <span className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/20 text-primary">
                {question.game_type}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">{question.question}</h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-4">
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
                    "w-full p-5 text-left rounded-xl border-2 transition-all font-semibold text-lg",
                    !isDisabled && "hover:border-primary/60 hover:bg-white/30 cursor-pointer",
                    isDisabled && "cursor-default",
                    !isSelected && !isDisabled && "border-primary/30 hover:border-primary/60 bg-white/20",
                    isSelected && !isDisabled && "border-primary/60 bg-primary/20",
                    isSelected && isCorrect && "border-green-500/60 bg-green-100/40 text-green-900 ring-2 ring-green-400/50",
                    isSelected && isWrong && "border-red-500/60 bg-red-100/40 text-red-900 ring-2 ring-red-400/50",
                    isDisabled && !isSelected && !isCorrect && "border-primary/20 opacity-50 bg-white/10"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-lg bg-primary/30 flex items-center justify-center font-black text-primary">
                        {optionLetter}
                      </span>
                      <span>{option.substring(3)}</span>
                    </div>
                    {isSelected && isCorrect && <Check className="w-6 h-6 text-green-600 animate-pulse" />}
                    {isSelected && isWrong && <X className="w-6 h-6 text-red-600 animate-pulse" />}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Feedback Message - Only for wrong answers */}
        {feedbackMessage === "wrong" && (
          <div className="space-y-4">
            <div className="p-6 rounded-xl text-center font-bold text-xl bg-red-100/50 border-2 border-red-400/50 text-red-900 animate-in fade-in duration-300 backdrop-blur">
              Try again ❌
            </div>
            <Button
              onClick={() => {
                setSelectedAnswer(null);
                setFeedbackMessage(null);
              }}
              className="w-full py-4 text-lg font-bold rounded-xl"
              variant="outline"
            >
              Try Another Answer
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
