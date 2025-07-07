// src/components/PDFNotes.tsx
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
if (!API) {
  console.error("VITE_API_URL não definida!");
}


const PDFNotes: React.FC<Props> = ({ conteudoId }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Carrega anotações
  useEffect(() => {
    if (!conteudoId) return;
    fetch(`${API}/anotacoes/${conteudoId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setNotes(data.map((t, i) => ({
            id: Date.now() + i,
            texto: t,
            data: new Date().toISOString()
          })));
        }
      })
      .catch(console.error);
  }, [conteudoId]);

  // Persiste automaticamente
  useEffect(() => {
    if (!conteudoId || notes.length === 0) return;
    fetch(`${API}/anotacoes/${conteudoId}`, {
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
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, 100);
  };

  return (
  <div
    className="absolute top-0 right-0 z-50 w-full md:w-[320px] h-full 
               bg-white shadow-xl border-l border-gray-200 flex flex-col"
  >
    <div className="p-3 border-b bg-gray-50">
      <h3 className="text-sm font-semibold text-gray-700">💬 Anotações</h3>
    </div>

    <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
      {notes.map((note) => (
        <div key={note.id} className="text-sm bg-gray-100 p-2 rounded-md shadow-sm">
          <p>{note.texto}</p>
          <span className="block text-[10px] text-gray-500 mt-1">
            {new Date(note.data).toLocaleString()}
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
        className="w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring"
      />
    </div>
  </div>
  )}

export default PDFNotes;
