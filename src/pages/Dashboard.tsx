
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';

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
  const [estudoAtual] = useState<EstudoAtual>({
    materia: 'Resolução nº 1.073 - Regulamento Administrativo',
    progresso: 65,
    proximaRevisao: '04/06/2025'
  });
  
  const proximasAtividades: ProximaAtividade[] = [
    {
      tipo: 'Revisão',
      titulo: 'Regimento Interno - Capítulos 1-3',
      horario: 'Hoje, 14:00'
    },
    {
      tipo: 'Novo Conteúdo',
      titulo: 'Resolução nº 1.073 - Capítulo 4',
      horario: 'Hoje, 16:30'
    },
    {
      tipo: 'Simulado',
      titulo: 'Simulado Temático - Regimento Interno',
      horario: 'Amanhã, 10:00'
    },
    {
      tipo: 'Flashcards',
      titulo: 'Revisão Espaçada - Resolução nº 1.007',
      horario: 'Amanhã, 15:00'
    }
  ];
  
  const estatisticas: Estatistica[] = [
    {
      label: 'Tempo de Estudo',
      valor: '24h 30min',
      progresso: 70
    },
    {
      label: 'Flashcards Revisados',
      valor: 120,
      progresso: 60
    },
    {
      label: 'Simulados Realizados',
      valor: 5,
      progresso: 50
    },
    {
      label: 'Explicações Feynman',
      valor: 8,
      progresso: 40
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button>Iniciar Sessão de Estudo</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Estudo Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{estudoAtual.materia}</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progresso</span>
                  <span>{estudoAtual.progresso}%</span>
                </div>
                <Progress value={estudoAtual.progresso} className="h-2" />
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Próxima revisão: {estudoAtual.proximaRevisao}</span>
                <Button variant="outline" size="sm">Continuar</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cronograma Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Segunda</span>
                <span className="text-muted-foreground">Res. 1.073</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Terça</span>
                <span className="text-muted-foreground">Res. 1.218</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Quarta</span>
                <span className="text-muted-foreground">Res. 1.771</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Quinta</span>
                <span className="text-muted-foreground">Res. 1.007</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Sexta</span>
                <span className="text-muted-foreground">Revisão</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Sábado</span>
                <span className="text-muted-foreground">Simulado</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Domingo</span>
                <span className="text-muted-foreground">Descanso</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Próximas Atividades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {proximasAtividades.map((atividade, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        atividade.tipo === 'Revisão' ? 'bg-blue-500' :
                        atividade.tipo === 'Novo Conteúdo' ? 'bg-green-500' :
                        atividade.tipo === 'Simulado' ? 'bg-orange-500' : 'bg-purple-500'
                      }`}></div>
                      <span className="text-sm font-medium">{atividade.tipo}</span>
                    </div>
                    <p className="text-sm mt-1">{atividade.titulo}</p>
                    <p className="text-xs text-muted-foreground mt-1">{atividade.horario}</p>
                  </div>
                  <Button variant="ghost" size="sm">Iniciar</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Estatísticas de Estudo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {estatisticas.map((estatistica, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{estatistica.label}</span>
                    <span>{estatistica.valor}</span>
                  </div>
                  {estatistica.progresso !== undefined && (
                    <Progress value={estatistica.progresso} className="h-1" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
