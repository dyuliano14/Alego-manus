// src/App.tsx
import React, { useState } from "react";
import AppHome from "./pages/AppHome";
import Dashboard from "./pages/Dashboard";
import PDFViewer from "./components/PDFViewer";
import MarkdownEditor from "./components/MarkdownEditor";
import Flashcards from "./components/Flashcards";
import SimuladoArea from "./components/SimuladoArea";
import MeusConteudos from "./components/MeusConteudos";
import MarkdownViewer from "./components/ui/MarkdownViewer";
import Cursos from "./components/Cursos";
import { ThemeProvider } from "./components/theme-provider";
import { Button } from "./components/ui/button"; // Importe o componente Button do Shadcn UI
import "./styles/index.css"; // Esta linha importa o Tailwind e o custom.css (via index.css)
// REMOVA OU COMENTE esta linha se ela ainda estiver aqui:
// import "./styles/custom.css"; // <-- REMOVA OU COMENTE esta linha!

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState("home");

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "markdown":
        return <MarkdownEditor />;
      case "pdf":
        return <PDFViewer />;
      case "cursos":
        return <Cursos />;
      case "flashcards":
        return <Flashcards />;
      case "conteudos":
        return <MeusConteudos />;
      case "simulado":
        return <SimuladoArea />;
      case "viewer":
        return <MarkdownViewer />;
      default:
        return <AppHome setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="alego-theme">
      {/* Contêiner principal que envolve TUDO para controlar o layout geral */}
      <div className="relative min-h-screen flex flex-col">
        {/* HEADER FIXO: Fora do fluxo normal, ocupa 100% da largura da viewport */}
        <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg">
          {/* Conteúdo do Header: Centralizado e com largura limitada DENTRO do header fixo */}
          <div className="max-w-7xl mx-auto px-4 py-6 text-center">
            <h1 className="text-3xl font-bold">Plataforma de Estudos ALEGO</h1>
            <p className="text-white/80 mt-2">
              Acompanhe seu progresso e organize seus materiais.
            </p>
            <div className="flex gap-4 justify-center mt-6 flex-wrap">
              {/* BOTÕES DO MENU HEADER: Usando o componente Button do Shadcn UI com estilos corretos */}
              <Button
                onClick={() => setCurrentPage("home")}
                variant={currentPage === "home" ? "default" : "outline"}
                className={
                  currentPage === "home"
                    ? "bg-white text-blue-800 hover:bg-gray-100"
                    : "border-white text-white hover:bg-white hover:text-blue-800"
                }
              >
                Início
              </Button>
              <Button
                onClick={() => setCurrentPage("dashboard")}
                variant={currentPage === "dashboard" ? "default" : "outline"}
                className={
                  currentPage === "dashboard"
                    ? "bg-white text-blue-800 hover:bg-gray-100"
                    : "border-white text-white hover:bg-white hover:text-blue-800"
                }
              >
                Dashboard
              </Button>
              <Button
                onClick={() => setCurrentPage("cursos")}
                variant={currentPage === "cursos" ? "default" : "outline"}
                className={
                  currentPage === "cursos"
                    ? "bg-white text-blue-800 hover:bg-gray-100"
                    : "border-white text-white hover:bg-white hover:text-blue-800"
                }
              >
                Cursos
              </Button>
            </div>
          </div>
        </header>
        {/* CONTEÚDO PRINCIPAL (MAIN E FOOTER): Empurrado para baixo pelo padding-top */}
        {/* O padding-top deve ser igual ou ligeiramente maior que a altura do header fixo */}
        {/* Use uma div para encapsular a main e o footer e aplicar o padding */}
        <div className="flex-1 pt-80 flex flex-col">
          {" "}
          {/* pt-80 (320px) para compensar a altura do header */}
          <div className="max-w-7xl mx-auto px-4 flex-1 flex flex-col w-full">
            {/* MAIN: Ocupa o restante do espaço vertical disponível. Sem estilos inline aqui! */}
            <main className="py-8 flex-1 w-full">
              {renderCurrentPage()}
            </main>
            {/* FOOTER: Fica na parte inferior do contêiner principal. */}
            <footer className="bg-gray-100 dark:bg-gray-800 py-6 mt-auto">
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  Plataforma de Estudos ALEGO — Desenvolvido para auxiliar na
                  preparação para o concurso da ALEGO
                </p>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;