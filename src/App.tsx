// src/App.tsx
import React, { useState } from "react";
import AppHome from "./pages/AppHome";
import Dashboard from "./pages/Dashboard";
// ... outros imports que você já tem (PDFViewer, MarkdownEditor, etc.)
import Cursos from "./components/Cursos";
import { ThemeProvider } from "./components/theme-provider";
import { Button } from "./components/ui/button"; // Importe o componente Button do Shadcn UI
import "./styles/index.css";
// REMOVA OU COMENTE esta linha se ela ainda estiver aqui: import "./styles/custom.css";
// Pois o index.css já importa o custom.css, e manter esta linha pode causar duplicidade.

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState("home");

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "markdown":
        // return <MarkdownEditor />; // Adicione de volta se precisar
        return <div>Página Markdown Editor</div>; // Placeholder
      case "pdf":
        // return <PDFViewer />; // Adicione de volta se precisar
        return <div>Página PDF Viewer</div>; // Placeholder
      case "cursos":
        return <Cursos />;
      case "flashcards":
        // return <Flashcards />; // Adicione de volta se precisar
        return <div>Página Flashcards</div>; // Placeholder
      case "conteudos":
        // return <MeusConteudos />; // Adicione de volta se precisar
        return <div>Página Meus Conteúdos</div>; // Placeholder
      case "simulado":
        // return <SimuladoArea />; // Adicione de volta se precisar
        return <div>Página Simulado</div>; // Placeholder
      case "viewer":
        // return <MarkdownViewer />; // Adicione de volta se precisar
        return <div>Página Markdown Viewer</div>; // Placeholder
      default:
        return <AppHome setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="alego-theme">
      {/* HEADER FIXO: Ocupa 100% da largura da tela, fixado no topo, com cor e sombra. */}
      <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-blue-900 to-blue-700 text-white shadow-lg">
        {/* Conteúdo do Header: Centralizado e com largura limitada (max-w-7xl) dentro do header fixo. */}
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <h1 className="text-3xl font-bold">Plataforma de Estudos ALEGO</h1>
          {/* Ajuste a cor do texto da descrição para ser visível no fundo escuro */}
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

      {/* ESPAÇAMENTO PARA COMPENSAR O HEADER FIXO */}
      {/* O `pt-48` empurra o conteúdo para baixo. Ajuste 48 para a altura real do seu header se necessário. */}
      <div className="pt-48">
        {/* CONTÊINER PRINCIPAL DE CONTEÚDO (MAIN E FOOTER): Centralizado e com largura limitada. */}
        <div className="flex min-h-[calc(100vh-192px)] flex-col max-w-7xl mx-auto px-4">
          {/* MAIN: Ocupa o restante do espaço vertical disponível. */}
          <main className="py-8 flex-1 w-full">
            {/* REMOVIDOS estilos inline "display: flex", etc., da tag <main> */}
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
    </ThemeProvider>
  );
};

export default App;
