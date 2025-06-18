// src/components/CursosArea.tsx
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card"; // Importe Card, CardHeader, CardTitle, CardContent
import { Button } from "../components/ui/button"; // Importe Button
import ContentViewer from "./ContentViewer";
import Modal from "../components/ui/Modal";

// ... (interfaces Conteudo, Materia, Curso, Props - mantenha as que já existem)

interface Conteudo {
  id: number;
  titulo: string;
  tipo: string;
  arquivo: string;
}
interface Materia {
  id: number;
  nome: string;
  conteudos: Conteudo[];
}
interface Curso {
  id: number;
  nome: string;
  materias: Materia[];
}

interface Props {
  curso: Curso;
  onVoltar: () => void;
  onAtualizar: (curso: Curso) => void;
}

const CursosArea: React.FC<Props> = ({ curso, onVoltar, onAtualizar }) => {
  const [materiaSel, setMateriaSel] = useState<Materia | null>(null);
  const [contSel, setContSel] = useState<Conteudo | null>(null);
  const [modalNovoConteudo, setModalNovoConteudo] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("pdf"); // Default para PDF
  const [arquivo, setArquivo] = useState("");

  const handleAdicionaConteudo = () => {
    if (!materiaSel || !titulo.trim() || !arquivo.trim()) {
      alert("Preencha todos os campos.");
      return;
    }

    const novo: Conteudo = { id: Date.now(), titulo, tipo, arquivo };
    const updatedMaterias = materiaSel
      ? materiaSel.conteudos.concat(novo)
      : [novo];

    const updatedMateria: Materia = {
      ...materiaSel!,
      conteudos: updatedMaterias,
    };

    const updatedCurso: Curso = {
      ...curso,
      materias: curso.materias.map((m) =>
        m.id === updatedMateria.id ? updatedMateria : m,
      ),
    };

    onAtualizar(updatedCurso);
    setModalNovoConteudo(false);
    setTitulo("");
    setTipo("pdf"); // Reset
    setArquivo("");
  };

  const abrirModalNovoConteudo = () => setModalNovoConteudo(true);

  return (
    // Contêiner principal para as duas colunas
    <div className="flex flex-col md:flex-row gap-6 w-full h-full p-4">
      {/* Coluna Esquerda: Matérias e seus Conteúdos (como um Card grande) */}
      <Card className="w-full md:w-1/3 flex-shrink-0 p-4">
        <CardContent className="p-0">
          <Button onClick={onVoltar} className="mb-4 w-full">
            ← Voltar para Cursos
          </Button>
          <h3 className="text-lg font-semibold mb-2">
            Matérias do Curso: {curso.nome}
          </h3>
          <div className="space-y-2">
            {curso.materias.map((m) => (
              <Button
                key={m.id}
                variant={materiaSel?.id === m.id ? "default" : "outline"}
                className="w-full justify-start"
                onClick={() => {
                  setMateriaSel(m);
                  setContSel(null); // Reseta o conteúdo selecionado ao mudar de matéria
                }}
              >
                {m.nome}
              </Button>
            ))}
          </div>
          {materiaSel && (
            <>
              <Button onClick={abrirModalNovoConteudo} className="mt-4 w-full">
                Adicionar Arquivo
              </Button>
              <div className="mt-4 space-y-2">
                {" "}
                {/* Lista de arquivos na mesma coluna */}
                <h4 className="text-md font-semibold mb-2">
                  Arquivos da Matéria: {materiaSel.nome}
                </h4>
                {materiaSel.conteudos.length > 0 ? (
                  materiaSel.conteudos.map((c) => (
                    <Button
                      key={c.id}
                      variant={contSel?.id === c.id ? "default" : "secondary"} // Use secondary ou outline
                      className="w-full justify-start"
                      onClick={() => setContSel(c)}
                    >
                      {c.tipo === "pdf" && "📄 "}
                      {c.tipo === "markdown" && "📝 "}
                      {c.tipo === "video" && "🎥 "}
                      {c.tipo === "youtube" && "▶️ "}
                      {c.titulo}
                    </Button>
                  ))
                ) : (
                  <p className="text-muted-foreground">
                    Nenhum arquivo nessa matéria.
                  </p>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Coluna Direita: Visualizador de Conteúdo (como um Card grande) */}
      <Card className="flex-1 p-4 overflow-auto max-h-[calc(100vh-200px)]">
        {" "}
        {/* overflow-auto para conteúdo grande */}
        <CardContent className="p-0">
          {contSel ? (
            <ContentViewer conteudo={contSel} />
          ) : (
            <p className="text-muted-foreground text-center">
              {materiaSel
                ? "Selecione um arquivo para visualizar."
                : "Selecione uma matéria para ver seus arquivos."}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Modal de Novo Conteúdo */}
      {modalNovoConteudo && (
        <Modal title="Novo Arquivo" onClose={() => setModalNovoConteudo(false)}>
          <div className="space-y-4">
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título"
              className="simple-input"
            />
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="simple-input"
            >
              <option value="pdf">PDF</option>
              <option value="markdown">Markdown</option>
              <option value="video">Vídeo Local</option>
              <option value="youtube">YouTube</option>
            </select>
            <input
              value={arquivo}
              onChange={(e) => setArquivo(e.target.value)}
              placeholder="URL ou caminho"
              className="simple-input"
            />
            <Button onClick={handleAdicionaConteudo} className="w-full">
              Adicionar
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CursosArea;
