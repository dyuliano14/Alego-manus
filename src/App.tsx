
import React, { useState } from "react";
import { ThemeProvider } from "./components/theme-provider";
import Dashboard from "./pages/Dashboard";

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState("home");

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">Plano de Estudos</h2>
                <div className="bg-card p-6 rounded-lg shadow">
                  <p className="mb-4">
                    Desenvolvemos um plano de estudos personalizado para o
                    concurso da ALEGO, utilizando metodologias ativas como
                    Técnica Feynman, flashcards, revisão espaçada e simulados.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div className="bg-muted p-4 rounded-md">
                      <h3 className="font-semibold mb-2">Ciclo Diário</h3>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        <li>Aquecimento (10 min)</li>
                        <li>Estudo de Novo Conteúdo (60-90 min)</li>
                        <li>Técnica Feynman (15-20 min)</li>
                        <li>Criação de Flashcards (15 min)</li>
                        <li>Prática Ativa (30 min)</li>
                      </ul>
                    </div>
                    <div className="bg-muted p-4 rounded-md">
                      <h3 className="font-semibold mb-2">Ciclo Semanal</h3>
                      <ul className="list-disc list-inside text-sm space-y-1">
                        <li>Segunda a Sexta: Novos conteúdos</li>
                        <li>Sábado: Revisão e simulado temático</li>
                        <li>Domingo: Descanso ativo</li>
                      </ul>
                    </div>
                  </div>
                  <a
                    href="/estudos_alego/plano_de_estudos.md"
                    className="inline-block mt-4 text-sm font-medium text-accent hover:underline transition"
                  >
                    Ver plano de estudos completo →
                  </a>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Resumos e Materiais</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-card p-6 rounded-lg shadow">
                    <h3 className="font-semibold mb-2">Resolução nº 1.073</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Regulamento Administrativo da ALEGO
                    </p>
                    <a
                      href="/estudos_alego/resumos/resolucao_1073/organizacao_administrativa.md"
                      className="text-primary hover:underline text-sm"
                    >
                      Ver resumo →
                    </a>
                  </div>
                  <div className="rounded-xl border bg-card p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
                    <h3 className="font-semibold text-lg mb-2 text-foreground">
                      Resolução nº 1.218
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Regimento Interno da ALEGO
                    </p>
                    <a
                      href="/estudos_alego/resumos/resolucao_1218/regimento_interno.md"
                      className="text-primary hover:underline text-sm"
                    >
                      Ver resumo →
                    </a>
                  </div>
                  <div className="bg-card p-6 rounded-lg shadow">
                    <h3 className="font-semibold mb-2">Resolução nº 1.771</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Secretaria de Polícia Legislativa
                    </p>
                    <a
                      href="/estudos_alego/resumos/resolucao_1771/policia_legislativa.md"
                      className="text-primary hover:underline text-sm"
                    >
                      Ver resumo →
                    </a>
                  </div>
                  <div className="bg-card p-6 rounded-lg shadow">
                    <h3 className="font-semibold mb-2">Resolução nº 1.007</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Estrutura Administrativa da ALEGO
                    </p>
                    <a
                      href="/estudos_alego/resumos/resolucao_1007/estrutura_administrativa.md"
                      className="text-primary hover:underline text-sm"
                    >
                      Ver resumo →
                    </a>
                  </div>
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">
                  Plataforma de Estudos
                </h2>
                <div className="bg-card p-6 rounded-lg shadow">
                  <p className="mb-4">
                    Desenvolvemos uma plataforma completa para gerenciar seus
                    estudos para o concurso da ALEGO.
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      <span>Dashboard personalizado</span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      <span>Biblioteca de PDFs</span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      <span>Editor de resumos em Markdown</span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      <span>Sistema de flashcards com SRS</span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      <span>Espaço para técnica Feynman</span>
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">✓</span>
                      <span>Simulados e questões</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => setCurrentPage("dashboard")}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90 transition"
                  >
                    Acessar a plataforma →
                  </button>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">Flashcards</h2>
                <div className="bg-card p-6 rounded-lg shadow">
                  <p className="mb-4">
                    Criamos conjuntos de flashcards para cada resolução,
                    facilitando a memorização ativa.
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li>
                      <a
                        href="/estudos_alego/flashcards/resolucao_1073_flashcards.md"
                        className="text-primary hover:underline"
                      >
                        Flashcards - Resolução nº 1.073
                      </a>
                    </li>
                    <li>
                      <a
                        href="/estudos_alego/flashcards/resolucao_1218_flashcards.md"
                        className="text-primary hover:underline"
                      >
                        Flashcards - Resolução nº 1.218
                      </a>
                    </li>
                    <li>
                      <a
                        href="/estudos_alego/flashcards/resolucao_1771_flashcards.md"
                        className="text-primary hover:underline"
                      >
                        Flashcards - Resolução nº 1.771
                      </a>
                    </li>
                    <li>
                      <a
                        href="/estudos_alego/flashcards/resolucao_1007_flashcards.md"
                        className="text-primary hover:underline"
                      >
                        Flashcards - Resolução nº 1.007
                      </a>
                    </li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        );
    }
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="alego-theme">
      <div className="flex min-h-screen flex-col">
        <header className="bg-gradient-to-br from-primary to-secondary text-white py-16 shadow-lg">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">
              Plataforma de Estudos ALEGO
            </h1>
            <p className="text-lg opacity-90">
              Seu assistente de estudos para o concurso da Assembleia
              Legislativa de Goiás
            </p>
            <div className="mt-6 space-x-4">
              <button
                onClick={() => setCurrentPage("home")}
                className={`px-4 py-2 rounded transition ${
                  currentPage === "home"
                    ? "bg-white text-primary"
                    : "bg-transparent border border-white text-white hover:bg-white hover:text-primary"
                }`}
              >
                Início
              </button>
              <button
                onClick={() => setCurrentPage("dashboard")}
                className={`px-4 py-2 rounded transition ${
                  currentPage === "dashboard"
                    ? "bg-white text-primary"
                    : "bg-transparent border border-white text-white hover:bg-white hover:text-primary"
                }`}
              >
                Dashboard
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-8">
          {renderCurrentPage()}
        </main>

        <footer className="bg-muted py-6">
          <div className="container mx-auto px-4 text-center">
            <p>
              Plataforma de Estudos ALEGO - Desenvolvido para auxiliar na
              preparação para o concurso da Assembleia Legislativa de Goiás
            </p>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default App;
