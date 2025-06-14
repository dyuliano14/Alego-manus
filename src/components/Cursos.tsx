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

  // carregar do localStorage
  useEffect(() => {
    const stored = localStorage.getItem("cursos");
    if (stored) {
      setCursos(JSON.parse(stored));
    }
  }, []);

  // salvar em localStorage
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

    const numMaterias = Number(prompt("Quantas matérias esse curso terá?"));
    if (!numMaterias || isNaN(numMaterias)) return;

    const materias: Materia[] = [];
    for (let i = 0; i < numMaterias; i++) {
      const nomeMateria =
        prompt(`Nome da matéria ${i + 1}:`) || `Matéria ${i + 1}`;
      materias.push({ nome: nomeMateria, conteudos: [] });
    }

    const novoCurso: Curso = {
      nome: nomeCurso,
      materias,
    };

    setCursos((prev) => [...prev, novoCurso]);
  };

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-72 border-r pr-4 space-y-4">
          <h2 className="text-lg font-bold">Cursos</h2>
          {cursos.map((curso) => (
            <div key={curso.nome}>
              <h3 className="font-semibold">{curso.nome}</h3>
              {curso.materias.map((materia) => (
                <div key={materia.nome} className="ml-4 space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {materia.nome}
                  </p>
                  {materia.conteudos.map((c) => (
                    <Button
                      key={c.titulo}
                      onClick={() => handleSelect(c)}
                      variant="ghost"
                      className="text-left w-full justify-start px-2 text-sm"
                    >
                      {c.titulo}
                    </Button>
                  ))}
                </div>
              ))}
            </div>
          ))}
          <Button size="sm" className="mt-4" onClick={criarNovoCurso}>
            + Novo Curso
          </Button>
        </div>
      )}

      {/* Main viewer */}
      <div className="flex-1 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Estudo</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen((v) => !v)}
          >
            {sidebarOpen ? "Ocultar Lista" : "Mostrar Lista"}
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
            Selecione um conteúdo ao lado para visualizar
          </p>
        )}
      </div>
    </div>
  );
};

export default Cursos;
