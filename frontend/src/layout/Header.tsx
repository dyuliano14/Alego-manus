import { useState } from "react";

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

const Header = ({ currentPage, setCurrentPage }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const links = [
    { label: "Início", page: "home", icon: "🏠" },
    { label: "Dashboard", page: "dashboard", icon: "📊" },
    { label: "Cursos", page: "cursos", icon: "📚" },
    { label: "Admin", page: "admin", icon: "⚙️" },
  ];

  return (
    <header className="bg-gradient-to-r from-blue-50 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo e título */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-black font-bold text-lg sm:text-xl">
                📚 ALEGO Estudos
              </h1>
            </div>
          </div>

          {/* Menu desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-6">
              {links.map(({ label, page, icon }) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === page
                      ? "bg-white/20 text-white shadow-md transform scale-105"
                      : "text-white/80 hover:bg-white/15 hover:text-white hover:scale-105"
                  }`}
                >
                  <span className="mr-2">{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Botão menu mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-3 rounded-lg text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-200"
            >
              <svg className="h-7 w-7" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-3 sm:px-3 bg-black/20 rounded-lg mt-2 backdrop-blur-sm relative z-50">
              {links.map(({ label, page, icon }) => (
                <button
                  key={page}
                  onClick={() => {
                    setCurrentPage(page);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-4 rounded-lg text-base font-medium transition-all duration-200 touch-manipulation ${
                    currentPage === page
                      ? "bg-white/30 text-white shadow-lg"
                      : "text-white/90 hover:bg-white/20 hover:text-white active:bg-white/25"
                  }`}
                >
                  <span className="mr-3 text-lg">{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
