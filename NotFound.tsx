import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronsLeft, Home } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <ChevronsLeft className="h-16 w-16 text-orange-500 mx-auto" />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          404 - Página não encontrada
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          A página que você está procurando não existe ou foi movida.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            to="/"
            className="btn btn-primary flex items-center"
          >
            <Home className="h-5 w-5 mr-2" />
            Voltar para o Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};