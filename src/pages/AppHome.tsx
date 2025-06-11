// src/pages/AppHome.tsx
import React from "react";

interface AppHomeProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

const AppHome: React.FC<AppHomeProps> = ({ setCurrentPage }) => {
  return (
    <div className="simple-grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
      {/* Card: Plano de Estudos */}
      <div className="bg-card p-6 rounded-lg shadow hover:shadow-lg transition">
        <h2 className="text-xl font-semibold mb-2">Plano de Estudos Semanal</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Visualize sua rotina semanal de estudos.
        </p>
        <button
          className="simple-btn"
          onClick={() => setCurrentPage("dashboard")}
        >
          Ver Dashboard
        </button>
      </div>

      {/* Card: Resumos */}
      <div className="bg-card p-6 rounded-lg shadow hover:shadow-lg transition">
        <h2 className="text-xl font-semibold mb-2">Resumos em Markdown</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Crie, edite e visualize resumos.
        </p>
        <button
          className="simple-btn"
          onClick={() => setCurrentPage("markdown")}
        >
          Ver Resumos
        </button>
      </div>

      {/* Card: PDFs */}
      <div className="bg-card p-6 rounded-lg shadow hover:shadow-lg transition">
        <h2 className="text-xl font-semibold mb-2">Biblioteca de PDFs</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Acesse documentos oficiais e materiais.
        </p>
        <button className="simple-btn" onClick={() => setCurrentPage("pdf")}>
          Ver PDFs
        </button>
      </div>

      {/* Card: Flashcards */}
      <div className="bg-card p-6 rounded-lg shadow hover:shadow-lg transition">
        <h2 className="text-xl font-semibold mb-2">Flashcards</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Estude com revisão espaçada.
        </p>
        <button
          className="simple-btn"
          onClick={() => setCurrentPage("flashcards")}
        >
          Ver Flashcards
        </button>
      </div>

      {/* Card: Espaço Feynman */}
      <div className="bg-card p-6 rounded-lg shadow hover:shadow-lg transition">
        <h2 className="text-xl font-semibold mb-2">Espaço Feynman</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Pratique explicar conceitos de forma simples.
        </p>
        <button
          className="simple-btn"
          onClick={() => setCurrentPage("feynman")}
        >
          Ver Feynman
        </button>
      </div>

      {/* Card: Simulados */}
      <div className="bg-card p-6 rounded-lg shadow hover:shadow-lg transition">
        <h2 className="text-xl font-semibold mb-2">Simulados</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Teste seus conhecimentos com questões.
        </p>
        <button
          className="simple-btn"
          onClick={() => setCurrentPage("simulado")}
        >
          Ver Simulados
        </button>
      </div>
    </div>
  );
};

export default AppHome;            >
              <div>
                <h3 className="font-semibold text-lg">{dia}</h3>
                <p>{tema}</p>
                <p className="text-sm text-muted-foreground">
                  <strong>Meta:</strong> {meta}
                </p>
              </div>
              <button
                variant="outline"
                className="simple-btn-outline text-sm"
                onClick={() => setCurrentPage("dashboard")}
              >
                Iniciar
              </button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Resumos e Materiais</h2>
        <div className="space-y-4">
          {[
            {
              titulo: "Resolução nº 1.073",
              desc: "Regulamento Administrativo da ALEGO",
              href: "resumos/resolucao_1073/organizacao_administrativa.md",
            },
            {
              titulo: "Resolução nº 1.218",
              desc: "Regimento Interno da ALEGO",
              href: "resumos/resolucao_1218/regimento_interno.md",
            },
            {
              titulo: "Resolução nº 1.771",
              desc: "Secretaria de Polícia Legislativa",
              href: "resumos/resolucao_1771/policia_legislativa.md",
            },
            {
              titulo: "Resolução nº 1.007",
              desc: "Estrutura Administrativa da ALEGO",
              href: "resumos/resolucao_1007/estrutura_administrativa.md",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-card p-4 rounded-md flex justify-between items-center shadow-sm"
            >
              <div>
                <h3 className="font-semibold">{item.titulo}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
              <a
                href={`/visualizar?arquivo=${item.href}`}
                variant="outline"
                className="simple-btn-outline text-sm"
              >
                Ver resumo →
              </a>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Acesso Rápido</h2>
        <div className="flex flex-wrap gap-2">
          {[
            ["Dashboard", "dashboard"],
            ["Resumos", "markdown"],
            ["PDFs", "pdf"],
            ["Flashcards", "flashcards"],
            ["Feynman", "feynman"],
            ["Simulado", "simulado"],
          ].map(([label, key]) => (
            <button
              variant="outline"
              key={key}
              onClick={() => setCurrentPage(key)}
              className="simple-btn-outline text-sm"
            >
              {label}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AppHome;
