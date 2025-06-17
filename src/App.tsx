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
import { Button } from "./components/ui/button";
import "./styles/index.css";

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
      <div className="flex min-h-screen flex-col max-w-7xl mx-auto px-4">
        <header className="app-header">
          <div className="text-center py-6">
            {/* Ajustado para não ter 'main-container' */}
            <h1 className="text-3xl font-bold">Plataforma de Estudos ALEGO</h1>
            <p className="text-muted-foreground mt-2">...</p>
            <div className="flex gap-4 justify-center mt-6 flex-wrap"></div>
            <Button
              onClick={() => setCurrentPage("home")}
              variant={currentPage === "home" ? "default" : "outline"} // Use variants do Shadcn
              className="px-4 py-2" // Adicione padding se o default não for suficiente
            >
              Início
            </Button>
            <Button
              onClick={() => setCurrentPage("dashboard")}
              variant={currentPage === "dashboard" ? "default" : "outline"}
              className="px-4 py-2"
            >
              Dashboard
            </Button>
            <Button
              onClick={() => setCurrentPage("cursos")}
              variant={currentPage === "cursos" ? "default" : "outline"}
              className="px-4 py-2"
            >
              Cursos
            </Button>
          </div>
        </header>
        <div className="flex flex-1">
          <h2 className="text-xl font-bold mb-4">Menu</h2>
          <ul className="space-y-2">
            <li>
              <Button
                variant={currentPage === "home" ? "default" : "ghost"}
                className="w-full text-left"
                onClick={() => setCurrentPage("home")}
              >
                Início
              </Button>
            </li>
            <li>
              <Button
                variant={currentPage === "dashboard" ? "default" : "ghost"}
                className="w-full text-left"
                onClick={() => setCurrentPage("dashboard")}
              >
                Dashboard
              </Button>
            </li>
            <li>
              <Button
                variant={currentPage === "cursos" ? "default" : "ghost"}
                className="w-full text-left"
                onClick={() => setCurrentPage("cursos")}
              >
                Cursos
              </Button>
            </li>
            <li>
              <Button
                variant={currentPage === "flashcards" ? "default" : "ghost"}
                className="w-full text-left"
                onClick={() => setCurrentPage("flashcards")}
              >
                Flashcards
              </Button>
            </li>
            <li>
              <Button
                variant={currentPage === "simulado" ? "default" : "ghost"}
                className="w-full text-left"
                onClick={() => setCurrentPage("simulado")}
              >
                Simulados
              </Button>
            </li>
            <li>
              <Button
                variant={currentPage === "conteudos" ? "default" : "ghost"}
                className="w-full text-left"
                onClick={() => setCurrentPage("conteudos")}
              >
                Meus Conteúdos
              </Button>
            </li>
            <li>
              <Button
                variant={currentPage === "markdown" ? "default" : "ghost"}
                className="w-full text-left"
                onClick={() => setCurrentPage("markdown")}
              >
                Editor de Resumos
              </Button>
            </li>
            <li>
              <Button
                variant={currentPage === "pdf" ? "default" : "ghost"}
                className="w-full text-left"
                onClick={() => setCurrentPage("pdf")}
              >
                Biblioteca PDF
              </Button>
            </li>
          </ul>

          <div className="container mx-auto">{renderCurrentPage()}</div>
        </div>

        <footer className="bg-gray-100 dark:bg-gray-800 py-6 mt-auto">
          <div className="text-center">
            {" "}
            {/* Removido max-w-7xl mx-auto px-4, pois o PAI já tem */}
            <p className="text-gray-600 dark:text-gray-400">
              Plataforma de Estudos ALEGO — Desenvolvido para auxiliar na
              preparação para o concurso da ALEGO
            </p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default App;
