import { useState } from "react";
import Flashcards from "../components/Flashcards";
import SimuladoArea from "../components/SimuladoArea";
import MarkdownEditor from "../components/MarkdownEditor";;
import MeusConteudos from "../components/MeusConteudos";
import Admin from "../pages/Admin";
import SimplePDFViewer from "../components/SimplePDFViewer";
import "../styles/custom.css";
import "../styles/index.css"; // Adicione esta linha se contém o Tailwind


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
      case "admin":
        return <Admin />;
      case "pdfs":
        return <SimplePDFViewer />;
      default:
        return (
          <div className="flex flex-col gap-6">
            {" "}
            {/* flex flex-col gap-6 */}
            <div
              className="flex justify-between items-center flex-wrap gap-4" /* flex justify-between items-center flex-wrap gap-4 */
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
              className="simple-grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6" /* simple-grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 */
            >
              <div className="simple-card">
                <h2>Estudo Atual</h2>
                <div className="flex flex-col gap-4" /* flex flex-col gap-4 */>
                  <h3 className="text-lg m-0">
                    {" "}
                    {/* text-lg m-0 */}
                    {estudoAtual.materia}
                  </h3>
                  <div>
                    <div
                      className="flex justify-between text-sm mb-2" /* flex justify-between text-sm mb-2 */
                    >
                      <span>Progresso</span>
                      <span>{estudoAtual.progresso}%</span>
                    </div>
                    <div
                      className="w-full h-2 bg-gray-200 rounded-md overflow-hidden" /* w-full h-2 bg-gray-200 rounded-md overflow-hidden */
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
                    className="flex justify-between items-center text-sm" /* flex justify-between items-center text-sm */
                  >
                    <span className="text-secondary">
                      {" "}
                      {/* text-secondary */}
                      Próxima revisão: {estudoAtual.proximaRevisao}
                    </span>
                    <button
                      className="simple-btn-outline px-4 py-2 text-sm" /* simple-btn-outline px-4 py-2 text-sm */
                    >
                      Continuar
                    </button>
                  </div>
                </div>
              </div>

              <div className="simple-card">
                <h2>Cronograma Semanal</h2>
                <div className="flex flex-col gap-2" /* flex flex-col gap-2 */>
                  <div
                    className="flex justify-between text-sm" /* flex justify-between text-sm */
                  >
                    <span>Segunda</span>
                    <span className="text-secondary">
                      {" "}
                      {/* text-secondary */}
                      Res. 1.073
                    </span>
                  </div>
                  <div
                    className="flex justify-between text-sm" /* flex justify-between text-sm */
                  >
                    <span>Terça</span>
                    <span className="text-secondary">
                      {" "}
                      {/* text-secondary */}
                      Res. 1.218
                    </span>
                  </div>
                  <div
                    className="flex justify-between text-sm" /* flex justify-between text-sm */
                  >
                    <span>Quarta</span>
                    <span className="text-secondary">
                      {" "}
                      {/* text-secondary */}
                      Res. 1.771
                    </span>
                  </div>
                  <div
                    className="flex justify-between text-sm" /* flex justify-between text-sm */
                  >
                    <span>Quinta</span>
                    <span className="text-secondary">
                      {" "}
                      {/* text-secondary */}
                      Res. 1.007
                    </span>
                  </div>
                  <div
                    className="flex justify-between text-sm" /* flex justify-between text-sm */
                  >
                    <span>Sexta</span>
                    <span className="text-secondary">
                      {" "}
                      {/* text-secondary */}
                      Revisão
                    </span>
                  </div>
                  <div
                    className="flex justify-between text-sm" /* flex justify-between text-sm */
                  >
                    <span>Sábado</span>
                    <span className="text-secondary">
                      {" "}
                      {/* text-secondary */}
                      Simulado
                    </span>
                  </div>
                  <div
                    className="flex justify-between text-sm" /* flex justify-between text-sm */
                  >
                    <span>Domingo</span>
                    <span className="text-secondary">
                      {" "}
                      {/* text-secondary */}
                      Descanso
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="simple-grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6" /* simple-grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 */
            >
              <div className="simple-card">
                <h2>Próximas Atividades</h2>
                <div className="flex flex-col gap-4" /* flex flex-col gap-4 */>
                  {proximasAtividades.map((atividade, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-start" /* flex justify-between items-start */
                    >
                      <div className="flex-1">
                        {" "}
                        {/* flex-1 */}
                        <div
                          className="flex items-center mb-1" /* flex items-center mb-1 */
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
                            className="text-sm font-medium" /* text-sm font-medium */
                          >
                            {atividade.tipo}
                          </span>
                        </div>
                        <p
                          className="text-sm my-1 pl-5" /* text-sm my-1 pl-5 */
                        >
                          {atividade.titulo}
                        </p>
                        <p
                          className="text-xs text-secondary my-1 pl-5" /* text-xs text-secondary my-1 pl-5 */
                        >
                          {atividade.horario}
                        </p>
                      </div>
                      <button
                        className="simple-btn-outline px-4 py-2 text-xs ml-2" /* simple-btn-outline px-4 py-2 text-xs ml-2 */
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
                  className="simple-grid simple-grid-2 gap-6" /* simple-grid simple-grid-2 gap-6 */
                >
                  {estatisticas.map((estatistica, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-2" /* flex flex-col gap-2 */
                    >
                      <div
                        className="flex justify-between text-sm" /* flex justify-between text-sm */
                      >
                        <span>{estatistica.label}</span>
                        <span className="font-semibold">
                          {" "}
                          {/* font-semibold */}
                          {estatistica.valor}
                        </span>
                      </div>
                      {estatistica.progresso !== undefined && (
                        <div
                          className="w-full h-1 bg-gray-200 rounded-sm overflow-hidden" /* w-full h-1 bg-gray-200 rounded-sm overflow-hidden */
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
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4" /* grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4 */
              >
                <button
                  className="simple-btn-outline p-4 text-left h-auto" /* simple-btn-outline p-4 text-left h-auto */
                  onClick={() => setCurrentView("flashcards")}
                >
                  <div>
                    <div className="font-semibold mb-2">
                      {" "}
                      {/* font-semibold mb-2 */}
                      📚 Flashcards
                    </div>
                    <div
                      className="text-sm text-secondary" /* text-sm text-secondary */
                    >
                      Sistema de repetição espaçada
                    </div>
                  </div>
                </button>

                <button
                  className="simple-btn-outline p-4 text-left h-auto" /* simple-btn-outline p-4 text-left h-auto */
                  onClick={() => setCurrentView("simulados")}
                >
                  <div>
                    <div className="font-semibold mb-2">
                      {" "}
                      {/* font-semibold mb-2 */}
                      📝 Simulados
                    </div>
                    <div
                      className="text-sm text-secondary" /* text-sm text-secondary */
                    >
                      Questões e provas
                    </div>
                  </div>
                </button>

                <button
                  className="simple-btn-outline p-4 text-left h-auto" /* simple-btn-outline p-4 text-left h-auto */
                  onClick={() => setCurrentView("conteudos")}
                >
                  <div>
                    <div className="font-semibold mb-2">
                      {" "}
                      {/* font-semibold mb-2 */}
                      🧠 Meus Conteúdos
                    </div>
                    <div
                      className="text-sm text-secondary" /* text-sm text-secondary */
                    >
                      Explique para aprender
                    </div>
                  </div>
                </button>

                <button
                  className="simple-btn-outline p-4 text-left h-auto" /* simple-btn-outline p-4 text-left h-auto */
                  onClick={() => setCurrentView("resumos")}
                >
                  <div>
                    <div className="font-semibold mb-2">
                      {" "}
                      {/* font-semibold mb-2 */}
                      📄 Editor de Resumos
                    </div>
                    <div
                      className="text-sm text-secondary" /* text-sm text-secondary */
                    >
                      Crie resumos em Markdown
                    </div>
                  </div>
                </button>

                <button
                  className="simple-btn-outline p-4 text-left h-auto" /* simple-btn-outline p-4 text-left h-auto */
                  onClick={() => setCurrentView("admin")}
                >
                  <div>
                    <div className="font-semibold mb-2">
                      {" "}
                      {/* font-semibold mb-2 */}
                      📄 Administração
                    </div>
                    <div
                      className="text-sm text-secondary" /* text-sm text-secondary */
                    >
                      Administre seu sistema
                    </div>
                  </div>
                </button>

                <button
                  className="simple-btn-outline p-4 text-left h-auto" /* simple-btn-outline p-4 text-left h-auto */
                  onClick={() => setCurrentView("pdfs")}
                >
                  <div>
                    <div className="font-semibold mb-2">
                      {" "}
                      {/* font-semibold mb-2 */}
                      📚 Biblioteca PDF
                    </div>
                    <div
                      className="text-sm text-secondary" /* text-sm text-secondary */
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col gap-6">
          {/* Navegação superior */}
          {currentView !== "dashboard" && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white rounded-lg p-4 shadow-sm">
              <button
                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
                onClick={() => setCurrentView("dashboard")}
              >
                ← Voltar ao Dashboard
              </button>
              <div className="flex gap-2 flex-wrap">
                {[
                  { key: "flashcards", label: "Flashcards" },
                  { key: "simulados", label: "Simulados" },
                  { key: "conteudos", label: "Conteúdos" },
                  { key: "resumos", label: "Resumos" },
                  { key: "pdfs", label: "PDFs" },
                  { key: "admin", label: "Admin" }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      currentView === key
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                    onClick={() => setCurrentView(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Conteúdo principal */}
          <div className="w-full">
            {renderCurrentView()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
