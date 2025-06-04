import React, { useState } from 'react';
import { Search, ShoppingBag, Phone, Globe, MessageSquare } from 'lucide-react';

// Define supplier type
type Supplier = {
  id: number;
  name: string;
  logo: string;
  category: string;
  description: string;
  phone: string;
  website: string;
  whatsapp: string;
  featured: boolean;
};

export const SuppliersModule: React.FC = () => {
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Mock suppliers data
  const [suppliers] = useState<Supplier[]>([
    {
      id: 1,
      name: 'Foods Distribuição',
      logo: 'https://images.pexels.com/photos/4197693/pexels-photo-4197693.jpeg?auto=compress&cs=tinysrgb&w=150',
      category: 'alimentos',
      description: 'Distribuidor de alimentos frescos para restaurantes. Entrega rápida e produtos de qualidade.',
      phone: '(11) 3456-7890',
      website: 'https://exemplo.com/foods',
      whatsapp: '5511912345678',
      featured: true
    },
    {
      id: 2,
      name: 'Eco Embalagens',
      logo: 'https://images.pexels.com/photos/4255489/pexels-photo-4255489.jpeg?auto=compress&cs=tinysrgb&w=150',
      category: 'embalagens',
      description: 'Embalagens sustentáveis e biodegradáveis para delivery e take-away.',
      phone: '(11) 2345-6789',
      website: 'https://exemplo.com/eco',
      whatsapp: '5511987654321',
      featured: true
    },
    {
      id: 3,
      name: 'Tech Systems',
      logo: 'https://images.pexels.com/photos/4126724/pexels-photo-4126724.jpeg?auto=compress&cs=tinysrgb&w=150',
      category: 'tecnologia',
      description: 'Soluções tecnológicas para gestão de restaurantes, PDV e controle de estoque.',
      phone: '(11) 3456-7891',
      website: 'https://exemplo.com/tech',
      whatsapp: '5511912345679',
      featured: true
    },
    {
      id: 4,
      name: 'Express Delivery',
      logo: 'https://images.pexels.com/photos/6169693/pexels-photo-6169693.jpeg?auto=compress&cs=tinysrgb&w=150',
      category: 'motoboy',
      description: 'Serviço de entrega dedicado para restaurantes, com equipe própria e rastreamento.',
      phone: '(11) 2345-6788',
      website: 'https://exemplo.com/express',
      whatsapp: '5511987654322',
      featured: false
    },
    {
      id: 5,
      name: 'Bebidas Premium',
      logo: 'https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=150',
      category: 'bebidas',
      description: 'Distribuidor de bebidas alcoólicas e não alcoólicas para estabelecimentos gastronômicos.',
      phone: '(11) 3456-7892',
      website: 'https://exemplo.com/bebidas',
      whatsapp: '5511912345670',
      featured: false
    },
    {
      id: 6,
      name: 'Clean Services',
      logo: 'https://images.pexels.com/photos/6446680/pexels-photo-6446680.jpeg?auto=compress&cs=tinysrgb&w=150',
      category: 'limpeza',
      description: 'Serviços e produtos de limpeza especializados para cozinhas profissionais.',
      phone: '(11) 2345-6787',
      website: 'https://exemplo.com/clean',
      whatsapp: '5511987654323',
      featured: false
    },
    {
      id: 7,
      name: 'Equipamentos Gastronomia',
      logo: 'https://images.pexels.com/photos/6994982/pexels-photo-6994982.jpeg?auto=compress&cs=tinysrgb&w=150',
      category: 'equipamentos',
      description: 'Venda e locação de equipamentos para cozinhas industriais e restaurantes.',
      phone: '(11) 3456-7893',
      website: 'https://exemplo.com/equip',
      whatsapp: '5511912345671',
      featured: false
    },
    {
      id: 8,
      name: 'Contador Food',
      logo: 'https://images.pexels.com/photos/5483077/pexels-photo-5483077.jpeg?auto=compress&cs=tinysrgb&w=150',
      category: 'contabilidade',
      description: 'Serviços contábeis especializados para restaurantes e bares.',
      phone: '(11) 2345-6786',
      website: 'https://exemplo.com/contador',
      whatsapp: '5511987654324',
      featured: false
    }
  ]);
  
  // Categories for filter
  const categories = [
    { id: 'all', name: 'Todos' },
    { id: 'alimentos', name: 'Alimentos' },
    { id: 'bebidas', name: 'Bebidas' },
    { id: 'embalagens', name: 'Embalagens' },
    { id: 'tecnologia', name: 'Tecnologia' },
    { id: 'motoboy', name: 'Entrega' },
    { id: 'limpeza', name: 'Limpeza' },
    { id: 'equipamentos', name: 'Equipamentos' },
    { id: 'contabilidade', name: 'Contabilidade' }
  ];
  
  // Filter suppliers based on search and category
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || supplier.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Featured suppliers
  const featuredSuppliers = filteredSuppliers.filter(supplier => supplier.featured);

  return (
    <div className="animate-fadeIn">
      <h1 className="page-title">Fornecedores</h1>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Buscar fornecedores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex-shrink-0">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {featuredSuppliers.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <ShoppingBag className="h-5 w-5 text-blue-500 mr-2" />
            <h2 className="text-xl font-medium text-gray-900">Fornecedores em Destaque</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredSuppliers.map(supplier => (
              <div key={supplier.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <img 
                      src={supplier.logo} 
                      alt={supplier.name} 
                      className="w-16 h-16 object-cover rounded-full mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{supplier.name}</h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {categories.find(c => c.id === supplier.category)?.name}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4">{supplier.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <span>{supplier.phone}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Globe className="h-4 w-4 text-gray-400 mr-2" />
                      <a 
                        href={supplier.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {supplier.website.replace('https://', '')}
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 bg-gray-50 px-6 py-3">
                  <a 
                    href={`https://wa.me/${supplier.whatsapp}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center w-full text-sm font-medium text-white bg-green-600 py-2 px-4 rounded-md hover:bg-green-700"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Contatar via WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <ShoppingBag className="h-5 w-5 text-gray-500 mr-2" />
          <h2 className="text-xl font-medium text-gray-900">
            {selectedCategory === 'all' 
              ? 'Todos os Fornecedores' 
              : `Fornecedores de ${categories.find(c => c.id === selectedCategory)?.name}`}
          </h2>
        </div>
        
        {filteredSuppliers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuppliers
              .filter(supplier => !supplier.featured || selectedCategory !== 'all')
              .map(supplier => (
                <div key={supplier.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <img 
                        src={supplier.logo} 
                        alt={supplier.name} 
                        className="w-16 h-16 object-cover rounded-full mr-4"
                      />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{supplier.name}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {categories.find(c => c.id === supplier.category)?.name}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">{supplier.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{supplier.phone}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Globe className="h-4 w-4 text-gray-400 mr-2" />
                        <a 
                          href={supplier.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {supplier.website.replace('https://', '')}
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 bg-gray-50 px-6 py-3">
                    <a 
                      href={`https://wa.me/${supplier.whatsapp}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center justify-center w-full text-sm font-medium text-white bg-green-600 py-2 px-4 rounded-md hover:bg-green-700"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contatar via WhatsApp
                    </a>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum fornecedor encontrado</h3>
            <p className="text-gray-500">
              Tente ajustar seus filtros ou busque por outro termo.
            </p>
          </div>
        )}
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-2">Quer se tornar um fornecedor em destaque?</h3>
        <p className="text-sm text-blue-700 mb-4">
          Divulgue seus produtos e serviços para milhares de restaurantes e aumente suas vendas.
        </p>
        <button className="bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700">
          Saiba mais
        </button>
      </div>
    </div>
  );
};