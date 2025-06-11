// src/pages/AppHome.tsx
import React from "react";

interface AppHomeProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

const AppHome: React.FC<AppHomeProps> = ({ setCurrentPage }) => {
  return (
    <div className="simple-grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
      <button onClick={() => setCurrentPage("dashboard")}>Dashboard</button>
      <button onClick={() => setCurrentPage("markdown")}>Resumos</button>
      <button onClick={() => setCurrentPage("pdf")}>PDFs</button>
      <button onClick={() => setCurrentPage("flashcards")}>Flashcards</button>
      <button onClick={() => setCurrentPage("feynman")}>Feynman</button>
      <button onClick={() => setCurrentPage("simulado")}>Simulados</button>
    </div>
  );
};
<div className="bg-card p-6 rounded-lg shadow hover:shadow-lg transition">
  <h2 className="text-xl font-semibold mb-2">Plano de Estudos Semanal</h2>
  <p className="text-sm text-muted-foreground mb-4">
    Visualize sua rotina semanal de estudos.
  </p>
  <button className="simple-btn" onClick={() => setCurrentPage("dashboard")}>
    Ver Dashboard
  </button>
</div>;

{
  /* Card: Resumos */
}
<div className="bg-card p-6 rounded-lg shadow hover:shadow-lg transition">
  <h2 className="text-xl font-semibold mb-2">Resumos em Markdown</h2>
  <p className="text-sm text-muted-foreground mb-4">
    Crie, edite e visualize resumos.
  </p>
  <button className="simple-btn" onClick={() => setCurrentPage("markdown")}>
    Ver Resumos
  </button>
</div>;

{
  /* Card: PDFs */
}
<div className="bg-card p-6 rounded-lg shadow hover:shadow-lg transition">
  <h2 className="text-xl font-semibold mb-2">Biblioteca de PDFs</h2>
  <p className="text-sm text-muted-foreground mb-4">
    Acesse documentos oficiais e materiais.
  </p>
  <button className="simple-btn" onClick={() => setCurrentPage("pdf")}>
    Ver PDFs
  </button>
</div>;

{
  /* Card: Flashcards */
}
<div className="bg-card p-6 rounded-lg shadow hover:shadow-lg transition">
  <h2 className="text-xl font-semibold mb-2">Flashcards</h2>
  <p className="text-sm text-muted-foreground mb-4">
    Estude com revisão espaçada.
  </p>
  <button className="simple-btn" onClick={() => setCurrentPage("flashcards")}>
    Ver Flashcards
  </button>
</div>;

{
  /* Card: Espaço Feynman */
}
<div className="bg-card p-6 rounded-lg shadow hover:shadow-lg transition">
  <h2 className="text-xl font-semibold mb-2">Espaço Feynman</h2>
  <p className="text-sm text-muted-foreground mb-4">
    Pratique explicar conceitos de forma simples.
  </p>
  <button className="simple-btn" onClick={() => setCurrentPage("feynman")}>
    Ver Feynman
  </button>
</div>;

{
  /* Card: Simulados */
}
<div className="bg-card p-6 rounded-lg shadow hover:shadow-lg transition">
  <h2 className="text-xl font-semibold mb-2">Simulados</h2>
  <p className="text-sm text-muted-foreground mb-4">
    Teste seus conhecimentos com questões.
  </p>
  <button className="simple-btn" onClick={() => setCurrentPage("simulado")}>
    Ver Simulados
  </button>
</div>;

export default AppHome;
