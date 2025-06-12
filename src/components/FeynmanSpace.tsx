import { useState } from 'react';

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
  const [novoTitulo, setNovoTitulo] = useState<string>('');
  const [novoTopico, setNovoTopico] = useState<string>('');

  // Dados de exemplo para as explicações existentes
  const explicacoes: ExplicacaoFeynman[] = [
    { 
      id: 1, 
      titulo: 'Como funciona a Mesa Diretora da ALEGO',
      topico: 'Organização Administrativa',
      conteudo: 'A Mesa Diretora é como o "time de gerência" da Assembleia Legislativa. Imagine uma empresa grande - ela precisa de diretores para coordenar tudo, certo? A Mesa Diretora faz exatamente isso na ALEGO.\n\nEla é formada por deputados eleitos pelos próprios colegas e tem a responsabilidade de administrar a Assembleia. É como se fosse o "conselho executivo" da casa.\n\nSuas principais funções são: dirigir os trabalhos legislativos, gerir o orçamento, representar a Assembleia externamente e coordenar as atividades administrativas. Funciona como o cérebro administrativo de toda a estrutura.',
      dataEdicao: '02/06/2025',
      avaliacaoClasse: 'boa'
    },
    { 
      id: 2, 
      titulo: 'O que são Comissões Permanentes',
      topico: 'Regimento Interno',
      conteudo: 'Imagine as comissões como "grupos especializados" dentro da Assembleia. É como se você tivesse uma empresa com diferentes departamentos - cada um cuidando de uma área específica.\n\nAs Comissões Permanentes são esses "departamentos" que analisam projetos de lei de acordo com sua especialidade. Por exemplo: a Comissão de Saúde analisa projetos relacionados à saúde, a de Educação cuida dos projetos educacionais, e assim por diante.\n\nCada comissão tem deputados membros que estudam profundamente os assuntos de sua área, fazem audiências públicas e dão parecer sobre os projetos. É uma forma de garantir que cada lei seja analisada por pessoas que realmente entendem do assunto.',
      dataEdicao: '01/06/2025',
      avaliacaoClasse: 'excelente'
    },
    { 
      id: 3, 
      titulo: 'Funcionamento da Polícia Legislativa',
      topico: 'Secretaria de Polícia Legislativa',
      conteudo: 'A Polícia Legislativa é como a "segurança interna" da Assembleia Legislativa. Pense nela como os seguranças de um shopping ou de uma empresa - mas com poderes especiais para proteger um ambiente muito importante.\n\nEla cuida da segurança de toda a Assembleia: protege os deputados, funcionários e visitantes, controla o acesso aos prédios e garante que as sessões aconteçam sem problemas.\n\nTem autoridade para fazer prisões dentro da Assembleia e investigar crimes que aconteçam no local. É como se fosse uma "mini polícia" especializada em proteger o Poder Legislativo.',
      dataEdicao: '31/05/2025',
      avaliacaoClasse: 'media'
    },
  ];

  const topicos = [
    'Organização Administrativa',
    'Regimento Interno', 
    'Secretaria de Polícia Legislativa',
    'Estrutura Administrativa',
    'Mesa Diretora',
    'Comissões',
    'Processo Legislativo'
  ];

  const handleExplicacaoSelect = (explicacao: ExplicacaoFeynman) => {
    setSelectedExplicacao(explicacao);
    setConteudoEditor(explicacao.conteudo);
    setNovoTitulo(explicacao.titulo);
    setNovoTopico(explicacao.topico);
    setModoEdicao(false);
  };

  const handleNovaExplicacao = () => {
    setSelectedExplicacao(null);
    setConteudoEditor('');
    setNovoTitulo('');
    setNovoTopico('');
    setModoEdicao(true);
  };

  const handleSalvar = () => {
    console.log('Salvando explicação:', { titulo: novoTitulo, topico: novoTopico, conteudo: conteudoEditor });
    alert('Explicação salva com sucesso! (Funcionalidade completa será implementada na versão final)');
    setModoEdicao(false);
  };

  const handleAvaliarExplicacao = (avaliacao: string) => {
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="section-title" style={{ margin: 0, border: 'none', padding: 0 }}>🧠 Espaço Feynman</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>
            Pratique explicar conceitos de forma simples e clara
          </p>
        </div>
        <button className="simple-btn" onClick={handleNovaExplicacao}>Nova Explicação</button>
      </div>

      <div className="simple-grid" style={{ gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="simple-card">
            <h2>Minhas Explicações</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              {explicacoes.map((explicacao) => (
                <div 
                  key={explicacao.id} 
                  style={{ 
                    padding: '1rem', 
                    cursor: 'pointer', 
                    border: selectedExplicacao?.id === explicacao.id ? '2px solid var(--primary-blue)' : '1px solid var(--border-color)',
                    borderRadius: '8px',
                    backgroundColor: selectedExplicacao?.id === explicacao.id ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => handleExplicacaoSelect(explicacao)}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '0.95rem', margin: 0, fontWeight: '600', lineHeight: '1.3', flex: 1 }}>{explicacao.titulo}</h3>
                    <div 
                      style={{
                        width: '12px', 
                        height: '12px', 
                        borderRadius: '50%',
                        backgroundColor: getAvaliacaoColor(explicacao.avaliacaoClasse),
                        marginLeft: '0.5rem',
                        flexShrink: 0
                      }}
                      title={`Avaliação: ${explicacao.avaliacaoClasse}`}
                    ></div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: '0 0 0.5rem 0' }}>{explicacao.topico}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Editado em: {explicacao.dataEdicao}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="simple-card">
            <h2>Dicas Feynman</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '600', margin: '0 0 0.25rem 0' }}>1. Use linguagem simples</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Explique como se fosse para uma criança</p>
              </div>
              <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '600', margin: '0 0 0.25rem 0' }}>2. Use analogias</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Compare com situações do dia a dia</p>
              </div>
              <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '600', margin: '0 0 0.25rem 0' }}>3. Identifique lacunas</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Onde você tropeça, precisa estudar mais</p>
              </div>
              <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '600', margin: '0 0 0.25rem 0' }}>4. Seja específico</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Evite jargões e termos vagos</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          {selectedExplicacao || modoEdicao ? (
            <div className="simple-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ margin: 0 }}>
                    {modoEdicao ? 'Nova Explicação Feynman' : selectedExplicacao?.titulo}
                  </h2>
                  {selectedExplicacao && !modoEdicao && (
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>
                      Tópico: {selectedExplicacao.topico}
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {!modoEdicao && (
                    <button className="simple-btn-outline" onClick={() => setModoEdicao(true)} style={{ padding: '0.5rem 1rem' }}>
                      Editar
                    </button>
                  )}
                  {modoEdicao && (
                    <>
                      <button className="simple-btn-outline" onClick={() => setModoEdicao(false)} style={{ padding: '0.5rem 1rem' }}>
                        Cancelar
                      </button>
                      <button className="simple-btn" onClick={handleSalvar} style={{ padding: '0.5rem 1rem' }}>
                        Salvar
                      </button>
                    </>
                  )}
                </div>
              </div>

              {modoEdicao ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label style={{ fontSize: '0.9rem', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>Título da Explicação</label>
                    <input 
                      type="text" 
                      className="simple-input"
                      value={novoTitulo}
                      onChange={(e) => setNovoTitulo(e.target.value)}
                      placeholder="Ex: Como funciona a Mesa Diretora da ALEGO"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.9rem', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>Tópico</label>
                    <select 
                      className="simple-input"
                      value={novoTopico}
                      onChange={(e) => setNovoTopico(e.target.value)}
                    >
                      <option value="">Selecione o tópico</option>
                      {topicos.map((topico) => (
                        <option key={topico} value={topico}>{topico}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.9rem', fontWeight: '600', display: 'block', marginBottom: '0.5rem' }}>Sua Explicação</label>
                    <textarea
                      value={conteudoEditor}
                      onChange={(e) => setConteudoEditor(e.target.value)}
                      placeholder="Explique o conceito de forma simples e clara, como se estivesse ensinando para alguém que nunca ouviu falar sobre o assunto..."
                      className="simple-input"
                      style={{ minHeight: '400px', resize: 'vertical', fontFamily: 'inherit' }}
                    />
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 1rem 0' }}>Sua Explicação:</h3>
                    <div style={{ fontSize: '1rem', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                      {selectedExplicacao?.conteudo}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 1rem 0' }}>Como você avalia esta explicação?</h4>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button 
                        className="simple-btn-outline" 
                        onClick={() => handleAvaliarExplicacao('ruim')}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', color: '#ef4444', borderColor: '#ef4444' }}
                      >
                        Ruim - Confusa
                      </button>
                      <button 
                        className="simple-btn-outline" 
                        onClick={() => handleAvaliarExplicacao('media')}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', color: '#f59e0b', borderColor: '#f59e0b' }}
                      >
                        Média - Ok
                      </button>
                      <button 
                        className="simple-btn-outline" 
                        onClick={() => handleAvaliarExplicacao('boa')}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', color: '#3b82f6', borderColor: '#3b82f6' }}
                      >
                        Boa - Clara
                      </button>
                      <button 
                        className="simple-btn-outline" 
                        onClick={() => handleAvaliarExplicacao('excelente')}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', color: '#10b981', borderColor: '#10b981' }}
                      >
                        Excelente - Muito Clara
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="simple-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '500px' }}>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem' }}>Bem-vindo ao Espaço Feynman!</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '400px' }}>
                  Aqui você pratica explicar conceitos complexos de forma simples. 
                  Selecione uma explicação existente ou crie uma nova.
                </p>
                <button className="simple-btn" onClick={handleNovaExplicacao}>
                  Criar Primeira Explicação
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeynmanSpace;
