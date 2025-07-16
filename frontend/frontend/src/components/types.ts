

export interface Conteudo {
  id: number;
  titulo: string;
  tipo: "pdf" | "markdown" | "video";
  arquivo: string;
  materia_id: number;
}

export interface Materia {
  id: number;
  nome: string;
  curso_id: number;
  conteudos?: Conteudo[];
}

export interface Curso {
  id: number;
  nome: string;
  materias?: Materia[];
}
