import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const categories = [
  { id: "geography", name: "Geography", icon: "🌍", color: "from-blue-500 to-cyan-500" },
  { id: "science", name: "Science", icon: "🔬", color: "from-green-500 to-emerald-500" },
  { id: "history", name: "History", icon: "📚", color: "from-purple-500 to-pink-500" },
  { id: "logic", name: "Logic & Math", icon: "🧮", color: "from-yellow-500 to-orange-500" },
];

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-amber-600" />
            <h1 className="text-5xl font-black text-slate-900">Quiz Master</h1>
            <Sparkles className="w-8 h-8 text-amber-600" />
          </div>
          <p className="text-xl text-slate-600">Challenge yourself with exciting quizzes</p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => (
            <Card
              key={category.id}
              className="p-6 hover:shadow-lg transition-shadow cursor-pointer overflow-hidden border-0"
              onClick={() => navigate(`/quiz/${category.id}`)}
            >
              <div className={`bg-gradient-to-br ${category.color} rounded-lg p-8 mb-4 text-center`}>
                <div className="text-5xl mb-2">{category.icon}</div>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{category.name}</h2>
              <p className="text-slate-600 mb-4">Test your knowledge</p>
              <Button className="w-full bg-amber-600 hover:bg-amber-700">
                Start Quiz
              </Button>
            </Card>
          ))}
        </div>

        {/* Footer Stats */}
        <div className="mt-12 text-center">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-3xl font-bold text-amber-600">100+</div>
              <div className="text-slate-600">Questions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-600">4</div>
              <div className="text-slate-600">Categories</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-600">10 pts</div>
              <div className="text-slate-600">Per Correct</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
