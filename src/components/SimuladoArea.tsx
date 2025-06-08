import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";

// Definindo interfaces para tipagem
interface Simulado {
  id: number;
  titulo: string;
  questoes: number;
  duracao: number;
  dificuldade: string;
  dataCriacao: string;
}

interface Questao {
  id: number;
  enunciado: string;
  alternativas: string[];
  resposta: number;
}

interface Respostas {
  [key: number]: number;
}

const SimuladoArea: React.FC = () => {
  const [selectedSimulado, setSelectedSimulado] = useState<Simulado | null>(
    null,
  );
  const [simuladoEmAndamento, setSimuladoEmAndamento] =
    useState<boolean>(false);
  const [questaoAtual, setQuestaoAtual] = useState<number>(0);
  const [respostas, setRespostas] = useState<Respostas>({});

  // Dados de exemplo para os simulados disponíveis
  const simulados: Simulado[] = [
    {
      id: 1,
      titulo: "Simulado Completo ALEGO",
      questoes: 30,
      duracao: 120,
      dificuldade: "Médio",
      dataCriacao: "01/06/2025",
    },
    {
      id: 2,
      titulo: "Regimento Interno - Básico",
      questoes: 15,
      duracao: 60,
      dificuldade: "Fácil",
      dataCriacao: "31/05/2025",
    },
    {
      id: 3,
      titulo: "Estrutura Administrativa - Avançado",
      questoes: 20,
      duracao: 90,
      dificuldade: "Difícil",
      dataCriacao: "30/05/2025",
    },
    {
      id: 4,
      titulo: "Polícia Legislativa - Específico",
      questoes: 10,
      duracao: 45,
      dificuldade: "Médio",
      dataCriacao: "29/05/2025",
    },
  ];

  // Dados de exemplo para as questões do simulado
  const questoesSimulado: Questao[] = [
    {
      id: 1,
      enunciado:
        "Quem exerce a administração da Assembleia Legislativa do Estado de Goiás?",
      alternativas: [
        "O Presidente da Assembleia, de forma exclusiva.",
        "A Mesa Diretora, com o apoio dos órgãos de assessoramento, coordenação e execução.",
        "O Governador do Estado, através de delegação constitucional.",
        "O Secretário-Geral da Assembleia, por delegação da Mesa Diretora.",
        "O Colégio de Líderes, em conjunto com a Mesa Diretora.",
      ],
      resposta: 1,
    },
    {
      id: 2,
      enunciado: "Como é composta a Mesa Diretora da ALEGO?",
      alternativas: [
        "Presidente, Vice-Presidente e Secretário.",
        "Presidente, 1º e 2º Vice-Presidentes, e 1º e 2º Secretários.",
        "Presidente, 1º e 2º Vice-Presidentes, e 1º, 2º, 3º e 4º Secretários.",
        "Presidente, Vice-Presidente, Secretário e Tesoureiro.",
        "Presidente, Secretário-Geral e Diretores de Departamento.",
      ],
      resposta: 2,
    },
    {
      id: 3,
      enunciado:
        "Qual é a finalidade da Secretaria de Polícia Legislativa da ALEGO?",
      alternativas: [
        "Apenas realizar a segurança do Presidente da Assembleia.",
        "Exclusivamente controlar o acesso de visitantes ao prédio da Assembleia.",
        "Preservar a ordem e a segurança interna, garantir a segurança dos parlamentares, servidores e visitantes, entre outras atribuições.",
        "Substituir a Polícia Militar em todas as suas funções dentro do Estado de Goiás.",
        "Realizar apenas a investigação de crimes ocorridos nas dependências da Assembleia.",
      ],
      resposta: 2,
    },
    {
      id: 4,
      enunciado: "Quais são os tipos de sessões da Assembleia Legislativa?",
      alternativas: [
        "Apenas ordinárias e extraordinárias.",
        "Ordinárias, extraordinárias e secretas.",
        "Preparatórias, ordinárias, extraordinárias, solenes e especiais.",
        "Regulares, especiais e comemorativas.",
        "Plenárias, de comissões e administrativas.",
      ],
      resposta: 2,
    },
    {
      id: 5,
      enunciado: "O que são as Comissões Permanentes na ALEGO?",
      alternativas: [
        "Órgãos temporários criados para investigar denúncias contra deputados.",
        "Órgãos técnicos que têm por finalidade apreciar os assuntos ou proposições submetidos ao seu exame e sobre eles emitir parecer.",
        "Grupos de trabalho formados exclusivamente por servidores efetivos da Assembleia.",
        "Órgãos de assessoramento direto ao Presidente da Assembleia.",
        "Conselhos consultivos formados por representantes da sociedade civil.",
      ],
      resposta: 1,
    },
  ];

  const handleSimuladoSelect = (simulado: Simulado) => {
    setSelectedSimulado(simulado);
    setSimuladoEmAndamento(false);
    setQuestaoAtual(0);
    setRespostas({});
  };

  const handleIniciarSimulado = () => {
    setSimuladoEmAndamento(true);
    setQuestaoAtual(0);
    setRespostas({});
  };

  const handleProximaQuestao = () => {
    if (questaoAtual < questoesSimulado.length - 1) {
      setQuestaoAtual(questaoAtual + 1);
    }
  };

  const handleQuestaoAnterior = () => {
    if (questaoAtual > 0) {
      setQuestaoAtual(questaoAtual - 1);
    }
  };

  const handleRespostaChange = (value: string) => {
    setRespostas({
      ...respostas,
      [questoesSimulado[questaoAtual].id]: parseInt(value),
    });
  };

  const handleFinalizarSimulado = () => {
    // Implementação da finalização do simulado
    console.log("Finalizando simulado", respostas);
    // Aqui seria implementada a lógica de correção e feedback
    alert(
      "Simulado finalizado! Na versão final, você veria seus resultados detalhados aqui.",
    );
    setSimuladoEmAndamento(false);
  };

  const handleCriarSimulado = () => {
    // Implementação da criação de novo simulado
    console.log("Criando novo simulado");
    // Aqui seria implementada a lógica de criação real
    alert(
      "Funcionalidade de criação de simulado será implementada na versão final",
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Simulados</h1>
        <Button onClick={handleCriarSimulado}>Novo Simulado</Button>
      </div>

      {!simuladoEmAndamento ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Simulados Disponíveis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {simulados.map((simulado) => (
                    <div
                      key={simulado.id}
                      className={`p-3 rounded-md cursor-pointer hover:bg-accent transition-colors ${selectedSimulado?.id === simulado.id ? "bg-accent" : ""}`}
                      onClick={() => handleSimuladoSelect(simulado)}
                    >
                      <h3 className="font-medium">{simulado.titulo}</h3>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{simulado.questoes} questões</span>
                        <span>{simulado.duracao} min</span>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground mt-1">
                        <span>Dificuldade: {simulado.dificuldade}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Criado em: {simulado.dataCriacao}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Histórico de Simulados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 rounded-md border">
                    <h3 className="font-medium">Simulado Completo ALEGO</h3>
                    <div className="flex justify-between text-sm">
                      <span>Realizado: 28/05/2025</span>
                      <span className="font-medium">75%</span>
                    </div>
                    <Progress value={75} className="mt-2 h-2" />
                  </div>
                  <div className="p-3 rounded-md border">
                    <h3 className="font-medium">Regimento Interno - Básico</h3>
                    <div className="flex justify-between text-sm">
                      <span>Realizado: 25/05/2025</span>
                      <span className="font-medium">82%</span>
                    </div>
                    <Progress value={82} className="mt-2 h-2" />
                  </div>
                  <Button variant="outline" className="w-full mt-2">
                    Ver Histórico Completo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {selectedSimulado ? (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedSimulado.titulo}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-muted rounded-md text-center">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Questões
                        </h3>
                        <p className="text-2xl font-bold">
                          {selectedSimulado.questoes}
                        </p>
                      </div>
                      <div className="p-4 bg-muted rounded-md text-center">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Duração
                        </h3>
                        <p className="text-2xl font-bold">
                          {selectedSimulado.duracao} min
                        </p>
                      </div>
                      <div className="p-4 bg-muted rounded-md text-center">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Dificuldade
                        </h3>
                        <p className="text-2xl font-bold">
                          {selectedSimulado.dificuldade}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-card rounded-md border">
                      <h3 className="font-medium mb-2">Descrição</h3>
                      <p className="text-muted-foreground">
                        Este simulado aborda os principais tópicos relacionados
                        à {selectedSimulado.titulo.split(" - ")[0]}. Ideal para
                        testar seus conhecimentos e preparar-se para o concurso
                        da ALEGO.
                      </p>
                    </div>

                    <div className="p-4 bg-card rounded-md border">
                      <h3 className="font-medium mb-2">Instruções</h3>
                      <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                        <li>
                          Você terá {selectedSimulado.duracao} minutos para
                          responder {selectedSimulado.questoes} questões
                        </li>
                        <li>
                          Cada questão possui apenas uma alternativa correta
                        </li>
                        <li>Você pode navegar livremente entre as questões</li>
                        <li>
                          Ao finalizar, você receberá seu resultado e poderá
                          revisar as questões
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={handleIniciarSimulado}>
                    Iniciar Simulado
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <div className="flex items-center justify-center h-[500px] bg-muted rounded-lg">
                <div className="text-center">
                  <h3 className="text-lg font-medium">
                    Nenhum simulado selecionado
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Selecione um simulado existente ou crie um novo
                  </p>
                  <Button onClick={handleCriarSimulado}>
                    Criar Novo Simulado
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b">
              <div className="flex justify-between items-center">
                <CardTitle>
                  {selectedSimulado?.titulo || ""} - Questão {questaoAtual + 1}/
                  {questoesSimulado.length}
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  Tempo restante: 01:45:30
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="p-4 bg-muted rounded-md">
                  <h3 className="font-medium mb-2">
                    Questão {questaoAtual + 1}
                  </h3>
                  <p>{questoesSimulado[questaoAtual].enunciado}</p>
                </div>

                <RadioGroup
                  value={
                    respostas[questoesSimulado[questaoAtual].id]?.toString() ||
                    ""
                  }
                  onValueChange={handleRespostaChange}
                >
                  {questoesSimulado[questaoAtual].alternativas.map(
                    (alternativa, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-2 p-3 rounded-md hover:bg-accent"
                      >
                        <RadioGroupItem
                          value={index.toString()}
                          id={`alternativa-${index}`}
                        />
                        <Label
                          htmlFor={`alternativa-${index}`}
                          className="flex-1 cursor-pointer"
                        >
                          {alternativa}
                        </Label>
                      </div>
                    ),
                  )}
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter className="border-t flex justify-between">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={handleQuestaoAnterior}
                  disabled={questaoAtual === 0}
                >

                  Anterior
                </Button>
                <Button
                  variant="outline"
                  onClick={handleProximaQuestao}
                  disabled={questaoAtual === questoesSimulado.length - 1}
                >
                  Próximo
                </Button>
              </div>
              <Button onClick={handleFinalizarSimulado}>
                Finalizar Simulado
              </Button>
            </CardFooter>
          </Card>

          <div className="p-4 bg-card rounded-md border">
            <h3 className="font-medium mb-4">Navegação de Questões</h3>
            <div className="flex flex-wrap gap-2">
              {questoesSimulado.map((questao, index) => (
                <Button
                  key={questao.id}
                  variant={
                    questaoAtual === index
                      ? "default"
                      : respostas[questao.id] !== undefined
                        ? "outline"
                        : "ghost"
                  }
                  className="w-10 h-10 p-0"
                  onClick={() => setQuestaoAtual(index)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimuladoArea;
