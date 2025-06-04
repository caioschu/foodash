import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Building2, MapPin, Phone, Mail, Search, MessageSquare } from 'lucide-react';

type Restaurant = {
  id: string;
  name: string;
  cuisineType: string;
  city: string;
  state: string;
  phone: string;
  whatsapp: string;
  email: string;
};

export const SupplierDashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');

  // Mock data - seria substituído por dados reais da API
  const restaurants: Restaurant[] = [
    {
      id: '1',
      name: 'Restaurante Italiano Bella Pasta',
      cuisineType: 'Italiana',
      city: 'São Paulo',
      state: 'SP',
      phone: '(11) 3456-7890',
      whatsapp: '5511987654321',
      email: 'contato@bellapasta.com'
    },
    {
      id: '2',
      name: 'Sabor Oriental',
      cuisineType: 'Japonesa',
      city: 'São Paulo',
      state: 'SP',
      phone: '(11) 2345-6789',
      whatsapp: '5511976543210',
      email: 'contato@sabororiental.com'
    },
    {
      id: '3',
      name: 'Cantinho Mineiro',
      cuisineType: 'Brasileira',
      city: 'Campinas',
      state: 'SP',
      phone: '(19) 3456-7890',
      whatsapp: '5519987654321',
      email: 'contato@cantinhomineiro.com'
    }
  ];

  const cities = ['São Paulo', 'Campinas', 'Santos', 'Ribeirão Preto'];

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.cuisineType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'all' || restaurant.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{user?.companyName}</h1>
          <p className="mt-1 text-sm text-gray-600">
            Painel do Fornecedor
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center text-gray-600">
            <Building2 className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total de Visualizações</p>
              <p className="text-2xl font-bold text-gray-900">324</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center text-gray-600">
            <MessageSquare className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Contatos Realizados</p>
              <p className="text-2xl font-bold text-gray-900">28</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center text-gray-600">
            <MapPin className="h-8 w-8 text-orange-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-500">Cidades Atendidas</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900">Restaurantes Disponíveis para Contato</h2>
          
          <div className="flex space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar restaurantes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="input"
            >
              <option value="all">Todas as cidades</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredRestaurants.map(restaurant => (
            <div key={restaurant.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:border-orange-200 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{restaurant.name}</h3>
                  <p className="text-sm text-gray-600">{restaurant.cuisineType}</p>
                  
                  <div className="flex items-center mt-2 space-x-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {restaurant.city}, {restaurant.state}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="h-4 w-4 mr-1" />
                      {restaurant.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail className="h-4 w-4 mr-1" />
                      {restaurant.email}
                    </div>
                  </div>
                </div>
                
                <a
                  href={`https://wa.me/${restaurant.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contatar via WhatsApp
                </a>
              </div>
            </div>
          ))}

          {filteredRestaurants.length === 0 && (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum restaurante encontrado</h3>
              <p className="text-gray-500">
                Tente ajustar seus filtros ou busque por outro termo.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};