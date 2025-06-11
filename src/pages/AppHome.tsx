// src/pages/AppHome.tsx
import React from "react";

interface AppHomeProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

const AppHome: React.FC<AppHomeProps> = ({ setCurrentPage }) => {
  const sections = [
    {
      title: "Plano de Estudos Semanal",
      desc: "Visualize sua rotina semanal de estudos.",
      page: "dashboard",
    },
    {
      title: "Resumos em Markdown",
      desc: "Crie, edite e visualize resumos.",
      page: "markdown",
    },
    {
      title: "Biblioteca de PDFs",
      desc: "Acesse documentos oficiais e materiais.",
      page: "pdf",
    },
    {
      title: "Flashcards",
      desc: "Estude com revisão espaçada.",
      page: "flashcards",
    },
    {
      title: "Espaço Feynman",
      desc: "Pratique explicar conceitos de forma simples.",
      page: "feynman",
    },
    {
      title: "Simulados",
      desc: "Teste seus conhecimentos com questões.",
      page: "simulado",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-10 px-4">
      {sections.map((section) => (
        <div
          key={section.page}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all p-6 flex flex-col justify-between"
        >
          <div>
            <h2 className="text-xl font-semibold mb-2 text-primary">
              {section.title}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">{section.desc}</p>
          </div>
          <button
            className="simple-btn mt-auto"
            onClick={() => setCurrentPage(section.page)}
          >
            Acessar
          </button>
        </div>
      ))}
    </div>
  );
};

export default AppHome;
