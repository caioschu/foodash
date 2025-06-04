import React, { useState, useContext } from "react";
import { SalesContext } from "../contexts/SalesContext";
import { RestaurantContext } from "../contexts/RestaurantContext";
import { PlusCircle, FileDown, Filter } from "lucide-react";
import { Link } from "react-router-dom";

// Componente SalesModule
export const SalesModule = () => {
  const { profile } = useContext(RestaurantContext);
  const { salesEntries, paymentEntries } = useContext(SalesContext);

  // Estados para filtros
  const [period, setPeriod] = useState("all");
  const [channel, setChannel] = useState("all");
  const [paymentType, setPaymentType] = useState("all");

  // Get enabled sales channels from profile
  const salesChannels = profile?.salesChannels
    ? profile.salesChannels
        .filter((channel) => channel.enabled)
        .map((channel) => channel.name)
    : [];

  // Get payment methods from profile
  const paymentMethods = profile?.paymentMethods
    ? profile.paymentMethods
        .filter((method) => method.enabled)
        .map((method) => method.name)
    : [];

  // Calcular totais
  const totalRevenue = salesEntries.reduce(
    (sum, entry) => sum + (entry.totalAmount || 0),
    0
  );
  const totalOrders = salesEntries.length;
  const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Group sales by channel
  const salesByChannel = salesEntries.reduce((acc, entry) => {
    const channelName = entry.channel || "Não informado";
    if (!acc[channelName]) {
      acc[channelName] = { revenue: 0, orders: 0 };
    }
    acc[channelName].revenue += entry.totalAmount || 0;
    acc[channelName].orders += 1;
    return acc;
  }, {} as { [key: string]: { revenue: number; orders: number } });

  // Group payments by type
  const paymentsByType = paymentEntries.reduce((acc, entry) => {
    const typeName = entry.payment_type || "Não informado";
    if (!acc[typeName]) {
      acc[typeName] = 0;
    }
    acc[typeName] += entry.amount;
    return acc;
  }, {} as { [key: string]: number });

  // Formatar valores monetários
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    })
      .format(value)
      .replace("R$", "R$ ");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-600">Vendas</h1>
        <div className="flex space-x-3">
          <Link
            to="/sales/register"
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center transition-colors"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            Registrar Vendas
          </Link>
          <button className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md flex items-center transition-colors">
            <FileDown className="h-5 w-5 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-gray-500 text-sm mb-1">Faturamento Total</div>
          <div className="text-3xl font-bold">
            {formatCurrency(totalRevenue)}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-gray-500 text-sm mb-1">Total de Pedidos</div>
          <div className="text-3xl font-bold">{totalOrders}</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-gray-500 text-sm mb-1">Ticket Médio</div>
          <div className="text-3xl font-bold">{formatCurrency(avgTicket)}</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 mr-2 text-gray-500" />
          <h2 className="text-lg font-medium">Filtros</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Período</label>
            <select
              className="w-full border border-gray-300 rounded-md p-2"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="all">Todos os meses</option>
              <option value="current_month">Mês atual</option>
              <option value="last_month">Mês anterior</option>
              <option value="last_3_months">Últimos 3 meses</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">
              Canal de Venda
            </label>
            <select
              className="w-full border border-gray-300 rounded-md p-2"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
            >
              <option value="all">Todos os canais</option>
              {salesChannels.map((channel) => (
                <option key={channel} value={channel}>
                  {channel}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-1">
              Forma de Pagamento
            </label>
            <select
              className="w-full border border-gray-300 rounded-md p-2"
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
            >
              <option value="all">Todas as formas</option>
              {paymentMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Vendas por Canal */}
      <div className="bg-white rounded-lg shadow-sm mb-8">
        <h2 className="text-lg font-medium p-6 pb-4">Vendas por Canal</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 text-sm border-b">
                <th className="px-6 py-3 uppercase">Canal</th>
                <th className="px-6 py-3 uppercase">Faturamento</th>
                <th className="px-6 py-3 uppercase">Pedidos</th>
                <th className="px-6 py-3 uppercase">Ticket Médio</th>
              </tr>
            </thead>
            <tbody>
              {salesChannels.length > 0 ? (
                salesChannels.map((channelName) => {
                  const data = salesByChannel[channelName] || {
                    revenue: 0,
                    orders: 0,
                  };
                  const channelTicket =
                    data.orders > 0 ? data.revenue / data.orders : 0;

                  return (
                    <tr key={channelName} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{channelName}</td>
                      <td className="px-6 py-4">
                        {formatCurrency(data.revenue)}
                      </td>
                      <td className="px-6 py-4">{data.orders}</td>
                      <td className="px-6 py-4">
                        {formatCurrency(channelTicket)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Nenhum canal de venda configurado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagamentos por Tipo */}
      <div className="bg-white rounded-lg shadow-sm">
        <h2 className="text-lg font-medium p-6 pb-4">Pagamentos por Tipo</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-500 text-sm border-b">
                <th className="px-6 py-3 uppercase">Forma de Pagamento</th>
                <th className="px-6 py-3 uppercase">Valor Total</th>
              </tr>
            </thead>
            <tbody>
              {paymentMethods.length > 0 ? (
                paymentMethods.map((methodName) => (
                  <tr key={methodName} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{methodName}</td>
                    <td className="px-6 py-4">
                      {formatCurrency(paymentsByType[methodName] || 0)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={2}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Nenhuma forma de pagamento configurada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Exportação nomeada e padrão para compatibilidade
export default SalesModule;
