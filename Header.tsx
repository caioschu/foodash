import React from "react";
import { Link } from "react-router-dom";
import { Menu, Bell, User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useRestaurant } from "../../contexts/RestaurantContext";

interface HeaderProps {
  setSidebarOpen?: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { profile } = useRestaurant();

  const getDisplayName = () => {
    // Priorizar o nome do perfil do restaurante do contexto
    if (profile?.restaurantName) {
      return profile.restaurantName;
    }

    // Fallback para os dados do usuário
    if (user?.userType === "supplier") {
      return user.companyName;
    }
    if (user?.userType === "restaurant") {
      return user.restaurantName;
    }
    return user?.name;
  };

  return (
    <header className="bg-white shadow-sm z-40 fixed top-0 left-0 right-0">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        {/* Aumentei a altura do header para h-32 (128px) para acomodar o logo maior */}
        <div className="flex justify-between items-center h-32">
          {/* Lado Esquerdo - Menu Mobile + Logo FooDash GIGANTE */}
          <div className="flex items-center">
            {setSidebarOpen && (
              <button
                type="button"
                className="px-4 text-gray-500 md:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Menu className="h-6 w-6" />
              </button>
            )}

            {/* Logo do FooDash - GIGANTE AGORA */}
            <img
              src="/foodash-logo-horizontal.svg"
              alt="FooDash"
              className="h-24 w-auto" // Ajustado para h-24 (96px) para caber no header
            />
          </div>

          {/* Centro - Nome do Restaurante + Logo */}
          <div className="flex items-center space-x-4">
            {/* Logo do Restaurante - Garantindo que use o logo do perfil */}
            <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-orange-200 bg-gray-50 flex-shrink-0">
              {profile?.logoUrl ? (
                <img
                  src={profile.logoUrl}
                  alt="Logo do Restaurante"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white">
                  <User className="h-6 w-6" />
                </div>
              )}
            </div>

            {/* Nome do Restaurante */}
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-800 truncate max-w-xs">
                {getDisplayName()}
              </h1>
              <p className="text-sm text-gray-500">
                {user?.userType === "restaurant"
                  ? profile?.cuisineType || "Restaurante"
                  : user?.userType === "supplier"
                  ? "Fornecedor"
                  : "Candidato"}
              </p>
            </div>
          </div>

          {/* Lado Direito - Notificações + Logout */}
          <div className="flex items-center space-x-4">
            {/* Botão de notificações */}
            <button
              type="button"
              className="relative p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" />
              {/* Badge de notificação */}
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Botão de logout */}
            <button
              onClick={logout}
              className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors font-medium"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
