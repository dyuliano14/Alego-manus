export interface Conteudo {
  id: number;
  titulo: string;
  tipo: "pdf" | "markdown" | "video";
  arquivo: string;
}

export interface Materia {
  id: number;
  nome: string;
  conteudos?: Conteudo[];
}

export interface Curso {
  id: number;
  nome: string;
  materias?: Materia[];
}
