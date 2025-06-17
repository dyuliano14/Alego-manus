import { useState } from "react";
import Flashcards from "../components/Flashcards";
import SimuladoArea from "../components/SimuladoArea";
import MarkdownEditor from "../components/MarkdownEditor";
import PDFViewer from "../components/PDFViewer";
import MeusConteudos from "../components/MeusConteudos";
import Cursos from "../components/Cursos";


// Definindo interfaces para tipagem
interface EstudoAtual {
  materia: string;
  progresso: number;
  proximaRevisao: string;
}

interface ProximaAtividade {
  tipo: string;
  titulo: string;
  horario: string;
}

interface Estatistica {
  label: string;
  valor: string | number;
  progresso?: number;
}

const Dashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>("dashboard");
  const [estudoAtual] = useState<EstudoAtual>({
    materia: "Resolução nº 1.073 - Regulamento Administrativo",
    progresso: 65,
    proximaRevisao: "04/06/2025",
  });

  const proximasAtividades: ProximaAtividade[] = [
    {
      tipo: "Revisão",
      titulo: "Regimento Interno - Capítulos 1-3",
      horario: "Hoje, 14:00",
    },
    {
      tipo: "Novo Conteúdo",
      titulo: "Resolução nº 1.073 - Capítulo 4",
      horario: "Hoje, 16:30",
    },
    {
      tipo: "Simulado",
      titulo: "Simulado Temático - Regimento Interno",
      horario: "Amanhã, 10:00",
    },
    {
      tipo: "Flashcards",
      titulo: "Revisão Espaçada - Resolução nº 1.007",
      horario: "Amanhã, 15:00",
    },
  ];

  const estatisticas: Estatistica[] = [
    {
      label: "Tempo de Estudo",
      valor: "24h 30min",
      progresso: 70,
    },
    {
      label: "Flashcards Revisados",
      valor: 120,
      progresso: 60,
    },
    {
      label: "Simulados Realizados",
      valor: 5,
      progresso: 50,
    },
    {
      label: "Meus conteúdos",
      valor: 8,
      progresso: 40,
    },
  ];

  const renderCurrentView = () => {
    switch (currentView) {
      case "flashcards":
        return <Flashcards />;
      case "simulados":
        return <SimuladoArea />;
      case "conteudos":
        return <MeusConteudos />;
      case "resumos":
        return <MarkdownEditor />;
      case "Cursos":
        return <Cursos />;
      case "pdfs":
        return <PDFViewer />;
      default:
        return (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
                
              }}
            >
              <h1
                className="section-title"
                style={{ margin: 0, border: "none", padding: 0 }}
              >
                Dashboard
              </h1>
              <button className="simple-btn">Iniciar Sessão de Estudo</button>
            </div>

            <div
              className="simple-grid"
              style={{ gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}
            >
              <div className="simple-card">
                <h2>Estudo Atual</h2>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  <h3 style={{ fontSize: "1.1rem", margin: 0 }}>
                    {estudoAtual.materia}
                  </h3>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.9rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <span>Progresso</span>
                      <span>{estudoAtual.progresso}%</span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "8px",
                        backgroundColor: "#e2e8f0",
                        borderRadius: "4px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${estudoAtual.progresso}%`,
                          height: "100%",
                          backgroundColor: "var(--primary-blue)",
                          transition: "width 0.3s ease",
                        }}
                      ></div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      fontSize: "0.9rem",
                    }}
                  >
                    <span style={{ color: "var(--text-secondary)" }}>
                      Próxima revisão: {estudoAtual.proximaRevisao}
                    </span>
                    <button
                      className="simple-btn-outline"
                      style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              </div>

              <div className="simple-card">
                <h2>Cronograma Semanal</h2>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.9rem",
                    }}
                  >
                    <span>Segunda</span>
                    <span style={{ color: "var(--text-secondary)" }}>
                      Res. 1.073
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.9rem",
                    }}
                  >
                    <span>Terça</span>
                    <span style={{ color: "var(--text-secondary)" }}>
                      Res. 1.218
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.9rem",
                    }}
                  >
                    <span>Quarta</span>
                    <span style={{ color: "var(--text-secondary)" }}>
                      Res. 1.771
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.9rem",
                    }}
                  >
                    <span>Quinta</span>
                    <span style={{ color: "var(--text-secondary)" }}>
                      Res. 1.007
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.9rem",
                    }}
                  >
                    <span>Sexta</span>
                    <span style={{ color: "var(--text-secondary)" }}>
                      Revisão
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.9rem",
                    }}
                  >
                    <span>Sábado</span>
                    <span style={{ color: "var(--text-secondary)" }}>
                      Simulado
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.9rem",
                    }}
                  >
                    <span>Domingo</span>
                    <span style={{ color: "var(--text-secondary)" }}>
                      Descanso
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="simple-grid"
              style={{ gridTemplateColumns: "1fr 2fr", gap: "1.5rem" }}
            >
              <div className="simple-card">
                <h2>Próximas Atividades</h2>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  {proximasAtividades.map((atividade, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "0.25rem",
                          }}
                        >
                          <div
                            style={{
                              width: "8px",
                              height: "8px",
                              borderRadius: "50%",
                              marginRight: "0.5rem",
                              backgroundColor:
                                atividade.tipo === "Revisão"
                                  ? "#3b82f6"
                                  : atividade.tipo === "Novo Conteúdo"
                                    ? "#10b981"
                                    : atividade.tipo === "Simulado"
                                      ? "#f59e0b"
                                      : "#8b5cf6",
                            }}
                          ></div>
                          <span
                            style={{ fontSize: "0.9rem", fontWeight: "500" }}
                          >
                            {atividade.tipo}
                          </span>
                        </div>
                        <p
                          style={{
                            fontSize: "0.9rem",
                            margin: "0.25rem 0",
                            paddingLeft: "1.25rem",
                          }}
                        >
                          {atividade.titulo}
                        </p>
                        <p
                          style={{
                            fontSize: "0.8rem",
                            color: "var(--text-secondary)",
                            margin: "0.25rem 0",
                            paddingLeft: "1.25rem",
                          }}
                        >
                          {atividade.horario}
                        </p>
                      </div>
                      <button
                        className="simple-btn-outline"
                        style={{
                          padding: "0.5rem 1rem",
                          fontSize: "0.8rem",
                          marginLeft: "0.5rem",
                        }}
                        onClick={() => {
                          if (atividade.tipo === "Simulado")
                            setCurrentView("simulados");
                          else if (atividade.tipo === "Flashcards")
                            setCurrentView("flashcards");
                        }}
                      >
                        Iniciar
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="simple-card">
                <h2>Estatísticas de Estudo</h2>
                <div
                  className="simple-grid simple-grid-2"
                  style={{ gap: "1.5rem" }}
                >
                  {estatisticas.map((estatistica, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "0.9rem",
                        }}
                      >
                        <span>{estatistica.label}</span>
                        <span style={{ fontWeight: "600" }}>
                          {estatistica.valor}
                        </span>
                      </div>
                      {estatistica.progresso !== undefined && (
                        <div
                          style={{
                            width: "100%",
                            height: "4px",
                            backgroundColor: "#e2e8f0",
                            borderRadius: "2px",
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              width: `${estatistica.progresso}%`,
                              height: "100%",
                              backgroundColor: "var(--primary-blue)",
                              transition: "width 0.3s ease",
                            }}
                          ></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Menu de Navegação Rápida */}
            <div className="simple-card">
              <h2>Acesso Rápido às Ferramentas</h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "1rem",
                  marginTop: "1rem",
                }}
              >
                <button
                  className="simple-btn-outline"
                  style={{ padding: "1rem", textAlign: "left", height: "auto" }}
                  onClick={() => setCurrentView("flashcards")}
                >
                  <div>
                    <div style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
                      📚 Flashcards
                    </div>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Sistema de repetição espaçada
                    </div>
                  </div>
                </button>

                <button
                  className="simple-btn-outline"
                  style={{ padding: "1rem", textAlign: "left", height: "auto" }}
                  onClick={() => setCurrentView("cursos")}
                >
                  <div>
                    <div style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
                      📚 Cursos
                    </div>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Crie e controle seus cursos
                    </div>
                  </div>
                </button>

                <button
                  className="simple-btn-outline"
                  style={{ padding: "1rem", textAlign: "left", height: "auto" }}
                  onClick={() => setCurrentView("cursosarea")}
                >
                  <div>
                    <div style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
                      📚 CursosArea
                    </div>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Crie e controle seus cursos
                    </div>
                  </div>
                </button>

                <button
                  className="simple-btn-outline"
                  style={{ padding: "1rem", textAlign: "left", height: "auto" }}
                  onClick={() => setCurrentView("simulados")}
                >
                  <div>
                    <div style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
                      📝 Simulados
                    </div>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Questões e provas
                    </div>
                  </div>
                </button>
                
                <button
                  className="simple-btn-outline"
                  style={{ padding: "1rem", textAlign: "left", height: "auto" }}
                  onClick={() => setCurrentView("cursosarea")}
                >
                  <div>
                    <div style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
                      🧠 CursosArea
                    </div>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Explique para aprender
                    </div>
                  </div>
                </button>

                <button
                  className="simple-btn-outline"
                  style={{ padding: "1rem", textAlign: "left", height: "auto" }}
                  onClick={() => setCurrentView("conteudos")}
                >
                  <div>
                    <div style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
                      🧠 Meus Conteúdos
                    </div>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Explique para aprender
                    </div>
                  </div>
                </button>

                <button
                  className="simple-btn-outline"
                  style={{ padding: "1rem", textAlign: "left", height: "auto" }}
                  onClick={() => setCurrentView("resumos")}
                >
                  <div>
                    <div style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
                      📄 Editor de Resumos
                    </div>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Crie resumos em Markdown
                    </div>
                  </div>
                </button>

                <button
                  className="simple-btn-outline"
                  style={{ padding: "1rem", textAlign: "left", height: "auto" }}
                  onClick={() => setCurrentView("pdfs")}
                >
                  <div>
                    <div style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
                      📚 Biblioteca PDF
                    </div>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Visualize materiais
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        {/* Navegação superior */}
        {currentView !== "dashboard" && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button
              className="simple-btn-outline"
              onClick={() => setCurrentView("dashboard")}
              style={{ padding: "0.5rem 1rem" }}
            >
              ← Voltar ao Dashboard
            </button>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button
                className={
                  currentView === "flashcards"
                    ? "simple-btn"
                    : "simple-btn-outline"
                }
                onClick={() => setCurrentView("flashcards")}
                style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
              >
                Flashcards
              </button>

               <button
                className={
                  currentView === "cursosarea"
                    ? "simple-btn"
                    : "simple-btn-outline"
                }
                onClick={() => setCurrentView("cursosarea")}
                style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
              >
                CursosArea
              </button>

              <button
                className={
                  currentView === "simulados"
                    ? "simple-btn"
                    : "simple-btn-outline"
                }
                onClick={() => setCurrentView("simulados")}
                style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
              >
                Simulados
              </button>
              <button
                className={
                  currentView === "conteudos"
                    ? "simple-btn"
                    : "simple-btn-outline"
                }
                onClick={() => setCurrentView("conteudos")}
                style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
              >
                Conteúdos
              </button>
              <button
                className={
                  currentView === "cursos" ? "simple-btn" : "simple-btn-outline"
                }
                onClick={() => setCurrentView("cursos")}
                style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
              >
                Cursos
              </button>
              <button
                className={
                  currentView === "pdfs" ? "simple-btn" : "simple-btn-outline"
                }
                onClick={() => setCurrentView("pdfs")}
                style={{ padding: "0.5rem 1rem", fontSize: "0.9rem" }}
              >
                PDFs
              </button>
            </div>
          </div>
        )}
      </div>
      {renderCurrentView()}
    </div>
  );
};

export default Dashboard;
