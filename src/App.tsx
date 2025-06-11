import React, { useState } from "react";
import AppHome from "./pages/AppHome"; // adicione isso aqui

import { ThemeProvider } from "./components/theme-provider";
import Dashboard from "./pages/Dashboard";
import PDFViewer from "./components/PDFViewer";
import MarkdownEditor from "./components/MarkdownEditor";
import Flashcards from "./components/Flashcards";
import SimuladoArea from "./components/SimuladoArea";
import FeynmanSpace from "./components/FeynmanSpace";
import MarkdownViewer from "./components/ui/MarkdownViewer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/index.css";
import "./styles/custom.css";

<Route path="/" element={<AppHome setCurrentPage={setCurrentPage} />} />;

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
      case "feynman":
        return <FeynmanSpace />;
      case "simulado":
        return <SimuladoArea />;
      default:
        return <AppHome setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="alego-theme">
      <Router>
        <div className="flex min-h-screen flex-col">
          <header className="app-header">
            <div className="main-container">
              <h1>Plataforma de Estudos ALEGO</h1>
              <p>
                Seu assistente de estudos para o concurso da Assembleia
                Legislativa de Goiás
              </p>
              <div className="flex gap-4 justify-center mt-6">
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

          <main
            className="main-container"
            style={{ padding: "2rem 1rem", minHeight: "60vh" }}
          >
            <Routes>
              <Route path="/visualizar" element={<MarkdownViewer />} />
              <Route path="/" element={renderCurrentPage()} />
            </Routes>
          </main>

          <footer className="bg-gray-100 dark:bg-gray-800 py-6">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Plataforma de Estudos ALEGO — Desenvolvido para auxiliar na
                preparação para o concurso da ALEGO
              </p>
            </div>
          </footer>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
