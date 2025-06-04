import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useAuth } from './AuthContext';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export type SalesChannel = {
  id: string;
  name: string;
  enabled: boolean;
  icon?: any;
  fees?: {
    commission: number;
    anticipation?: number;
    onlinePayment?: {
      credit: number;
      debit: number;
      pix: number;
      food_voucher: number;
      enabled: boolean;
    };
  };
};

export type PaymentMethod = {
  id: string;
  name: string;
  enabled: boolean;
  fee?: number;
  anticipation?: number;
};

export type RestaurantProfile = {
  id?: string;
  restaurantName: string;
  phone: {
    ddd: string;
    number: string;
  };
  whatsapp: {
    ddd: string;
    number: string;
  };
  website: string;
  email: string;
  cuisineType: string;
  employeeCount: string;
  services: {
    lunch: boolean;
    dinner: boolean;
  };
  salesChannels: SalesChannel[];
  paymentMethods: PaymentMethod[];
  customChannels: string[];
  address: {
    zipCode: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
  };
};

// Canais de venda padrão
const defaultSalesChannels: SalesChannel[] = [
  {
    id: "salao",
    name: "Salão",
    enabled: true,
    fees: {
      commission: 0,
    },
  },
  {
    id: "ifood",
    name: "iFood",
    enabled: false,
    fees: {
      commission: 12,
    },
  },
  {
    id: "rappi",
    name: "Rappi",
    enabled: false,
    fees: {
      commission: 12,
    },
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    enabled: false,
    fees: {
      commission: 0,
    },
  },
  {
    id: "delivery",
    name: "Delivery Direto",
    enabled: false,
    fees: {
      commission: 0,
    },
  },
];

// Formas de pagamento padrão
const defaultPaymentMethods: PaymentMethod[] = [
  {
    id: "cash",
    name: "Dinheiro",
    enabled: true,
  },
  {
    id: "credit",
    name: "Cartão de Crédito",
    enabled: true,
    fee: 3.5,
    anticipation: 2.5,
  },
  {
    id: "debit",
    name: "Cartão de Débito",
    enabled: true,
    fee: 2.5,
    anticipation: 0,
  },
  {
    id: "pix",
    name: "PIX",
    enabled: true,
    fee: 1,
    anticipation: 0,
  },
  {
    id: "food_voucher",
    name: "Vale-Refeição",
    enabled: true,
    fee: 3.5,
    anticipation: 0,
  },
  {
    id: "ifood_online",
    name: "Pagamento Online iFood",
    enabled: false,
    fee: 3.5,
    anticipation: 2.5,
  },
];

type RestaurantContextType = {
  profile: RestaurantProfile | null;
  currentRestaurant: RestaurantProfile | null; // Adicionado para compatibilidade
  updateProfile: (profile: RestaurantProfile) => Promise<void>;
  loading: boolean;
  error: string | null;
};

const RestaurantContext = createContext<RestaurantContextType | undefined>(
  undefined
);

