import React from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export const SaiposImport = () => {
  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <Link to="/sales" className="mr-3 text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-3xl font-bold text-blue-600">
          Importar Vendas do Saipos
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="text-6xl mb-6">🚧</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Em breve</h2>
        <p className="text-gray-600 max-w-md mx-auto mb-6">
          A funcionalidade de importação de vendas do Saipos está em
          desenvolvimento e estará disponível em breve.
        </p>
        <Link
          to="/sales"
          className="inline-flex items-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors"
        >
          Voltar para Vendas
        </Link>
      </div>
    </div>
  );
};

// Exportação nomeada e padrão para compatibilidade
export default SaiposImport;
