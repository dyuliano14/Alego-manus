// src/pages/AppHome.tsx
import React from "react";

interface Props {
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

const AppHome: React.FC<Props> = ({ setCurrentPage }) => {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-4">Plano de Estudos Semanal</h2>
        <div className="space-y-4">
          {[
            ["Segunda-feira", "Resolução nº 1.073", "Capítulos 1-2"],
            ["Terça-feira", "Resolução nº 1.218", "Capítulos 1-3"],
            ["Quarta-feira", "Resolução nº 1.771", "Artigos 1-15"],
            ["Quinta-feira", "Resolução nº 1.007", "Capítulos 1-2"],
            ["Sexta-feira", "Revisão Geral e Flashcards", "50 cartões"],
            ["Sábado", "Simulado Temático", "20 questões"],
          ].map(([dia, tema, meta], i) => (
            <div
              key={i}
              className="bg-card p-4 rounded-md flex justify-between items-center shadow-sm"
            >
              <div>
                <h3 className="font-semibold text-lg">{dia}</h3>
                <p>{tema}</p>
                <p className="text-sm text-muted-foreground">
                  <strong>Meta:</strong> {meta}
                </p>
              </div>
              <button
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
