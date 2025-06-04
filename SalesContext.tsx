import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useAuth } from "./AuthContext";
import { useRestaurant } from "./RestaurantContext";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export type SalesChannel = {
  id: string;
  name: string;
  restaurantId: string;
};

export type PaymentMethod = {
  id: string;
  name: string;
  restaurantId: string;
};

export type SalesEntry = {
  id: string;
  date: string;
  channel: string;
  revenue: number;
  orders: number;
  externalId?: string; // Adicionado para o ID do Saipos
  salesChannelRaw?: string; // Nome bruto do canal de vendas
  paymentMethodRaw?: string; // Nome bruto do método de pagamento
  totalAmount: number;
  itemsAmount: number;
  deliveryFee: number;
  discount: number;
  isCancelled: boolean;
};

export type PaymentEntry = {
  id: string;
  date: string;
  payment_type: string;
  amount: number;
  externalId?: string; // Adicionado para o ID do Saipos, caso necessário para pagamentos
  salesEntryId?: string; // Referência à venda relacionada
};

// Estrutura esperada dos dados do JSON do Saipos
export type SaiposSale = {
  externalId: string;
  date: string; // Formato YYYY-MM-DDTHH:MM:SS
  totalAmount: number;
  itemsAmount: number;
  deliveryFee: number;
  discount: number;
  paymentMethodRaw: string;
  salesChannelRaw: string;
  isCancelled: boolean;
};

type SalesContextType = {
  salesEntries: SalesEntry[];
  sales: SalesEntry[]; // Alias para compatibilidade
  paymentEntries: PaymentEntry[];
  salesChannels: SalesChannel[];
  paymentMethods: PaymentMethod[];
  addSalesEntry: (entry: Omit<SalesEntry, "id">) => Promise<SalesEntry | null>;
  addMultipleSales: (entries: Omit<SalesEntry, "id">[]) => Promise<void>; // Novo método para adicionar múltiplas vendas
  addPaymentEntry: (entry: Omit<PaymentEntry, "id">) => Promise<void>;
  updateSalesEntry: (id: string, entry: Partial<SalesEntry>) => Promise<void>;
  updatePaymentEntry: (
    id: string,
    entry: Partial<PaymentEntry>
  ) => Promise<void>;
  deleteSalesEntry: (id: string) => Promise<void>;
  deletePaymentEntry: (id: string) => Promise<void>;
  getSalesByExternalId: (externalId: string) => SalesEntry | undefined;
  getOrCreateSalesChannel: (name: string) => Promise<SalesChannel>;
  getOrCreatePaymentMethod: (name: string) => Promise<PaymentMethod>;
  processNextBatch: (
    entries: Omit<SalesEntry, "id">[],
    batchSize: number,
    startIndex: number
  ) => Promise<number>; // Novo método para processamento em lote
  loading: boolean;
  error: string | null;
  totalRevenue: number; // Novo campo para total de receita
  totalOrders: number; // Novo campo para total de pedidos
  averageTicket: number; // Novo campo para ticket médio
  refreshSalesData: () => Promise<void>; // Novo método para atualizar dados
  clearAllSales: () => Promise<void>; // Método para limpar todas as vendas
  lastUpdated: string | null; // Timestamp da última atualização real dos dados
};

// Exportação nomeada do contexto para compatibilidade com importações
export const SalesContext = createContext<SalesContextType | undefined>(
  undefined
);

export const useSales = () => {
  const context = useContext(SalesContext);
  if (context === undefined) {
    throw new Error("useSales must be used within a SalesProvider");
  }
  return context;
};

