import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';

// Definindo interfaces para tipagem
interface Collection {
  id: number;
  titulo: string;
  quantidade: number;
  progresso: number;
  ultimoEstudo: string;
}

interface Flashcard {
  pergunta: string;
  resposta: string;
}

const Flashcards: React.FC = () => {
  const [currentCard, setCurrentCard] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  
  // Dados de exemplo para as coleções de flashcards
  const collections: Collection[] = [
    { 
      id: 1, 
      titulo: 'Resolução nº 1.073 - Regulamento Administrativo', 
      quantidade: 20,
      progresso: 65,
      ultimoEstudo: '01/06/2025'
    },
    { 
      id: 2, 
      titulo: 'Resolução nº 1.218 - Regimento Interno', 
      quantidade: 30,
      progresso: 40,
      ultimoEstudo: '31/05/2025'
    },
    { 
      id: 3, 
      titulo: 'Resolução nº 1.771 - Polícia Legislativa', 
      quantidade: 20,
      progresso: 25,
      ultimoEstudo: '30/05/2025'
    },
    { 
      id: 4, 
      titulo: 'Resolução nº 1.007 - Estrutura Administrativa', 
      quantidade: 25,
      progresso: 10,
      ultimoEstudo: '29/05/2025'
    },
  ];

  // Dados de exemplo para os flashcards da coleção selecionada
  const flashcardsData: Flashcard[] = [
    {
      pergunta: 'Quem exerce a administração da Assembleia Legislativa do Estado de Goiás?',
      resposta: 'A administração da Assembleia Legislativa é exercida pela Mesa Diretora, com o apoio dos órgãos de assessoramento, coordenação e execução.'
    },
    {
      pergunta: 'Quais são os sistemas administrativos que compõem a estrutura da ALEGO?',
      resposta: 'Sistema de Planejamento e Orçamento; Sistema de Administração Financeira; Sistema de Contabilidade; Sistema de Administração de Material e Patrimônio; Sistema de Administração de Serviços Gerais; Sistema de Administração de Recursos Humanos; Sistema de Modernização Administrativa.'
    },
    {
      pergunta: 'O que são os cargos em comissão na ALEGO?',
      resposta: 'São cargos de livre nomeação e exoneração, destinados às atribuições de direção, chefia e assessoramento, providos por ato do Presidente da Assembleia.'
    },
    {
      pergunta: 'Quem pode exercer funções especiais de confiança na ALEGO?',
      resposta: 'As funções especiais de confiança são exercidas exclusivamente por servidores ocupantes de cargo efetivo, designados para atribuições de direção, chefia e assessoramento.'
    },
    {
      pergunta: 'Qual é a restrição para nomeação de parentes para cargos em comissão na ALEGO?',
      resposta: 'É vedada a nomeação para cargo em comissão ou a designação para função especial de confiança de cônjuge, companheiro ou parente até o terceiro grau civil dos membros da Mesa Diretora, salvo se servidor efetivo da Assembleia.'
    }
  ];

  const handleCollectionSelect = (collection: Collection) => {
    setSelectedCollection(collection);
    setCurrentCard(0);
    setShowAnswer(false);
  };

  const handleNextCard = () => {
    if (currentCard < flashcardsData.length - 1) {
      setCurrentCard(currentCard + 1);
      setShowAnswer(false);
    }
  };

  const handlePrevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
      setShowAnswer(false);
    }
  };

  const handleCreateCollection = () => {
    // Implementação da criação de nova coleção
    console.log('Criando nova coleção de flashcards');
    // Aqui seria implementada a lógica de criação real
    alert('Funcionalidade de criação de coleção será implementada na versão final');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Flashcards</h1>
        <Button onClick={handleCreateCollection}>Nova Coleção</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Minhas Coleções</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {collections.map((collection) => (
                  <div 
                    key={collection.id} 
                    className={`p-3 rounded-md cursor-pointer hover:bg-accent transition-colors ${selectedCollection?.id === collection.id ? 'bg-accent' : ''}`}
                    onClick={() => handleCollectionSelect(collection)}
                  >
                    <h3 className="font-medium">{collection.titulo}</h3>
                    <p className="text-sm text-muted-foreground">{collection.quantidade} cartões</p>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Progresso</span>
                        <span>{collection.progresso}%</span>
                      </div>
                      <Progress value={collection.progresso} className="h-1" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Último estudo: {collection.ultimoEstudo}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {selectedCollection ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{selectedCollection.titulo}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="estudo">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="estudo">Modo Estudo</TabsTrigger>
                      <TabsTrigger value="teste">Modo Teste</TabsTrigger>
                      <TabsTrigger value="gerenciar">Gerenciar Cartões</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="estudo" className="mt-4">
                      <Card className="border-2">
                        <CardContent className="pt-6">
                          <div className="min-h-[300px] flex flex-col items-center justify-center p-6 text-center">
                            {showAnswer ? (
                              <div className="space-y-4">
                                <h3 className="text-xl font-semibold text-muted-foreground">Resposta:</h3>
                                <p className="text-lg">{flashcardsData[currentCard].resposta}</p>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <h3 className="text-xl font-semibold">Pergunta:</h3>
                                <p className="text-lg">{flashcardsData[currentCard].pergunta}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between border-t p-4">
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              onClick={handlePrevCard}
                              disabled={currentCard === 0}
                            >
                              Anterior
                            </Button>
                            <Button 
                              variant="outline" 
                              onClick={handleNextCard}
                              disabled={currentCard === flashcardsData.length - 1}
                            >
                              Próximo
                            </Button>
                          </div>
                          <Button onClick={() => setShowAnswer(!showAnswer)}>
                            {showAnswer ? 'Mostrar Pergunta' : 'Mostrar Resposta'}
                          </Button>
                        </CardFooter>
                      </Card>
                      <div className="flex justify-between items-center mt-4">
                        <div className="text-sm text-muted-foreground">
                          Cartão {currentCard + 1} de {flashcardsData.length}
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Difícil</Button>
                          <Button variant="outline" size="sm">Médio</Button>
                          <Button variant="outline" size="sm">Fácil</Button>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="teste" className="mt-4">
                      <div className="p-8 text-center">
                        <h3 className="text-lg font-medium mb-4">Modo Teste</h3>
                        <p className="text-muted-foreground mb-6">
                          No modo teste, você responderá às perguntas sem ver as respostas e receberá uma pontuação ao final.
                        </p>
                        <Button>Iniciar Teste</Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="gerenciar" className="mt-4">
                      <div className="space-y-4">
                        {flashcardsData.map((card, index) => (
                          <Card key={index}>
                            <CardContent className="p-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-2">Pergunta:</h4>
                                  <p className="text-sm">{card.pergunta}</p>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Resposta:</h4>
                                  <p className="text-sm">{card.resposta}</p>
                                </div>
                              </div>
                              <div className="flex justify-end mt-4 space-x-2">
                                <Button variant="outline" size="sm">Editar</Button>
                                <Button variant="destructive" size="sm">Excluir</Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        <div className="flex justify-center">
                          <Button>Adicionar Novo Cartão</Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[500px] bg-muted rounded-lg">
              <div className="text-center">
                <h3 className="text-lg font-medium">Nenhuma coleção selecionada</h3>
                <p className="text-muted-foreground mb-4">Selecione uma coleção existente ou crie uma nova</p>
                <Button onClick={handleCreateCollection}>Criar Nova Coleção</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Flashcards;
