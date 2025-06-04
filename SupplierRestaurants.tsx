import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Store, MapPin, Phone, Mail, Search, MessageSquare, Check } from 'lucide-react';

type Restaurant = {
  id: string;
  name: string;
  cuisineType: string;
  city: string;
  state: string;
  phone: string;
  whatsapp: string;
  email: string;
  contacted: boolean;
};

export const SupplierRestaurants: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [showContactedOnly, setShowContactedOnly] = useState(false);

  // Mock data - seria substituído por dados reais da API
  const [restaurants, setRestaurants] = useState<Restaurant[]>([
    {
      id: '1',
      name: 'Restaurante Italiano Bella Pasta',
      cuisineType: 'Italiana',
      city: 'São Paulo',
      state: 'SP',
      phone: '(11) 3456-7890',
      whatsapp: '5511987654321',
      email: 'contato@bellapasta.com',
      contacted: false
    },
    {
      id: '2',
      name: 'Sabor Oriental',
      cuisineType: 'Japonesa',
      city: 'São Paulo',
      state: 'SP',
      phone: '(11) 2345-6789',
      whatsapp: '5511976543210',
      email: 'contato@sabororiental.com',
      contacted: true
    },
    {
      id: '3',
      name: 'Cantinho Mineiro',
      cuisineType: 'Brasileira',
      city: 'Campinas',
      state: 'SP',
      phone: '(19) 3456-7890',
      whatsapp: '5519987654321',
      email: 'contato@cantinhomineiro.com',
      contacted: false
    }
  ]);

  const cities = ['São Paulo', 'Campinas', 'Santos', 'Ribeirão Preto'];
  const cuisineTypes = ['Italiana', 'Japonesa', 'Brasileira', 'Árabe', 'Mexicana'];

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.cuisineType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'all' || restaurant.city === selectedCity;
    const matchesCuisine = selectedCuisine === 'all' || restaurant.cuisineType === selectedCuisine;
    const matchesContacted = !showContactedOnly || restaurant.contacted;
    return matchesSearch && matchesCity && matchesCuisine && matchesContacted;
  });

  const toggleContacted = (id: string) => {
    setRestaurants(restaurants.map(restaurant => 
      restaurant.id === id 
        ? { ...restaurant, contacted: !restaurant.contacted }
        : restaurant
    ));
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Restaurantes Disponíveis</h1>
          <p className="mt-1 text-sm text-gray-600">
            Estes restaurantes liberaram o contato para fornecedores
          </p>
        </div>
      </div>

      <div className="card mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar restaurantes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
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

            <select
              value={selectedCuisine}
              onChange={(e) => setSelectedCuisine(e.target.value)}
              className="input"
            >
              <option value="all">Todos os tipos</option>
              {cuisineTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showContactedOnly}
                onChange={(e) => setShowContactedOnly(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
              <span className="ml-3 text-sm font-medium text-gray-900">Mostrar apenas contatados</span>
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {filteredRestaurants.map(restaurant => (
          <div key={restaurant.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:border-orange-200 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium text-gray-900">{restaurant.name}</h3>
                  {restaurant.contacted && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Check className="w-3 h-3 mr-1" />
                      Contatado
                    </span>
                  )}
                </div>
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
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleContacted(restaurant.id)}
                  className={`btn ${restaurant.contacted ? 'btn-secondary' : 'btn-accent'}`}
                >
                  {restaurant.contacted ? 'Desmarcar Contato' : 'Marcar como Contatado'}
                </button>
                
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
          </div>
        ))}

        {filteredRestaurants.length === 0 && (
          <div className="text-center py-8">
            <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum restaurante encontrado</h3>
            <p className="text-gray-500">
              Tente ajustar seus filtros ou busque por outro termo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};