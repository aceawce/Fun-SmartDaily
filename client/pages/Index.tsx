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
    iconGradient: "from-amber-600 to-yellow-500",
    count: 200,
  },
  {
    id: "History",
    name: "History",
    description: "Explore historical events, famous figures, civilizations, and discoveries.",
    icon: BookOpen,
    iconGradient: "from-amber-700 to-amber-600",
    count: 200,
  },
  {
    id: "General Knowledge",
    name: "General Knowledge",
    description: "Fun facts, inventions, and diverse trivia from across the world.",
    icon: Lightbulb,
    iconGradient: "from-yellow-600 to-amber-500",
    count: 200,
  },
  {
    id: "Sports",
    name: "Sports",
    description: "Team and individual sports, Olympics, and famous athletes.",
    icon: Trophy,
    iconGradient: "from-amber-600 to-yellow-600",
    count: 200,
  },
  {
    id: "Science and Natural Sciences",
    name: "Science & Nature",
    description: "Physics, chemistry, biology, space, and technology.",
    icon: Microscope,
    iconGradient: "from-amber-700 to-yellow-600",
    count: 200,
  },
  {
    id: "Logic and Puzzles",
    name: "Logic & Puzzles",
    description: "Brain teasers, math puzzles, and logic problems.",
    icon: Brain,
    iconGradient: "from-yellow-600 to-amber-600",
    count: 200,
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-luxurious-gradient" style={{backgroundColor: "hsl(39, 100%, 96%)"}}>
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md border-b-2 border-primary/30" style={{backgroundColor: "hsl(39, 100%, 94%)"}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">✨</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Fun & Smart Daily</h1>
              <p className="text-xs text-muted-foreground">Master Your Knowledge</p>
            </div>
          </div>
          <div className="text-sm font-semibold text-foreground bg-white/40 px-4 py-2 rounded-full">
            6 Categories • 1,200 Questions
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
            Elevate Your <span className="text-primary font-black">Knowledge</span>
          </h2>
          <p className="text-lg sm:text-xl text-foreground/80 max-w-3xl mx-auto mb-8 font-medium">
            Discover a world of learning with our premium quiz experience. Over 1,200 carefully crafted questions across 6 fascinating categories, designed to challenge and inspire you daily.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.id} to={`/quiz/${category.id}`}>
                <Card className="group h-full p-0 overflow-hidden border-2 border-primary/30 shadow-xl hover:shadow-2xl hover:border-primary/60 transition-all duration-300 hover:scale-105 cursor-pointer bg-card-gradient backdrop-blur">
                  {/* Icon Background */}
                  <div className={`h-24 bg-gradient-to-br ${category.iconGradient} opacity-15 group-hover:opacity-25 transition-opacity`}></div>

                  {/* Content */}
                  <div className="relative p-6 -mt-12">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.iconGradient} flex items-center justify-center mb-4 text-white shadow-xl transform group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8" />
                    </div>

                    <h3 className="text-2xl font-bold text-foreground mb-2">{category.name}</h3>
                    <p className="text-sm text-foreground/70 mb-6 line-clamp-2 font-medium">{category.description}</p>

                    <div className="flex items-center justify-between pt-4 border-t border-primary/20">
                      <span className="text-sm font-bold text-primary">{category.count} Questions</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="group/btn text-primary hover:text-primary/80 hover:bg-primary/10 font-bold"
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
        <div className="bg-card-gradient border-2 border-primary/30 rounded-2xl p-10 sm:p-16 text-center shadow-xl">
          <h3 className="text-2xl font-bold text-foreground mb-8">Why Choose Us?</h3>
          <div className="grid grid-cols-3 gap-8">
            <div>
              <div className="text-4xl sm:text-5xl font-black text-primary mb-3">6</div>
              <p className="text-sm sm:text-base font-bold text-foreground">Diverse Categories</p>
              <p className="text-xs text-foreground/70 mt-1">Explore every interest</p>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-black text-primary mb-3">1,200</div>
              <p className="text-sm sm:text-base font-bold text-foreground">Premium Questions</p>
              <p className="text-xs text-foreground/70 mt-1">Carefully curated</p>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-black text-primary mb-3">∞</div>
              <p className="text-sm sm:text-base font-bold text-foreground">Learning</p>
              <p className="text-xs text-foreground/70 mt-1">Always improving</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-primary/30 mt-20 py-12 backdrop-blur" style={{backgroundColor: "hsl(39, 100%, 94%)"}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-foreground/80 font-semibold mb-2">© 2024 Fun & Smart Daily</p>
          <p className="text-sm text-foreground/60">Premium Learning Experience • Master Your Knowledge</p>
        </div>
      </footer>
    </div>
  );
}
