import { useState } from "react";
import Header from "./layout/Header";
import Main from "./layout/Main";
import Footer from "./layout/Footer";
import AppHome from "./pages/AppHome";
import Dashboard from "./pages/Dashboard";
import Cursos from "./components/Cursos";
import PDFViewer from "./components/PDFViewer";
import MarkdownEditor from "./components/MarkdownEditor";
import Flashcards from "./components/Flashcards";
import SimuladoArea from "./components/SimuladoArea";
import MeusConteudos from "./components/MeusConteudos";
import MarkdownViewer from "./components/ui/MarkdownViewer";
import { ThemeProvider } from "./components/theme-provider";
import Admin from "./pages/Admin";
import "./styles/index.css";

const App = () => {
  const [currentPage, setCurrentPage] = useState("home");

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "cursos":
        return <Cursos />;
      case "pdf":
        return <PDFViewer />;
      case "markdown":
        return <MarkdownEditor />;
      case "flashcards":
        return <Flashcards />;
      case "simulado":
        return <SimuladoArea />;
      case "conteudos":
        return <MeusConteudos />;
      case "admin":
        return <Admin />;
      case "viewer":
        return <MarkdownViewer markdown={""} />;
      default:
        return <AppHome setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="alego-theme">
      <div className="flex flex-col min-h-screen">
        <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <Main>{renderPage()}</Main>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default App;
