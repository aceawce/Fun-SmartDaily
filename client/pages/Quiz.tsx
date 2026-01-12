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

export default function Quiz() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quizComplete, setQuizComplete] = useState(false);
  const [answers, setAnswers] = useState<Array<{ selected: string; correct: string }>>([]);

  useEffect(() => {
    const loadQuizData = async () => {
      try {
        const response = await fetch("/quiz-data.json");
        const data: QuizData = await response.json();
        const categoryData = data.categories.find((c) => c.category === category);
        if (categoryData) {
          setQuizData(categoryData.questions);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error loading quiz data:", error);
        setLoading(false);
      }
    };

    loadQuizData();
  }, [category]);

  const handleAnswerSelect = (option: string) => {
    if (!showResult) {
      setSelectedAnswer(option);
      const isCorrect = option === quizData[currentQuestion].correct_answer;
      setShowResult(true);
      if (isCorrect) {
        setScore(score + 1);
      }
      setAnswers([
        ...answers,
        {
          selected: option,
          correct: quizData[currentQuestion].correct_answer,
        },
      ]);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  };

  const handleBackToHome = () => {
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
    const percentage = Math.round((score / quizData.length) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center border-0 shadow-xl">
          <div className="mb-6">
            <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4">
              {percentage}%
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">{category} Quiz Complete!</h2>
            <p className="text-muted-foreground">
              You scored {score} out of {quizData.length} points
            </p>
          </div>

          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-4">
              {percentage >= 80
                ? "🎉 Excellent performance!"
                : percentage >= 60
                  ? "👍 Good job!"
                  : "💪 Keep practicing!"}
            </p>
          </div>

          <Button onClick={handleBackToHome} className="w-full" size="lg">
            Back to Home
          </Button>
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
          <button
            onClick={handleBackToHome}
            className="flex items-center gap-2 text-primary hover:text-secondary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-foreground">{category}</h1>
            <div className="text-right">
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                {score}/{quizData.length}
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

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(optionLetter)}
                  disabled={showResult}
                  className={cn(
                    "w-full p-4 text-left rounded-lg border-2 transition-all font-medium",
                    !showResult && "hover:border-primary cursor-pointer",
                    showResult && "cursor-default",
                    !isSelected && !showResult && "border-border hover:border-primary/50",
                    isSelected && !showResult && "border-primary bg-primary/5",
                    showResult && isCorrect && "border-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-200",
                    showResult && isWrong && "border-red-500 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-200",
                    showResult && !isSelected && !isCorrect && "border-border opacity-50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && isCorrect && <Check className="w-5 h-5 text-green-600 dark:text-green-400" />}
                    {showResult && isWrong && <X className="w-5 h-5 text-red-600 dark:text-red-400" />}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Result Message and Next Button */}
        {showResult && (
          <div className="space-y-4">
            <div
              className={cn(
                "p-4 rounded-lg text-center font-semibold",
                selectedAnswer === question.correct_answer
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                  : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
              )}
            >
              {selectedAnswer === question.correct_answer ? "✓ Correct!" : "✗ Incorrect!"}
            </div>
            <Button onClick={handleNext} className="w-full" size="lg">
              {currentQuestion === quizData.length - 1 ? "See Results" : "Next Question"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
