import React from "react";

interface HeaderProps {
  currentPage: string;
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => {
  const links = [
    { label: "Início", page: "home" },
    { label: "Dashboard", page: "dashboard" },
    { label: "Cursos", page: "cursos" },
  ];

  return (
    <header className="bg-white shadow-md py-4 sticky top-0 z-10">
      <div className="main-container text-center">
        <h1 className="text-2xl font-bold">Plataforma de Estudos ALEGO</h1>
        <p className="text-muted-foreground text-sm mb-4">
          Seu assistente de estudos para o concurso da Assembleia Legislativa de Goiás
        </p>
        <div className="flex justify-center flex-wrap gap-4">
          {links.map(({ label, page }) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={currentPage === page ? "simple-btn" : "simple-btn-outline"}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
