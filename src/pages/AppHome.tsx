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
      title: "Meus Conteúdos",
      desc: "Pratique explicar conceitos de forma simples.",
      page: "conteudos",
    },
    {
      title: "Simulados",
      desc: "Teste seus conhecimentos com questões.",
      page: "simulado",
    },
    {
      title: "CursosArea",
      desc: "Acesse todos os cursos.",
      page: "cursosarea",
    },

    {
      title: "Cursos",
      desc: "Acesse todos os cursos.",
      page: "cursos",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {sections.map((sec) => (
        <div
          key={sec.page}
          className="bg-card p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold mb-2">{sec.title}</h2>
          <p className="text-sm text-muted-foreground mb-4">{sec.desc}</p>
          <button
            className="simple-btn"
            onClick={() => setCurrentPage(sec.page)}
          >
            Acessar
          </button>
        </div>
      ))}
    </div>
  );
};

export default AppHome;
