import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SalesContext } from "../contexts/SalesContext";
import { RestaurantContext } from "../contexts/RestaurantContext";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  ShoppingBag,
  CreditCard,
  Check,
  AlertCircle,
} from "lucide-react";

export const SalesRegister = () => {
  const navigate = useNavigate();
  const { profile } = useContext(RestaurantContext);
  const { salesChannels, paymentMethods, addSalesEntry, loading, error } =
    useContext(SalesContext);

  // Estados para o formulário
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [channel, setChannel] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [orders, setOrders] = useState("1");
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Efeito para selecionar o primeiro canal e método de pagamento por padrão
  useEffect(() => {
    if (salesChannels.length > 0 && !channel) {
      setChannel(salesChannels[0].id);
    }

    if (paymentMethods.length > 0 && !paymentMethod) {
      setPaymentMethod(paymentMethods[0].id);
    }
  }, [salesChannels, paymentMethods, channel, paymentMethod]);

  // Função para validar o formulário
  const validateForm = () => {
    if (!date) {
      setFormError("Por favor, selecione uma data");
      return false;
    }

    if (!channel) {
      setFormError("Por favor, selecione um canal de vendas");
      return false;
    }

    if (!paymentMethod) {
      setFormError("Por favor, selecione uma forma de pagamento");
      return false;
    }

    const amount = parseFloat(totalAmount);
    if (isNaN(amount) || amount <= 0) {
      setFormError("Por favor, informe um valor válido");
      return false;
    }

    const orderCount = parseInt(orders);
    if (isNaN(orderCount) || orderCount <= 0) {
      setFormError("Por favor, informe um número válido de pedidos");
      return false;
    }

    setFormError(null);
    return true;
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const selectedChannel = salesChannels.find((c) => c.id === channel);
      const selectedPaymentMethod = paymentMethods.find(
        (p) => p.id === paymentMethod
      );

      const entry = {
        date,
        channel: selectedChannel?.name || "",
        salesChannelRaw: selectedChannel?.name || "",
        paymentMethodRaw: selectedPaymentMethod?.name || "",
        revenue: parseFloat(totalAmount),
        orders: parseInt(orders),
        totalAmount: parseFloat(totalAmount),
        itemsAmount: parseFloat(totalAmount), // Simplificação, poderia ser detalhado
        deliveryFee: 0, // Simplificação, poderia ser um campo adicional
        discount: 0, // Simplificação, poderia ser um campo adicional
        isCancelled: false,
      };

      await addSalesEntry(entry);

      // Mostrar mensagem de sucesso
      setSuccess(true);

      // Limpar formulário
      setTotalAmount("");
      setOrders("1");

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate("/sales");
      }, 2000);
    } catch (err) {
      console.error("Error registering sale:", err);
      setFormError("Erro ao registrar venda. Por favor, tente novamente.");
    }
  };

  // Formatar valor monetário para exibição
  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    const floatValue = parseInt(numericValue) / 100;
    return floatValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Lidar com mudança no valor monetário
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setTotalAmount(value ? (parseInt(value) / 100).toString() : "");
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/sales")}
          className="mr-3 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-3xl font-bold text-blue-600">Registrar Venda</h1>
      </div>

      {/* Mensagem de sucesso */}
      {success && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <div className="flex">
            <Check className="h-5 w-5 text-green-500 mr-2" />
            <p className="font-medium text-green-800">
              Venda registrada com sucesso! Redirecionando...
            </p>
          </div>
        </div>
      )}

      {/* Mensagem de erro */}
      {(formError || error) && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="font-medium text-red-800">{formError || error}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          {/* Data */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pl-10 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Canal de Vendas */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Canal de Vendas
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ShoppingBag className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="pl-10 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione um canal</option>
                {salesChannels.map((channel) => (
                  <option key={channel.id} value={channel.id}>
                    {channel.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Forma de Pagamento */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Forma de Pagamento
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <CreditCard className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="pl-10 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Selecione uma forma de pagamento</option>
                {paymentMethods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Valor Total */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor Total
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={totalAmount ? formatCurrency(totalAmount) : ""}
                onChange={handleAmountChange}
                placeholder="R$ 0,00"
                className="pl-10 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Número de Pedidos */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de Pedidos
            </label>
            <input
              type="number"
              value={orders}
              onChange={(e) => setOrders(e.target.value)}
              min="1"
              className="block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Botão de Envio */}
          <button
            type="submit"
            disabled={loading || success}
            className={`w-full py-2 px-4 rounded-md flex items-center justify-center ${
              loading || success
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600 text-white"
            } transition-colors`}
          >
            {loading
              ? "Registrando..."
              : success
              ? "Registrado!"
              : "Registrar Venda"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SalesRegister;
