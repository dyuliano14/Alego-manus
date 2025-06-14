// src/App.tsx
import React, { useState } from "react";
import AppHome from "./pages/AppHome";
import Dashboard from "./pages/Dashboard";
import PDFViewer from "./components/PDFViewer";
import MarkdownEditor from "./components/MarkdownEditor";
import Flashcards from "./components/Flashcards";
import SimuladoArea from "./components/SimuladoArea";
import MeusConteudos from "./components/MeusConteudos";
//import MarkdownViewer from "./components/ui/MarkdownViewer";
import { ThemeProvider } from "./components/theme-provider";
import "./styles/index.css";
import "./styles/custom.css";

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
      case "flashcards":
        return <Flashcards />;
      case "conteudos":
        return <MeusConteudos />;
      case "simulado":
        return <SimuladoArea />;
  //    case "viewer":
    //    return <MarkdownViewer />;
      default:
        return <AppHome setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="alego-theme">
      <div className="flex min-h-screen flex-col">
        <header className="app-header">
          <div className="main-container text-center py-6">
            <h1 className="text-3xl font-bold">Plataforma de Estudos ALEGO</h1>
            <p className="text-muted-foreground mt-2">
              Seu assistente de estudos para o concurso da Assembleia
              Legislativa de Goiás
            </p>
            <div className="flex gap-4 justify-center mt-6 flex-wrap">
              <button
                onClick={() => setCurrentPage("home")}
                className={
                  currentPage === "home" ? "simple-btn" : "simple-btn-outline"
                }
              >
                Início
              </button>
              <button
                onClick={() => setCurrentPage("dashboard")}
                className={
                  currentPage === "dashboard"
                    ? "simple-btn"
                    : "simple-btn-outline"
                }
              >
                Dashboard
              </button>
            </div>
          </div>
        </header>

        <main className="main-container py-8">{renderCurrentPage()}</main>

        <footer className="bg-gray-100 dark:bg-gray-800 py-6 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center">
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
