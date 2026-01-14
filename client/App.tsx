import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Quiz from "./pages/Quiz";
import "./global.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/quiz/:category" element={<Quiz />} />
        <Route path="*" element={<Index />} />
      </Routes>
    </Router>
  );
}
