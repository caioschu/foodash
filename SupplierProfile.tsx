import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Building2, MapPin, Phone, Mail, Truck, Globe, ChefHat } from 'lucide-react';

export const SupplierProfile: React.FC = () => {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    companyName: user?.companyName || '',
    description: '',
    phone: '',
    whatsapp: '',
    website: '',
    email: user?.email || '',
    coverage: 'local', // local, state, national, international
    cities: [] as string[],
    states: [] as string[],
    categories: [] as string[],
    restaurantCategories: [] as string[],
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });

  const coverageOptions = [
    { id: 'local', name: 'Apenas na cidade' },
    { id: 'state', name: 'Em todo o estado' },
    { id: 'national', name: 'Em todo o país' },
    { id: 'international', name: 'Internacional' }
  ];

  const categoryOptions = [
    'Alimentos',
    'Bebidas',
    'Embalagens',
    'Equipamentos',
    'Utensílios',
    'Limpeza',
    'Tecnologia',
    'Serviços',
    'Outros'
  ];

  const restaurantCategoryOptions = [
    'Italiana',
    'Japonesa',
    'Brasileira',
    'Árabe',
    'Mexicana',
    'Chinesa',
    'Francesa',
    'Vegetariana',
    'Vegana',
    'Fast Food',
    'Pizzaria',
    'Hamburgueria',
    'Cafeteria',
    'Doceria',
    'Padaria',
    'Sorveteria',
    'Churrascaria',
    'Bar',
    'Pub',
    'Food Truck',
    'Buffet',
    'Delivery Only',
    'Todos os tipos'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você enviaria os dados para a API
    console.log(formData);
    alert('Perfil atualizado com sucesso!');
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Perfil da Empresa</h1>
          <p className="mt-1 text-sm text-gray-600">
            Mantenha suas informações atualizadas para alcançar mais clientes
          </p>
        </div>
        <div className="flex space-x-3">
          <button type="button" className="btn btn-secondary">
            Cancelar
          </button>
          <button type="submit" form="supplier-form" className="btn btn-primary">
            Salvar Perfil
          </button>
        </div>
      </div>

      <form id="supplier-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <div className="flex items-center mb-6">
            <Building2 className="h-5 w-5 text-orange-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Informações da Empresa</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="companyName" className="label">
                Nome da Empresa
              </label>
              <input
                type="text"
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="categories" className="label">
                Categorias de Produtos/Serviços
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categoryOptions.map((category) => (
                  <label key={category} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.categories.includes(category)}
                      onChange={(e) => {
                        const newCategories = e.target.checked
                          ? [...formData.categories, category]
                          : formData.categories.filter(c => c !== category);
                        setFormData({ ...formData, categories: newCategories });
                      }}
                      className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="label">
                Descrição da Empresa
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input"
                rows={4}
                required
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <ChefHat className="h-5 w-5 text-orange-500 mr-2" />
                <label className="text-lg font-medium text-gray-900">
                  Tipos de Restaurantes que Atende
                </label>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Selecione os tipos de restaurantes que sua empresa atende. Isso ajudará a direcionar seus produtos/serviços para os clientes certos.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {restaurantCategoryOptions.map((category) => (
                  <label key={category} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.restaurantCategories.includes(category)}
                      onChange={(e) => {
                        const newCategories = e.target.checked
                          ? [...formData.restaurantCategories, category]
                          : formData.restaurantCategories.filter(c => c !== category);
                        setFormData({ ...formData, restaurantCategories: newCategories });
                      }}
                      className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center mb-6">
            <MapPin className="h-5 w-5 text-orange-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Localização e Cobertura</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="label">Área de Cobertura</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {coverageOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.coverage === option.id
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 hover:border-orange-200 hover:bg-orange-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="coverage"
                      value={option.id}
                      checked={formData.coverage === option.id}
                      onChange={(e) => setFormData({ ...formData, coverage: e.target.value })}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">{option.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="street" className="label">Endereço</label>
                <input
                  type="text"
                  id="street"
                  value={formData.address.street}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, street: e.target.value }
                  })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label htmlFor="number" className="label">Número</label>
                <input
                  type="text"
                  id="number"
                  value={formData.address.number}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, number: e.target.value }
                  })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label htmlFor="complement" className="label">Complemento</label>
                <input
                  type="text"
                  id="complement"
                  value={formData.address.complement}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, complement: e.target.value }
                  })}
                  className="input"
                />
              </div>

              <div>
                <label htmlFor="neighborhood" className="label">Bairro</label>
                <input
                  type="text"
                  id="neighborhood"
                  value={formData.address.neighborhood}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, neighborhood: e.target.value }
                  })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label htmlFor="city" className="label">Cidade</label>
                <input
                  type="text"
                  id="city"
                  value={formData.address.city}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, city: e.target.value }
                  })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label htmlFor="state" className="label">Estado</label>
                <input
                  type="text"
                  id="state"
                  value={formData.address.state}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, state: e.target.value }
                  })}
                  className="input"
                  required
                />
              </div>

              <div>
                <label htmlFor="zipCode" className="label">CEP</label>
                <input
                  type="text"
                  id="zipCode"
                  value={formData.address.zipCode}
                  onChange={(e) => setFormData({
                    ...formData,
                    address: { ...formData.address, zipCode: e.target.value }
                  })}
                  className="input"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center mb-6">
            <Phone className="h-5 w-5 text-orange-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Contato</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="phone" className="label">Telefone</label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="whatsapp" className="label">WhatsApp</label>
              <input
                type="tel"
                id="whatsapp"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="label">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input"
                required
              />
            </div>

            <div>
              <label htmlFor="website" className="label">Website</label>
              <input
                type="url"
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="input"
                placeholder="https://"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};