import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  BarChart4,
  DollarSign,
  TrendingUp,
  Briefcase,
  AlertTriangle,
  Calendar,
  ChevronDown,
  PieChart,
  Users,
  Clock,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useRestaurant } from "../contexts/RestaurantContext";
import { useSales } from "../contexts/SalesContext";

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { profile } = useRestaurant();
  const { salesEntries, paymentEntries } = useSales();

  // Date filter state
  const [dateRange, setDateRange] = useState("all");
  const [customStartDate, setCustomStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .split("T")[0]
  );
  const [customEndDate, setCustomEndDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Filter sales entries based on date range
  const filteredSalesEntries = useMemo(() => {
    if (dateRange === "all") {
      return salesEntries;
    }

    const today = new Date();
    let startDate: Date;

    switch (dateRange) {
      case "today":
        startDate = new Date(today.setHours(0, 0, 0, 0));
        break;
      case "yesterday":
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        const endOfYesterday = new Date(startDate);
        endOfYesterday.setHours(23, 59, 59, 999);
        return salesEntries.filter((entry) => {
          const entryDate = new Date(entry.date);
          return entryDate >= startDate && entryDate <= endOfYesterday;
        });
      case "last7days":
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "last30days":
        startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 30);
        break;
      case "thisMonth":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case "lastMonth":
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const endOfLastMonth = new Date(
          today.getFullYear(),
          today.getMonth(),
          0,
          23,
          59,
          59,
          999
        );
        return salesEntries.filter((entry) => {
          const entryDate = new Date(entry.date);
          return entryDate >= startDate && entryDate <= endOfLastMonth;
        });
      case "custom":
        startDate = new Date(customStartDate);
        const endDate = new Date(customEndDate);
        endDate.setHours(23, 59, 59, 999);
        return salesEntries.filter((entry) => {
          const entryDate = new Date(entry.date);
          return entryDate >= startDate && entryDate <= endDate;
        });
      default:
        return salesEntries;
    }

    return salesEntries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= startDate && entryDate <= today;
    });
  }, [salesEntries, dateRange, customStartDate, customEndDate]);

  // Mock market data (would come from API in real app)
  const marketData = {
    category: profile?.cuisineType || "Restaurante",
    totalRestaurants: 145,
    averages: {
      sales: 42500.3,
      orders: 650,
      avgTicket: 65.38,
      cmv: 30.1, // % of revenue
      labor: 25.5, // % of revenue
      profit: 15.2, // % of revenue
    },
  };

  // Calculate real sales data from filtered salesEntries
  const salesData = useMemo(() => {
    const total = filteredSalesEntries.reduce(
      (sum, entry) => sum + entry.revenue,
      0
    );
    const orders = filteredSalesEntries.reduce(
      (sum, entry) => sum + entry.orders,
      0
    );
    const avgTicket = orders > 0 ? total / orders : 0;

    // Group sales by channel
    const byChannel = filteredSalesEntries.reduce((acc, entry) => {
      if (!acc[entry.channel]) {
        acc[entry.channel] = { revenue: 0, orders: 0 };
      }
      acc[entry.channel].revenue += entry.revenue;
      acc[entry.channel].orders += entry.orders;
      return acc;
    }, {} as { [key: string]: { revenue: number; orders: number } });

    // Calculate top channel
    let topChannel = { name: "", revenue: 0 };
    Object.entries(byChannel).forEach(([channel, data]) => {
      if (data.revenue > topChannel.revenue) {
        topChannel = { name: channel, revenue: data.revenue };
      }
    });

    // Calculate estimated metrics based on industry standards
    const estimatedCMV = total * 0.3; // 30% of revenue
    const estimatedLabor = total * 0.25; // 25% of revenue
    const estimatedProfit = total * 0.15; // 15% of revenue

    return {
      total,
      growth: 7.9, // This could be calculated if we had historical data
      avgTicket,
      orders,
      byChannel,
      topChannel,
      estimatedCMV,
      estimatedLabor,
      estimatedProfit,
    };
  }, [filteredSalesEntries]);

  const calculatePerformance = (value: number, average: number) => {
    const percentage = ((value - average) / average) * 100;
    return {
      percentage,
      type: percentage >= 0 ? "positive" : "negative",
    };
  };

  const salesPerformance = calculatePerformance(
    salesData.total,
    marketData.averages.sales
  );
  const ordersPerformance = calculatePerformance(
    salesData.orders,
    marketData.averages.orders
  );
  const ticketPerformance = calculatePerformance(
    salesData.avgTicket,
    marketData.averages.avgTicket
  );

  // Format date range for display
  const getDateRangeDisplay = () => {
    switch (dateRange) {
      case "all":
        return "Todo o período";
      case "today":
        return "Hoje";
      case "yesterday":
        return "Ontem";
      case "last7days":
        return "Últimos 7 dias";
      case "last30days":
        return "Últimos 30 dias";
      case "thisMonth":
        return "Este mês";
      case "lastMonth":
        return "Mês passado";
      case "custom":
        return `${new Date(customStartDate).toLocaleDateString(
          "pt-BR"
        )} - ${new Date(customEndDate).toLocaleDateString("pt-BR")}`;
      default:
        return "Todo o período";
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {profile?.restaurantName || user?.restaurantName}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            {profile?.cuisineType || marketData.category} • Comparando com{" "}
            {marketData.totalRestaurants} restaurantes na sua região
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              {getDateRangeDisplay()}
              <ChevronDown className="h-4 w-4 ml-2 text-gray-500" />
            </button>

            {showDatePicker && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-10 p-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Filtrar por período
                  </h3>

                  <div className="space-y-1">
                    {[
                      { value: "all", label: "Todo o período" },
                      { value: "today", label: "Hoje" },
                      { value: "yesterday", label: "Ontem" },
                      { value: "last7days", label: "Últimos 7 dias" },
                      { value: "last30days", label: "Últimos 30 dias" },
                      { value: "thisMonth", label: "Este mês" },
                      { value: "lastMonth", label: "Mês passado" },
                      { value: "custom", label: "Personalizado" },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center">
                        <input
                          id={`date-range-${option.value}`}
                          name="date-range"
                          type="radio"
                          checked={dateRange === option.value}
                          onChange={() => setDateRange(option.value)}
                          className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                        />
                        <label
                          htmlFor={`date-range-${option.value}`}
                          className="ml-2 block text-sm text-gray-700"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>

                  {dateRange === "custom" && (
                    <div className="mt-3 space-y-2">
                      <div>
                        <label
                          htmlFor="custom-start-date"
                          className="block text-xs text-gray-500"
                        >
                          Data inicial
                        </label>
                        <input
                          type="date"
                          id="custom-start-date"
                          value={customStartDate}
                          onChange={(e) => setCustomStartDate(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="custom-end-date"
                          className="block text-xs text-gray-500"
                        >
                          Data final
                        </label>
                        <input
                          type="date"
                          id="custom-end-date"
                          value={customEndDate}
                          onChange={(e) => setCustomEndDate(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-3 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowDatePicker(false)}
                      className="bg-orange-600 text-white rounded-md px-3 py-1.5 text-sm font-medium hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center bg-orange-50 text-orange-800 px-4 py-2 rounded-lg">
            <TrendingUp className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">
              Dados atualizados hoje às 08:00
            </span>
          </div>
        </div>
      </div>

      {/* Main Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Vendas</h3>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                salesPerformance.type === "positive"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {salesPerformance.type === "positive" ? "+" : ""}
              {salesPerformance.percentage.toFixed(1)}%
            </span>
          </div>

          <div className="flex items-end gap-4">
            <div>
              <p className="text-3xl font-bold text-gray-900">
                R${" "}
                {salesData.total.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-sm text-gray-500 mt-1">Seu restaurante</p>
            </div>
            <div>
              <p className="text-xl text-gray-600">
                R${" "}
                {marketData.averages.sales.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-sm text-gray-500 mt-1">Média do mercado</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className={`h-2 rounded-full ${
                  salesPerformance.type === "positive"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(
                      0,
                      (salesData.total / (marketData.averages.sales * 1.5)) *
                        100
                    )
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Pedidos</h3>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                ordersPerformance.type === "positive"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {ordersPerformance.type === "positive" ? "+" : ""}
              {ordersPerformance.percentage.toFixed(1)}%
            </span>
          </div>

          <div className="flex items-end gap-4">
            <div>
              <p className="text-3xl font-bold text-gray-900">
                {salesData.orders}
              </p>
              <p className="text-sm text-gray-500 mt-1">Seu restaurante</p>
            </div>
            <div>
              <p className="text-xl text-gray-600">
                {marketData.averages.orders}
              </p>
              <p className="text-sm text-gray-500 mt-1">Média do mercado</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className={`h-2 rounded-full ${
                  ordersPerformance.type === "positive"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(
                      0,
                      (salesData.orders / (marketData.averages.orders * 1.5)) *
                        100
                    )
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Ticket Médio</h3>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                ticketPerformance.type === "positive"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {ticketPerformance.type === "positive" ? "+" : ""}
              {ticketPerformance.percentage.toFixed(1)}%
            </span>
          </div>

          <div className="flex items-end gap-4">
            <div>
              <p className="text-3xl font-bold text-gray-900">
                R${" "}
                {salesData.avgTicket.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-sm text-gray-500 mt-1">Seu restaurante</p>
            </div>
            <div>
              <p className="text-xl text-gray-600">
                R${" "}
                {marketData.averages.avgTicket.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-sm text-gray-500 mt-1">Média do mercado</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className={`h-2 rounded-full ${
                  ticketPerformance.type === "positive"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
                style={{
                  width: `${Math.min(
                    100,
                    Math.max(
                      0,
                      (salesData.avgTicket /
                        (marketData.averages.avgTicket * 1.5)) *
                        100
                    )
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center mb-4">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <PieChart className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                CMV Estimado
              </h3>
              <p className="text-xl font-bold text-gray-900">
                R${" "}
                {salesData.estimatedCMV.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {((salesData.estimatedCMV / salesData.total) * 100).toFixed(1)}%
                da receita
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center mb-4">
            <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
              <Users className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Custo de Mão de Obra
              </h3>
              <p className="text-xl font-bold text-gray-900">
                R${" "}
                {salesData.estimatedLabor.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {((salesData.estimatedLabor / salesData.total) * 100).toFixed(
                  1
                )}
                % da receita
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center mb-4">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Lucro Estimado
              </h3>
              <p className="text-xl font-bold text-green-600">
                R${" "}
                {salesData.estimatedProfit.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {((salesData.estimatedProfit / salesData.total) * 100).toFixed(
                  1
                )}
                % da receita
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Channel Performance */}
      <div className="card mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Desempenho por Canal
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Canal
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Faturamento
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Pedidos
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ticket Médio
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  % do Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(salesData.byChannel).map(([channel, data]) => (
                <tr key={channel}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {channel}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    R${" "}
                    {data.revenue.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {data.orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    R${" "}
                    {(data.orders > 0
                      ? data.revenue / data.orders
                      : 0
                    ).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {salesData.total > 0
                      ? ((data.revenue / salesData.total) * 100).toFixed(1)
                      : "0.0"}
                    %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center mb-4">
            <Briefcase className="h-5 w-5 text-orange-500 mr-2" />
            <h3 className="text-lg font-medium">Suas Vagas em Aberto</h3>
          </div>
          <ul className="space-y-3">
            <li className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Cozinheiro(a)
                </p>
                <p className="text-xs text-gray-500">
                  3 vagas • Publicada há 2 dias
                </p>
              </div>
              <Link
                to="/jobs"
                className="text-xs text-orange-600 hover:text-orange-800"
              >
                Ver detalhes
              </Link>
            </li>
            <li className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Auxiliar de Cozinha
                </p>
                <p className="text-xs text-gray-500">
                  2 vagas • Publicada há 3 dias
                </p>
              </div>
              <Link
                to="/jobs"
                className="text-xs text-orange-600 hover:text-orange-800"
              >
                Ver detalhes
              </Link>
            </li>
            <li className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-900">Atendente</p>
                <p className="text-xs text-gray-500">
                  5 vagas • Publicada há 5 dias
                </p>
              </div>
              <Link
                to="/jobs"
                className="text-xs text-orange-600 hover:text-orange-800"
              >
                Ver detalhes
              </Link>
            </li>
          </ul>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link
              to="/jobs"
              className="text-sm font-medium text-orange-600 hover:text-orange-800 flex items-center"
            >
              Gerenciar vagas
              <svg
                className="ml-1 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-5 w-5 text-orange-500 mr-2" />
            <h3 className="text-lg font-medium">Alertas de Performance</h3>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="flex-shrink-0">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-red-100">
                  <DollarSign className="h-5 w-5 text-red-600" />
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  CMV acima da média
                </p>
                <p className="text-xs text-gray-500">
                  Seu CMV está em 32.4%, enquanto a média do mercado é 30.1%
                </p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0">
                <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-green-100">
                  <BarChart4 className="h-5 w-5 text-green-600" />
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Ticket médio acima da média
                </p>
                <p className="text-xs text-gray-500">
                  Seu ticket médio está{" "}
                  {ticketPerformance.percentage.toFixed(1)}%{" "}
                  {ticketPerformance.type === "positive" ? "acima" : "abaixo"}{" "}
                  da média do mercado
                </p>
              </div>
            </li>
          </ul>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link
              to="/benchmarking"
              className="text-sm font-medium text-orange-600 hover:text-orange-800 flex items-center"
            >
              Ver análise completa
              <svg
                className="ml-1 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
