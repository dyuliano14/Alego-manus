// 📝 COMPONENTE PDFNotes - Sistema de Anotações Flutuantes
// 
// 🎯 OBJETIVO: Permitir que o usuário faça anotações enquanto lê PDFs
// 💡 CONCEITO: Botões flutuantes + balão de anotação que se sobrepõe ao conteúdo

import { useEffect, useState, useRef, memo } from "react";

// 📋 TYPESCRIPT: Define a estrutura de uma anotação
type Note = {
  id: number;      // Identificador único da nota
  texto: string;   // Conteúdo da anotação
  data: string;    // Quando foi criada
};

// 🔧 PROPS: O que este componente recebe do "pai" (ContentViewer)
interface Props {
  conteudoId: number; // ID do PDF/conteúdo para salvar as anotações
}

// 🌐 API: Pega a URL da API das variáveis de ambiente
const API = import.meta.env.VITE_API_URL;

// 🎯 COMPONENTE PRINCIPAL: React.FC = React Function Component
const PDFNotes: React.FC<Props> = ({ conteudoId }) => {
  // 🐛 DEBUG: Logs para acompanhar renderizações
  console.log('PDFNotes renderizado com conteudoId:', conteudoId, 'em:', new Date().toISOString());
  
  // 📊 ESTADO (useState): Variáveis que podem mudar e fazem o componente re-renderizar
  const [notes, setNotes] = useState<Note[]>([]);           // Lista de anotações
  const [input, setInput] = useState("");                   // Texto que o usuário está digitando
  const [showBalloon, setShowBalloon] = useState(false);    // Se o balão está aberto/fechado
  
  // 📍 REF: Referência para um elemento HTML (para scroll automático)
  const scrollRef = useRef<HTMLDivElement>(null);

  console.log('PDFNotes state - showBalloon:', showBalloon, 'notes:', notes.length);

  // 🖨️ FUNÇÃO DE IMPRESSÃO: Cria uma página HTML para imprimir as anotações
  // CONCEITO: window.open() abre uma nova janela/aba
  const handlePrintNotes = () => {
    const win = window.open('', '_blank'); // Abre nova aba em branco
    if (!win) return; // Se foi bloqueado pelo browser, para aqui
    
    // 📄 HTML: Monta uma página completa para impressão
    const html = `
      <html>
        <head>
          <title>Relatório de Anotações</title>
          <style>
            /* 🎨 CSS para deixar a impressão bonita */
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { text-align: center; margin-bottom: 32px; }
            .note { border-bottom: 1px solid #ccc; padding: 16px 0; }
            .note:last-child { border-bottom: none; }
            .note-text { font-size: 1.1em; margin-bottom: 8px; }
            .note-date { font-size: 0.9em; color: #666; text-align: right; }
          </style>
        </head>
        <body>
          <h1>Relatório de Anotações</h1>
          <div>
            ${notes.map(n => `
              <div class="note">
                <div class="note-text">${n.texto.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
                <div class="note-date">${new Date(n.data).toLocaleString('pt-BR')}</div>
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `;
    
    // 📝 Escreve o HTML na nova janela e imprime
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500); // Aguarda 500ms e abre diálogo de impressão
  };

  // 🔄 useEffect #1: CARREGA anotações existentes do servidor
  // CONCEITO: Executa quando o componente monta ou conteudoId muda
  useEffect(() => {
    if (!conteudoId) return; // Se não tem ID, não faz nada

    // 🌐 FETCH: Busca dados da API (como um WhatsApp pedindo mensagens)
    fetch(`${API}/api/anotacoes/${conteudoId}`)
      .then((res) => res.json())           // Converte resposta para JSON
      .then((data) => {
        // 📋 Verifica se recebeu uma lista
        if (Array.isArray(data)) {
          setNotes(
            data.map((a, i) => ({
              id: a.id ?? Date.now() + i,
              texto: a.texto,
              data: new Date().toISOString(),
            }))
          );
        }
      })
      .catch(console.error);
  }, [conteudoId]);

  useEffect(() => {
    if (!conteudoId || notes.length === 0) return;

    fetch(`${API}/api/anotacoes/${conteudoId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notes.map((n) => n.texto)),
    }).catch(console.error);
  }, [notes, conteudoId]);

  const addNote = () => {
    if (!input.trim()) return;
    const nova = {
      id: Date.now(),
      texto: input,
      data: new Date().toISOString(),
    };
    setNotes([...notes, nova]);
    setInput("");

    setTimeout(() => {
      scrollRef.current?.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 999999,
        fontFamily: 'Arial, sans-serif'
      }}
    >
      {/* Botão de teste COM CSS INLINE */}
      <button
        onClick={() => {
          alert('PDFNotes funcionando!');
          console.log('Clique detectado em:', new Date());
        }}
        style={{
          position: 'relative',
          backgroundColor: '#ff0000',
          color: 'white',
          padding: '15px',
          borderRadius: '50%',
          border: 'none',
          fontSize: '18px',
          fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          minWidth: '60px',
          minHeight: '60px',
          zIndex: 999999
        }}
      >
        📝
      </button>
      
      {/* Botão principal COM CSS INLINE */}
      <button
        onClick={() => {
          console.log('Botão principal clicado em:', new Date());
          setShowBalloon(!showBalloon);
        }}
        style={{
          position: 'absolute',
          bottom: '70px',
          right: '0px',
          backgroundColor: '#3b82f6',
          color: 'white',
          padding: '12px',
          borderRadius: '50%',
          border: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          cursor: 'pointer',
          zIndex: 999999
        }}
      >
        💬
      </button>
      
      {/* Balão COM CSS INLINE */}
      {showBalloon && (
        <div 
          style={{
            position: 'absolute',
            bottom: '130px',
            right: '0px',
            backgroundColor: 'white',
            border: '2px solid #ccc',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            borderRadius: '8px',
            padding: '16px',
            width: '320px',
            zIndex: 999998
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontWeight: 'bold', margin: 0 }}>Anotações</h3>
            <button
              onClick={() => setShowBalloon(false)}
              style={{
                color: '#666',
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '20px',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            placeholder="Sua anotação..."
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              marginBottom: '12px',
              fontFamily: 'Arial, sans-serif',
              fontSize: '14px'
            }}
          />
          
          <button
            onClick={() => {
              if (input.trim()) {
                const nova = {
                  id: Date.now(),
                  texto: input,
                  data: new Date().toISOString(),
                };
                setNotes([...notes, nova]);
                setInput("");
                alert('Anotação salva!');
              }
            }}
            disabled={!input.trim()}
            style={{
              width: '100%',
              backgroundColor: input.trim() ? '#3b82f6' : '#ccc',
              color: 'white',
              padding: '8px',
              borderRadius: '4px',
              border: 'none',
              cursor: input.trim() ? 'pointer' : 'not-allowed'
            }}
          >
            Salvar
          </button>
          
          {notes.length > 0 && (
            <div style={{ marginTop: '12px', maxHeight: '160px', overflowY: 'auto' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 'medium', marginBottom: '8px' }}>
                Anotações ({notes.length}):
              </h4>
              {notes.map((note) => (
                <div 
                  key={note.id} 
                  style={{
                    backgroundColor: '#fef3c7',
                    padding: '8px',
                    borderRadius: '4px',
                    marginBottom: '8px',
                    fontSize: '12px'
                  }}
                >
                  {note.texto}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(PDFNotes);
