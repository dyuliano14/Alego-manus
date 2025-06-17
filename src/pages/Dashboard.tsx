import React, { useState } from "react";

interface DashboardProps {
  setCurrentPage: (page: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setCurrentPage }) => {
  const [metrics, setMetrics] = useState({
    totalCourses: 25,
    activeUsers: 150,
    completedLessons: 320,
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Visão geral do progresso e métricas</p>
        </div>
        <button
          onClick={() => setCurrentPage("home")}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Voltar à Home
        </button>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">Cursos Ativos</h2>
          <p className="text-3xl font-bold text-blue-600">
            {metrics.totalCourses}
          </p>
          <p className="text-sm text-gray-500">Total de cursos disponíveis</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">
            Usuários Ativos
          </h2>
          <p className="text-3xl font-bold text-green-600">
            {metrics.activeUsers}
          </p>
          <p className="text-sm text-gray-500">Usuários engajados</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">
            Lições Concluídas
          </h2>
          <p className="text-3xl font-bold text-purple-600">
            {metrics.completedLessons}
          </p>
          <p className="text-sm text-gray-500">
            Lições finalizadas por usuários
          </p>
        </div>
      </section>

      <section className="mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Resumo</h2>
          <p className="text-gray-600">
            Aqui você pode visualizar um resumo das principais métricas da
            plataforma. Acompanhe o progresso dos cursos, o engajamento dos
            usuários e as lições concluídas.
          </p>
          <button
            onClick={() => setCurrentPage("cursos")}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Ver Cursos
          </button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
