export interface Conteudo {
  materia_id: ReactNode;
  id: number;
  titulo: string;
  tipo: "pdf" | "markdown" | "video";
  arquivo: string;
}

export interface Materia {
  curso_id: ReactNode;
  id: number;
  nome: string;
  conteudos?: Conteudo[];
}

export interface Curso {
  id: number;
  nome: string;
  materias?: Materia[];
}