export const useRestaurant = () => {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error("useRestaurant must be used within a RestaurantProvider");
  }
  return context;
};

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<RestaurantProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("restaurant_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          setProfile(null);
        } else {
          throw error;
        }
      } else if (data) {
        // Mesclar canais de venda padrão com os do banco de dados
        let mergedSalesChannels = [...defaultSalesChannels];
        if (data.canais_de_vendas && Array.isArray(data.canais_de_vendas)) {
          // Atualizar canais padrão com dados do banco
          mergedSalesChannels = mergedSalesChannels.map((defaultChannel) => {
            const dbChannel = data.canais_de_vendas.find(
              (c: any) => c.id === defaultChannel.id
            );
            return dbChannel
              ? { ...defaultChannel, ...dbChannel }
              : defaultChannel;
          });

          // Adicionar canais personalizados
          const customChannels = data.canais_de_vendas.filter(
            (c: any) => !defaultSalesChannels.some((dc) => dc.id === c.id)
          );
          mergedSalesChannels = [...mergedSalesChannels, ...customChannels];
        }

        // Mesclar formas de pagamento padrão com as do banco de dados
        let mergedPaymentMethods = [...defaultPaymentMethods];
        if (
          data.métodos_de_pagamento &&
          Array.isArray(data.métodos_de_pagamento)
        ) {
          // Atualizar formas de pagamento padrão com dados do banco
          mergedPaymentMethods = mergedPaymentMethods.map((defaultMethod) => {
            const dbMethod = data.métodos_de_pagamento.find(
              (m: any) => m.id === defaultMethod.id
            );
            return dbMethod ? { ...defaultMethod, ...dbMethod } : defaultMethod;
          });

          // Adicionar formas de pagamento personalizadas
          const customMethods = data.métodos_de_pagamento.filter(
            (m: any) => !defaultPaymentMethods.some((dm) => dm.id === m.id)
          );
          mergedPaymentMethods = [...mergedPaymentMethods, ...customMethods];
        }

        const transformedProfile: RestaurantProfile = {
          id: data.id,
          restaurantName: data.restaurant_name || "",
          phone: {
            ddd: data.phone_ddd || "",
            number: data.phone_number || "",
          },
          whatsapp: {
            ddd: data.whatsapp_ddd || "",
            number: data.whatsapp_number || "",
          },
          website: data.website || "",
          email: data.email || "",
          cuisineType: data.cuisine_type || "",
          employeeCount: data.employee_count?.toString() || "",
          services: data.services || { lunch: false, dinner: false },
          salesChannels: mergedSalesChannels,
          paymentMethods: mergedPaymentMethods,
          customChannels: data.custom_channels || [],
          address: data.address || {
            zipCode: "",
            street: "",
            number: "",
            complement: "",
            neighborhood: "",
            city: "",
            state: "",
          },
        };
        setProfile(transformedProfile);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (newProfile: RestaurantProfile) => {
    if (!user?.id) throw new Error("No user ID available");

    try {
      setLoading(true);
      setError(null);

      const dbProfile = {
        user_id: user.id,
        restaurant_name: newProfile.restaurantName || "",
        phone_ddd: newProfile.phone.ddd || "",
        phone_number: newProfile.phone.number || "",
        whatsapp_ddd: newProfile.whatsapp.ddd || "",
        whatsapp_number: newProfile.whatsapp.number || "",
        website: newProfile.website || "",
        email: newProfile.email || "",
        cuisine_type: newProfile.cuisineType || "",
        employee_count: newProfile.employeeCount
          ? isNaN(parseInt(newProfile.employeeCount))
            ? null
            : parseInt(newProfile.employeeCount)
          : null,
        services: newProfile.services || { lunch: false, dinner: false },
        // Usar apenas canais_de_vendas (sem o sales_channels)
        canais_de_vendas: Array.isArray(newProfile.salesChannels)
          ? newProfile.salesChannels.map(({ icon, ...rest }) => rest)
          : [],
        // Usar apenas métodos_de_pagamento (sem o payment_methods)
        métodos_de_pagamento: Array.isArray(newProfile.paymentMethods)
          ? newProfile.paymentMethods
          : [],
        custom_channels: Array.isArray(newProfile.customChannels)
          ? newProfile.customChannels
          : [],
        address: newProfile.address || {},
      };

      let result;
      if (profile?.id) {
        // Update existing profile
        const { data, error } = await supabase
          .from("restaurant_profiles")
          .update(dbProfile)
          .eq("id", profile.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        // Insert new profile
        const { data, error } = await supabase
          .from("restaurant_profiles")
          .insert([dbProfile])
          .select()
          .single();

        if (error) throw error;
        result = data;
      }

      // Mesclar canais de venda padrão com os do banco de dados
      let mergedSalesChannels = [...defaultSalesChannels];
      if (result.canais_de_vendas && Array.isArray(result.canais_de_vendas)) {
        // Atualizar canais padrão com dados do banco
        mergedSalesChannels = mergedSalesChannels.map((defaultChannel) => {
          const dbChannel = result.canais_de_vendas.find(
            (c: any) => c.id === defaultChannel.id
          );
          return dbChannel
            ? { ...defaultChannel, ...dbChannel }
            : defaultChannel;
        });

        // Adicionar canais personalizados
        const customChannels = result.canais_de_vendas.filter(
          (c: any) => !defaultSalesChannels.some((dc) => dc.id === c.id)
        );
        mergedSalesChannels = [...mergedSalesChannels, ...customChannels];
      }

      // Mesclar formas de pagamento padrão com as do banco de dados
      let mergedPaymentMethods = [...defaultPaymentMethods];
      if (
        result.métodos_de_pagamento &&
        Array.isArray(result.métodos_de_pagamento)
      ) {
        // Atualizar formas de pagamento padrão com dados do banco
        mergedPaymentMethods = mergedPaymentMethods.map((defaultMethod) => {
          const dbMethod = result.métodos_de_pagamento.find(
            (m: any) => m.id === defaultMethod.id
          );
          return dbMethod ? { ...defaultMethod, ...dbMethod } : defaultMethod;
        });

        // Adicionar formas de pagamento personalizadas
        const customMethods = result.métodos_de_pagamento.filter(
          (m: any) => !defaultPaymentMethods.some((dm) => dm.id === m.id)
        );
        mergedPaymentMethods = [...mergedPaymentMethods, ...customMethods];
      }

      // Transform the result back to our application format
      const updatedProfile: RestaurantProfile = {
        id: result.id,
        restaurantName: result.restaurant_name || "",
        phone: {
          ddd: result.phone_ddd || "",
          number: result.phone_number || "",
        },
        whatsapp: {
          ddd: result.whatsapp_ddd || "",
          number: result.whatsapp_number || "",
        },
        website: result.website || "",
        email: result.email || "",
        cuisineType: result.cuisine_type || "",
        employeeCount: result.employee_count?.toString() || "",
        services: result.services || { lunch: false, dinner: false },
        salesChannels: mergedSalesChannels,
        paymentMethods: mergedPaymentMethods,
        customChannels: result.custom_channels || [],
        address: result.address || {
          zipCode: "",
          street: "",
          number: "",
          complement: "",
          neighborhood: "",
          city: "",
          state: "",
        },
      };

      // Update local state with the transformed profile
      setProfile(updatedProfile);

      // Update auth context user data
      if (user && updatedProfile.restaurantName !== user.restaurantName) {
        const updatedUser = {
          ...user,
          restaurantName: updatedProfile.restaurantName,
        };
        localStorage.setItem("foodash_user", JSON.stringify(updatedUser));
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <RestaurantContext.Provider
      value={{ 
        profile, 
        currentRestaurant: profile, // Adicionado para compatibilidade
        updateProfile, 
        loading, 
        error 
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export { RestaurantContext };
