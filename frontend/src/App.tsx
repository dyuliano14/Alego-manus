import { useState, useEffect } from "react";
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize app
    try {
      setIsLoading(false);
      console.info("Alego App initialized successfully");
    } catch (error) {
      console.error("App initialization error:", error);
      setError("Erro ao inicializar o aplicativo");
      setIsLoading(false);
    }
  }, []);

  const renderPage = () => {
    try {
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
    } catch (error) {
      console.error("Page render error:", error);
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center p-6">
            <h2 className="text-xl font-bold text-red-600 mb-2">Erro</h2>
            <p className="text-gray-600">Falha ao carregar a página</p>
            <button 
              onClick={() => setCurrentPage("home")}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Voltar ao Início
            </button>
          </div>
        </div>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6">
          <h2 className="text-xl font-bold text-red-600 mb-2">Erro</h2>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Recarregar
          </button>
        </div>
      </div>
    );
  }

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
