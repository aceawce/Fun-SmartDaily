import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, BookOpen, Lightbulb, Trophy, Microscope, Brain } from "lucide-react";

const categories = [
  {
    id: "Geography",
    name: "Geography",
    description: "Test your knowledge about capitals, countries, maps, rivers, and mountains.",
    icon: Globe,
    gradient: "from-blue-500 to-cyan-500",
    count: 200,
  },
  {
    id: "History",
    name: "History",
    description: "Explore historical events, famous figures, civilizations, and discoveries.",
    icon: BookOpen,
    gradient: "from-amber-500 to-orange-500",
    count: 200,
  },
  {
    id: "General Knowledge",
    name: "General Knowledge",
    description: "Fun facts, inventions, and diverse trivia from across the world.",
    icon: Lightbulb,
    gradient: "from-yellow-500 to-amber-500",
    count: 200,
  },
  {
    id: "Sports",
    name: "Sports",
    description: "Team and individual sports, Olympics, and famous athletes.",
    icon: Trophy,
    gradient: "from-green-500 to-emerald-500",
    count: 200,
  },
  {
    id: "Science and Natural Sciences",
    name: "Science & Nature",
    description: "Physics, chemistry, biology, space, and technology.",
    icon: Microscope,
    gradient: "from-purple-500 to-pink-500",
    count: 200,
  },
  {
    id: "Logic and Puzzles",
    name: "Logic & Puzzles",
    description: "Brain teasers, math puzzles, and logic problems.",
    icon: Brain,
    gradient: "from-indigo-500 to-purple-500",
    count: 200,
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-sm bg-background/80 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-bold text-lg">Q</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">QuizMaster</h1>
          </div>
          <div className="text-sm text-muted-foreground">6 Categories • 1,200 Questions</div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
            Challenge Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Knowledge</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Master over 1,200 carefully curated questions across 6 fascinating categories. Learn, compete, and improve your skills today.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.id} to={`/quiz/${category.id}`}>
                <Card className="group h-full p-0 overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer bg-card">
                  {/* Gradient Background */}
                  <div className={`h-32 bg-gradient-to-br ${category.gradient} opacity-10 group-hover:opacity-20 transition-opacity`}></div>

                  {/* Content */}
                  <div className="relative p-6 -mt-16">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.gradient} flex items-center justify-center mb-4 text-white shadow-lg`}>
                      <Icon className="w-7 h-7" />
                    </div>

                    <h3 className="text-xl font-bold text-foreground mb-2">{category.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{category.description}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-primary">{category.count} Questions</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="group/btn text-primary hover:text-secondary hover:bg-transparent"
                        onClick={(e) => {
                          e.preventDefault();
                          // Navigation happens through Link
                        }}
                      >
                        Start Quiz →
                      </Button>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="bg-card border border-border/50 rounded-xl p-8 sm:p-12 text-center shadow-lg">
          <div className="grid grid-cols-3 gap-8">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-2">6</div>
              <p className="text-sm text-muted-foreground">Categories</p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-2">1,200</div>
              <p className="text-sm text-muted-foreground">Questions</p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-2">∞</div>
              <p className="text-sm text-muted-foreground">Learning</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-20 py-8 bg-background/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p>© 2024 QuizMaster. Powered by knowledge. Built with passion.</p>
        </div>
      </footer>
    </div>
  );
}
