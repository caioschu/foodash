import React, { useState, useMemo } from "react";
import {
  Gauge,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Info,
} from "lucide-react";
import { useRestaurant } from "../contexts/RestaurantContext";
import { useSales } from "../contexts/SalesContext";

// Define benchmark metric type
type BenchmarkMetric = {
  id: string;
  name: string;
  yourValue: number;
  marketAvg: number;
  unit: string;
  isPercentage?: boolean;
  category: string;
  description: string;
  higherIsBetter: boolean;
};

export const BenchmarkingModule: React.FC = () => {
  // Get real data from contexts
  const { profile } = useRestaurant();
  const { salesEntries, paymentEntries } = useSales();

  // Filter state
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Calculate real metrics from sales data
  const realMetrics = useMemo(() => {
    // Calculate total revenue
    const totalRevenue = salesEntries.reduce(
      (sum, entry) => sum + entry.revenue,
      0
    );

    // Calculate total orders
    const totalOrders = salesEntries.reduce(
      (sum, entry) => sum + entry.orders,
      0
    );

    // Calculate average ticket
    const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Assume CMV is 30% of revenue (this would come from FinancialModule in a real app)
    const cmv = totalRevenue * 0.3;
    const cmvPercentage = totalRevenue > 0 ? (cmv / totalRevenue) * 100 : 0;

    // Assume labor cost is 18% of revenue
    const laborCost = totalRevenue * 0.18;
    const laborCostPercentage =
      totalRevenue > 0 ? (laborCost / totalRevenue) * 100 : 0;

    // Assume profit margin is revenue minus expenses (simplified)
    const expenses = cmv + laborCost + totalRevenue * 0.4; // Other expenses
    const profit = totalRevenue - expenses;
    const profitMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

    return {
      avgTicket,
      profitMargin,
      cmvPercentage,
      laborCostPercentage,
    };
  }, [salesEntries]);

  // Mock benchmarking data with real values where available
  const [metrics] = useState<BenchmarkMetric[]>([
    {
      id: "avg-ticket",
      name: "Ticket Médio",
      yourValue: 65.32, // Will be updated with real data
      marketAvg: 58.9,
      unit: "R$",
      category: "sales",
      description: "Valor médio gasto por cliente em cada pedido.",
      higherIsBetter: true,
    },
    {
      id: "profit-margin",
      name: "Margem de Lucro",
      yourValue: 12.3, // Will be updated with real data
      marketAvg: 15.2,
      unit: "%",
      isPercentage: true,
      category: "financial",
      description: "Percentual de lucro em relação à receita total.",
      higherIsBetter: true,
    },
    {
      id: "cmv",
      name: "CMV",
      yourValue: 32.4, // Will be updated with real data
      marketAvg: 30.1,
      unit: "%",
      isPercentage: true,
      category: "financial",
      description: "Custo da Mercadoria Vendida em relação à receita total.",
      higherIsBetter: false,
    },
    {
      id: "labor-cost",
      name: "Custo com Mão de Obra",
      yourValue: 18.0, // Will be updated with real data
      marketAvg: 22.5,
      unit: "%",
      isPercentage: true,
      category: "financial",
      description: "Total de gastos com pessoal em relação à receita.",
      higherIsBetter: false,
    },
    {
      id: "delivery-time",
      name: "Tempo de Entrega",
      yourValue: 45,
      marketAvg: 38,
      unit: "min",
      category: "operations",
      description: "Tempo médio de entrega dos pedidos.",
      higherIsBetter: false,
    },
    {
      id: "rating",
      name: "Avaliação Média",
      yourValue: 4.7,
      marketAvg: 4.3,
      unit: "estrelas",
      category: "customer",
      description: "Nota média recebida dos clientes.",
      higherIsBetter: true,
    },
    {
      id: "repeat-customers",
      name: "Clientes Recorrentes",
      yourValue: 35.2,
      marketAvg: 28.5,
      unit: "%",
      isPercentage: true,
      category: "customer",
      description: "Percentual de clientes que voltam a comprar.",
      higherIsBetter: true,
    },
    {
      id: "energy-cost",
      name: "Custo de Energia",
      yourValue: 2.1,
      marketAvg: 1.8,
      unit: "%",
      isPercentage: true,
      category: "financial",
      description: "Gastos com energia em relação à receita.",
      higherIsBetter: false,
    },
    {
      id: "cancellation-rate",
      name: "Taxa de Cancelamento",
      yourValue: 1.2,
      marketAvg: 2.5,
      unit: "%",
      isPercentage: true,
      category: "operations",
      description: "Percentual de pedidos cancelados.",
      higherIsBetter: false,
    },
  ]);

  // Update metrics with real data
  const updatedMetrics = useMemo(() => {
    return metrics.map((metric) => {
      if (metric.id === "avg-ticket") {
        return { ...metric, yourValue: realMetrics.avgTicket };
      }
      if (metric.id === "profit-margin") {
        return { ...metric, yourValue: realMetrics.profitMargin };
      }
      if (metric.id === "cmv") {
        return { ...metric, yourValue: realMetrics.cmvPercentage };
      }
      if (metric.id === "labor-cost") {
        return { ...metric, yourValue: realMetrics.laborCostPercentage };
      }
      return metric;
    });
  }, [metrics, realMetrics]);

  // Helper function to calculate performance
  const calculatePerformance = (metric: BenchmarkMetric) => {
    const diff = metric.yourValue - metric.marketAvg;
    const percentageDiff = (diff / metric.marketAvg) * 100;

    return {
      diff,
      percentageDiff,
      positive: metric.higherIsBetter ? diff > 0 : diff < 0,
    };
  };

  // Filter metrics based on selected category
  const filteredMetrics =
    selectedFilter === "all"
      ? updatedMetrics
      : updatedMetrics.filter((metric) => metric.category === selectedFilter);

  // Count alerts (metrics significantly worse than market)
  const alerts = updatedMetrics.filter((metric) => {
    const { diff, percentageDiff, positive } = calculatePerformance(metric);
    return !positive && Math.abs(percentageDiff) > 10;
  });

  // Count positive metrics (significantly better than market)
  const positiveMetrics = updatedMetrics.filter((metric) => {
    const { diff, percentageDiff, positive } = calculatePerformance(metric);
    return positive && Math.abs(percentageDiff) > 5;
  });

  return (
    <div className="animate-fadeIn">
      <h1 className="page-title">
        Benchmarking - {profile?.restaurantName || "Seu Restaurante"}
      </h1>
      <p className="text-sm text-gray-600 mb-6">
        {profile?.cuisineType || "Restaurante"} • Comparando com restaurantes
        similares na sua região
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <Gauge className="h-10 w-10 text-orange-500 mr-4" />
            <div>
              <p className="text-sm font-medium text-gray-500">
                Métricas Monitoradas
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <ArrowUpRight className="h-10 w-10 text-green-500 mr-4" />
            <div>
              <p className="text-sm font-medium text-gray-500">
                Acima da Média
              </p>
              <p className="text-2xl font-bold text-green-600">
                {positiveMetrics.length} métricas
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <ArrowDownRight className="h-10 w-10 text-red-500 mr-4" />
            <div>
              <p className="text-sm font-medium text-gray-500">Alertas</p>
              <p className="text-2xl font-bold text-red-600">
                {alerts.length} métricas
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center mb-6">
          <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
          <h2 className="text-xl font-medium text-gray-900">
            Comparativo com o Mercado
          </h2>
        </div>

        <div className="flex mb-6 overflow-x-auto py-2">
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium mr-2 ${
              selectedFilter === "all"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => setSelectedFilter("all")}
          >
            Todos
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium mr-2 ${
              selectedFilter === "financial"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => setSelectedFilter("financial")}
          >
            Financeiro
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium mr-2 ${
              selectedFilter === "sales"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => setSelectedFilter("sales")}
          >
            Vendas
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium mr-2 ${
              selectedFilter === "operations"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => setSelectedFilter("operations")}
          >
            Operações
          </button>
          <button
            className={`px-4 py-2 rounded-full text-sm font-medium mr-2 ${
              selectedFilter === "customer"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
            onClick={() => setSelectedFilter("customer")}
          >
            Clientes
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMetrics.map((metric) => {
            const { diff, percentageDiff, positive } =
              calculatePerformance(metric);

            return (
              <div
                key={metric.id}
                className={`border rounded-lg p-4 ${
                  positive
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      {metric.name}
                    </h3>
                    <div className="ml-2 text-gray-400 cursor-pointer group relative">
                      <Info className="h-4 w-4" />
                      <div className="absolute left-0 bottom-full mb-2 w-64 bg-white shadow-lg rounded-md p-3 hidden group-hover:block z-10">
                        <p className="text-sm text-gray-700">
                          {metric.description}
                        </p>
                      </div>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      positive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {positive ? "+" : ""}
                    {percentageDiff.toFixed(1)}%
                  </span>
                </div>

                <div className="flex justify-between items-end mb-2">
                  <div>
                    <p className="text-sm text-gray-500">Seu restaurante</p>
                    <p className="text-xl font-bold text-gray-900">
                      {metric.yourValue.toLocaleString("pt-BR", {
                        minimumFractionDigits: metric.isPercentage ? 1 : 0,
                        maximumFractionDigits: 2,
                      })}{" "}
                      {metric.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Média do mercado</p>
                    <p className="text-md text-gray-700">
                      {metric.marketAvg.toLocaleString("pt-BR", {
                        minimumFractionDigits: metric.isPercentage ? 1 : 0,
                        maximumFractionDigits: 2,
                      })}{" "}
                      {metric.unit}
                    </p>
                  </div>
                </div>

                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                    <div
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                        positive ? "bg-green-500" : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(
                            0,
                            (metric.yourValue / (metric.marketAvg * 1.5)) * 100
                          )
                        )}%`,
                      }}
                    ></div>
                    <div
                      className="shadow-none flex flex-col text-center whitespace-nowrap justify-center h-full w-0.5 bg-gray-500"
                      style={{
                        position: "absolute",
                        left: `${
                          (metric.marketAvg / (metric.marketAvg * 1.5)) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <p className="text-sm mt-2 text-gray-600">
                  {positive
                    ? `Você está ${Math.abs(diff).toFixed(1)}${
                        metric.unit
                      } acima da média.`
                    : `Você está ${Math.abs(diff).toFixed(1)}${
                        metric.unit
                      } abaixo da média.`}
                </p>
              </div>
            );
          })}
        </div>

        {filteredMetrics.length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-500">
              Nenhum resultado encontrado para o filtro selecionado.
            </p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center mb-6">
          <Info className="h-5 w-5 text-blue-500 mr-2" />
          <h2 className="text-xl font-medium text-gray-900">
            Sobre o Benchmarking
          </h2>
        </div>

        <div className="text-gray-700 space-y-4">
          <p>
            Os dados de benchmarking são coletados de forma anônima de todos os
            restaurantes que utilizam a plataforma FooDash, permitindo
            comparações relevantes e precisas com negócios semelhantes ao seu.
          </p>

          <p>As médias do mercado são calculadas considerando:</p>

          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>
              Restaurantes do mesmo tipo de cozinha (
              {profile?.cuisineType || "sua categoria"})
            </li>
            <li>Localização na mesma cidade ou região</li>
            <li>Tamanho e faturamento similares</li>
          </ul>

          <p>
            Utilize estas informações para identificar oportunidades de melhoria
            e áreas onde seu restaurante já se destaca positivamente em relação
            ao mercado.
          </p>

          <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mt-4">
            <p className="text-blue-800 text-sm">
              <strong>Dica:</strong> Acompanhe regularmente suas métricas e
              estabeleça metas para melhorar os indicadores abaixo da média do
              mercado. Pequenas mudanças podem trazer grandes resultados ao
              longo do tempo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
