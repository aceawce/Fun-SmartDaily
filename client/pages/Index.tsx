import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const categories = [
  {
    id: "geography",
    name: "Geography",
    icon: "🌍",
    desc: "Explore world capitals, landmarks, and more",
  },
  {
    id: "science",
    name: "Science",
    icon: "🔬",
    desc: "Test your scientific knowledge",
  },
  {
    id: "history",
    name: "History",
    icon: "📚",
    desc: "Journey through historical events",
  },
  {
    id: "logic",
    name: "Logic & Math",
    icon: "🧮",
    desc: "Challenge your reasoning skills",
  },
];

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-10 h-10 text-yellow-600 animate-pulse" />
            <h1 className="text-6xl font-black bg-gradient-to-r from-yellow-600 via-amber-500 to-orange-600 bg-clip-text text-transparent">
              Quiz Master
            </h1>
            <Sparkles className="w-10 h-10 text-yellow-600 animate-pulse" />
          </div>
          <p className="text-2xl text-yellow-900 font-semibold mb-2">
            Enhance Fun & Smart Daily
          </p>
          <p className="text-lg text-yellow-800">
            Test your knowledge across multiple categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => navigate(`/quiz/${category.id}`)}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 p-8 h-full flex flex-col justify-between"
              >
                <div>
                  <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">
                    {category.name}
                  </h2>
                  <p className="text-slate-600 text-lg">
                    {category.desc}
                  </p>
                </div>
                <Button
                  onClick={() => navigate(`/quiz/${category.id}`)}
                  className="mt-6 w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-bold py-3 rounded-lg transition-all duration-300"
                  size="lg"
                >
                  Start Quiz
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl p-12 mb-8">
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-black bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent">
                100+
              </div>
              <p className="text-slate-600 text-lg font-semibold mt-2">Questions</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent">
                4
              </div>
              <p className="text-slate-600 text-lg font-semibold mt-2">Categories</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent">
                10 pts
              </div>
              <p className="text-slate-600 text-lg font-semibold mt-2">Per Correct</p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-xl p-12">
          <h3 className="text-3xl font-bold text-slate-900 mb-8 text-center">
            Why Quiz Master?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <div className="text-4xl">✨</div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">
                  Smooth Experience
                </h4>
                <p className="text-slate-600">
                  No page reloads, seamless transitions between questions
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-4xl">💾</div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">
                  Auto-Save Progress
                </h4>
                <p className="text-slate-600">
                  Resume from where you left off automatically
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-4xl">🏆</div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">
                  Earn Points
                </h4>
                <p className="text-slate-600">
                  Get 10 points for each correct answer
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="text-4xl">🎯</div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">
                  Track Progress
                </h4>
                <p className="text-slate-600">
                  See your scores and progress per category
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
