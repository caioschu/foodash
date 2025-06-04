import React, { useState, useEffect } from "react";
import {
  Users,
  TrendingUp,
  Settings,
  DollarSign,
  BarChart2,
  PieChart,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// Define types for our data
type User = {
  id: number;
  name: string;
  email: string;
  type: "restaurant" | "supplier" | "jobseeker";
  plan: "Mensal" | "Semestral" | "Anual" | "Gratuito";
  status: "active" | "inactive";
  joinDate: string;
};

type Plan = {
  id: number;
  name: string;
  price: number;
  interval: "monthly" | "semiannual" | "annual";
  userType: "restaurant" | "supplier";
  features: string[];
  active: boolean;
};

type BenchmarkData = {
  type: string;
  avgTicket: number;
  profitMargin: number;
  cmv: number;
  laborCost: number;
  avgOrdersPerDay: number;
};

export const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "users" | "plans" | "benchmarking" | "stats"
  >("users");

  // Check if user is admin
  useEffect(() => {
    // Only allow caioschu@hotmail.com to access admin panel
    if (!user || user.email !== "caioschu@hotmail.com") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Mock data - would be replaced with real data from API
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "Restaurante Italiano",
      email: "italiano@example.com",
      type: "restaurant",
      plan: "Mensal",
      status: "active",
      joinDate: "2025-01-15",
    },
    {
      id: 2,
      name: "Distribuidora ABC",
      email: "abc@example.com",
      type: "supplier",
      plan: "Anual",
      status: "active",
      joinDate: "2025-02-20",
    },
    {
      id: 3,
      name: "Pizzaria do João",
      email: "joao@example.com",
      type: "restaurant",
      plan: "Semestral",
      status: "inactive",
      joinDate: "2025-03-10",
    },
    {
      id: 4,
      name: "Sushi Express",
      email: "sushi@example.com",
      type: "restaurant",
      plan: "Anual",
      status: "active",
      joinDate: "2025-01-05",
    },
    {
      id: 5,
      name: "Fornecedor XYZ",
      email: "xyz@example.com",
      type: "supplier",
      plan: "Mensal",
      status: "active",
      joinDate: "2025-04-12",
    },
  ]);

  const [plans, setPlans] = useState<Plan[]>([
    {
      id: 1,
      name: "Plano Mensal - Restaurante",
      price: 99.9,
      interval: "monthly",
      userType: "restaurant",
      features: [
        "Acesso a todas as funcionalidades",
        "Suporte prioritário",
        "Relatórios avançados",
      ],
      active: true,
    },
    {
      id: 2,
      name: "Plano Semestral - Restaurante",
      price: 69.9,
      interval: "semiannual",
      userType: "restaurant",
      features: [
        "Acesso a todas as funcionalidades",
        "Suporte prioritário",
        "Relatórios avançados",
        "Desconto de 30%",
      ],
      active: true,
    },
    {
      id: 3,
      name: "Plano Anual - Restaurante",
      price: 49.9,
      interval: "annual",
      userType: "restaurant",
      features: [
        "Acesso a todas as funcionalidades",
        "Suporte prioritário",
        "Relatórios avançados",
        "Desconto de 50%",
      ],
      active: true,
    },
    {
      id: 4,
      name: "Plano Mensal - Fornecedor",
      price: 149.9,
      interval: "monthly",
      userType: "supplier",
      features: [
        "Acesso a todas as funcionalidades",
        "Suporte prioritário",
        "Relatórios avançados",
        "Visibilidade para restaurantes",
      ],
      active: true,
    },
    {
      id: 5,
      name: "Plano Semestral - Fornecedor",
      price: 119.9,
      interval: "semiannual",
      userType: "supplier",
      features: [
        "Acesso a todas as funcionalidades",
        "Suporte prioritário",
        "Relatórios avançados",
        "Visibilidade para restaurantes",
        "Desconto de 20%",
      ],
      active: true,
    },
    {
      id: 6,
      name: "Plano Anual - Fornecedor",
      price: 89.9,
      interval: "annual",
      userType: "supplier",
      features: [
        "Acesso a todas as funcionalidades",
        "Suporte prioritário",
        "Relatórios avançados",
        "Visibilidade para restaurantes",
        "Desconto de 40%",
      ],
      active: true,
    },
  ]);

  const [benchmarkingData, setBenchmarkingData] = useState<BenchmarkData[]>([
    {
      type: "Italiana",
      avgTicket: 89.9,
      profitMargin: 15.2,
      cmv: 30.1,
      laborCost: 25.5,
      avgOrdersPerDay: 45,
    },
    {
      type: "Japonesa",
      avgTicket: 120.5,
      profitMargin: 18.5,
      cmv: 35.2,
      laborCost: 28.3,
      avgOrdersPerDay: 38,
    },
    {
      type: "Brasileira",
      avgTicket: 65.3,
      profitMargin: 12.8,
      cmv: 28.5,
      laborCost: 22.7,
      avgOrdersPerDay: 52,
    },
    {
      type: "Fast Food",
      avgTicket: 42.75,
      profitMargin: 10.5,
      cmv: 32.8,
      laborCost: 20.1,
      avgOrdersPerDay: 120,
    },
    {
      type: "Mexicana",
      avgTicket: 78.4,
      profitMargin: 14.3,
      cmv: 31.5,
      laborCost: 24.8,
      avgOrdersPerDay: 35,
    },
  ]);

  // Calculate plan statistics
  const planStats = {
    restaurant: {
      monthly: users.filter(
        (u) =>
          u.type === "restaurant" &&
          u.plan === "Mensal" &&
          u.status === "active"
      ).length,
      semiannual: users.filter(
        (u) =>
          u.type === "restaurant" &&
          u.plan === "Semestral" &&
          u.status === "active"
      ).length,
      annual: users.filter(
        (u) =>
          u.type === "restaurant" && u.plan === "Anual" && u.status === "active"
      ).length,
      total: users.filter(
        (u) => u.type === "restaurant" && u.status === "active"
      ).length,
    },
    supplier: {
      monthly: users.filter(
        (u) =>
          u.type === "supplier" && u.plan === "Mensal" && u.status === "active"
      ).length,
      semiannual: users.filter(
        (u) =>
          u.type === "supplier" &&
          u.plan === "Semestral" &&
          u.status === "active"
      ).length,
      annual: users.filter(
        (u) =>
          u.type === "supplier" && u.plan === "Anual" && u.status === "active"
      ).length,
      total: users.filter((u) => u.type === "supplier" && u.status === "active")
        .length,
    },
    totalActive: users.filter((u) => u.status === "active").length,
    totalInactive: users.filter((u) => u.status === "inactive").length,
  };

  // Calculate monthly recurring revenue
  const calculateMRR = () => {
    let mrr = 0;

    // Restaurant plans
    mrr +=
      planStats.restaurant.monthly *
        plans.find(
          (p) => p.userType === "restaurant" && p.interval === "monthly"
        )?.price || 0;
    mrr +=
      (planStats.restaurant.semiannual *
        (plans.find(
          (p) => p.userType === "restaurant" && p.interval === "semiannual"
        )?.price || 0)) /
      6;
    mrr +=
      (planStats.restaurant.annual *
        (plans.find(
          (p) => p.userType === "restaurant" && p.interval === "annual"
        )?.price || 0)) /
      12;

    // Supplier plans
    mrr +=
      planStats.supplier.monthly *
      (plans.find((p) => p.userType === "supplier" && p.interval === "monthly")
        ?.price || 0);
    mrr +=
      (planStats.supplier.semiannual *
        (plans.find(
          (p) => p.userType === "supplier" && p.interval === "semiannual"
        )?.price || 0)) /
      6;
    mrr +=
      (planStats.supplier.annual *
        (plans.find((p) => p.userType === "supplier" && p.interval === "annual")
          ?.price || 0)) /
      12;

    return mrr;
  };

  // Handle user status toggle
  const toggleUserStatus = (userId: number) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === "active" ? "inactive" : "active",
            }
          : user
      )
    );
  };

  // Handle plan status toggle
  const togglePlanStatus = (planId: number) => {
    setPlans(
      plans.map((plan) =>
        plan.id === planId ? { ...plan, active: !plan.active } : plan
      )
    );
  };

  // Handle benchmark data update
  const updateBenchmarkData = (
    index: number,
    field: keyof BenchmarkData,
    value: number
  ) => {
    setBenchmarkingData(
      benchmarkingData.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  // Handle plan price update
  const updatePlanPrice = (planId: number, price: number) => {
    setPlans(
      plans.map((plan) => (plan.id === planId ? { ...plan, price } : plan))
    );
  };

  if (!user || user.email !== "caioschu@hotmail.com") {
    return (
      <div className="p-8 text-center">Acesso restrito. Redirecionando...</div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Painel Administrativo
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Gerencie usuários, planos e dados do sistema
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab("users")}
              className={`py-4 px-6 inline-flex items-center ${
                activeTab === "users"
                  ? "border-b-2 border-orange-500 text-orange-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Users className="h-5 w-5 mr-2" />
              Usuários
            </button>
            <button
              onClick={() => setActiveTab("plans")}
              className={`py-4 px-6 inline-flex items-center ${
                activeTab === "plans"
                  ? "border-b-2 border-orange-500 text-orange-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <DollarSign className="h-5 w-5 mr-2" />
              Planos
            </button>
            <button
              onClick={() => setActiveTab("benchmarking")}
              className={`py-4 px-6 inline-flex items-center ${
                activeTab === "benchmarking"
                  ? "border-b-2 border-orange-500 text-orange-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              Dados de Mercado
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`py-4 px-6 inline-flex items-center ${
                activeTab === "stats"
                  ? "border-b-2 border-orange-500 text-orange-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <BarChart2 className="h-5 w-5 mr-2" />
              Estatísticas
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "users" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Usuários do Sistema
                </h2>
                <div className="flex space-x-2">
                  <select className="form-select rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50">
                    <option value="all">Todos os tipos</option>
                    <option value="restaurant">Restaurantes</option>
                    <option value="supplier">Fornecedores</option>
                  </select>
                  <button className="btn btn-primary">Adicionar Usuário</button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Nome
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tipo
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Plano
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Data de Cadastro
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {user.type === "restaurant"
                              ? "Restaurante"
                              : user.type === "supplier"
                              ? "Fornecedor"
                              : "Candidato"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.plan}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.status === "active" ? "Ativo" : "Inativo"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.joinDate).toLocaleDateString("pt-BR")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => toggleUserStatus(user.id)}
                              className={`px-2 py-1 rounded text-xs font-medium ${
                                user.status === "active"
                                  ? "bg-red-100 text-red-800 hover:bg-red-200"
                                  : "bg-green-100 text-green-800 hover:bg-green-200"
                              }`}
                            >
                              {user.status === "active"
                                ? "Desativar"
                                : "Ativar"}
                            </button>
                            <button className="text-orange-600 hover:text-orange-900">
                              <Settings className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "plans" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Planos do Sistema
                </h2>
                <button className="btn btn-primary">Adicionar Plano</button>
              </div>

              <div className="mb-8">
                <h3 className="text-md font-medium text-gray-700 mb-4">
                  Planos para Restaurantes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plans
                    .filter((plan) => plan.userType === "restaurant")
                    .map((plan) => (
                      <div
                        key={plan.id}
                        className={`bg-white border rounded-lg shadow-sm overflow-hidden ${
                          !plan.active ? "opacity-60" : ""
                        }`}
                      >
                        <div className="p-6 border-b border-gray-200">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-medium text-gray-900">
                              {plan.name.split(" - ")[0]}
                            </h3>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                plan.active
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {plan.active ? "Ativo" : "Inativo"}
                            </span>
                          </div>
                          <div className="flex items-baseline mt-2">
                            <span className="text-2xl font-bold text-gray-900">
                              R$ {plan.price.toFixed(2)}
                            </span>
                            <span className="ml-1 text-sm text-gray-500">
                              /
                              {plan.interval === "monthly"
                                ? "mês"
                                : plan.interval === "semiannual"
                                ? "semestre"
                                : "ano"}
                            </span>
                          </div>
                        </div>
                        <div className="p-6">
                          <ul className="space-y-2">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <svg
                                  className="h-5 w-5 text-green-500 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                  ></path>
                                </svg>
                                <span className="text-sm text-gray-700">
                                  {feature}
                                </span>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-6 space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Preço (R$)
                              </label>
                              <input
                                type="number"
                                value={plan.price}
                                onChange={(e) =>
                                  updatePlanPrice(
                                    plan.id,
                                    parseFloat(e.target.value)
                                  )
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                                step="0.01"
                                min="0"
                              />
                            </div>
                            <div className="flex justify-between">
                              <button
                                onClick={() => togglePlanStatus(plan.id)}
                                className={`px-3 py-1.5 rounded text-sm font-medium ${
                                  plan.active
                                    ? "bg-red-100 text-red-800 hover:bg-red-200"
                                    : "bg-green-100 text-green-800 hover:bg-green-200"
                                }`}
                              >
                                {plan.active ? "Desativar" : "Ativar"}
                              </button>
                              <button className="px-3 py-1.5 bg-orange-100 text-orange-800 rounded text-sm font-medium hover:bg-orange-200">
                                Editar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <h3 className="text-md font-medium text-gray-700 mb-4">
                  Planos para Fornecedores
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plans
                    .filter((plan) => plan.userType === "supplier")
                    .map((plan) => (
                      <div
                        key={plan.id}
                        className={`bg-white border rounded-lg shadow-sm overflow-hidden ${
                          !plan.active ? "opacity-60" : ""
                        }`}
                      >
                        <div className="p-6 border-b border-gray-200">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-medium text-gray-900">
                              {plan.name.split(" - ")[0]}
                            </h3>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                plan.active
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {plan.active ? "Ativo" : "Inativo"}
                            </span>
                          </div>
                          <div className="flex items-baseline mt-2">
                            <span className="text-2xl font-bold text-gray-900">
                              R$ {plan.price.toFixed(2)}
                            </span>
                            <span className="ml-1 text-sm text-gray-500">
                              /
                              {plan.interval === "monthly"
                                ? "mês"
                                : plan.interval === "semiannual"
                                ? "semestre"
                                : "ano"}
                            </span>
                          </div>
                        </div>
                        <div className="p-6">
                          <ul className="space-y-2">
                            {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <svg
                                  className="h-5 w-5 text-green-500 mr-2"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                  ></path>
                                </svg>
                                <span className="text-sm text-gray-700">
                                  {feature}
                                </span>
                              </li>
                            ))}
                          </ul>
                          <div className="mt-6 space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Preço (R$)
                              </label>
                              <input
                                type="number"
                                value={plan.price}
                                onChange={(e) =>
                                  updatePlanPrice(
                                    plan.id,
                                    parseFloat(e.target.value)
                                  )
                                }
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                                step="0.01"
                                min="0"
                              />
                            </div>
                            <div className="flex justify-between">
                              <button
                                onClick={() => togglePlanStatus(plan.id)}
                                className={`px-3 py-1.5 rounded text-sm font-medium ${
                                  plan.active
                                    ? "bg-red-100 text-red-800 hover:bg-red-200"
                                    : "bg-green-100 text-green-800 hover:bg-green-200"
                                }`}
                              >
                                {plan.active ? "Desativar" : "Ativar"}
                              </button>
                              <button className="px-3 py-1.5 bg-orange-100 text-orange-800 rounded text-sm font-medium hover:bg-orange-200">
                                Editar
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "benchmarking" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Dados de Mercado
                </h2>
                <div className="flex space-x-2">
                  <button className="btn btn-secondary">
                    Adicionar Categoria
                  </button>
                  <button className="btn btn-primary">Salvar Alterações</button>
                </div>
              </div>

              <div className="space-y-6">
                {benchmarkingData.map((type, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Culinária {type.type}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Ticket Médio (R$)
                        </label>
                        <input
                          type="number"
                          value={type.avgTicket}
                          onChange={(e) =>
                            updateBenchmarkData(
                              index,
                              "avgTicket",
                              parseFloat(e.target.value)
                            )
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                          step="0.01"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Margem de Lucro (%)
                        </label>
                        <input
                          type="number"
                          value={type.profitMargin}
                          onChange={(e) =>
                            updateBenchmarkData(
                              index,
                              "profitMargin",
                              parseFloat(e.target.value)
                            )
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                          step="0.1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          CMV (%)
                        </label>
                        <input
                          type="number"
                          value={type.cmv}
                          onChange={(e) =>
                            updateBenchmarkData(
                              index,
                              "cmv",
                              parseFloat(e.target.value)
                            )
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                          step="0.1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Custo de Mão de Obra (%)
                        </label>
                        <input
                          type="number"
                          value={type.laborCost}
                          onChange={(e) =>
                            updateBenchmarkData(
                              index,
                              "laborCost",
                              parseFloat(e.target.value)
                            )
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                          step="0.1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Pedidos por Dia (média)
                        </label>
                        <input
                          type="number"
                          value={type.avgOrdersPerDay}
                          onChange={(e) =>
                            updateBenchmarkData(
                              index,
                              "avgOrdersPerDay",
                              parseInt(e.target.value)
                            )
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                          step="1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "stats" && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Estatísticas do Sistema
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Total de Usuários
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {users.length}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        <span className="text-green-600">
                          {planStats.totalActive}
                        </span>{" "}
                        ativos,
                        <span className="text-red-600">
                          {" "}
                          {planStats.totalInactive}
                        </span>{" "}
                        inativos
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Receita Mensal (MRR)
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        R${" "}
                        {calculateMRR().toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Estimativa baseada nos planos ativos
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center mr-4">
                      <PieChart className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Restaurantes
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {planStats.restaurant.total}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        <span>{planStats.restaurant.monthly}</span> mensais,
                        <span> {planStats.restaurant.semiannual}</span>{" "}
                        semestrais,
                        <span> {planStats.restaurant.annual}</span> anuais
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Fornecedores
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {planStats.supplier.total}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        <span>{planStats.supplier.monthly}</span> mensais,
                        <span> {planStats.supplier.semiannual}</span>{" "}
                        semestrais,
                        <span> {planStats.supplier.annual}</span> anuais
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Distribuição de Planos - Restaurantes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-700">
                        Plano Mensal
                      </h4>
                      <span className="text-xs font-medium text-gray-500">
                        {planStats.restaurant.monthly} usuários
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{
                          width: `${
                            planStats.restaurant.total > 0
                              ? (planStats.restaurant.monthly /
                                  planStats.restaurant.total) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {planStats.restaurant.total > 0
                        ? (
                            (planStats.restaurant.monthly /
                              planStats.restaurant.total) *
                            100
                          ).toFixed(1)
                        : "0"}
                      % dos restaurantes
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-700">
                        Plano Semestral
                      </h4>
                      <span className="text-xs font-medium text-gray-500">
                        {planStats.restaurant.semiannual} usuários
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-green-500 rounded-full"
                        style={{
                          width: `${
                            planStats.restaurant.total > 0
                              ? (planStats.restaurant.semiannual /
                                  planStats.restaurant.total) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {planStats.restaurant.total > 0
                        ? (
                            (planStats.restaurant.semiannual /
                              planStats.restaurant.total) *
                            100
                          ).toFixed(1)
                        : "0"}
                      % dos restaurantes
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-700">
                        Plano Anual
                      </h4>
                      <span className="text-xs font-medium text-gray-500">
                        {planStats.restaurant.annual} usuários
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-orange-500 rounded-full"
                        style={{
                          width: `${
                            planStats.restaurant.total > 0
                              ? (planStats.restaurant.annual /
                                  planStats.restaurant.total) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {planStats.restaurant.total > 0
                        ? (
                            (planStats.restaurant.annual /
                              planStats.restaurant.total) *
                            100
                          ).toFixed(1)
                        : "0"}
                      % dos restaurantes
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Distribuição de Planos - Fornecedores
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-700">
                        Plano Mensal
                      </h4>
                      <span className="text-xs font-medium text-gray-500">
                        {planStats.supplier.monthly} usuários
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-purple-500 rounded-full"
                        style={{
                          width: `${
                            planStats.supplier.total > 0
                              ? (planStats.supplier.monthly /
                                  planStats.supplier.total) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {planStats.supplier.total > 0
                        ? (
                            (planStats.supplier.monthly /
                              planStats.supplier.total) *
                            100
                          ).toFixed(1)
                        : "0"}
                      % dos fornecedores
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-700">
                        Plano Semestral
                      </h4>
                      <span className="text-xs font-medium text-gray-500">
                        {planStats.supplier.semiannual} usuários
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-pink-500 rounded-full"
                        style={{
                          width: `${
                            planStats.supplier.total > 0
                              ? (planStats.supplier.semiannual /
                                  planStats.supplier.total) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {planStats.supplier.total > 0
                        ? (
                            (planStats.supplier.semiannual /
                              planStats.supplier.total) *
                            100
                          ).toFixed(1)
                        : "0"}
                      % dos fornecedores
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-medium text-gray-700">
                        Plano Anual
                      </h4>
                      <span className="text-xs font-medium text-gray-500">
                        {planStats.supplier.annual} usuários
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-indigo-500 rounded-full"
                        style={{
                          width: `${
                            planStats.supplier.total > 0
                              ? (planStats.supplier.annual /
                                  planStats.supplier.total) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {planStats.supplier.total > 0
                        ? (
                            (planStats.supplier.annual /
                              planStats.supplier.total) *
                            100
                          ).toFixed(1)
                        : "0"}
                      % dos fornecedores
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
