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
          <div className="simple-grid simple-grid-3">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <section>
                <h2 className="section-title">Plano de Estudos Semanal</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px', margin: '0 auto' }}>
                  <div className="simple-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-blue)' }}>Segunda-feira</h3>
                        <p style={{ margin: '0 0 0.25rem 0' }}>Resolução nº 1.073 - Regulamento Administrativo</p>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}><strong>Meta:</strong> Capítulos 1-2</p>
                      </div>
                      <button className="simple-btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Iniciar</button>
                    </div>
                  </div>

                  <div className="simple-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-blue)' }}>Terça-feira</h3>
                        <p style={{ margin: '0 0 0.25rem 0' }}>Resolução nº 1.218 - Regimento Interno</p>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}><strong>Meta:</strong> Capítulos 1-3</p>
                      </div>
                      <button className="simple-btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Iniciar</button>
                    </div>
                  </div>

                  <div className="simple-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-blue)' }}>Quarta-feira</h3>
                        <p style={{ margin: '0 0 0.25rem 0' }}>Resolução nº 1.771 - Polícia Legislativa</p>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}><strong>Meta:</strong> Artigos 1-15</p>
                      </div>
                      <button className="simple-btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Iniciar</button>
                    </div>
                  </div>

                  <div className="simple-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-blue)' }}>Quinta-feira</h3>
                        <p style={{ margin: '0 0 0.25rem 0' }}>Resolução nº 1.007 - Estrutura Administrativa</p>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}><strong>Meta:</strong> Capítulos 1-2</p>
                      </div>
                      <button className="simple-btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Iniciar</button>
                    </div>
                  </div>

                  <div className="simple-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-blue)' }}>Sexta-feira</h3>
                        <p style={{ margin: '0 0 0.25rem 0' }}>Revisão Geral e Flashcards</p>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}><strong>Meta:</strong> 50 cartões</p>
                      </div>
                      <button className="simple-btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Iniciar</button>
                    </div>
                  </div>

                  <div className="simple-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-blue)' }}>Sábado</h3>
                        <p style={{ margin: '0 0 0.25rem 0' }}>Simulado Temático</p>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}><strong>Meta:</strong> 20 questões</p>
                      </div>
                      <button className="simple-btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Iniciar</button>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="section-title">Resumos e Materiais</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '800px', margin: '0 auto' }}>
                  <div className="simple-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-blue)' }}>Resolução nº 1.073</h3>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Regulamento Administrativo da ALEGO</p>
                      </div>
                      <a href="/estudos_alego/resumos/resolucao_1073/organizacao_administrativa.md" className="simple-btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', textDecoration: 'none' }}>Ver resumo</a>
                    </div>
                  </div>

                  <div className="simple-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-blue)' }}>Resolução nº 1.218</h3>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Regimento Interno da ALEGO</p>
                      </div>
                      <a href="/estudos_alego/resumos/resolucao_1218/regimento_interno.md" className="simple-btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', textDecoration: 'none' }}>Ver resumo</a>
                    </div>
                  </div>

                  <div className="simple-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-blue)' }}>Resolução nº 1.771</h3>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Secretaria de Polícia Legislativa</p>
                      </div>
                      <a href="/estudos_alego/resumos/resolucao_1771/policia_legislativa.md" className="simple-btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', textDecoration: 'none' }}>Ver resumo</a>
                    </div>
                  </div>

                  <div className="simple-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--primary-blue)' }}>Resolução nº 1.007</h3>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Estrutura Administrativa da ALEGO</p>
                      </div>
                      <a href="/estudos_alego/resumos/resolucao_1007/estrutura_administrativa.md" className="simple-btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', textDecoration: 'none' }}>Ver resumo</a>
                    </div>
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
        <header className="app-header">
          <div className="main-container">
            <h1>Plataforma de Estudos ALEGO</h1>
            <p>Seu assistente de estudos para o concurso da Assembleia Legislativa de Goiás</p>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button
                onClick={() => setCurrentPage("home")}
                className={currentPage === "home" ? "simple-btn" : "simple-btn-outline"}
                style={currentPage === "home" ? { background: 'white', color: 'var(--primary-blue)' } : { borderColor: 'white', color: 'white' }}
              >
                Início
              </button>
              <button
                onClick={() => setCurrentPage("dashboard")}
                className={currentPage === "dashboard" ? "simple-btn" : "simple-btn-outline"}
                style={currentPage === "dashboard" ? { background: 'white', color: 'var(--primary-blue)' } : { borderColor: 'white', color: 'white' }}
              >
                Dashboard
              </button>
            </div>
          </div>
        </header>

        <main className="main-container" style={{ padding: '2rem 1rem', minHeight: '60vh' }}>
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