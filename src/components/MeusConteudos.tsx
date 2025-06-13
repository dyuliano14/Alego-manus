import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./ui/select";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Conteudo {
  id: number;
  tipo: "feynman" | "resumo" | "nota";
  titulo: string;
  topico: string;
  conteudo: string;
  dataEdicao: string;
  avaliacao?: "ruim" | "media" | "boa" | "excelente";
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

  // Carregar do localStorage
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
    setCurrent(current);
    setIsEditing(false);
  };

  const filtered =
    filter === "todos" ? conteudos : conteudos.filter((c) => c.tipo === filter);

  return (
    <div className="simple-grid" style={{ gap: "2rem" }}>
      <div className="simple-card">
        <h1 className="section-title">🧠 Meus conteúdos</h1>
        <p className="text-muted-foreground text-sm">
          Pratique explicar conceitos de forma simples e clara.
        </p>
      </div>

      <Select defaultValue="todos" onValueChange={(v) => setFilter(v)}>
        <SelectTrigger>
          <SelectValue placeholder="Todos" />
        </SelectTrigger>
        <SelectContent>
          {TIPOS.map((t) => (
            <SelectItem key={t.value} value={t.value}>
              {t.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="space-x-2">
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

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((c) => (
          <Card
            key={c.id}
            className="cursor-pointer hover:shadow-lg"
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
          <CardContent>

            
              <div className="simple-card space-y-4">
                <Input placeholder="Título do resumo" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
                <Textarea value={conteudo} onChange={(e) => setConteudo(e.target.value)} className="h-64" />
                <Button onClick={handleSave}>Salvar</Button>
              </div>
            
              <div>
                <label>Tópico</label>
                <input
                  type="text"
                  value={current.topico}
                  onChange={(e) =>
                    setCurrent({ ...current, topico: e.target.value })
                  }
                  className="w-full border px-2 py-1 rounded"
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
                    className="w-full border px-2 py-1 rounded h-48"
                  />
                ) : (
                  <div className="prose prose-slate max-w-none border rounded p-4 h-48 overflow-auto">
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
                      className="simple-btn"
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
                {resumos.length > 0 && (
                    <div className="simple-card">
                      <h2 className="text-lg font-semibold">📚 Seus Resumos</h2>
                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        {resumos.map((resumo) => (
                          <Card key={resumo.id} onClick={() => setSelectedResumo(resumo)} className="cursor-pointer hover:shadow-md">
                            <CardHeader>
                              <CardTitle>{resumo.titulo}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <p>{resumo.conteudo.slice(0, 100)}...</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
             

export default MeusConteudos;
