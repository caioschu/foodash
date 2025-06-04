import React from "react";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

interface PageTitleProps {}

const PageTitle: React.FC<PageTitleProps> = () => {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/' || path === '/dashboard') return 'Dashboard';
    if (path === '/profile') return 'Perfil do Restaurante';
    if (path === '/sales') return 'Vendas';
    if (path === '/sales/register') return 'Registrar Venda';
    if (path === '/sales/import-saipos') return 'Importar Vendas';
    if (path === '/financial') return 'Financeiro (DRE)';
    if (path === '/benchmarking') return 'Benchmarking';
    if (path === '/suppliers') return 'Fornecedores';
    if (path === '/suppliers/catalog') return 'Catálogo de Produtos';
    if (path === '/suppliers/profile') return 'Perfil do Fornecedor';
    if (path === '/suppliers/restaurants') return 'Restaurantes Atendidos';
    if (path === '/jobs') return 'Vagas';
    if (path === '/jobs/seeker') return 'Painel do Candidato';
    if (path === '/admin') return 'Painel Administrativo';
    if (path === '/subscription') return 'Planos de Assinatura';
    
    // Extrair o último segmento do caminho e formatar como título
    const segments = path.split('/').filter(Boolean);
    if (segments.length > 0) {
      const lastSegment = segments[segments.length - 1];
      return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, ' ');
    }
    
    return '';
  };

  return (
    <h1 className="text-3xl font-bold mb-6">{getPageTitle()}</h1>
  );
};

export const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Ajustado z-index para ficar abaixo do header */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content - Ajustado padding-top para não sobrepor o header */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        {/* Header */}
        <Header setSidebarOpen={setSidebarOpen} />

        {/* Page Content - Aumentado padding-top para compensar o header maior */}
        <main className="flex-1 overflow-y-auto p-6 pt-36">
          {/* Título da Página */}
          <PageTitle />
          
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
