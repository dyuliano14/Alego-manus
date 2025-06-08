
import { useState } from 'react';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 className="section-title" style={{ margin: 0, border: 'none', padding: 0 }}>Dashboard</h1>
        <button className="simple-btn">Iniciar Sessão de Estudo</button>
      </div>

      <div className="simple-grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="simple-card">
          <h2>Estudo Atual</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{estudoAtual.materia}</h3>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                <span>Progresso</span>
                <span>{estudoAtual.progresso}%</span>
              </div>
              <div style={{ 
                width: '100%', 
                height: '8px', 
                backgroundColor: '#e2e8f0', 
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{ 
                  width: `${estudoAtual.progresso}%`, 
                  height: '100%', 
                  backgroundColor: 'var(--primary-blue)',
                  transition: 'width 0.3s ease'
                }}></div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Próxima revisão: {estudoAtual.proximaRevisao}</span>
              <button className="simple-btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Continuar</button>
            </div>
          </div>
        </div>

        <div className="simple-card">
          <h2>Cronograma Semanal</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span>Segunda</span>
              <span style={{ color: 'var(--text-secondary)' }}>Res. 1.073</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span>Terça</span>
              <span style={{ color: 'var(--text-secondary)' }}>Res. 1.218</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span>Quarta</span>
              <span style={{ color: 'var(--text-secondary)' }}>Res. 1.771</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span>Quinta</span>
              <span style={{ color: 'var(--text-secondary)' }}>Res. 1.007</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span>Sexta</span>
              <span style={{ color: 'var(--text-secondary)' }}>Revisão</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span>Sábado</span>
              <span style={{ color: 'var(--text-secondary)' }}>Simulado</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span>Domingo</span>
              <span style={{ color: 'var(--text-secondary)' }}>Descanso</span>
            </div>
          </div>
        </div>
      </div>

      <div className="simple-grid" style={{ gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        <div className="simple-card">
          <h2>Próximas Atividades</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {proximasAtividades.map((atividade, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      marginRight: '0.5rem',
                      backgroundColor: 
                        atividade.tipo === 'Revisão' ? '#3b82f6' :
                        atividade.tipo === 'Novo Conteúdo' ? '#10b981' :
                        atividade.tipo === 'Simulado' ? '#f59e0b' : '#8b5cf6'
                    }}></div>
                    <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{atividade.tipo}</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', margin: '0.25rem 0', paddingLeft: '1.25rem' }}>{atividade.titulo}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.25rem 0', paddingLeft: '1.25rem' }}>{atividade.horario}</p>
                </div>
                <button className="simple-btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', marginLeft: '0.5rem' }}>Iniciar</button>
              </div>
            ))}
          </div>
        </div>

        <div className="simple-card">
          <h2>Estatísticas de Estudo</h2>
          <div className="simple-grid simple-grid-2" style={{ gap: '1.5rem' }}>
            {estatisticas.map((estatistica, index) => (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span>{estatistica.label}</span>
                  <span style={{ fontWeight: '600' }}>{estatistica.valor}</span>
                </div>
                {estatistica.progresso !== undefined && (
                  <div style={{ 
                    width: '100%', 
                    height: '4px', 
                    backgroundColor: '#e2e8f0', 
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      width: `${estatistica.progresso}%`, 
                      height: '100%', 
                      backgroundColor: 'var(--primary-blue)',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
