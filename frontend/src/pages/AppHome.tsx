// src/pages/AppHome.tsx
import React from "react";
import { Button } from "../components/ui/button";

interface AppHomeProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

const sections = [
  { title: "Dashboard", page: "dashboard", emoji: "📊", color: "bg-blue-100" },
  { title: "Cursos", page: "cursos", emoji: "🎓", color: "bg-green-100" },
  { title: "Flashcards", page: "flashcards", emoji: "🃏", color: "bg-yellow-100" },
  { title: "Simulados", page: "simulado", emoji: "📝", color: "bg-purple-100" },
  { title: "Resumos", page: "markdown", emoji: "📚", color: "bg-indigo-100" },
  { title: "PDFs", page: "pdf", emoji: "📄", color: "bg-red-100" },
];

const AppHome: React.FC<AppHomeProps> = ({ setCurrentPage }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
    {sections.map(({ title, page, emoji, color }) => (
      <div
        key={page}
        className={`rounded-xl ${color} shadow-md hover:shadow-lg transition duration-200 border border-transparent hover:border-gray-200 flex flex-col justify-between p-6`}
      >
        <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <span>{emoji}</span> {title}
        </h3>
        <Button className="simple-btn mt-4 mb-4" onClick={() => setCurrentPage(page)}>
          Acessar {title}
        </Button>
      </div>
    ))}
  </div>
);

export default AppHome;
