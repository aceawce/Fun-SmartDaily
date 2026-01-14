import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy } from "lucide-react";

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

  useEffect(() => {
    loadQuizData();
    restoreProgress(category || "");
  }, [category]);

  const loadQuizData = async () => {
    try {
      const response = await fetch("/quiz-data.json");
      const data = await response.json();

      const selectedCategory = data.find(
        (cat: Category) => cat.name.toLowerCase().replace(/\s+/g, "") === category?.toLowerCase()
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
    const saved = localStorage.getItem(`quiz_${categoryName}`);
    if (saved) {
      const { questionIndex, currentPoints } = JSON.parse(saved);
      setCurrentQuestion(questionIndex);
      setPoints(currentPoints);
    }
  };

  const saveProgress = (questionIndex: number, newPoints: number) => {
    localStorage.setItem(
      `quiz_${category}`,
      JSON.stringify({ questionIndex, currentPoints: newPoints })
    );
  };

  const handleAnswerSelect = (option: string) => {
    if (showResult || selectedAnswer) return;

    setSelectedAnswer(option);
    const isCorrect = option === quizData[currentQuestion].correct_answer;

    if (isCorrect) {
      setFeedbackMessage("correct");
      setShowResult(true);
      const newPoints = points + 10;
      setPoints(newPoints);
      saveProgress(currentQuestion, newPoints);

      setTimeout(() => {
        handleNextQuestion();
      }, 1500);
    } else {
      setFeedbackMessage("wrong");
      setShowResult(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setFeedbackMessage(null);
    } else {
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
      <div className="min-h-screen bg-gradient-to-br from-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (quizData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-slate-50 flex items-center justify-center p-4">
        <Card className="p-8 text-center border-0">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Quiz not found</h2>
          <Button onClick={handleBackToHome} className="bg-amber-600 hover:bg-amber-700">
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  if (feedbackMessage === "complete") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-slate-50 flex items-center justify-center p-4">
        <Card className="p-8 text-center border-0 max-w-md">
          <div className="mb-6">
            <Trophy className="w-16 h-16 text-amber-600 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-slate-900 mb-2">
              Completed ✅
            </h2>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 mb-6">
            <p className="text-slate-600 text-sm mb-2">Total Points:</p>
            <p className="text-4xl font-bold text-amber-600">{points}</p>
          </div>
          <Button
            onClick={handleBackToHome}
            className="w-full bg-amber-600 hover:bg-amber-700"
            size="lg"
          >
            Back to Home
          </Button>
        </Card>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / quizData.length) * 100;
  const current = quizData[currentQuestion];
  const answerLetter = selectedAnswer
    ? String.fromCharCode(65 + current.options.indexOf(selectedAnswer))
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToHome}
            className="text-slate-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900">{categoryName}</h1>
          <Badge className="bg-amber-100 text-amber-800 text-base px-3 py-1">
            {current.difficulty}
          </Badge>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>Question {currentQuestion + 1}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Points Card */}
        <Card className="p-4 mb-6 bg-amber-50 border-0">
          <p className="text-sm text-slate-600">Total Points</p>
          <p className="text-2xl font-bold text-amber-600">{points}</p>
        </Card>

        {/* Question */}
        <Card className="p-6 mb-6 border-0">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">{current.question}</h2>

          {/* Options */}
          <div className="space-y-3">
            {current.options.map((option, index) => {
              const letter = String.fromCharCode(65 + index);
              const isSelected = selectedAnswer === option;
              const isCorrect = option === current.correct_answer;

              let bgColor = "bg-white hover:bg-slate-50";
              if (showResult && isCorrect) {
                bgColor = "bg-green-100 border-green-300";
              } else if (showResult && isSelected && !isCorrect) {
                bgColor = "bg-red-100 border-red-300";
              } else if (isSelected && !showResult) {
                bgColor = "bg-amber-100 border-amber-300";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showResult || selectedAnswer !== null}
                  className={`w-full p-4 text-left rounded-lg border-2 border-slate-200 transition-all ${bgColor}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="font-bold text-slate-900 min-w-max">{letter}.</span>
                    <span className="text-slate-900">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Feedback */}
        {feedbackMessage === "correct" && (
          <div className="flex justify-center mb-6">
            <div className="text-center">
              <div className="inline-block">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
              <p className="text-green-600 font-semibold mt-2">
                Moving to next question...
              </p>
            </div>
          </div>
        )}

        {feedbackMessage === "wrong" && (
          <div className="space-y-4">
            <div className="p-4 rounded-lg text-center font-semibold text-lg bg-red-100 text-red-700">
              Try again ❌
            </div>
            <Button
              onClick={handleTryAgain}
              className="w-full bg-amber-600 hover:bg-amber-700"
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
