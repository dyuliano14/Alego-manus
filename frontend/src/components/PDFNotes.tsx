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
      {/* Balão flutuante para adicionar anotação - fora do container principal */}
      {showBalloon && (
        <div className="fixed bottom-24 right-8 z-50 bg-white border shadow-lg rounded-2xl p-4 w-80 flex flex-col animate-fade-in">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={5}
            placeholder="Escreva uma anotação..."
            className="w-full px-3 py-2 text-sm border rounded-xl shadow-sm focus:outline-none focus:ring resize-none mb-2"
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                addNote();
                setShowBalloon(false);
              }}
              className="px-4 py-1 bg-blue-600 text-white rounded-full text-sm hover:bg-blue-700"
            >💾</button>
            <button
              onClick={() => setShowBalloon(false)}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300"
            >🏃‍➡️</button>
            <button
              onClick={handlePrintNotes}
              className="px-3 py-1 bg-green-600 text-white rounded-full text-sm hover:bg-green-700"
              title="Imprimir relatório de anotações"
            >🖨️</button>
          </div>
        </div>
      )}
      <button
        onClick={() => setShowBalloon((v) => !v)}
        className="fixed bottom-12 right-8 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-4 flex items-center justify-center text-xl"
        title="Adicionar anotação"
      >
        <span role="img" aria-label="anotação">💬</span>
      </button>
    </>
  );
};


export default PDFNotes;
