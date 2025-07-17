import { useEffect, useState, useRef } from "react";

type Note = {
  id: number;
  texto: string;
  data: string;
};

interface Props {
  conteudoId: number;
}

const API = import.meta.env.VITE_API_URL;

const PDFNotes: React.FC<Props> = ({ conteudoId }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState("");
  const [showBalloon, setShowBalloon] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Função para imprimir anotações em layout de relatório
  const handlePrintNotes = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    const html = `
      <html>
        <head>
          <title>Relatório de Anotações</title>
          <style>
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
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  };

  useEffect(() => {
    if (!conteudoId) return;

    fetch(`${API}/api/anotacoes/${conteudoId}`)
      .then((res) => res.json())
      .then((data) => {
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
    <>
      {/* Balão flutuante para adicionar anotação - responsivo */}
      {showBalloon && (
        <div className="fixed bottom-20 right-4 sm:bottom-24 sm:right-8 z-50 bg-white border shadow-2xl rounded-2xl p-4 sm:p-6 w-80 sm:w-96 max-w-[calc(100vw-2rem)] flex flex-col animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Nova Anotação</h3>
            <button
              onClick={() => setShowBalloon(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
            placeholder="Escreva sua anotação aqui..."
            className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none mb-4 transition-all"
          />
          
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => {
                addNote();
                setShowBalloon(false);
              }}
              disabled={!input.trim()}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-medium hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-md touch-manipulation min-h-[44px]"
            >
              💾 Salvar
            </button>
            
            <button
              onClick={handlePrintNotes}
              disabled={notes.length === 0}
              className="px-5 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl text-sm font-medium hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-md touch-manipulation min-h-[44px]"
              title="Imprimir relatório de anotações"
            >
              🖨️
            </button>
          </div>
        </div>
      )}
      
      {/* Botão flutuante - responsivo */}
      <button
        onClick={() => setShowBalloon((v) => !v)}
        className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-40 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full shadow-2xl p-3 sm:p-4 flex items-center justify-center text-lg sm:text-xl transition-all transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300/50"
        title="Adicionar anotação"
      >
        <span role="img" aria-label="anotação" className="relative">
          💬
          {notes.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {notes.length}
            </span>
          )}
        </span>
      </button>
    </>
  );
};


export default PDFNotes;
