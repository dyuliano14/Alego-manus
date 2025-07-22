const Footer = () => (
  <footer className="bg-gray-900 text-white py-8 mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0 flex items-center gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img 
              src="/site/alego-estudos-app/logo.png" 
              alt="Alego Estudos Logo" 
              className="h-12 w-auto"
              onError={(e) => {
                // Fallback para emoji se logo não carregar
                e.currentTarget.style.display = 'none';
                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'block';
              }}
            />
            <div className="text-3xl hidden">📚</div>
          </div>
          
          {/* Texto */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Controlador de estudos</h3>
            <p className="text-gray-400 text-sm">
              Plataforma completa para preparação de concursos
            </p>
          </div>
        </div>
        
        <div className="text-center md:text-right">
          <p className="text-gray-400 text-sm">
            Desenvolvido com ❤️ para auxiliar na sua preparação
          </p>
          <p className="text-gray-500 text-xs mt-1">
            © 2025 Controlador de estudos.
          </p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
