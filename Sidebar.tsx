import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  BarChart2,
  User,
  FileText,
  DollarSign,
  TrendingUp,
  Package,
  Briefcase,
  ChevronLeft,
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const isActiveSection = (section: string) =>
    location.pathname.startsWith(`/${section}`);

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const handleMouseEnter = () => {
    if (!sidebarOpen) setIsHovering(true);
  };
  const handleMouseLeave = () => {
    if (!sidebarOpen) setIsHovering(false);
  };

  useEffect(() => {
    setActiveDropdown(null);
  }, [location.pathname]);

  const expanded = sidebarOpen || isHovering;

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-10 pt-32 ${
        expanded ? "w-64" : "w-16"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 py-2 overflow-y-auto">
          <nav className="px-2 space-y-1">
            <NavItem
              path="/"
              label="Dashboard"
              icon={BarChart2}
              active={isActive("/")}
              expanded={expanded}
              onClick={() => handleNavigate("/")}
            />

            <NavItem
              path="/profile"
              label="Perfil do Restaurante"
              icon={User}
              active={isActive("/profile")}
              expanded={expanded}
              onClick={() => handleNavigate("/profile")}
            />

            <Dropdown
              section="sales"
              activeSection={isActiveSection("sales")}
              isOpen={activeDropdown === "sales"}
              toggle={() => toggleDropdown("sales")}
              expanded={expanded}
              items={[
                { label: "Registrar Venda", path: "/sales/register" },
                { label: "Importar Vendas", path: "/sales/import-saipos" },
              ]}
              onNavigate={handleNavigate}
            />

            <NavItem
              path="/financial"
              label="Financeiro (DRE)"
              icon={DollarSign}
              active={isActive("/financial")}
              expanded={expanded}
              onClick={() => handleNavigate("/financial")}
            />

            <NavItem
              path="/benchmarking"
              label="Benchmarking"
              icon={TrendingUp}
              active={isActive("/benchmarking")}
              expanded={expanded}
              onClick={() => handleNavigate("/benchmarking")}
            />

            <NavItem
              path="/suppliers"
              label="Fornecedores"
              icon={Package}
              active={isActive("/suppliers")}
              expanded={expanded}
              onClick={() => handleNavigate("/suppliers")}
            />

            <NavItem
              path="/jobs"
              label="Vagas"
              icon={Briefcase}
              active={isActive("/jobs")}
              expanded={expanded}
              onClick={() => handleNavigate("/jobs")}
            />
          </nav>
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md"
          >
            {sidebarOpen ? (
              <>
                <ChevronLeft className="h-5 w-5" />
                <span className="ml-2">Recolher barra</span>
              </>
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

interface NavItemProps {
  path: string;
  label: string;
  icon: React.FC<{ className?: string }>;
  active: boolean;
  expanded: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({
  label,
  icon: Icon,
  active,
  expanded,
  onClick,
}) => (
  <div
    onClick={onClick}
    className={`flex items-center px-2 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors ${
      active
        ? "bg-orange-50 text-orange-600"
        : "text-gray-600 hover:bg-gray-100"
    }`}
  >
    <Icon className={`${expanded ? "mr-3" : "mx-auto"} h-5 w-5`} />
    {expanded && <span>{label}</span>}
  </div>
);

interface DropdownProps {
  section: string;
  activeSection: boolean;
  isOpen: boolean;
  toggle: () => void;
  expanded: boolean;
  items: { label: string; path: string }[];
  onNavigate: (path: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  activeSection,
  isOpen,
  toggle,
  expanded,
  items,
  onNavigate,
}) => (
  <div className="relative">
    <div
      onClick={toggle}
      className={`flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors ${
        activeSection
          ? "bg-orange-50 text-orange-600"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <div className="flex items-center">
        <FileText className={`${expanded ? "mr-3" : "mx-auto"} h-5 w-5`} />
        {expanded && <span>Vendas</span>}
      </div>
      {expanded && (isOpen ? <ChevronDown /> : <ChevronRight />)}
    </div>

    {isOpen && expanded && (
      <div className="mt-1 pl-10 space-y-1">
        {items.map((item) => (
          <div
            key={item.path}
            onClick={() => onNavigate(item.path)}
            className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md cursor-pointer hover:bg-gray-100"
          >
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default Sidebar;
