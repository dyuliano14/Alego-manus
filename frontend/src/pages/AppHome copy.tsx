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
    <div className="flex flex-wrap justify-center gap-8 py-10">
      {sections.map((section) => (
        <div
          key={section.page}
          className="border rounded-md px-6 py-5 shadow bg-white text-center min-w-[200px] transition hover:shadow-md"
        >
          <h3 className="text-xl font-bold mb-4">{section.title}</h3>
          <button
            className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800 text-sm w-auto"
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
