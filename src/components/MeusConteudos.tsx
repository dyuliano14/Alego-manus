// src/components/MeusConteudos.tsx
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";

interface Conteudo {
  id: number;
  tipo: "feynman" | "resumo" | "nota";
  titulo: string;
  topico: string;
  conteudo: string;
  dataEdicao: string;
}

const TIPOS = [
  { value: "todos", label: "Todos" },
  { value: "feynman", label: "Explicações Feynman" },
  { value: "resumo", label: "Resumos" },
  { value: "nota", label: "Notas" },
];

const MeusConteudos: React.FC = () => {
  const [conteudos, setConteudos] = useState<Conteudo[]>([]);
  const [filter, setFilter] = useState<string>("todos");
  const [current, setCurrent] = useState<Conteudo | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("meus-conteudos");
    if (data) setConteudos(JSON.parse(data));
  }, []);

  const salvarTodos = (novos: Conteudo[]) => {
    setConteudos(novos);
    localStorage.setItem("meus-conteudos", JSON.stringify(novos));
  };

  const iniciarNovo = (tipo: Conteudo["tipo"]) => {
    setCurrent({
      id: Date.now(),
      tipo,
      titulo: "",
      topico: "",
      conteudo: "",
      dataEdicao: new Date().toISOString(),
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!current) return;
    const atualizados = [
      ...conteudos.filter((c) => c.id !== current.id),
      { ...current, dataEdicao: new Date().toISOString() },
    ];
    salvarTodos(atualizados);
    setIsEditing(false);
  };

  const filtered =
    filter === "todos" ? conteudos : conteudos.filter((c) => c.tipo === filter);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1 className="section-title" style={{ margin: 0, border: "none" }}>
            🧠 Meus Conteúdos
          </h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>
            Gerencie suas anotações, explicações e resumos.
          </p>
        </div>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Select value={filter} onValueChange={(v) => setFilter(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar" />
            </SelectTrigger>
            <SelectContent>
              {TIPOS.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {["feynman", "resumo", "nota"].map((tipo) => (
            <Button
              className="simple-btn"
              key={tipo}
              onClick={() => iniciarNovo(tipo as Conteudo["tipo"])}
            >
              Novo{" "}
              {tipo === "feynman"
                ? "Feynman"
                : tipo === "resumo"
                  ? "Resumo"
                  : "Nota"}
            </Button>
          ))}
        </div>
      </div>

      <div className="simple-grid simple-grid-3">
        {filtered.map((c) => (
          <Card
            key={c.id}
            className="cursor-pointer hover:shadow-md"
            onClick={() => {
              setCurrent(c);
              setIsEditing(false);
            }}
          >
            <CardHeader>
              <CardTitle>{c.titulo || "(sem título)"}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{c.topico}</p>
              <p className="text-xs text-muted-foreground">
                Editado em {new Date(c.dataEdicao).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-muted-foreground">Nenhum item encontrado.</p>
        )}
      </div>

      {current && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>
              {isEditing
                ? current.tipo === "feynman"
                  ? "Nova Explicação Feynman"
                  : current.tipo === "resumo"
                    ? "Editar Resumo"
                    : "Editar Nota"
                : current.titulo || "(sem título)"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label>Título</label>
              <input
                type="text"
                value={current.titulo}
                onChange={(e) =>
                  setCurrent({ ...current, titulo: e.target.value })
                }
                className="simple-input w-full"
                disabled={!isEditing}
              />
            </div>
            <div>
              <label>Tópico</label>
              <input
                type="text"
                value={current.topico}
                onChange={(e) =>
                  setCurrent({ ...current, topico: e.target.value })
                }
                className="simple-input w-full"
                disabled={!isEditing}
              />
            </div>
            <div>
              <label>Conteúdo</label>
              {isEditing ? (
                <textarea
                  value={current.conteudo}
                  onChange={(e) =>
                    setCurrent({ ...current, conteudo: e.target.value })
                  }
                  className="simple-input w-full min-h-[200px]"
                />
              ) : (
                <div className="prose max-w-none border rounded p-4 overflow-auto max-h-[400px]">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {current.conteudo}
                  </ReactMarkdown>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    className="simple-btn-outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancelar
                  </Button>
                  <Button className="simple-btn" onClick={handleSave}>
                    Salvar
                  </Button>
                </>
              ) : (
                <Button
                  className="simple-btn"
                  onClick={() => setIsEditing(true)}
                >
                  Editar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MeusConteudos;
