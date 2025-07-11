// src/components/CursosArea.tsx
import React, { useState } from "react";
import { Curso, Materia, Conteudo } from "./types";
import { criarConteudo } from "../services/conteudoService";
import { criarMateria } from "../services/materiaService";
import ContentViewer from "./ContentViewer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Modal from "./ui/Modal";
import { Card, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";

interface Props {
  curso: Curso;
  onVoltar(): void;
  onAtualizar(c: Curso): void;
}

const CursosArea: React.FC<Props> = ({ curso, onVoltar, onAtualizar }) => {
  const [sel, setSel] = useState<Materia | null>(null);
  const [sc, setSc] = useState<Conteudo | null>(null);
  const [modalMat, setModalMat] = useState(false);
  const [modalCont, setModalCont] = useState(false);
  const [nm, setNm] = useState("");
  const [ct, setCt] = useState<Conteudo["tipo"]>("pdf");
  const [arq, setArq] = useState("");
  const [tt, setTt] = useState("");

  const adicionarMateria = async () => {
    if (!nm.trim()) return;
    const m = await criarMateria(nm, curso.id);
    const nova = { ...m, conteudos: [] };
    const atual = { ...curso, materias: [...(curso.materias || []), nova] };
    onAtualizar(atual);
    setSel(nova);
    setNm("");
    setModalMat(false);
  };

  const adicionarConteudo = async () => {
    if (!sel) return;
    const novo: Omit<Conteudo, "id"> = {
      titulo: tt,
      tipo: ct,
      arquivo: arq,
      materia_id: sel.id,
    };
    const c = await criarConteudo(novo);
    const matAtual = curso.materias?.map((m) =>
      m.id === sel.id ? { ...m, conteudos: [...(m.conteudos || []), c] } : m,
    );
    const atual = { ...curso, materias: matAtual! };
    onAtualizar(atual);
    setSc(c);
    setModalCont(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
      <aside className="bg-gray-50 rounded-lg p-4 shadow">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">📘 Matérias</h3>
          <Button onClick={() => setModalMat(true)}>+ Matéria</Button>
        </div>
        <div className="mt-4 space-y-2">
          {curso.materias?.map((m) => (
            <Button
              key={m.id}
              className={`w-full text-left ${sel?.id === m.id ? "bg-blue-100" : ""}`}
              onClick={() => {
                setSel(m);
                setSc(null);
              }}
            >
              {m.nome} ({m.conteudos?.length})
            </Button>
          ))}
        </div>
        <Button onClick={onVoltar} className="mt-6 w-full">
          ← Voltar
        </Button>
      </aside>

      <main className="bg-white rounded-lg p-4 shadow">
        {!sel ? (
          <p>Selecione uma matéria.</p>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">📂 {sel.nome}</h2>
              <Button onClick={() => setModalCont(true)}>+ Conteúdo</Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sel.conteudos?.map((c) => (
                <Card
                  key={c.id}
                  onClick={() => setSc(c)}
                  className="cursor-pointer"
                >
                  <CardHeader>
                    <CardTitle>{c.titulo}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
            {sc && (
              <div className="mt-6">
                <ContentViewer conteudo={sc} />
              </div>
            )}
          </>
        )}
      </main>

      {modalMat && (
        <Modal title="Nova Matéria" onClose={() => setModalMat(false)}>
          <Input
            placeholder="Nome da matéria"
            value={nm}
            onChange={(e) => setNm(e.target.value)}
          />
          <Button
            onClick={adicionarMateria}
            className="mt-4 w-full bg-green-600 text-white"
          >
            Criar
          </Button>
        </Modal>
      )}

      {modalCont && (
        <Modal title="Novo Conteúdo" onClose={() => setModalCont(false)}>
          <Input
            placeholder="Título"
            value={tt}
            onChange={(e) => setTt(e.target.value)}
          />
          <Select value={ct} onValueChange={(v) => setCt(v as any)}>
            <SelectTrigger>
              <SelectValue obrigatório />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="markdown">Markdown</SelectItem>
              <SelectItem value="video">Vídeo</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="URL ou arquivo"
            value={arq}
            onChange={(e) => setArq(e.target.value)}
          />
          <Button
            onClick={adicionarConteudo}
            className="mt-4 w-full bg-green-600 text-white"
          >
            Adicionar
          </Button>
        </Modal>
      )}
    </div>
  );
};

export default CursosArea;
