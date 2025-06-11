import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

interface Questao {
  id: number;
  pergunta: string;
  opcoes: string[];
  respostaCorreta: string;
}

const SimuladoArea: React.FC = () => {
  const [questoes] = useState<Questao[]>([
    {
      id: 1,
      pergunta: "O que faz a Mesa Diretora da ALEGO?",
      opcoes: [
        "Coordena sessões",
        "Faz leis",
        "Gerencia orçamento",
        "Todas as anteriores",
      ],
      respostaCorreta: "Todas as anteriores",
    },
    {
      id: 2,
      pergunta: "Qual é a função das Comissões Permanentes?",
      opcoes: [
        "Analisar projetos por tema",
        "Aprovar leis",
        "Fiscalizar deputados",
        "Gerenciar orçamento",
      ],
      respostaCorreta: "Analisar projetos por tema",
    },
    // ...adicione mais questões 📝
  ]);

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
