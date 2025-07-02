import React, { useEffect, useState } from "react";

interface Props {
  conteudoId: number;
}

type Note = {
  id: number;
  texto: string;
  data: string;
};

const API = import.meta.env.VITE_API_URL;

const PDFNotes: React.FC<Props> = ({ conteudoId }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!conteudoId) return;
    fetch(`${API}/anotacoes/${conteudoId}`)
      .then((res) => res.json())
      .then(setNotes)
      .catch(console.error);
  }, [conteudoId]);

  useEffect(() => {
    if (!conteudoId || notes.length === 0) return;
    fetch(`${API}/anotacoes/${conteudoId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notes.map(n => n.texto)),
    }).catch(console.error);
  }, [notes, conteudoId]);

  const addNote = () => {
    if (!input.trim()) return;
    const newNote: Note = {
      id: Date.now(),
      texto: input,
      data: new Date().toISOString(),
    };
    setNotes([...notes, newNote]);
    setInput("");
  };

  return (
    <div className="p-3 h-full flex flex-col border-l bg-white">
      <h3 className="font-bold text-sm mb-2">💬 Minhas Anotações</h3>
      <div className="flex-1 overflow-auto space-y-3 mb-2 text-sm">
        {notes.map((note, idx) => (
          <div key={idx} className="flex items-start gap-2">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
              A
            </div>
            <div className="bg-gray-100 px-3 py-2 rounded-md max-w-[80%]">
              <div className="text-gray-800">{note.texto}</div>
              <div className="text-[10px] text-gray-500 mt-1">
                {new Date(note.data).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Escreva algo..."
        className="border px-2 py-1 text-sm w-full rounded"
        onKeyDown={(e) => e.key === "Enter" && addNote()}
      />
    </div>
  );
};

export default PDFNotes;
