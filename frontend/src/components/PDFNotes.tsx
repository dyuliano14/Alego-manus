import React, { useEffect, useState, useRef } from "react";

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
  const scrollRef = useRef<HTMLDivElement>(null);

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
    <div className="h-full flex flex-col border-l border-gray-300 bg-white">
      <div className="p-3 border-b bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700">💬 Anotações</h3>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-blue-100 text-blue-800 max-w-xs md:max-w-full self-end ml-auto rounded-xl px-4 py-2 shadow-md"
          >
            <p className="text-sm">{note.texto}</p>
            <span className="block text-[10px] text-blue-600 text-right mt-1">
              {new Date(note.data).toLocaleString("pt-BR")}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t p-2 bg-white">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addNote()}
          placeholder="Escreva uma anotação..."
          className="w-full px-3 py-2 text-sm border rounded-full shadow-sm focus:outline-none focus:ring"
        />
      </div>
    </div>
  );
};

export default PDFNotes;
