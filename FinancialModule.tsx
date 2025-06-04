import React, { useState, useMemo } from "react";
import {
  FileDown,
  ChevronDown,
  ChevronUp,
  DollarSign,
  TrendingUp,
  BarChart2,
} from "lucide-react";
import { useSales } from "../contexts/SalesContext";
import { useRestaurant } from "../contexts/RestaurantContext";

// Define DRE category types
type Category = {
  id: string;
  name: string;
  amount: number;
  expanded?: boolean;
  items: {
    id: string;
    name: string;
    amount: number;
  }[];
};

export const FinancialModule: React.FC = () => {
  // Get real data from contexts
  const { salesEntries, paymentEntries } = useSales();
  const { profile } = useRestaurant();

  // Mock date selection
  const [currentMonth] = useState("Junho 2025");

  // Calculate real revenue from sales entries
  const totalRevenue = useMemo(() => {
    return salesEntries.reduce((sum, entry) => sum + entry.revenue, 0);
  }, [salesEntries]);

  // Group sales by channel for revenue items
  const salesByChannel = useMemo(() => {
    return salesEntries.reduce((acc, entry) => {
      if (!acc[entry.channel]) {
        acc[entry.channel] = { revenue: 0, orders: 0 };
      }
      acc[entry.channel].revenue += entry.revenue;
      acc[entry.channel].orders += entry.orders;
      return acc;
    }, {} as { [key: string]: { revenue: number; orders: number } });
  }, [salesEntries]);

  // DRE data with real revenue
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "revenue",
      name: "Receitas",
      amount: 0, // Will be updated with real data
      expanded: true,
      items: [], // Will be populated with real data
    },
    {
      id: "taxes",
      name: "Impostos sobre vendas",
      amount: 0, // Will be calculated based on real revenue
      expanded: true,
      items: [{ id: "taxes-simples", name: "Simples Nacional", amount: 0 }],
    },
    {
      id: "cogs",
      name: "CMV (Custo da Mercadoria Vendida)",
      amount: 0, // Will be calculated based on real revenue
      expanded: true,
      items: [
        { id: "cogs-raw", name: "Matéria-prima", amount: 0 },
        { id: "cogs-packaging", name: "Embalagens", amount: 0 },
        { id: "cogs-products", name: "Produtos prontos", amount: 0 },
      ],
    },
    {
      id: "sales-expenses",
      name: "Despesas com vendas",
      amount: 0, // Will be calculated based on real revenue
      expanded: true,
      items: [
        { id: "sales-card-fees", name: "Taxas de cartão", amount: 0 },
        { id: "sales-channel-fees", name: "Taxas dos canais", amount: 0 },
      ],
    },
    {
      id: "delivery",
      name: "Entregas",
      amount: 0, // Will be calculated based on real revenue
      expanded: true,
      items: [{ id: "delivery-courier", name: "Motoboy", amount: 0 }],
    },
    {
      id: "labor",
      name: "CMO (Custo com Mão de Obra)",
      amount: 8256.69,
      expanded: true,
      items: [
        { id: "labor-salaries", name: "Salários", amount: 6500.0 },
        {
          id: "labor-benefits",
          name: "VT, férias, 13º, INSS, FGTS",
          amount: 1756.69,
        },
      ],
    },
    {
      id: "fixed-costs",
      name: "Custos fixos",
      amount: 5850.0,
      expanded: true,
      items: [
        { id: "fixed-rent", name: "Aluguel", amount: 3500.0 },
        { id: "fixed-water", name: "Água", amount: 350.0 },
        { id: "fixed-energy", name: "Energia", amount: 950.0 },
        { id: "fixed-phone", name: "Telefone", amount: 150.0 },
        { id: "fixed-accounting", name: "Contador", amount: 500.0 },
        { id: "fixed-systems", name: "Sistemas", amount: 400.0 },
      ],
    },
    {
      id: "marketing",
      name: "Marketing",
      amount: 1250.0,
      expanded: true,
      items: [
        { id: "marketing-ads", name: "Anúncios online", amount: 750.0 },
        { id: "marketing-other", name: "Outros", amount: 500.0 },
      ],
    },
  ]);

  // Update categories with real data
  React.useEffect(() => {
    if (totalRevenue > 0) {
      setCategories((prevCategories) => {
        const updatedCategories = [...prevCategories];

        // Update revenue category with real data
        const revenueCategory = updatedCategories.find(
          (c) => c.id === "revenue"
        );
        if (revenueCategory) {
          // Create revenue items from sales by channel
          const revenueItems = Object.entries(salesByChannel).map(
            ([channel, data]) => ({
              id: `revenue-${channel.toLowerCase().replace(/\s+/g, "-")}`,
              name: channel,
              amount: data.revenue,
            })
          );

          revenueCategory.items = revenueItems;
          revenueCategory.amount = totalRevenue;
        }

        // Update taxes based on revenue (12% of revenue)
        const taxesCategory = updatedCategories.find((c) => c.id === "taxes");
        if (taxesCategory) {
          const taxAmount = totalRevenue * 0.12;
          taxesCategory.amount = taxAmount;
          taxesCategory.items[0].amount = taxAmount;
        }

        // Update CMV based on revenue (30% of revenue)
        const cogsCategory = updatedCategories.find((c) => c.id === "cogs");
        if (cogsCategory) {
          const cogsAmount = totalRevenue * 0.3;
          cogsCategory.amount = cogsAmount;

          // Distribute among items
          cogsCategory.items[0].amount = cogsAmount * 0.75; // Matéria-prima (75% of CMV)
          cogsCategory.items[1].amount = cogsAmount * 0.15; // Embalagens (15% of CMV)
          cogsCategory.items[2].amount = cogsAmount * 0.1; // Produtos prontos (10% of CMV)
        }

        // Update sales expenses based on revenue (12% of revenue)
        const salesExpensesCategory = updatedCategories.find(
          (c) => c.id === "sales-expenses"
        );
        if (salesExpensesCategory) {
          const salesExpensesAmount = totalRevenue * 0.12;
          salesExpensesCategory.amount = salesExpensesAmount;

          // Distribute among items
          salesExpensesCategory.items[0].amount = salesExpensesAmount * 0.25; // Taxas de cartão (25% of sales expenses)
          salesExpensesCategory.items[1].amount = salesExpensesAmount * 0.75; // Taxas dos canais (75% of sales expenses)
        }

        // Update delivery based on revenue (6% of revenue)
        const deliveryCategory = updatedCategories.find(
          (c) => c.id === "delivery"
        );
        if (deliveryCategory) {
          const deliveryAmount = totalRevenue * 0.06;
          deliveryCategory.amount = deliveryAmount;
          deliveryCategory.items[0].amount = deliveryAmount;
        }

        return updatedCategories;
      });
    }
  }, [totalRevenue, salesByChannel]);

  // Calculate totals
  const totalExpenses = categories
    .filter((c) => c.id !== "revenue")
    .reduce((acc, category) => acc + category.amount, 0);

  const operatingProfit = totalRevenue - totalExpenses;
  const profitMargin =
    totalRevenue > 0 ? (operatingProfit / totalRevenue) * 100 : 0;

  // Calculate additional financial metrics
  const cmvAmount = categories.find((c) => c.id === "cogs")?.amount || 0;
  const cmvPercentage = totalRevenue > 0 ? (cmvAmount / totalRevenue) * 100 : 0;

  const laborAmount = categories.find((c) => c.id === "labor")?.amount || 0;
  const laborPercentage =
    totalRevenue > 0 ? (laborAmount / totalRevenue) * 100 : 0;

  const fixedCostsAmount =
    categories.find((c) => c.id === "fixed-costs")?.amount || 0;
  const fixedCostsPercentage =
    totalRevenue > 0 ? (fixedCostsAmount / totalRevenue) * 100 : 0;

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setCategories(
      categories.map((category) =>
        category.id === categoryId
          ? { ...category, expanded: !category.expanded }
          : category
      )
    );
  };

  // Format currency with 2 decimal places
  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Format percentage with 1 decimal place
  const formatPercentage = (value: number) => {
    return value.toLocaleString("pt-BR", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <h1 className="page-title">Financeiro (DRE)</h1>
        <div className="flex space-x-2">
          <div className="relative inline-block w-48">
            <select
              className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              value={currentMonth}
              onChange={() => {}}
            >
              <option>Junho 2025</option>
              <option>Maio 2025</option>
              <option>Abril 2025</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          <button className="btn btn-secondary flex items-center">
            <FileDown className="h-4 w-4 mr-2" />
            Exportar DRE
          </button>
        </div>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-2">
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Receita Total
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                R$ {formatCurrency(totalRevenue)}
              </p>
              <p className="text-sm text-gray-500 mt-1">100%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Lucro Operacional
              </h3>
              <p
                className={`text-2xl font-bold ${
                  operatingProfit >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                R$ {formatCurrency(operatingProfit)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {formatPercentage(profitMargin)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center mb-2">
            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
              <BarChart2 className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">CMV</h3>
              <p className="text-2xl font-bold text-gray-900">
                R$ {formatCurrency(cmvAmount)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {formatPercentage(cmvPercentage)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">
            Custo de Mão de Obra
          </h3>
          <p className="text-xl font-bold text-gray-900">
            R$ {formatCurrency(laborAmount)}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {formatPercentage(laborPercentage)}% da receita
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">
            Custos Fixos
          </h3>
          <p className="text-xl font-bold text-gray-900">
            R$ {formatCurrency(fixedCostsAmount)}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {formatPercentage(fixedCostsPercentage)}% da receita
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">
            Ponto de Equilíbrio
          </h3>
          <p className="text-xl font-bold text-gray-900">
            R${" "}
            {formatCurrency(fixedCostsAmount / (1 - cmvAmount / totalRevenue))}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Receita mínima para cobrir custos
          </p>
        </div>
      </div>

      <div className="card mb-8">
        <h2 className="text-xl font-medium text-gray-900 mb-4">
          Demonstrativo de Resultado (DRE)
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/2"
                >
                  Categoria / Item
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Valor (R$)
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  % da Receita
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Categories and items */}
              {categories.map((category) => (
                <React.Fragment key={category.id}>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="flex items-center font-medium text-gray-900"
                      >
                        {category.expanded ? (
                          <ChevronDown className="h-4 w-4 mr-1" />
                        ) : (
                          <ChevronUp className="h-4 w-4 mr-1" />
                        )}
                        {category.name}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {category.id === "revenue" ? (
                        <span className="text-green-600">
                          R$ {formatCurrency(category.amount)}
                        </span>
                      ) : (
                        <span className="text-red-600">
                          -R$ {formatCurrency(category.amount)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                      {totalRevenue > 0
                        ? formatPercentage(
                            (category.amount / totalRevenue) * 100
                          )
                        : "0,0"}
                      %
                    </td>
                  </tr>

                  {/* Category items */}
                  {category.expanded &&
                    category.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap pl-10 text-sm text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                          {category.id === "revenue" ? (
                            <span>R$ {formatCurrency(item.amount)}</span>
                          ) : (
                            <span>-R$ {formatCurrency(item.amount)}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500">
                          {totalRevenue > 0
                            ? formatPercentage(
                                (item.amount / totalRevenue) * 100
                              )
                            : "0,0"}
                          %
                        </td>
                      </tr>
                    ))}
                </React.Fragment>
              ))}

              {/* Total row */}
              <tr className="bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                  Lucro Operacional
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-bold">
                  <span
                    className={
                      operatingProfit >= 0 ? "text-green-600" : "text-red-600"
                    }
                  >
                    R$ {formatCurrency(operatingProfit)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-gray-900">
                  {formatPercentage(profitMargin)}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg mb-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              A DRE é um relatório somente para visualização. Os valores são
              calculados automaticamente com base nos lançamentos de vendas e
              configurações do sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
