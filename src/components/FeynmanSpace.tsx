import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

// Definindo interfaces para tipagem
interface ExplicacaoFeynman {
  id: number;
  titulo: string;
  topico: string;
  conteudo: string;
  dataEdicao: string;
  avaliacaoClasse: string;
}

const FeynmanSpace: React.FC = () => {
  const [selectedExplicacao, setSelectedExplicacao] = useState<ExplicacaoFeynman | null>(null);
  const [conteudoEditor, setConteudoEditor] = useState<string>('');
  const [modoEdicao, setModoEdicao] = useState<boolean>(false);

  // Dados de exemplo para as explicações existentes
  const explicacoes: ExplicacaoFeynman[] = [
    { 
      id: 1, 
      titulo: 'Como funciona a Mesa Diretora da ALEGO',
      topico: 'Organização Administrativa',
      conteudo: 'A Mesa Diretora é como o "time de gerência" da Assembleia...',
      dataEdicao: '02/06/2025',
      avaliacaoClasse: 'boa'
    },
    { 
      id: 2, 
      titulo: 'O que são Comissões Permanentes',
      topico: 'Regimento Interno',
      conteudo: 'Imagine as comissões como "grupos especializados"...',
      dataEdicao: '01/06/2025',
      avaliacaoClasse: 'excelente'
    },
    { 
      id: 3, 
      titulo: 'Funcionamento da Polícia Legislativa',
      topico: 'Secretaria de Polícia Legislativa',
      conteudo: 'A Polícia Legislativa é como a "segurança interna"...',
      dataEdicao: '31/05/2025',
      avaliacaoClasse: 'media'
    },
  ];

  const handleExplicacaoSelect = (explicacao: ExplicacaoFeynman) => {
    setSelectedExplicacao(explicacao);
    setConteudoEditor(explicacao.conteudo);
    setModoEdicao(false);
  };

  const handleNovaExplicacao = () => {
    setSelectedExplicacao(null);
    setConteudoEditor('');
    setModoEdicao(true);
  };

  const handleSalvar = () => {
    // Implementação do salvamento
    console.log('Salvando explicação:', conteudoEditor);
    alert('Explicação salva com sucesso! (Funcionalidade completa será implementada na versão final)');
    setModoEdicao(false);
  };

  const handleAvaliarExplicacao = (avaliacao: string) => {
    // Implementação da avaliação
    console.log('Avaliando explicação como:', avaliacao);
    alert(`Explicação avaliada como "${avaliacao}"! Isso ajudará a melhorar suas explicações futuras.`);
  };

  const getAvaliacaoColor = (classe: string) => {
    switch(classe) {
      case 'excelente': return '#10b981';
      case 'boa': return '#3b82f6';
      case 'media': return '#f59e0b';
      case 'ruim': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Espaço Feynman</h1>
          <p className="text-muted-foreground mt-2">
            Pratique explicar conceitos de forma simples e clara
          </p>
        </div>
        <Button onClick={handleNovaExplicacao}>Nova Explicação</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Minhas Explicações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {explicacoes.map((explicacao) => (
                  <div 
                    key={explicacao.id} 
                    className={`p-3 rounded-md cursor-pointer hover:bg-accent transition-colors ${selectedExplicacao?.id === explicacao.id ? 'bg-accent' : ''}`}
                    onClick={() => handleExplicacaoSelect(explicacao)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-sm">{explicacao.titulo}</h3>
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getAvaliacaoColor(explicacao.avaliacaoClasse) }}
                        title={`Avaliação: ${explicacao.avaliacaoClasse}`}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground">{explicacao.topico}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Editado em: {explicacao.dataEdicao}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dicas Feynman</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-muted rounded-md">
                  <h4 className="font-medium mb-1">1. Use linguagem simples</h4>
                  <p className="text-xs">Explique como se fosse para uma criança</p>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <h4 className="font-medium mb-1">2. Use analogias</h4>
                  <p className="text-xs">Compare com situações do dia a dia</p>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <h4 className="font-medium mb-1">3. Identifique lacunas</h4>
                  <p className="text-xs">Onde você tropeça, precisa estudar mais</p>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <h4 className="font-medium mb-1">4. Seja específico</h4>
                  <p className="text-xs">Evite jargões e termos vagos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {selectedExplicacao || modoEdicao ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>
                    {modoEdicao ? 'Nova Explicação Feynman' : selectedExplicacao?.titulo}
                  </CardTitle>
                  <div className="flex space-x-2">
                    {!modoEdicao && (
                      <Button 
                        variant="outline" 
                        onClick={() => setModoEdicao(true)}
                      >
                        Editar
                      </Button>
                    )}
                    {modoEdicao && (
                      <>
                        <Button 
                          variant="outline" 
                          onClick={() => setModoEdicao(false)}
                        >
                          Cancelar
                        </Button>
                        <Button onClick={handleSalvar}>
                          Salvar
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                {selectedExplicacao && !modoEdicao && (
                  <p className="text-sm text-muted-foreground">
                    Tópico: {selectedExplicacao.topico}
                  </p>
                )}
              </CardHeader>
              <CardContent>
                {modoEdicao ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Título da Explicação</label>
                      <Input 
                        type="text" 
                        className="w-full mt-1"
                        placeholder="Ex: Como funciona a Mesa Diretora da ALEGO"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Tópico</label>
                      <Select>
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue placeholder="Selecione o tópico" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="organizacao">Organização Administrativa</SelectItem>
                          <SelectItem value="regimento">Regimento Interno</SelectItem>
                          <SelectItem value="policia">Secretaria de Polícia Legislativa</SelectItem>
                          <SelectItem value="estrutura">Estrutura Administrativa</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Sua Explicação</label>
                      <Textarea
                        value={conteudoEditor}
                        onChange={(e) => setConteudoEditor(e.target.value)}
                        placeholder="Explique o conceito de forma simples e clara, como se estivesse ensinando para alguém que nunca ouviu falar sobre o assunto..."
                        className="mt-1 min-h-[400px] resize-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-md">
                      <h3 className="font-medium mb-2">Sua Explicação:</h3>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {selectedExplicacao?.conteudo}
                        </p>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="font-medium mb-3">Como você avalia esta explicação?</h4>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAvaliarExplicacao('ruim')}
                          className="text-red-600 hover:bg-red-50"
                        >
                          Ruim - Confusa
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAvaliarExplicacao('media')}
                          className="text-yellow-600 hover:bg-yellow-50"
                        >
                          Média - Ok
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAvaliarExplicacao('boa')}
                          className="text-blue-600 hover:bg-blue-50"
                        >
                          Boa - Clara
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAvaliarExplicacao('excelente')}
                          className="text-green-600 hover:bg-green-50"
                        >
                          Excelente - Muito Clara
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-[500px] bg-muted rounded-lg">
              <div className="text-center">
                <h3 className="text-lg font-medium">Bem-vindo ao Espaço Feynman!</h3>
                <p className="text-muted-foreground mb-4 max-w-md">
                  Aqui você pratica explicar conceitos complexos de forma simples. 
                  Selecione uma explicação existente ou crie uma nova.
                </p>
                <Button onClick={handleNovaExplicacao}>
                  Criar Primeira Explicação
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeynmanSpace;