// src/components/SimuladoArea.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

interface Questao {
  id: number;
  enunciado: string;
  alternativas: string[];
  correta: number;
}

const questoes: Questao[] = [
  {
    id: 1,
    enunciado: "Qual é a função da Resolução nº 1.073 na ALEGO?",
    alternativas: [
      "Define o Regimento Interno",
      "Regulamenta a Estrutura Administrativa",
      "Regulamento Administrativo",
      "Organiza a Polícia Legislativa",
    ],
    correta: 2,
  },
  {
    id: 2,
    enunciado: "Quantos artigos tem a Resolução nº 1.007?",
    alternativas: ["25", "30", "45", "50"],
    correta: 3,
  },
];

const SimuladoArea: React.FC = () => {
  const [respostas, setRespostas] = useState<{ [key: number]: number }>({});
  const [corrigido, setCorrigido] = useState(false);

  const selecionar = (id: number, alternativa: number) => {
    setRespostas((prev) => ({ ...prev, [id]: alternativa }));
  };

  const corrigir = () => setCorrigido(true);

  const totalAcertos = questoes.filter(
    (q) => respostas[q.id] === q.correta,
  ).length;

  return (
    <div className="simple-grid" style={{ gap: "2rem" }}>
      <div className="simple-card">
        <h1 className="section-title">📝 Simulado</h1>
        <p className="text-muted-foreground text-sm">
          Responda as questões abaixo e clique em <strong>Corrigir</strong>.
        </p>
      </div>

      {questoes.map((q) => (
        <Card key={q.id}>
          <CardHeader>
            <CardTitle>Questão {q.id}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>{q.enunciado}</p>
            <div className="space-y-2">
              {q.alternativas.map((alt, i) => {
                const selecionada = respostas[q.id] === i;
                const correta = corrigido && q.correta === i;
                const incorreta = corrigido && selecionada && q.correta !== i;

                return (
                  <button
                    key={i}
                    className={`w-full text-left p-3 rounded-md border transition-all ${
                      selecionada
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:shadow"
                    } ${correta ? "bg-green-100 border-green-500" : ""} ${
                      incorreta ? "bg-red-100 border-red-500" : ""
                    }`}
                    onClick={() => selecionar(q.id, i)}
                    disabled={corrigido}
                  >
                    {alt}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
      <div className="simple-grid" style={{ gap: "2rem" }}>
        <div className="simple-card text-center">
          <Button
            className="simple-btn"
            onClick={corrigir}
            disabled={corrigido}
          >
            Corrigir
          </Button>
          {corrigido && (
            <p className="text-lg font-semibold mt-4">
              Você acertou {totalAcertos} de {questoes.length} questões.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimuladoArea;
