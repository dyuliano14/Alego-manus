// src/components/Cursos.tsx
import React, { useState, useEffect } from "react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface Conteudo {
  titulo: string;
  tipo: "pdf" | "markdown";
  arquivo: string;
}

interface Materia {
  nome: string;
  conteudos: Conteudo[];
}

interface Curso {
  nome: string;
  materias: Materia[];
}

const Cursos: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selected, setSelected] = useState<Conteudo | null>(null);
  const [markdown, setMarkdown] = useState("");
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [activeCursoIdx, setActiveCursoIdx] = useState<number | null>(null);
  const [activeMateriaIdx, setActiveMateriaIdx] = useState<number | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("cursos");
    if (stored) setCursos(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("cursos", JSON.stringify(cursos));
  }, [cursos]);

  const handleSelect = (conteudo: Conteudo) => {
    setSelected(conteudo);
    if (conteudo.tipo === "markdown") {
      fetch(conteudo.arquivo)
        .then((res) => res.text())
        .then(setMarkdown)
        .catch(() => setMarkdown("Erro ao carregar markdown."));
    }
  };

  const criarNovoCurso = () => {
    const nomeCurso = prompt("Nome do curso:");
    if (!nomeCurso) return;
    const num = Number(prompt("Quantas matérias?"));
    if (!num || isNaN(num)) return;

    const materias: Materia[] = [];
    for (let i = 0; i < num; i++) {
      const nomeM = prompt(`Matéria ${i + 1} nome:`) || `Matéria ${i + 1}`;
      materias.push({ nome: nomeM, conteudos: [] });
    }

    setCursos((prev) => [...prev, { nome: nomeCurso, materias }]);
  };

  const adicionarConteudo = () => {
    if (activeCursoIdx === null || activeMateriaIdx === null) {
      alert("Escolha uma matéria primeiro!");
      return;
    }

    const tipo = prompt("Tipo de conteúdo (pdf ou markdown):");
    if (tipo !== "pdf" && tipo !== "markdown") {
      alert("Tipo inválido.");
      return;
    }

    const titulo = prompt("Título do conteúdo:") || "Novo Conteúdo";
    const arquivo = prompt("URL ou caminho do arquivo (ex: /pdfs/meu.pdf):")!;
    if (!arquivo) return;

    setCursos((prev) => {
      const newCursos = [...prev];
      newCursos[activeCursoIdx].materias[activeMateriaIdx].conteudos.push({
        titulo,
        tipo: tipo as "pdf" | "markdown",
        arquivo,
      });
      return newCursos;
    });
  };

  return (
    <div className="flex">
      {sidebarOpen && (
        <div className="w-80 border-r px-4 space-y-4">
          <h2 className="text-lg font-bold">Cursos</h2>
          {cursos.map((c, ci) => (
            <div key={ci}>
              <h3 className="font-semibold">{c.nome}</h3>
              {c.materias.map((m, mi) => (
                <div key={mi} className="ml-4">
                  <p
                    className={`cursor-pointer ${
                      activeCursoIdx === ci && activeMateriaIdx === mi
                        ? "text-primary font-semibold"
                        : "text-muted-foreground"
                    }`}
                    onClick={() => {
                      setActiveCursoIdx(ci);
                      setActiveMateriaIdx(mi);
                      setSelected(null);
                    }}
                  >
                    {m.nome}
                  </p>
                  {activeCursoIdx === ci && activeMateriaIdx === mi && (
                    <div className="ml-4 space-y-1">
                      {m.conteudos.map((cnt, idx) => (
                        <Button
                          key={idx}
                          variant="ghost"
                          className="text-left px-2 text-sm"
                          onClick={() => handleSelect(cnt)}
                        >
                          {cnt.titulo}
                        </Button>
                      ))}
                      <Button
                        size="sm"
                        className="mt-2"
                        onClick={adicionarConteudo}
                      >
                        + Adicionar Conteúdo
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
          <Button size="sm" className="mt-2" onClick={criarNovoCurso}>
            + Novo Curso
          </Button>
        </div>
      )}

      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Estudo</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            {sidebarOpen ? "Ocultar lista" : "Mostrar lista"}
          </Button>
        </div>

        {selected ? (
          <Card>
            <CardHeader>
              <CardTitle>{selected.titulo}</CardTitle>
            </CardHeader>
            <CardContent>
              {selected.tipo === "pdf" ? (
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                  <div className="border rounded h-[600px] overflow-hidden">
                    <Viewer fileUrl={selected.arquivo} />
                  </div>
                </Worker>
              ) : (
                <div className="prose max-w-none p-4 border rounded overflow-auto h-[600px]">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {markdown}
                  </ReactMarkdown>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <p className="text-muted-foreground">
            Selecione ou adicione um conteúdo em uma matéria.
          </p>
        )}
      </div>
    </div>
  );
};

export default Cursos;
