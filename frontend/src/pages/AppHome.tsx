// src/pages/AppHome.tsx
import React from "react";

interface AppHomeProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

const AppHome: React.FC<AppHomeProps> = ({ setCurrentPage }) => {
  const sections = [
    { title: "Dashboard", page: "dashboard" },
    { title: "Cursos", page: "cursos" },
    { title: "Flashcards", page: "flashcards" },
    { title: "Simulados", page: "simulado" },
    { title: "Resumos", page: "markdown" },
    { title: "PDFs", page: "pdf" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-10">
      {sections.map((section) => (
        <div
          key={section.page}
          className="rounded-lg border p-6 shadow hover:shadow-md transition"
        >
          <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
          <button
            className="simple-btn"
            onClick={() => setCurrentPage(section.page)}
          >
            Acessar {section.title}
          </button>
        </div>
      ))}
    </div>
  );
};

export default AppHome;
