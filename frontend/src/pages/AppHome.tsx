interface AppHomeProps {
  setCurrentPage: (page: string) => void;
}

const sections = [
  { 
    title: "Dashboard", 
    page: "dashboard", 
    emoji: "📊", 
    color: "from-blue-500 to-blue-600",
    description: "Visualize seu progresso e estatísticas de estudo"
  },
  { 
    title: "Cursos", 
    page: "cursos", 
    emoji: "📚", 
    color: "from-green-500 to-green-600",
    description: "Explore nossos cursos estruturados e organizados"
  },
  {
    title: "Flashcards",
    page: "flashcards",
    emoji: "🧠",
    color: "from-yellow-500 to-yellow-600",
    description: "Pratique com cartões de memorização inteligentes"
  },
  { 
    title: "Simulados", 
    page: "simulado", 
    emoji: "📝", 
    color: "from-purple-500 to-purple-600",
    description: "Teste seus conhecimentos com simulados realistas"
  },
  { 
    title: "Resumos", 
    page: "markdown", 
    emoji: "📄", 
    color: "from-indigo-500 to-indigo-600",
    description: "Crie e organize seus resumos e anotações"
  },
  { 
    title: "PDFs", 
    page: "pdf", 
    emoji: "📖", 
    color: "from-red-500 to-red-600",
    description: "Visualize e anote seus documentos PDF"
  },
];

const AppHome = ({ setCurrentPage }: AppHomeProps) => (
  <div className="space-y-8">
    {/* Hero Section */}
    <div className="text-center py-8">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        Bem-vindo ao ALEGO Estudos
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Sua plataforma completa para organizar, estudar e acompanhar seu progresso nos estudos para concursos.
      </p>
    </div>

    {/* Cards Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {sections.map(({ title, page, emoji, color, description }) => (
        <div
          key={page}
          className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
        >
          {/* Gradient Background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
          
          <div className="relative p-8">
            <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
              {emoji}
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors duration-300">
              {title}
            </h3>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              {description}
            </p>
            
            <button
              onClick={() => setCurrentPage(page)}
              className={`w-full bg-gradient-to-r ${color} text-white py-4 px-6 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300/50 touch-manipulation min-h-[50px] text-base`}
            >
              Acessar {title}
            </button>
          </div>
        </div>
      ))}
    </div>

    {/* Stats Section */}
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 mt-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div>
          <div className="text-3xl font-bold text-blue-600 mb-2">6</div>
          <div className="text-gray-600">Módulos Disponíveis</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
          <div className="text-gray-600">Gratuito</div>
        </div>
        <div>
          <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
          <div className="text-gray-600">Acesso Ilimitado</div>
        </div>
      </div>
    </div>
  </div>
);

export default AppHome;
