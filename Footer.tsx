import React from 'react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} FooDash. Todos os direitos reservados.
            </p>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
              Termos de Uso
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
              Política de Privacidade
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">
              Suporte
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};