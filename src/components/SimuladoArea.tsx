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

    const totalAcertos = questoes.filter((q) => respostas[q.id] === q.correta).length;

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

        <div className="simple-card text-center">
          <Button onClick={corrigir} disabled={corrigido}>
            Corrigir
          </Button>
          {corrigido && (
            <p className="text-lg font-semibold mt-4">
              Você acertou {totalAcertos} de {questoes.length} questões.
            </p>
          )}
        </div>
      </div>
    );
  };

  export default SimuladoArea;  ]);

  const [atual, setAtual] = useState(0);
  const [respostaSelecionada, setRespostaSelecionada] = useState<string | null>(
    null,
  );
  const [showFeedback, setShowFeedback] = useState(false);

  const questao = questoes[atual];

  const handleResponder = (opcao: string) => {
    setRespostaSelecionada(opcao);
    setShowFeedback(true);
  };

  const nextQuestao = () => {
    setRespostaSelecionada(null);
    setShowFeedback(false);
    setAtual((prev) => Math.min(prev + 1, questoes.length - 1));
  };

  const prevQuestao = () => {
    setRespostaSelecionada(null);
    setShowFeedback(false);
    setAtual((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="simple-grid grid-cols-1 lg:grid-cols-3 gap-6 py-8">
      {/* Lista de questões */}
      <div className="lg:col-span-1 simple-card">
        <CardTitle>Questões do Simulado</CardTitle>
        <ul className="mt-4 space-y-2">
          {questoes.map((q, i) => (
            <li key={q.id}>
              <Button
                variant={i === atual ? "default" : "outline"}
                size="sm"
                className="w-full text-left"
                onClick={() => {
                  setAtual(i);
                  setRespostaSelecionada(null);
                  setShowFeedback(false);
                }}
              >
                Questão {i + 1}
              </Button>
            </li>
          ))}
        </ul>
      </div>

      {/* Painel da questão */}
      <div className="lg:col-span-2 simple-card">
        <CardHeader>
          <CardTitle>
            Questão {atual + 1} de {questoes.length}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{questao.pergunta}</p>
          <div className="space-y-2">
            {questao.opcoes.map((op) => (
              <Button
                key={op}
                variant={respostaSelecionada === op ? "default" : "outline"}
                className="w-full"
                onClick={() => handleResponder(op)}
                disabled={showFeedback}
              >
                {op}
              </Button>
            ))}
          </div>

          {showFeedback && (
            <div className="mt-4 p-4 rounded-md bg-muted text-sm">
              <p>
                {respostaSelecionada === questao.respostaCorreta ? (
                  <span className="text-green-600 font-semibold">
                    ✔️ Correto!
                  </span>
                ) : (
                  <span className="text-red-600 font-semibold">❌ Errado!</span>
                )}
              </p>
              <p className="mt-2">
                Resposta correta: <strong>{questao.respostaCorreta}</strong>
              </p>
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <Button
              variant="outline"
              onClick={prevQuestao}
              disabled={atual === 0}
            >
              Anterior
            </Button>
            <Button
              onClick={nextQuestao}
              disabled={atual === questoes.length - 1}
            >
              Próxima
            </Button>
          </div>
        </CardContent>
      </div>
    </div>
  );
};

export default SimuladoArea;