export const SalesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const { profile } = useRestaurant();
  const [salesEntries, setSalesEntries] = useState<SalesEntry[]>([]);
  const [paymentEntries, setPaymentEntries] = useState<PaymentEntry[]>([]);
  const [salesChannels, setSalesChannels] = useState<SalesChannel[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [totalOrders, setTotalOrders] = useState<number>(0);
  const [averageTicket, setAverageTicket] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Cache para canais de venda e métodos de pagamento para evitar chamadas repetidas à API
  const channelCache = new Map<string, SalesChannel>();
  const paymentMethodCache = new Map<string, PaymentMethod>();

  // Função para atualizar o timestamp de última atualização
  const updateLastUpdated = () => {
    setLastUpdated(new Date().toISOString());
    // Também salvar no localStorage para persistência entre sessões
    localStorage.setItem("salesLastUpdated", new Date().toISOString());
  };

  // Carregar o timestamp de última atualização do localStorage na inicialização
  useEffect(() => {
    const savedLastUpdated = localStorage.getItem("salesLastUpdated");
    if (savedLastUpdated) {
      setLastUpdated(savedLastUpdated);
    }
  }, []);

  useEffect(() => {
    if (user && profile?.id) {
      fetchSalesData();
      fetchSalesChannels();
      fetchPaymentMethods();
    }
  }, [user, profile]);

  // Efeito para calcular métricas quando as vendas mudam
  useEffect(() => {
    calculateMetrics();
  }, [salesEntries]);

  const calculateMetrics = () => {
    try {
      // Filtrar vendas canceladas
      const validSales = salesEntries.filter((sale) => !sale.isCancelled);

      // Calcular receita total
      const revenue = validSales.reduce(
        (sum, sale) => sum + (sale.totalAmount || 0),
        0
      );
      setTotalRevenue(revenue);

      // Calcular total de pedidos
      setTotalOrders(validSales.length);

      // Calcular ticket médio
      const avgTicket = validSales.length > 0 ? revenue / validSales.length : 0;
      setAverageTicket(avgTicket);
    } catch (err) {
      console.error("Error calculating metrics:", err);
    }
  };

  const refreshSalesData = async () => {
    await fetchSalesData();
    calculateMetrics();
    updateLastUpdated();
  };

  const fetchSalesData = async () => {
    if (!profile?.id) {
      setLoading(false);
      setError(null);
      setSalesEntries([]);
      setPaymentEntries([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data: salesData, error: salesError } = await supabase
        .from("sales_entries")
        .select("*")
        .eq("restaurant_id", profile.id)
        .order("date", { ascending: false });

      if (salesError) throw salesError;

      const { data: paymentData, error: paymentError } = await supabase
        .from("payment_entries")
        .select("*")
        .eq("restaurant_id", profile.id)
        .order("date", { ascending: false });

      if (paymentError) throw paymentError;

      setSalesEntries(salesData || []);
      setPaymentEntries(paymentData || []);

      // Calcular métricas após carregar dados
      if (salesData) {
        const validSales = salesData.filter((sale) => !sale.isCancelled);
        const revenue = validSales.reduce(
          (sum, sale) => sum + (sale.totalAmount || 0),
          0
        );
        setTotalRevenue(revenue);
        setTotalOrders(validSales.length);
        setAverageTicket(
          validSales.length > 0 ? revenue / validSales.length : 0
        );
      }

      // Atualizar timestamp de última atualização
      updateLastUpdated();
    } catch (err) {
      console.error("Error fetching sales data:", err);
      setError("Failed to load sales data");
      setSalesEntries([]);
      setPaymentEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSalesChannels = async () => {
    if (!profile?.id) return;

    try {
      const { data, error } = await supabase
        .from("sales_channels")
        .select("*")
        .eq("restaurant_id", profile.id);

      if (error) throw error;

      const channels = data || [];
      setSalesChannels(channels);

      // Atualizar cache de canais
      channels.forEach((channel) => {
        channelCache.set(channel.name.toLowerCase(), {
          id: channel.id,
          name: channel.name,
          restaurantId: channel.restaurant_id,
        });
      });
    } catch (err) {
      console.error("Error fetching sales channels:", err);
    }
  };

  const fetchPaymentMethods = async () => {
    if (!profile?.id) return;

    try {
      const { data, error } = await supabase
        .from("payment_methods")
        .select("*")
        .eq("restaurant_id", profile.id);

      if (error) throw error;

      const methods = data || [];
      setPaymentMethods(methods);

      // Atualizar cache de métodos de pagamento
      methods.forEach((method) => {
        paymentMethodCache.set(method.name.toLowerCase(), {
          id: method.id,
          name: method.name,
          restaurantId: method.restaurant_id,
        });
      });
    } catch (err) {
      console.error("Error fetching payment methods:", err);
    }
  };

  const getOrCreateSalesChannel = async (
    name: string
  ): Promise<SalesChannel> => {
    if (!profile?.id) {
      throw new Error("Restaurant profile not found");
    }

    if (!name) {
      throw new Error("Channel name is required");
    }

    const normalizedName = name.toLowerCase().trim();

    // Verificar no cache primeiro
    if (channelCache.has(normalizedName)) {
      return channelCache.get(normalizedName)!;
    }

    // Verificar se o canal já existe na lista em memória
    const existingChannel = salesChannels.find(
      (channel) => channel.name.toLowerCase() === normalizedName
    );

    if (existingChannel) {
      // Adicionar ao cache
      channelCache.set(normalizedName, {
        id: existingChannel.id,
        name: existingChannel.name,
        restaurantId: existingChannel.restaurant_id || profile.id,
      });
      return {
        id: existingChannel.id,
        name: existingChannel.name,
        restaurantId: existingChannel.restaurant_id || profile.id,
      };
    }

    // Criar novo canal
    try {
      const { data, error } = await supabase
        .from("sales_channels")
        .insert([{ name, restaurant_id: profile.id }])
        .select()
        .single();

      if (error) {
        // Verificar se o erro é de duplicação (pode ocorrer em inserções simultâneas)
        if (error.code === "23505") {
          // Código de erro de duplicação no PostgreSQL
          // Buscar o canal que foi inserido por outra operação
          const { data: existingData, error: fetchError } = await supabase
            .from("sales_channels")
            .select("*")
            .eq("name", name)
            .eq("restaurant_id", profile.id)
            .single();

          if (fetchError) throw fetchError;
          if (!existingData)
            throw new Error("Channel exists but could not be fetched");

          const channel = {
            id: existingData.id,
            name: existingData.name,
            restaurantId: existingData.restaurant_id,
          };

          // Atualizar cache e estado
          channelCache.set(normalizedName, channel);
          setSalesChannels((prev) => [...prev, existingData]);

          return channel;
        }
        throw error;
      }

      if (!data) throw new Error("No data returned from insert");

      const newChannel = {
        id: data.id,
        name: data.name,
        restaurantId: data.restaurant_id,
      };

      // Atualizar cache e estado
      channelCache.set(normalizedName, newChannel);
      setSalesChannels((prev) => [...prev, data]);

      return newChannel;
    } catch (err) {
      console.error("Error creating sales channel:", err);
      throw new Error(
        `Failed to create sales channel: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  const getOrCreatePaymentMethod = async (
    name: string
  ): Promise<PaymentMethod> => {
    if (!profile?.id) {
      throw new Error("Restaurant profile not found");
    }

    if (!name) {
      throw new Error("Payment method name is required");
    }

    const normalizedName = name.toLowerCase().trim();

    // Verificar no cache primeiro
    if (paymentMethodCache.has(normalizedName)) {
      return paymentMethodCache.get(normalizedName)!;
    }

    // Verificar se o método já existe na lista em memória
    const existingMethod = paymentMethods.find(
      (method) => method.name.toLowerCase() === normalizedName
    );

    if (existingMethod) {
      // Adicionar ao cache
      paymentMethodCache.set(normalizedName, {
        id: existingMethod.id,
        name: existingMethod.name,
        restaurantId: existingMethod.restaurant_id || profile.id,
      });
      return {
        id: existingMethod.id,
        name: existingMethod.name,
        restaurantId: existingMethod.restaurant_id || profile.id,
      };
    }

    // Criar novo método
    try {
      const { data, error } = await supabase
        .from("payment_methods")
        .insert([{ name, restaurant_id: profile.id }])
        .select()
        .single();

      if (error) {
        // Verificar se o erro é de duplicação (pode ocorrer em inserções simultâneas)
        if (error.code === "23505") {
          // Código de erro de duplicação no PostgreSQL
          // Buscar o método que foi inserido por outra operação
          const { data: existingData, error: fetchError } = await supabase
            .from("payment_methods")
            .select("*")
            .eq("name", name)
            .eq("restaurant_id", profile.id)
            .single();

          if (fetchError) throw fetchError;
          if (!existingData)
            throw new Error("Payment method exists but could not be fetched");

          const method = {
            id: existingData.id,
            name: existingData.name,
            restaurantId: existingData.restaurant_id,
          };

          // Atualizar cache e estado
          paymentMethodCache.set(normalizedName, method);
          setPaymentMethods((prev) => [...prev, existingData]);

          return method;
        }
        throw error;
      }

      if (!data) throw new Error("No data returned from insert");

      const newMethod = {
        id: data.id,
        name: data.name,
        restaurantId: data.restaurant_id,
      };

      // Atualizar cache e estado
      paymentMethodCache.set(normalizedName, newMethod);
      setPaymentMethods((prev) => [...prev, data]);

      return newMethod;
    } catch (err) {
      console.error("Error creating payment method:", err);
      throw new Error(
        `Failed to create payment method: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  const addSalesEntry = async (
    entry: Omit<SalesEntry, "id">
  ): Promise<SalesEntry | null> => {
    if (!profile?.id) {
      throw new Error("Restaurant profile not found");
    }

    try {
      // Se já existe uma venda com o mesmo externalId, não adicionar duplicada
      if (entry.externalId) {
        const existingSale = getSalesByExternalId(entry.externalId);
        if (existingSale) {
          console.log(
            `Sale with externalId ${entry.externalId} already exists, skipping`
          );
          return existingSale;
        }
      }

      // Se tiver salesChannelRaw, criar ou obter o canal
      let channelId = "";
      if (entry.salesChannelRaw) {
        try {
          const channel = await getOrCreateSalesChannel(entry.salesChannelRaw);
          channelId = channel.id;
        } catch (channelError) {
          console.error("Error getting/creating sales channel:", channelError);
          // Continuar mesmo sem o canal
        }
      }

      // Se tiver paymentMethodRaw, criar ou obter o método de pagamento
      let paymentMethodId = "";
      if (entry.paymentMethodRaw) {
        try {
          const method = await getOrCreatePaymentMethod(entry.paymentMethodRaw);
          paymentMethodId = method.id;
        } catch (methodError) {
          console.error("Error getting/creating payment method:", methodError);
          // Continuar mesmo sem o método de pagamento
        }
      }

      const entryToInsert = {
        ...entry,
        restaurant_id: profile.id,
        channel_id: channelId || null,
        payment_method_id: paymentMethodId || null,
      };

      const { data, error } = await supabase
        .from("sales_entries")
        .insert([entryToInsert])
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error("No data returned from insert");

      // Se tiver valor de pagamento, criar entrada de pagamento
      if (entry.totalAmount > 0 && entry.paymentMethodRaw) {
        try {
          await addPaymentEntry({
            date: entry.date,
            payment_type: entry.paymentMethodRaw,
            amount: entry.totalAmount,
            externalId: entry.externalId,
            salesEntryId: data.id,
          });
        } catch (paymentError) {
          console.error("Error adding payment entry:", paymentError);
          // Continuar mesmo sem a entrada de pagamento
        }
      }

      // Atualizar estado local
      setSalesEntries((prev) => [data, ...prev]);

      // Atualizar timestamp de última atualização
      updateLastUpdated();

      return data;
    } catch (err) {
      console.error("Error adding sales entry:", err);
      return null;
    }
  };

  // Método para adicionar múltiplas vendas de uma vez
  const addMultipleSales = async (entries: Omit<SalesEntry, "id">[]) => {
    if (!profile?.id) {
      throw new Error("Restaurant profile not found");
    }

    try {
      // Processar em lotes para evitar sobrecarga
      const batchSize = 10;
      let processedCount = 0;

      while (processedCount < entries.length) {
        const nextBatchSize = await processNextBatch(
          entries,
          batchSize,
          processedCount
        );
        processedCount += nextBatchSize;

        // Se não processou nenhum item no lote, interromper
        if (nextBatchSize === 0) break;
      }

      // Atualizar timestamp de última atualização
      updateLastUpdated();

      console.log(`Processed ${processedCount} of ${entries.length} entries`);
    } catch (err) {
      console.error("Error adding multiple sales:", err);
      throw err;
    }
  };

  // Método para processar o próximo lote de vendas
  const processNextBatch = async (
    entries: Omit<SalesEntry, "id">[],
    batchSize: number,
    startIndex: number
  ): Promise<number> => {
    if (startIndex >= entries.length) return 0;

    const endIndex = Math.min(startIndex + batchSize, entries.length);
    const batch = entries.slice(startIndex, endIndex);

    // Pré-carregar canais e métodos de pagamento para evitar chamadas repetidas
    const uniqueChannels = new Set<string>();
    const uniquePaymentMethods = new Set<string>();

    batch.forEach((entry) => {
      if (entry.salesChannelRaw) uniqueChannels.add(entry.salesChannelRaw);
      if (entry.paymentMethodRaw)
        uniquePaymentMethods.add(entry.paymentMethodRaw);
    });

    // Pré-carregar canais
    for (const channelName of uniqueChannels) {
      try {
        await getOrCreateSalesChannel(channelName);
      } catch (err) {
        console.error(`Error pre-loading channel ${channelName}:`, err);
      }
    }

    // Pré-carregar métodos de pagamento
    for (const methodName of uniquePaymentMethods) {
      try {
        await getOrCreatePaymentMethod(methodName);
      } catch (err) {
        console.error(`Error pre-loading payment method ${methodName}:`, err);
      }
    }

    // Processar cada venda no lote
    for (const entry of batch) {
      try {
        await addSalesEntry(entry);
      } catch (err) {
        console.error(`Error processing entry:`, err);
      }
    }

    return batch.length;
  };

  const addPaymentEntry = async (entry: Omit<PaymentEntry, "id">) => {
    if (!profile?.id) {
      throw new Error("Restaurant profile not found");
    }

    try {
      const { data, error } = await supabase
        .from("payment_entries")
        .insert([{ ...entry, restaurant_id: profile.id }])
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error("No data returned from insert");

      // Atualizar estado local
      setPaymentEntries((prev) => [data, ...prev]);

      // Atualizar timestamp de última atualização
      updateLastUpdated();
    } catch (err) {
      console.error("Error adding payment entry:", err);
      throw err;
    }
  };

  const updateSalesEntry = async (id: string, entry: Partial<SalesEntry>) => {
    if (!profile?.id) {
      throw new Error("Restaurant profile not found");
    }

    try {
      const { error } = await supabase
        .from("sales_entries")
        .update(entry)
        .eq("id", id)
        .eq("restaurant_id", profile.id);

      if (error) throw error;

      // Atualizar estado local
      setSalesEntries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...entry } : item))
      );

      // Atualizar timestamp de última atualização
      updateLastUpdated();
    } catch (err) {
      console.error("Error updating sales entry:", err);
      throw err;
    }
  };

  const updatePaymentEntry = async (
    id: string,
    entry: Partial<PaymentEntry>
  ) => {
    if (!profile?.id) {
      throw new Error("Restaurant profile not found");
    }

    try {
      const { error } = await supabase
        .from("payment_entries")
        .update(entry)
        .eq("id", id)
        .eq("restaurant_id", profile.id);

      if (error) throw error;

      // Atualizar estado local
      setPaymentEntries((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...entry } : item))
      );

      // Atualizar timestamp de última atualização
      updateLastUpdated();
    } catch (err) {
      console.error("Error updating payment entry:", err);
      throw err;
    }
  };

  const deleteSalesEntry = async (id: string) => {
    if (!profile?.id) {
      throw new Error("Restaurant profile not found");
    }

    try {
      const { error } = await supabase
        .from("sales_entries")
        .delete()
        .eq("id", id)
        .eq("restaurant_id", profile.id);

      if (error) throw error;

      // Atualizar estado local
      setSalesEntries((prev) => prev.filter((item) => item.id !== id));

      // Atualizar timestamp de última atualização
      updateLastUpdated();
    } catch (err) {
      console.error("Error deleting sales entry:", err);
      throw err;
    }
  };

  const deletePaymentEntry = async (id: string) => {
    if (!profile?.id) {
      throw new Error("Restaurant profile not found");
    }

    try {
      const { error } = await supabase
        .from("payment_entries")
        .delete()
        .eq("id", id)
        .eq("restaurant_id", profile.id);

      if (error) throw error;

      // Atualizar estado local
      setPaymentEntries((prev) => prev.filter((item) => item.id !== id));

      // Atualizar timestamp de última atualização
      updateLastUpdated();
    } catch (err) {
      console.error("Error deleting payment entry:", err);
      throw err;
    }
  };

  const getSalesByExternalId = (externalId: string) => {
    return salesEntries.find((entry) => entry.externalId === externalId);
  };

  const clearAllSales = async () => {
    if (!profile?.id) {
      throw new Error("Restaurant profile not found");
    }

    try {
      // Primeiro limpar pagamentos
      const { error: paymentError } = await supabase
        .from("payment_entries")
        .delete()
        .eq("restaurant_id", profile.id);

      if (paymentError) throw paymentError;

      // Depois limpar vendas
      const { error: salesError } = await supabase
        .from("sales_entries")
        .delete()
        .eq("restaurant_id", profile.id);

      if (salesError) throw salesError;

      // Atualizar estado local
      setSalesEntries([]);
      setPaymentEntries([]);

      // Atualizar timestamp de última atualização
      updateLastUpdated();
    } catch (err) {
      console.error("Error clearing all sales:", err);
      throw err;
    }
  };

  return (
    <SalesContext.Provider
      value={{
        salesEntries,
        sales: salesEntries, // Alias para compatibilidade
        paymentEntries,
        salesChannels,
        paymentMethods,
        addSalesEntry,
        addMultipleSales,
        addPaymentEntry,
        updateSalesEntry,
        updatePaymentEntry,
        deleteSalesEntry,
        deletePaymentEntry,
        getSalesByExternalId,
        getOrCreateSalesChannel,
        getOrCreatePaymentMethod,
        processNextBatch,
        loading,
        error,
        totalRevenue,
        totalOrders,
        averageTicket,
        refreshSalesData,
        clearAllSales,
        lastUpdated,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
};

export default SalesProvider;
