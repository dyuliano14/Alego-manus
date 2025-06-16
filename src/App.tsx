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
import { Button } from "./components/ui/button"; // Importar Button do ui

import "./styles/index.css";
import "./styles/custom.css";


const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState("home");

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        // Dashboard precisará de suas próprias classes de layout se não for full width
        return <Dashboard />;
      case "markdown":
        return <MarkdownEditor />;
      case "pdf":
        return <PDFViewer />;
      case "cursos":
        return <Cursos />; // Cursos vai lidar com seu próprio layout full width
      case "flashcards":
        return <Flashcards />;
      case "conteudos":
        // MeusConteudos também vai ter seu próprio layout, talvez centralizado
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
      <div className="flex min-h-screen flex-col">
        <header className="app-header">
          <div className="main-container text-center py-6">
            <h1 className="text-3xl font-bold">Plataforma de Estudos ALEGO</h1>
            <p className="text-muted-foreground mt-2">
              Seu assistente de estudos para o concurso da Assembleia
              Legislativa de Goiás
            </p>
            <div className="flex gap-4 justify-center mt-6 flex-wrap">
              {/* Usando o componente Button do Shadcn UI */}
              <Button
                onClick={() => setCurrentPage("home")}
                variant={currentPage === "home" ? "default" : "outline"}
              >
                Início
              </Button>

              <Button
                onClick={() => setCurrentPage("dashboard")}
                variant={currentPage === "dashboard" ? "default" : "outline"}
              >
                Dashboard
              </Button>

              <Button
                onClick={() => setCurrentPage("cursos")}
                variant={currentPage === "cursos" ? "default" : "outline"}
              >
                Cursos
              </Button>
            </div>
          </div>
        </header>

        {/* Removido "main-container" da tag <main> para permitir layout full width nos componentes de página */}
       <main className="py-8 flex-1"> {/* Removido 'main-container' e adicionado 'flex-1' */}
          {" "}
          {/* Adicionado flex-1 para que main ocupe o espaço restante */}
          {renderCurrentPage()}
        </main>

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
