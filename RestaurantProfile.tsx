import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useRestaurant } from "../contexts/RestaurantContext";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  ChefHat,
  Check,
  X,
  Plus,
  MessageSquare,
  Truck,
  Send,
  DollarSign,
  Upload,
  Image,
} from "lucide-react";

const RestaurantProfile: React.FC = () => {
  const { user } = useAuth();
  const { profile, updateProfile } = useRestaurant();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newChannel, setNewChannel] = useState("");
  const [newPaymentMethod, setNewPaymentMethod] = useState("");
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const cuisineTypes = [
    "Italiana",
    "Japonesa",
    "Brasileira",
    "Árabe",
    "Mexicana",
    "Chinesa",
    "Francesa",
    "Vegetariana",
    "Vegana",
    "Fast Food",
    "Pizzaria",
    "Hamburgueria",
    "Cafeteria",
    "Doceria",
    "Padaria",
    "Sorveteria",
    "Churrascaria",
    "Bar",
    "Pub",
  ];

  const [formData, setFormData] = useState({
    restaurantName: user?.restaurantName || "",
    logoUrl: "",
    phone: {
      ddd: "",
      number: "",
    },
    whatsapp: {
      ddd: "",
      number: "",
    },
    website: "",
    email: user?.email || "",
    cuisineType: "",
    employeeCount: "",
    services: {
      lunch: false,
      dinner: false,
    },
    salesChannels: [
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
    ],
    paymentMethods: [
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
    ],
    customChannels: [],
    address: {
      zipCode: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    },
  });

  useEffect(() => {
    if (profile) {
      // Mesclar canais de venda padrão com os do perfil e incluir canais personalizados
      let updatedSalesChannels = [...formData.salesChannels];

      if (profile.salesChannels && profile.salesChannels.length > 0) {
        // Atualizar canais padrão com dados do perfil
        updatedSalesChannels = updatedSalesChannels.map((defaultChannel) => {
          const profileChannel = profile.salesChannels.find(
            (c) => c.id === defaultChannel.id
          );
          return profileChannel
            ? { ...defaultChannel, ...profileChannel }
            : defaultChannel;
        });

        // Adicionar canais personalizados do perfil
        const customChannels = profile.salesChannels.filter(
          (channel) =>
            !formData.salesChannels.some((dc) => dc.id === channel.id)
        );

        if (customChannels.length > 0) {
          updatedSalesChannels = [...updatedSalesChannels, ...customChannels];
        }
      }

      // Atualizar o formData com todos os dados do perfil, incluindo os canais de venda atualizados
      setFormData({
        ...formData,
        restaurantName: profile.restaurantName || user?.restaurantName || "",
        logoUrl: profile.logoUrl || "",
        phone: profile.phone || { ddd: "", number: "" },
        whatsapp: profile.whatsapp || { ddd: "", number: "" },
        website: profile.website || "",
        email: profile.email || user?.email || "",
        cuisineType: profile.cuisineType || "",
        employeeCount: profile.employeeCount || "",
        services: profile.services || { lunch: false, dinner: false },
        salesChannels: updatedSalesChannels,
        paymentMethods: profile.paymentMethods || formData.paymentMethods,
        customChannels: profile.customChannels || [],
        address: profile.address || {
          zipCode: "",
          street: "",
          number: "",
          complement: "",
          neighborhood: "",
          city: "",
          state: "",
        },
      });
    }
  }, [profile, user]);

  // CORREÇÃO: Upload de logo funcionando corretamente com compressão
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];

    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Por favor, selecione apenas arquivos de imagem.");
      return;
    }

    // Validar tamanho do arquivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("O arquivo deve ter no máximo 5MB.");
      return;
    }

    setIsUploadingLogo(true);
    setErrorMessage("");

    try {
      const reader = new FileReader();

      reader.onload = async (event) => {
        if (event.target && event.target.result) {
          // Comprimir a imagem para garantir que caiba no localStorage
          const logoUrl = event.target.result as string;
          
          // Criar uma imagem para redimensionar se necessário
          const img = new Image();
          img.onload = async () => {
            // Redimensionar se for muito grande
            let finalLogoUrl = logoUrl;
            
            if (img.width > 400 || img.height > 400) {
              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d');
              
              // Definir tamanho máximo
              const MAX_SIZE = 400;
              let width = img.width;
              let height = img.height;
              
              if (width > height) {
                if (width > MAX_SIZE) {
                  height = Math.round(height * (MAX_SIZE / width));
                  width = MAX_SIZE;
                }
              } else {
                if (height > MAX_SIZE) {
                  width = Math.round(width * (MAX_SIZE / height));
                  height = MAX_SIZE;
                }
              }
              
              canvas.width = width;
              canvas.height = height;
              
              ctx?.drawImage(img, 0, 0, width, height);
              finalLogoUrl = canvas.toDataURL('image/jpeg', 0.8); // Comprimir como JPEG
            }
            
            // Atualizar formData primeiro
            const updatedFormData = {
              ...formData,
              logoUrl: finalLogoUrl,
            };

            setFormData(updatedFormData);

            try {
              // Salvar no contexto/backend imediatamente
              await updateProfile(updatedFormData);
              
              // Forçar atualização do localStorage
              if (user) {
                const profileData = JSON.stringify(updatedFormData);
                localStorage.setItem(`restaurant_profile_${user.id}`, profileData);
              }
              
              setSuccessMessage("Logo atualizado com sucesso!");

              // Clear success message after 3 seconds
              setTimeout(() => {
                setSuccessMessage("");
              }, 3000);
            } catch (error) {
              console.error("Error updating logo:", error);
              setErrorMessage("Erro ao salvar o logo. Tente novamente.");
              // Reverter mudança no formData em caso de erro
              setFormData(formData);
            } finally {
              setIsUploadingLogo(false);
            }
          };
          
          img.src = logoUrl;
        }
      };

      reader.onerror = () => {
        setErrorMessage("Erro ao processar o arquivo. Tente novamente.");
        setIsUploadingLogo(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error processing logo:", error);
      setErrorMessage("Erro ao processar o logo. Tente novamente.");
      setIsUploadingLogo(false);
    }
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, "");

    setFormData({
      ...formData,
      address: { ...formData.address, zipCode: cep },
    });

    if (cep.length === 8) {
      setIsLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();

        if (!data.erro) {
          setFormData({
            ...formData,
            address: {
              ...formData.address,
              zipCode: cep,
              street: data.logradouro,
              neighborhood: data.bairro,
              city: data.localidade,
              state: data.uf,
            },
          });
        }
      } catch (error) {
        console.error("Error fetching CEP:", error);
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  const handleChannelToggle = (channelId: string) => {
    setFormData({
      ...formData,
      salesChannels: formData.salesChannels.map((channel) =>
        channel.id === channelId
          ? { ...channel, enabled: !channel.enabled }
          : channel
      ),
    });
  };

  const handleChannelCommissionChange = (channelId: string, value: string) => {
    setFormData({
      ...formData,
      salesChannels: formData.salesChannels.map((channel) =>
        channel.id === channelId
          ? {
              ...channel,
              fees: {
                ...channel.fees,
                commission: value === "" ? 0 : parseFloat(value),
              },
            }
          : channel
      ),
    });
  };

  const handleAddChannel = () => {
    if (newChannel.trim() === "") return;

    const channelId = `custom_${Date.now()}`;
    const newCustomChannel = {
      id: channelId,
      name: newChannel,
      enabled: true,
      fees: {
        commission: 0,
      },
    };

    setFormData({
      ...formData,
      salesChannels: [...formData.salesChannels, newCustomChannel],
    });

    setNewChannel("");
  };

  const handlePaymentMethodToggle = (methodId: string) => {
    setFormData({
      ...formData,
      paymentMethods: formData.paymentMethods.map((method) =>
        method.id === methodId
          ? { ...method, enabled: !method.enabled }
          : method
      ),
    });
  };

  const handlePaymentMethodFeeChange = (methodId: string, value: string) => {
    setFormData({
      ...formData,
      paymentMethods: formData.paymentMethods.map((method) =>
        method.id === methodId
          ? { ...method, fee: value === "" ? 0 : parseFloat(value) }
          : method
      ),
    });
  };

  const handlePaymentMethodAnticipationChange = (
    methodId: string,
    value: string
  ) => {
    setFormData({
      ...formData,
      paymentMethods: formData.paymentMethods.map((method) =>
        method.id === methodId
          ? { ...method, anticipation: value === "" ? 0 : parseFloat(value) }
          : method
      ),
    });
  };

  const handleAddPaymentMethod = () => {
    if (newPaymentMethod.trim() === "") return;

    const methodId = `custom_${Date.now()}`;
    const newCustomMethod = {
      id: methodId,
      name: newPaymentMethod,
      enabled: true,
      fee: 0,
      anticipation: 0,
    };

    setFormData({
      ...formData,
      paymentMethods: [...formData.paymentMethods, newCustomMethod],
    });

    setNewPaymentMethod("");
  };

  const handleRemovePaymentMethod = (methodId: string) => {
    setFormData({
      ...formData,
      paymentMethods: formData.paymentMethods.filter(
        (method) => method.id !== methodId
      ),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await updateProfile(formData);
      setSuccessMessage("Perfil atualizado com sucesso!");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage("Erro ao atualizar perfil. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
          <Check className="h-5 w-5 mr-2" />
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <X className="h-5 w-5 mr-2" />
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* SEÇÃO: INFORMAÇÕES BÁSICAS */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <Building2 className="text-orange-500 mr-2" />
            <h2 className="text-xl font-semibold">Informações Básicas</h2>
          </div>

          {/* Logo Upload Section - MELHORADO */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2 font-medium">
              Logo do Restaurante
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 hover:border-orange-300 transition-colors">
                {formData.logoUrl ? (
                  <img
                    src={formData.logoUrl}
                    alt="Logo do Restaurante"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center">
                    <Image className="text-gray-400 h-12 w-12 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Nenhuma imagem</p>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <input
                  type="file"
                  id="logo-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                  disabled={isUploadingLogo}
                />
                <label
                  htmlFor="logo-upload"
                  className={`inline-flex items-center px-6 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    isUploadingLogo
                      ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                      : "bg-orange-500 text-white hover:bg-orange-600 hover:shadow-md"
                  }`}
                >
                  {isUploadingLogo ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processando...
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 mr-2" />
                      {formData.logoUrl ? "Alterar Logo" : "Fazer Upload"}
                    </>
                  )}
                </label>
                <div className="mt-2 text-sm text-gray-500">
                  <p>• Formatos aceitos: JPG, PNG, SVG</p>
                  <p>• Tamanho máximo: 5MB</p>
                  <p>• Dimensões recomendadas: 200x200px</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Nome do Restaurante
            </label>
            <input
              type="text"
              value={formData.restaurantName}
              onChange={(e) =>
                setFormData({ ...formData, restaurantName: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Tipo de Culinária
            </label>
            <select
              value={formData.cuisineType}
              onChange={(e) =>
                setFormData({ ...formData, cuisineType: e.target.value })
              }
              className="w-full p-2 border rounded"
            >
              <option value="">Selecione...</option>
              {cuisineTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Número de Funcionários
            </label>
            <input
              type="number"
              value={formData.employeeCount}
              onChange={(e) =>
                setFormData({ ...formData, employeeCount: e.target.value })
              }
              className="w-full p-2 border rounded"
              min="0"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Serviços</label>
            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="lunch"
                  checked={formData.services.lunch}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      services: {
                        ...formData.services,
                        lunch: !formData.services.lunch,
                      },
                    })
                  }
                  className="mr-2"
                />
                <label htmlFor="lunch">Almoço</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="dinner"
                  checked={formData.services.dinner}
                  onChange={() =>
                    setFormData({
                      ...formData,
                      services: {
                        ...formData.services,
                        dinner: !formData.services.dinner,
                      },
                    })
                  }
                  className="mr-2"
                />
                <label htmlFor="dinner">Jantar</label>
              </div>
            </div>
          </div>
        </div>

        {/* SEÇÃO: ENDEREÇO */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <MapPin className="text-orange-500 mr-2" />
            <h2 className="text-xl font-semibold">Endereço</h2>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">CEP</label>
            <div className="flex items-center">
              <input
                type="text"
                value={formData.address.zipCode}
                onChange={handleCepChange}
                className="w-full p-2 border rounded"
                maxLength={9}
                placeholder="00000-000"
              />
              {isLoadingCep && (
                <div className="ml-2 animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Rua</label>
              <input
                type="text"
                value={formData.address.street}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, street: e.target.value },
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Número</label>
              <input
                type="text"
                value={formData.address.number}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, number: e.target.value },
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Complemento</label>
            <input
              type="text"
              value={formData.address.complement}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address, complement: e.target.value },
                })
              }
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Bairro</label>
              <input
                type="text"
                value={formData.address.neighborhood}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: {
                      ...formData.address,
                      neighborhood: e.target.value,
                    },
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Cidade</label>
              <input
                type="text"
                value={formData.address.city}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, city: e.target.value },
                  })
                }
                className="w-full p-2 border rounded"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Estado</label>
              <input
                type="text"
                value={formData.address.state}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, state: e.target.value },
                  })
                }
                className="w-full p-2 border rounded"
                maxLength={2}
              />
            </div>
          </div>
        </div>

        {/* SEÇÃO: CONTATO */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <Phone className="text-orange-500 mr-2" />
            <h2 className="text-xl font-semibold">Contato</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Telefone</label>
              <div className="flex">
                <input
                  type="text"
                  value={formData.phone.ddd}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: { ...formData.phone, ddd: e.target.value },
                    })
                  }
                  className="w-16 p-2 border rounded-l"
                  placeholder="DDD"
                  maxLength={2}
                />
                <input
                  type="text"
                  value={formData.phone.number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: { ...formData.phone, number: e.target.value },
                    })
                  }
                  className="flex-1 p-2 border-t border-b border-r rounded-r"
                  placeholder="Número"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">WhatsApp</label>
              <div className="flex">
                <input
                  type="text"
                  value={formData.whatsapp.ddd}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      whatsapp: { ...formData.whatsapp, ddd: e.target.value },
                    })
                  }
                  className="w-16 p-2 border rounded-l"
                  placeholder="DDD"
                  maxLength={2}
                />
                <input
                  type="text"
                  value={formData.whatsapp.number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      whatsapp: {
                        ...formData.whatsapp,
                        number: e.target.value,
                      },
                    })
                  }
                  className="flex-1 p-2 border-t border-b border-r rounded-r"
                  placeholder="Número"
                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">E-mail</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Website</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              className="w-full p-2 border rounded"
              placeholder="https://www.seurestaurante.com.br"
            />
          </div>
        </div>

        {/* SEÇÃO: CANAIS DE VENDA */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <MessageSquare className="text-orange-500 mr-2" />
            <h2 className="text-xl font-semibold">Canais de Venda</h2>
          </div>

          <div className="space-y-4">
            {formData.salesChannels.map((channel) => (
              <div
                key={channel.id}
                className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`channel-${channel.id}`}
                    checked={channel.enabled}
                    onChange={() => handleChannelToggle(channel.id)}
                    className="mr-3"
                  />
                  <label
                    htmlFor={`channel-${channel.id}`}
                    className="font-medium"
                  >
                    {channel.name}
                  </label>
                </div>

                {channel.enabled && (
                  <div className="flex items-center">
                    <label className="mr-2 text-sm">Comissão (%)</label>
                    <input
                      type="number"
                      value={channel.fees.commission}
                      onChange={(e) =>
                        handleChannelCommissionChange(channel.id, e.target.value)
                      }
                      className="w-16 p-1 border rounded text-center"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center">
            <input
              type="text"
              value={newChannel}
              onChange={(e) => setNewChannel(e.target.value)}
              className="flex-1 p-2 border rounded-l"
              placeholder="Adicionar novo canal..."
            />
            <button
              type="button"
              onClick={handleAddChannel}
              className="bg-orange-500 text-white p-2 rounded-r hover:bg-orange-600 focus:outline-none"
              disabled={!newChannel.trim()}
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* SEÇÃO: FORMAS DE PAGAMENTO */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-4">
            <DollarSign className="text-orange-500 mr-2" />
            <h2 className="text-xl font-semibold">Formas de Pagamento</h2>
          </div>

          <div className="space-y-4">
            {formData.paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-3 border rounded hover:bg-gray-50"
              >
                <div className="flex items-center mb-2 md:mb-0">
                  <input
                    type="checkbox"
                    id={`method-${method.id}`}
                    checked={method.enabled}
                    onChange={() => handlePaymentMethodToggle(method.id)}
                    className="mr-3"
                  />
                  <label
                    htmlFor={`method-${method.id}`}
                    className="font-medium"
                  >
                    {method.name}
                  </label>
                </div>

                {method.enabled && (
                  <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
                    <div className="flex items-center">
                      <label className="mr-2 text-sm">Taxa (%)</label>
                      <input
                        type="number"
                        value={method.fee}
                        onChange={(e) =>
                          handlePaymentMethodFeeChange(
                            method.id,
                            e.target.value
                          )
                        }
                        className="w-16 p-1 border rounded text-center"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </div>

                    {(method.id === "credit" ||
                      method.id === "ifood_online") && (
                      <div className="flex items-center">
                        <label className="mr-2 text-sm">Antecipação (%)</label>
                        <input
                          type="number"
                          value={method.anticipation}
                          onChange={(e) =>
                            handlePaymentMethodAnticipationChange(
                              method.id,
                              e.target.value
                            )
                          }
                          className="w-16 p-1 border rounded text-center"
                          min="0"
                          max="100"
                          step="0.1"
                        />
                      </div>
                    )}

                    {method.id.startsWith("custom_") && (
                      <button
                        type="button"
                        onClick={() => handleRemovePaymentMethod(method.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center">
            <input
              type="text"
              value={newPaymentMethod}
              onChange={(e) => setNewPaymentMethod(e.target.value)}
              className="flex-1 p-2 border rounded-l"
              placeholder="Adicionar nova forma de pagamento..."
            />
            <button
              type="button"
              onClick={handleAddPaymentMethod}
              className="bg-orange-500 text-white p-2 rounded-r hover:bg-orange-600 focus:outline-none"
              disabled={!newPaymentMethod.trim()}
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className={`px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RestaurantProfile;
