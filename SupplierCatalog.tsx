import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Package, Search, Plus, Edit2, Trash2, Upload, X } from 'lucide-react';

type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  minOrder: number;
  image: string;
  sku: string;
  brand: string;
  stock: number;
  weight: number;
  weightUnit: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  tags: string[];
};

type NewProduct = Omit<Product, 'id'>;

const initialProductState: NewProduct = {
  name: '',
  description: '',
  category: '',
  price: 0,
  unit: '',
  minOrder: 1,
  image: '',
  sku: '',
  brand: '',
  stock: 0,
  weight: 0,
  weightUnit: 'kg',
  dimensions: {
    length: 0,
    width: 0,
    height: 0
  },
  tags: []
};

export const SupplierCatalog: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState<NewProduct>(initialProductState);
  const [newTag, setNewTag] = useState('');

  // Mock data - seria substituído por dados reais da API
  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'Arroz Branco Premium',
      description: 'Arroz branco tipo 1, grãos longos e selecionados',
      category: 'Alimentos',
      price: 89.90,
      unit: 'Fardo 30kg',
      minOrder: 2,
      image: 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=300',
      sku: 'ARZ-001',
      brand: 'Premium Foods',
      stock: 50,
      weight: 30,
      weightUnit: 'kg',
      dimensions: {
        length: 60,
        width: 40,
        height: 15
      },
      tags: ['arroz', 'grãos', 'básico']
    },
    {
      id: '2',
      name: 'Óleo de Soja Refinado',
      description: 'Óleo de soja refinado, ideal para frituras',
      category: 'Alimentos',
      price: 159.90,
      unit: 'Caixa 20L',
      minOrder: 1,
      image: 'https://images.pexels.com/photos/4033325/pexels-photo-4033325.jpeg?auto=compress&cs=tinysrgb&w=300',
      sku: 'OLE-001',
      brand: 'Premium Foods',
      stock: 30,
      weight: 20,
      weightUnit: 'l',
      dimensions: {
        length: 40,
        width: 30,
        height: 20
      },
      tags: ['óleo', 'fritura', 'básico']
    },
    {
      id: '3',
      name: 'Embalagem Delivery M',
      description: 'Embalagem biodegradável para delivery, tamanho médio',
      category: 'Embalagens',
      price: 89.90,
      unit: 'Caixa 100un',
      minOrder: 5,
      image: 'https://images.pexels.com/photos/4255489/pexels-photo-4255489.jpeg?auto=compress&cs=tinysrgb&w=300',
      sku: 'EMB-001',
      brand: 'EcoPack',
      stock: 100,
      weight: 5,
      weightUnit: 'kg',
      dimensions: {
        length: 50,
        width: 30,
        height: 40
      },
      tags: ['embalagem', 'delivery', 'sustentável']
    }
  ]);

  const categories = ['Alimentos', 'Bebidas', 'Embalagens', 'Equipamentos', 'Utensílios', 'Limpeza'];
  const units = ['Unidade', 'Caixa', 'Pacote', 'Fardo', 'Kg', 'L', 'ml', 'g'];
  const weightUnits = ['kg', 'g', 'l', 'ml'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (!newProduct.tags.includes(newTag.trim())) {
        setNewProduct({
          ...newProduct,
          tags: [...newProduct.tags, newTag.trim()]
        });
      }
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewProduct({
      ...newProduct,
      tags: newProduct.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você enviaria os dados para a API
    console.log('Novo produto:', newProduct);
    setShowAddProduct(false);
    setNewProduct(initialProductState);
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Catálogo de Produtos</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gerencie seus produtos e preços
          </p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddProduct(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Produto
        </button>
      </div>

      <div className="card mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          
          <div className="flex gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input"
            >
              <option value="all">Todas as categorias</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="card hover:shadow-lg transition-shadow">
            <div className="aspect-w-16 aspect-h-9 mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="rounded-lg object-cover w-full h-48"
              />
            </div>
            
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    {product.category}
                  </span>
                  <span className="text-xs text-gray-500">SKU: {product.sku}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="text-gray-400 hover:text-orange-500">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button className="text-gray-400 hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-4">{product.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Marca:</span>
                <span className="font-medium">{product.brand}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Estoque:</span>
                <span className="font-medium">{product.stock} {product.unit}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Peso:</span>
                <span className="font-medium">{product.weight}{product.weightUnit}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {product.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-gray-500">Preço por {product.unit}</p>
                <p className="text-xl font-bold text-gray-900">
                  R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Pedido mínimo</p>
                <p className="text-sm font-medium text-gray-900">{product.minOrder} {product.unit}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum produto encontrado</h3>
          <p className="text-gray-500">
            Tente ajustar seus filtros ou busque por outro termo.
          </p>
        </div>
      )}

      {/* Modal de Adicionar Produto */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-3xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Adicionar Novo Produto</h2>
              <button
                onClick={() => setShowAddProduct(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="label">Nome do Produto*</label>
                  <input
                    type="text"
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="label">Categoria*</label>
                  <select
                    id="category"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="input"
                    required
                  >
                    <option value="">Selecione...</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="description" className="label">Descrição*</label>
                  <textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="input"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="sku" className="label">SKU*</label>
                  <input
                    type="text"
                    id="sku"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="brand" className="label">Marca*</label>
                  <input
                    type="text"
                    id="brand"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="price" className="label">Preço*</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">R$</span>
                    <input
                      type="number"
                      id="price"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                      className="input pl-8"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="unit" className="label">Unidade de Venda*</label>
                  <select
                    id="unit"
                    value={newProduct.unit}
                    onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                    className="input"
                    required
                  >
                    <option value="">Selecione...</option>
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="minOrder" className="label">Pedido Mínimo*</label>
                  <input
                    type="number"
                    id="minOrder"
                    value={newProduct.minOrder}
                    onChange={(e) => setNewProduct({ ...newProduct, minOrder: Number(e.target.value) })}
                    className="input"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="stock" className="label">Estoque*</label>
                  <input
                    type="number"
                    id="stock"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                    className="input"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="weight" className="label">Peso*</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      id="weight"
                      value={newProduct.weight}
                      onChange={(e) => setNewProduct({ ...newProduct, weight: Number(e.target.value) })}
                      className="input flex-1"
                      min="0"
                      step="0.01"
                      required
                    />
                    <select
                      value={newProduct.weightUnit}
                      onChange={(e) => setNewProduct({ ...newProduct, weightUnit: e.target.value })}
                      className="input w-24"
                    >
                      {weightUnits.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="label">Dimensões (cm)*</label>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="length" className="text-xs text-gray-500">Comprimento</label>
                      <input
                        type="number"
                        id="length"
                        value={newProduct.dimensions.length}
                        onChange={(e) => setNewProduct({
                          ...newProduct,
                          dimensions: {
                            ...newProduct.dimensions,
                            length: Number(e.target.value)
                          }
                        })}
                        className="input"
                        min="0"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="width" className="text-xs text-gray-500">Largura</label>
                      <input
                        type="number"
                        id="width"
                        value={newProduct.dimensions.width}
                        onChange={(e) => setNewProduct({
                          ...newProduct,
                          dimensions: {
                            ...newProduct.dimensions,
                            width: Number(e.target.value)
                          }
                        })}
                        className="input"
                        min="0"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="height" className="text-xs text-gray-500">Altura</label>
                      <input
                        type="number"
                        id="height"
                        value={newProduct.dimensions.height}
                        onChange={(e) => setNewProduct({
                          ...newProduct,
                          dimensions: {
                            ...newProduct.dimensions,
                            height: Number(e.target.value)
                          }
                        })}
                        className="input"
                        min="0"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="label">Imagem do Produto*</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="image-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-orange-600 hover:text-orange-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-orange-500"
                        >
                          <span>Fazer upload de arquivo</span>
                          <input id="image-upload" name="image-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">ou arraste e solte</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG até 10MB</p>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="label">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newProduct.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-gray-400 hover:text-gray-500"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="Digite uma tag e pressione Enter"
                    className="input"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddProduct(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Salvar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};