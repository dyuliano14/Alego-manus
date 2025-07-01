import React, { useEffect, useState } from "react";

interface Props {
  conteudoId: number;
}

const PDFNotes: React.FC<Props> = ({ conteudoId }) => {
  const [notes, setNotes] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/api/anotacoes/${conteudoId}`)
      .then((res) => res.json())
      .then(setNotes)
      .catch(console.error);
  }, [conteudoId]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/anotacoes/${conteudoId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(notes),
    }).catch(console.error);
  }, [notes, conteudoId]);

  const addNote = () => {
    if (!input.trim()) return;
    setNotes((prev) => [...prev, input]);
    setInput("");
  };

  return (
    <div className="p-3 h-full flex flex-col border-l">
      <h3 className="font-bold text-sm mb-2">Anotações</h3>
      <div className="flex-1 overflow-auto space-y-2 mb-2 text-sm">
        {notes.map((note, idx) => (
          <div key={idx} className="bg-gray-100 p-2 rounded">
            {note}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Digite uma anotação"
        className="border px-2 py-1 text-sm w-full"
        onKeyDown={(e) => e.key === "Enter" && addNote()}
      />
    </div>
  );
};

export default PDFNotes;
