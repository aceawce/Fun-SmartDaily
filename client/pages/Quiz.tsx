import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  correct_answer: string;
  difficulty: string;
}

interface Category {
  name: string;
  questions: Question[];
}

interface CategoryProgress {
  categoryName: string;
  totalPoints: number;
  questionsAttempted: number;
  completedQuestions: number;
}

export default function Quiz() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [points, setPoints] = useState(0);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);

  useEffect(() => {
    loadQuizData();
  }, [category]);

  useEffect(() => {
    if (quizData.length > 0 && category) {
      restoreProgress(category);
    }
  }, [quizData, category]);

  const loadQuizData = async () => {
    try {
      const response = await fetch("/quiz-data.json");
      const data = await response.json();

      const selectedCategory = data.categories.find(
        (cat: Category) =>
          cat.name.toLowerCase().replace(/\s+/g, "") ===
          category?.toLowerCase(),
      );

      if (selectedCategory) {
        setCategoryName(selectedCategory.name);
        setQuizData(selectedCategory.questions);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error loading quiz data:", error);
      setLoading(false);
    }
  };

  const restoreProgress = (categoryName: string) => {
    const saved = localStorage.getItem(`quiz_progress_${categoryName}`);
    if (saved) {
      const { questionIndex, totalPoints } = JSON.parse(saved);
      setCurrentQuestion(Math.min(questionIndex, quizData.length - 1));
      setPoints(totalPoints);
    }
  };

  const saveProgress = (questionIndex: number, newPoints: number) => {
    if (!category) return;
    localStorage.setItem(
      `quiz_progress_${category}`,
      JSON.stringify({
        questionIndex,
        totalPoints: newPoints,
        categoryName,
        timestamp: new Date().toISOString(),
      }),
    );
  };

  const saveCategoryStats = (
    categoryName: string,
    totalPoints: number,
    questionsAttempted: number,
    completedQuestions: number,
  ) => {
    const stats: CategoryProgress = {
      categoryName,
      totalPoints,
      questionsAttempted,
      completedQuestions,
    };
    localStorage.setItem(
      `category_stats_${category}`,
      JSON.stringify(stats),
    );
  };

  const handleAnswerSelect = (option: string) => {
    if (showResult || selectedAnswer) return;

    setSelectedAnswer(option);
    const isCorrect = option === quizData[currentQuestion].correct_answer;

    if (isCorrect) {
      setFeedbackMessage("correct");
      setShowResult(true);
      setPointsEarned(10);
      const newPoints = points + 10;
      setPoints(newPoints);
      saveProgress(currentQuestion, newPoints);

      setTimeout(() => {
        setShowCompletionModal(true);
      }, 500);
    } else {
      setFeedbackMessage("wrong");
      setShowResult(true);
    }
  };

  const handleNextQuestion = () => {
    setShowCompletionModal(false);
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setFeedbackMessage(null);
    } else {
      saveCategoryStats(
        categoryName,
        points + 10,
        quizData.length,
        quizData.length,
      );
      setFeedbackMessage("complete");
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleTryAgain = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setFeedbackMessage(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (quizData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 flex items-center justify-center p-4">
        <Card className="p-8 text-center border-0 bg-white shadow-xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Quiz not found
          </h2>
          <Button
            onClick={handleBackToHome}
            className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white"
          >
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  if (feedbackMessage === "complete") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 flex items-center justify-center p-4">
        <div className="text-center max-w-2xl w-full animate-in fade-in zoom-in duration-500">
          <div className="bg-white rounded-3xl shadow-2xl p-12">
            <div className="text-8xl mb-6 drop-shadow-lg">🏆</div>
            <h2 className="text-5xl font-black text-slate-900 mb-4">
              Congratulations!
            </h2>
            <p className="text-2xl text-yellow-700 font-bold mb-8">
              You've completed all questions!
            </p>
            <div className="bg-gradient-to-r from-yellow-100 to-amber-100 rounded-2xl p-8 mb-8">
              <p className="text-slate-600 text-lg mb-2">Total Points Earned</p>
              <p className="text-6xl font-black bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                {points}
              </p>
            </div>
            <Button
              onClick={handleBackToHome}
              className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-bold py-4 rounded-lg text-lg"
              size="lg"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Completion Modal
  if (showCompletionModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 flex items-center justify-center p-4">
        <div className="text-center max-w-2xl w-full animate-in fade-in zoom-in duration-500">
          <div className="bg-white rounded-3xl shadow-2xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-100/20 to-amber-100/20"></div>
            <div className="relative z-10">
              <div className="text-9xl mb-6 drop-shadow-lg animate-bounce">
                🏆
              </div>
              <h2 className="text-5xl font-black text-slate-900 mb-4">
                Well Done!
              </h2>
              <p className="text-2xl text-yellow-700 font-bold mb-2">
                You completed this question successfully.
              </p>
              <div className="bg-gradient-to-r from-yellow-100 to-amber-100 rounded-2xl p-8 mb-8 my-8">
                <p className="text-slate-600 text-lg mb-2">Points Earned</p>
                <p className="text-7xl font-black bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                  +{pointsEarned}
                </p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4 mb-8">
                <p className="text-sm text-slate-600">
                  Question {currentQuestion + 1} of {quizData.length}
                </p>
              </div>
              <Button
                onClick={handleNextQuestion}
                className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-bold py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105"
                size="lg"
              >
                {currentQuestion === quizData.length - 1
                  ? "See Results"
                  : "Next Question"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / quizData.length) * 100;
  const current = quizData[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 p-4 transition-all duration-300">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToHome}
            className="text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-black bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
            {categoryName}
          </h1>
          <Badge className="bg-gradient-to-r from-yellow-200 to-amber-200 text-yellow-800 text-base px-4 py-2 border-0">
            {current.difficulty}
          </Badge>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-slate-700 font-semibold mb-3">
            <span>Question {currentQuestion + 1}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress
            value={progress}
            className="h-3 rounded-full overflow-hidden"
          />
        </div>

        {/* Points Card */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-yellow-50 to-amber-50 border-0 shadow-lg">
          <p className="text-sm text-slate-600 font-semibold">Total Points</p>
          <p className="text-4xl font-black bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
            {points}
          </p>
        </Card>

        {/* Question */}
        <Card className="p-8 mb-8 border-0 shadow-lg bg-white animate-in fade-in slide-in-from-bottom-4 duration-300">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">
            {current.question}
          </h2>

          {/* Options */}
          <div className="space-y-4">
            {current.options.map((option, index) => {
              const letter = String.fromCharCode(65 + index);
              const isSelected = selectedAnswer === option;
              const isCorrect = option === current.correct_answer;

              let bgColor =
                "bg-white hover:bg-yellow-50 border-slate-200 hover:border-yellow-300";
              if (showResult && isCorrect) {
                bgColor =
                  "bg-green-50 border-green-300 shadow-lg shadow-green-100";
              } else if (showResult && isSelected && !isCorrect) {
                bgColor = "bg-red-50 border-red-300 shadow-lg shadow-red-100";
              } else if (isSelected && !showResult) {
                bgColor =
                  "bg-yellow-50 border-yellow-300 shadow-lg shadow-yellow-100";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showResult || selectedAnswer !== null}
                  className={`w-full p-5 text-left rounded-xl border-2 transition-all duration-200 transform hover:scale-102 ${bgColor} ${
                    showResult || selectedAnswer !== null
                      ? "cursor-default"
                      : "cursor-pointer"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="font-bold text-yellow-600 min-w-max text-lg">
                      {letter}.
                    </span>
                    <span className="text-slate-900 text-lg">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Feedback */}
        {feedbackMessage === "correct" && (
          <div className="flex justify-center mb-6 animate-in fade-in duration-300">
            <div className="text-center">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
              <p className="text-green-600 font-semibold mt-3">
                Preparing celebration...
              </p>
            </div>
          </div>
        )}

        {feedbackMessage === "wrong" && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="p-6 rounded-xl text-center font-bold text-xl bg-red-50 border-2 border-red-200 text-red-700 shadow-lg">
              Try again ❌
            </div>
            <Button
              onClick={handleTryAgain}
              className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-bold py-3 rounded-lg transition-all duration-300"
              size="lg"
            >
              Try Another Answer
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
