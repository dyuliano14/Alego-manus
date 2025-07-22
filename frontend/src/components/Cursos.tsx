import * as React from "react";
import { useEffect, useState } from "react";
import { Curso, Materia } from "./types";
import { listarCursos, criarCurso } from "../services/cursoService";
import { criarMateria } from "../services/materiaService";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Modal from "./ui/Modal";
import CursosArea from "./CursosArea";

const Cursos: React.FC = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cursoAberto, setCursoAberto] = useState<Curso | null>(null);
  const [modalNovo, setModalNovo] = useState(false);
  const [nome, setNome] = useState("");
  const [numMaterias, setNumMaterias] = useState(1);
  const [nomesMaterias, setNomesMaterias] = useState<string[]>([""]);

  useEffect(() => {
    console.log("🔄 Cursos.tsx - Carregando cursos...");
    listarCursos()
      .then((cursosCarregados) => {
        console.log("📚 Cursos.tsx - Cursos carregados:", cursosCarregados);
        setCursos(cursosCarregados);
      })
      .catch((error) => {
        console.error("❌ Cursos.tsx - Erro ao carregar:", error);
      });
  }, []);

  const criarNovoCurso = async () => {
    if (!nome.trim()) return alert("Informe nome");
    try {
      const curso = await criarCurso(nome);
      const materias: Materia[] = [];
      for (const mat of nomesMaterias) {
        if (mat.trim()) {
          const m = await criarMateria(mat, curso.id);
          materias.push({ ...m, conteudos: [] });
        }
      }
      const novo = { ...curso, materias };
      setCursos((c) => [...c, novo]);
      setModalNovo(false); 
      setNome(""); 
      setNumMaterias(1); 
      setNomesMaterias([""]);
    } catch {
      alert("Erro ao criar");
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Navegação Superior - Seletor de Cursos */}
      <div className="bg-white rounded-lg p-4 shadow flex-shrink-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">📚 Cursos</h2>
            {cursoAberto && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>→</span>
                <span className="font-medium text-blue-600">{cursoAberto.nome}</span>
                <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                  {cursoAberto.materias?.length || 0} matérias
                </span>
              </div>
            )}
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {cursoAberto && (
              <Button
                onClick={() => setCursoAberto(null)}
                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                ← Voltar aos Cursos
              </Button>
            )}
            <Button
              onClick={() => setModalNovo(true)}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white"
            >
              + Novo Curso
            </Button>
          </div>
        </div>

        {/* Grid de Cursos - Só mostra quando nenhum curso está aberto */}
        {!cursoAberto && (
          <div className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {cursos.map(c => (
                <div
                  key={c.id}
                  onClick={() => setCursoAberto(c)}
                  className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-lg p-4 cursor-pointer hover:shadow-md hover:from-blue-100 hover:to-indigo-200 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-800 text-lg truncate pr-2">
                      {c.nome}
                    </h3>
                    <div className="text-blue-600 text-xl">📚</div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {c.materias?.length || 0} matéria(s)
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Clique para abrir</span>
                    <span>→</span>
                  </div>
                </div>
              ))}
              
              {cursos.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <div className="text-6xl mb-4 opacity-50">📚</div>
                  <p className="text-gray-500 text-lg mb-2">Nenhum curso encontrado</p>
                  <p className="text-gray-400 text-sm">Crie seu primeiro curso para começar</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Área Principal - CursosArea ou Estado Vazio */}
      <div className="flex-1 min-h-0">
        {cursoAberto ? (
          <CursosArea
            curso={cursoAberto}
            onVoltar={() => setCursoAberto(null)}
            onAtualizar={upd => {
              setCursos(cursos.map(c => c.id === upd.id ? upd : c));
              setCursoAberto(upd);
            }}
          />
        ) : (
          <div className="bg-white rounded-lg shadow h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-8xl mb-6 opacity-30">🎓</div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                Bem-vindo aos seus Cursos
              </h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Organize seus estudos criando cursos com matérias e conteúdos. 
                Cada curso pode ter múltiplas matérias com PDFs, vídeos e materiais de estudo.
              </p>
              <Button
                onClick={() => setModalNovo(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg"
              >
                🚀 Criar Primeiro Curso
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Modal para Novo Curso */}
      {modalNovo && (
        <Modal title="Novo Curso" onClose={() => setModalNovo(false)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Curso
              </label>
              <Input
                placeholder="Ex: Concurso ALEGO 2025"
                value={nome}
                onChange={e => setNome(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantas matérias?
              </label>
              <Input
                type="number"
                min={1}
                max={20}
                value={numMaterias}
                onChange={e => {
                  const v = parseInt(e.target.value) || 1;
                  setNumMaterias(v);
                  setNomesMaterias(prev => Array.from({ length: v }, (_, i) => prev[i] || ""));
                }}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Nome das Matérias
              </label>
              {Array.from({ length: numMaterias }).map((_, i) => (
                <Input
                  key={i}
                  placeholder={`Matéria ${i + 1} - Ex: Regimento Interno`}
                  value={nomesMaterias[i]}
                  onChange={e => {
                    const arr = [...nomesMaterias];
                    arr[i] = e.target.value;
                    setNomesMaterias(arr);
                  }}
                  className="w-full"
                />
              ))}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                onClick={() => setModalNovo(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Cancelar
              </Button>
              <Button 
                onClick={criarNovoCurso} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6"
              >
                ✅ Criar Curso
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Cursos;
