// src/pages/Admin.tsx
import React, { useEffect, useState } from "react";
import { Curso, Materia, Conteudo } from "../components/types";
import {
  listarCursos,
  atualizarCurso,
  excluirCurso,
} from "../services/cursoService";
import {
  listarMaterias,
  atualizarMateria,
  excluirMateria,
} from "../services/materiaService";
import {
  listarConteudos,
  atualizarConteudo,
  excluirConteudo,
} from "../services/conteudoService";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { resetDB, seedDB } from "../services/debugService";

const Admin: React.FC = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [conteudos, setConteudos] = useState<Conteudo[]>([]);

  const carregarDados = async () => {
    try {
      const [c, m, co] = await Promise.all([
        listarCursos(),
        listarMaterias(),
        listarConteudos(),
      ]);
      setCursos(c);
      setMaterias(m);
      setConteudos(co);
    } catch (e) {
      alert("Erro ao carregar dados");
      console.error(e);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleUpdate = async (tipo: string, item: any) => {
    try {
      if (tipo === "curso") await atualizarCurso(item);
      if (tipo === "materia") await atualizarMateria(item);
      if (tipo === "conteudo") await atualizarConteudo(item);
      carregarDados();
    } catch (e) {
      alert("Erro ao atualizar");
    }
  };

  const handleDelete = async (tipo: string, id: number) => {
    if (!confirm("Tem certeza que deseja excluir?")) return;
    try {
      if (tipo === "curso") await excluirCurso(id);
      if (tipo === "materia") await excluirMateria(id);
      if (tipo === "conteudo") await excluirConteudo(id);
      carregarDados();
    } catch (e) {
      alert("Erro ao excluir");
    }
  };

  return (
    <div className="space-y-10 p-6">
      <h2 className="text-2xl font-bold">
        🛠️ Painel de Administração plataforma de controle de estudos
      </h2>

      {/* CURSOS */}
      <div>
        <h3 className="text-xl font-semibold mt-4mb-4">📘 Cursos</h3>
        <div className="bg-white rounded-lg p-4 shadow">
          {cursos.map((curso) => (
            <div
              key={curso.id}
              className="flex items-center gap-2 border p-2 rounded bg-white shadow-sm"
            >
              <Input
                value={curso.nome}
                onChange={(e) =>
                  setCursos((prev) =>
                    prev.map((c) =>
                      c.id === curso.id ? { ...c, nome: e.target.value } : c,
                    ),
                  )
                }
              />
              <Button
                onClick={() => handleUpdate("curso", curso)}
                className="simple-btn mt-4 mb-4"
              >
                Salvar
              </Button>
              <Button
                onClick={() => handleDelete("curso", curso.id)}
                className="simple-btn mt-4 mb-4"
              >
                Excluir
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* MATERIAS */}
      <div>
        <h3 className="text-xl font-semibold mt-4 mb-4">📗 Matérias</h3>
        <div className="bg-white rounded-lg p-4 shadow">
          {materias.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-2 border p-2 rounded bg-white shadow-sm"
            >
              <Input
                value={m.nome}
                onChange={(e) =>
                  setMaterias((prev) =>
                    prev.map((x) =>
                      x.id === m.id ? { ...x, nome: e.target.value } : x,
                    ),
                  )
                }
              />
              <span className="text-xs text-muted-foreground">
                Curso ID: {m.curso_id}
              </span>
              <Button
                onClick={() => handleUpdate("materia", m)}
                className="simple-btn mt-4 mb-4"
              >
                Salvar
              </Button>
              <Button
                onClick={() => handleDelete("materia", m.id)}
                className="simple-btn mt-4 mb-4"
              >
                Excluir
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* CONTEUDOS */}
      <div>
        <h3 className="text-xl font-semibold mt-4 mb-4">📄 Conteúdos</h3>
        <div className="bg-white rounded-lg p-4 shadow">
          {conteudos.map((c) => (
            <div
              key={c.id}
              className="flex flex-col md:flex-row md:items-center gap-2 border p-2 rounded bg-white shadow-sm"
            >
              <Input
                value={c.titulo}
                onChange={(e) =>
                  setConteudos((prev) =>
                    prev.map((x) =>
                      x.id === c.id ? { ...x, titulo: e.target.value } : x,
                    ),
                  )
                }
              />
              <span className="text-xs text-muted-foreground">
                Tipo: {c.tipo} | Matéria ID: {c.materia_id}
              </span>
              <Button
                onClick={() => handleUpdate("conteudo", c)}
                className="simple-btn mt-4 mb-4"
              >
                Salvar
              </Button>
              <Button
                onClick={() => handleDelete("conteudo", c.id)}
                className="simple-btn mt-4 mb-4"
              >
                Excluir
              </Button>
            </div>
          ))}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 sm:p-8 max-w-7xl mx-auto">
            <Button
              className="simple-btn mt-4 mb-4"
              onClick={async () => {
                try {
                  await resetDB();
                  const res = await seedDB();
                  alert("Banco de dados resetado e populado com sucesso!");
                  console.log("Seed result:", res);
                } catch (err) {
                  alert("Erro ao reiniciar dados.");
                  console.error(err);
                }
              }}
            >
              ♻️ Resetar e Popular Banco
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
