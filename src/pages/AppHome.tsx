// src/pages/AppHome.tsx
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card"; // Certifique-se que o Card está importado

interface AppHomeProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

const AppHome: React.FC<AppHomeProps> = ({ setCurrentPage }) => {
  const sections = [
    {
      title: "Plano de Estudos Semanal",
      desc: "Visualize sua rotina semanal de estudos.",
      page: "dashboard",
    },
    {
      title: "Biblioteca de PDFs",
      desc: "Acesse documentos oficiais e materiais.",
      page: "pdf",
    },
    {
      title: "Flashcards",
      desc: "Estude com revisão espaçada.",
      page: "flashcards",
    },
    {
      title: "Meus Conteúdos",
      desc: "Pratique explicar conceitos de forma simples.",
      page: "conteudos",
    },
    {
      title: "Simulados",
      desc: "Teste seus conhecimentos com questões.",
      page: "simulado",
    },
    {
      title: "Cursos",
      desc: "Acesse todos os cursos.",
      page: "cursos",
    },
  ];

  return (
    // Removido p-6 e adicionado w-full para preencher o contêiner centralizado
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {sections.map((sec) => (
        <Card
          key={sec.page}
          className="bg-card p-6 rounded-lg shadow hover:shadow-lg transition cursor-pointer" // Adicionado cursor-pointer
          onClick={() => setCurrentPage(sec.page)}
        >
          <CardHeader>
            <CardTitle>{sec.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{sec.desc}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AppHome;
