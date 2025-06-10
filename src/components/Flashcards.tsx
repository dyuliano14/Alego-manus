
import { useState } from 'react';

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
    console.log('Criando nova coleção de flashcards');
    alert('Funcionalidade de criação de coleção será implementada na versão final');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 className="section-title" style={{ margin: 0, border: 'none', padding: 0 }}>📚 Flashcards</h1>
        <button className="simple-btn" onClick={handleCreateCollection}>Nova Coleção</button>
      </div>

      <div className="simple-grid" style={{ gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        <div className="simple-card">
          <h2>Minhas Coleções</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            {collections.map((collection) => (
              <div 
                key={collection.id} 
                className={`${selectedCollection?.id === collection.id ? 'simple-card' : ''}`}
                style={{ 
                  padding: '1rem', 
                  cursor: 'pointer', 
                  border: selectedCollection?.id === collection.id ? '2px solid var(--primary-blue)' : '1px solid var(--border-color)',
                  borderRadius: '8px',
                  backgroundColor: selectedCollection?.id === collection.id ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => handleCollectionSelect(collection)}
              >
                <h3 style={{ fontSize: '1rem', margin: '0 0 0.5rem 0', fontWeight: '600' }}>{collection.titulo}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0 0 0.75rem 0' }}>{collection.quantidade} cartões</p>
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                    <span>Progresso</span>
                    <span>{collection.progresso}%</span>
                  </div>
                  <div style={{ 
                    width: '100%', 
                    height: '4px', 
                    backgroundColor: '#e2e8f0', 
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      width: `${collection.progresso}%`, 
                      height: '100%', 
                      backgroundColor: 'var(--primary-blue)',
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>Último estudo: {collection.ultimoEstudo}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          {selectedCollection ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="simple-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h2 style={{ margin: 0 }}>{selectedCollection.titulo}</h2>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="simple-btn" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Modo Estudo</button>
                    <button className="simple-btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>Modo Teste</button>
                  </div>
                </div>
                
                <div className="simple-card" style={{ border: '2px solid var(--border-color)', minHeight: '350px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center', minHeight: '300px' }}>
                    {showAnswer ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-secondary)', margin: 0 }}>Resposta:</h3>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', margin: 0 }}>{flashcardsData[currentCard].resposta}</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '600', margin: 0 }}>Pergunta:</h3>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', margin: 0 }}>{flashcardsData[currentCard].pergunta}</p>
                      </div>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        className="simple-btn-outline" 
                        onClick={handlePrevCard}
                        disabled={currentCard === 0}
                        style={{ 
                          padding: '0.5rem 1rem', 
                          opacity: currentCard === 0 ? 0.5 : 1,
                          cursor: currentCard === 0 ? 'not-allowed' : 'pointer'
                        }}
                      >
                        ← Anterior
                      </button>
                      <button 
                        className="simple-btn-outline" 
                        onClick={handleNextCard}
                        disabled={currentCard === flashcardsData.length - 1}
                        style={{ 
                          padding: '0.5rem 1rem',
                          opacity: currentCard === flashcardsData.length - 1 ? 0.5 : 1,
                          cursor: currentCard === flashcardsData.length - 1 ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Próximo →
                      </button>
                    </div>
                    <button className="simple-btn" onClick={() => setShowAnswer(!showAnswer)} style={{ padding: '0.5rem 1.5rem' }}>
                      {showAnswer ? 'Ver Pergunta' : 'Ver Resposta'}
                    </button>
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Cartão {currentCard + 1} de {flashcardsData.length}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="simple-btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', color: '#ef4444', borderColor: '#ef4444' }}>Difícil</button>
                    <button className="simple-btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', color: '#f59e0b', borderColor: '#f59e0b' }}>Médio</button>
                    <button className="simple-btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', color: '#10b981', borderColor: '#10b981' }}>Fácil</button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="simple-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '500px' }}>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1rem' }}>Nenhuma coleção selecionada</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Selecione uma coleção existente ou crie uma nova</p>
                <button className="simple-btn" onClick={handleCreateCollection}>Criar Nova Coleção</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Flashcards;
