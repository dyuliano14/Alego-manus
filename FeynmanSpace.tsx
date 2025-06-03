import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

// Definindo interfaces para tipagem
interface Topic {
  id: number;
  titulo: string;
  resolucao: string;
  ultimaExplicacao: string | null;
}

const FeynmanSpace: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [explanation, setExplanation] = useState<string>('');
  
  // Dados de exemplo para os tópicos disponíveis
  const topics: Topic[] = [
    { 
      id: 1, 
      titulo: 'Organização Administrativa da ALEGO', 
      resolucao: 'Resolução nº 1.073',
      ultimaExplicacao: '01/06/2025'
    },
    { 
      id: 2, 
      titulo: 'Mesa Diretora e Comissões', 
      resolucao: 'Resolução nº 1.218',
      ultimaExplicacao: '30/05/2025'
    },
    { 
      id: 3, 
      titulo: 'Atribuições da Polícia Legislativa', 
      resolucao: 'Resolução nº 1.771',
      ultimaExplicacao: null
    },
    { 
      id: 4, 
      titulo: 'Estrutura Administrativa da ALEGO', 
      resolucao: 'Resolução nº 1.007',
      ultimaExplicacao: null
    },
  ];

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    // Em uma implementação real, aqui carregaríamos a explicação existente, se houver
    setExplanation(topic.ultimaExplicacao ? 
      'Esta é uma explicação prévia sobre o tópico. Na versão final, a explicação salva anteriormente seria carregada aqui.' : 
      '');
  };

  const handleCreateNew = () => {
    setSelectedTopic(null);
    setExplanation('');
  };

  const handleSave = () => {
    // Implementação do salvamento da explicação
    console.log('Salvando explicação', explanation);
    // Aqui seria implementada a lógica de salvamento real
    alert('Explicação salva com sucesso!');
  };

  const handleRecordAudio = () => {
    // Implementação da gravação de áudio
    console.log('Iniciando gravação de áudio');
    // Aqui seria implementada a lógica de gravação real
    alert('Funcionalidade de gravação será implementada na versão final');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Espaço Feynman</h1>
        <div className="space-x-2">
          <Button onClick={handleCreateNew}>Nova Explicação</Button>
          {selectedTopic && (
            <>
              <Button variant="outline" onClick={handleRecordAudio}>Gravar Áudio</Button>
              <Button onClick={handleSave}>Salvar</Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tópicos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Input placeholder="Buscar tópicos..." />
                  <Select defaultValue="todos">
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Filtrar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="1073">Res. 1.073</SelectItem>
                      <SelectItem value="1007">Res. 1.007</SelectItem>
                      <SelectItem value="1218">Res. 1.218</SelectItem>
                      <SelectItem value="1771">Res. 1.771</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 mt-4">
                  {topics.map((topic) => (
                    <div 
                      key={topic.id} 
                      className={`p-3 rounded-md cursor-pointer hover:bg-accent transition-colors ${selectedTopic?.id === topic.id ? 'bg-accent' : ''}`}
                      onClick={() => handleTopicSelect(topic)}
                    >
                      <h3 className="font-medium">{topic.titulo}</h3>
                      <p className="text-sm text-muted-foreground">{topic.resolucao}</p>
                      {topic.ultimaExplicacao ? (
                        <p className="text-xs text-muted-foreground mt-1">Explicado em: {topic.ultimaExplicacao}</p>
                      ) : (
                        <p className="text-xs text-muted-foreground mt-1 italic">Ainda não explicado</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sobre o Método Feynman</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <p>O Método Feynman é uma técnica de aprendizagem que consiste em explicar um conceito em termos simples, como se estivesse ensinando a uma criança.</p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Escolha um tópico</li>
                  <li>Explique-o em termos simples</li>
                  <li>Identifique lacunas na sua explicação</li>
                  <li>Revise e simplifique ainda mais</li>
                </ol>
                <p className="italic">Esta técnica ajuda a consolidar o conhecimento e identificar pontos que você ainda não compreendeu completamente.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {selectedTopic || explanation !== '' ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedTopic ? `Explicando: ${selectedTopic.titulo}` : 'Nova Explicação'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {!selectedTopic && (
                    <div className="space-y-4 mb-4">
                      <Input placeholder="Título da explicação" />
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a resolução relacionada" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1073">Resolução nº 1.073</SelectItem>
                          <SelectItem value="1007">Resolução nº 1.007</SelectItem>
                          <SelectItem value="1218">Resolução nº 1.218</SelectItem>
                          <SelectItem value="1771">Resolução nº 1.771</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <div className="p-4 bg-muted rounded-md mb-4">
                    <h3 className="font-medium mb-2">Dicas para uma boa explicação Feynman:</h3>
                    <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                      <li>Use linguagem simples e evite jargões</li>
                      <li>Explique como se estivesse ensinando a alguém que não conhece o assunto</li>
                      <li>Use analogias e exemplos práticos</li>
                      <li>Identifique pontos que você tem dificuldade em explicar</li>
                    </ul>
                  </div>
                  
                  <Textarea 
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    className="min-h-[300px]"
                    placeholder="Escreva sua explicação aqui, usando linguagem simples como se estivesse explicando para alguém que não conhece o assunto..."
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancelar</Button>
                <Button onClick={handleSave}>Salvar Explicação</Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-[500px] bg-muted rounded-lg">
              <div className="text-center">
                <h3 className="text-lg font-medium">Nenhum tópico selecionado</h3>
                <p className="text-muted-foreground mb-4">Selecione um tópico existente ou crie uma nova explicação</p>
                <Button onClick={handleCreateNew}>Criar Nova Explicação</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeynmanSpace;
