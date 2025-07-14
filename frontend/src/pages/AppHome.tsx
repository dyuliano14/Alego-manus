// src/pages/AppHome.tsx
import React from "react";
import { Button } from "../components/ui/button";
import { resetDB, seedDB } from "../services/debugService";

interface AppHomeProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<string>>;
}

const sections = [
  { title: "Dashboard", page: "dashboard", emoji: "📊", color: "bg-blue-100" },
  { title: "Cursos", page: "cursos", emoji: "📚", color: "bg-green-100" },
  {
    title: "Flashcards",
    page: "flashcards",
    emoji: "🧠",
    color: "bg-yellow-100",
  },
  { title: "Simulados", page: "simulado", emoji: "📝", color: "bg-purple-100" },
  { title: "Resumos", page: "markdown", emoji: "📄", color: "bg-indigo-100" },
  { title: "PDFs", page: "pdf", emoji: "📖", color: "bg-red-100" },
];

const AppHome: React.FC<AppHomeProps> = ({ setCurrentPage }) => (
  // Ajustado o padding para `p-4` em mobile e `sm:p-8` em telas maiores
  // A classe 'max-w-7xl mx-auto' garante que o conteúdo não se espalhe muito em telas gigantes, centralizando-o
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 sm:p-8 max-w-7xl mx-auto">
    {sections.map(({ title, page, emoji, color }) => (
      <div
        key={page}
        className={`rounded-xl ${color} shadow-md hover:shadow-lg transition duration-200 border border-transparent hover:border-gray-200 flex flex-col justify-between p-6`}
      >
        <div>
          <div className="text-5xl mb-4">{emoji}</div> {/* text-5xl mb-4 */}
          <h2 className="text-2xl font-bold mb-2">{title}</h2>{" "}
          {/* text-2xl font-bold mb-2 */}
          <p className="text-gray-700">
            {" "}
            {/* text-gray-700 */}
            Acesse seus {title.toLowerCase()} rapidamente e otimize seus
            estudos.
          </p>
        </div>
        <Button
          onClick={() => setCurrentPage(page)}
          className="simple-btn mt-4 mb-4"
        >
          Acessar
        </Button>
        <Button
          className="mt-8 w-full bg-red-100 text-red-800 border border-red-300 hover:bg-red-200"
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
    ))}
  </div>
);

export default AppHome;
