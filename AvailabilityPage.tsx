import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useApplications } from '../contexts/ApplicationsContext';
import { Send, MapPin, Briefcase, Check, X } from 'lucide-react';

const jobCategories = [
  {
    name: 'Cozinha',
    roles: [
      'Chef de Cozinha',
      'Sous Chef',
      'Chef de Partida',
      'Cozinheiro(a)',
      'Auxiliar de Cozinha',
      'Confeiteiro(a)',
      'Padeiro(a)',
      'Sushiman',
      'Pizzaiolo(a)'
    ]
  },
  {
    name: 'Salão',
    roles: [
      'Maître',
      'Gerente de Salão',
      'Garçom/Garçonete',
      'Sommelier',
      'Hostess',
      'Barista',
      'Bartender',
      'Cumim'
    ]
  },
  {
    name: 'Administrativo',
    roles: [
      'Gerente Geral',
      'Gerente Administrativo',
      'Supervisor(a)',
      'Coordenador(a)',
      'Assistente Administrativo',
      'Comprador(a)',
      'Financeiro',
      'RH'
    ]
  },
  {
    name: 'Delivery',
    roles: [
      'Atendente de Delivery',
      'Motoboy/Motogirl',
      'Entregador(a)',
      'Coordenador(a) de Delivery'
    ]
  },
  {
    name: 'Outros',
    roles: [
      'Auxiliar de Limpeza',
      'Auxiliar de Serviços Gerais',
      'Estoquista',
      'Segurança',
      'Manobrista'
    ]
  }
];

const cities = [
  'São Paulo, SP',
  'Rio de Janeiro, RJ',
  'Belo Horizonte, MG',
  'Curitiba, PR',
  'Porto Alegre, RS',
  'Salvador, BA',
  'Recife, PE',
  'Fortaleza, CE',
  'Brasília, DF',
  'Manaus, AM'
];

export const AvailabilityPage: React.FC = () => {
  const { user } = useAuth();
  const { addApplication } = useApplications();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Cozinha');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    city: '',
    desiredRoles: [] as string[],
    availability: 'immediate',
    observations: ''
  });

  const availabilityOptions = [
    { value: 'immediate', label: 'Imediata' },
    { value: '15days', label: 'Em 15 dias' },
    { value: '30days', label: 'Em 30 dias' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    setIsSubmitting(true);

    if (!formData.city) {
      setErrorMessage('Por favor, selecione sua cidade');
      setIsSubmitting(false);
      return;
    }

    if (formData.desiredRoles.length === 0) {
      setErrorMessage('Por favor, selecione pelo menos um cargo de interesse');
      setIsSubmitting(false);
      return;
    }

    try {
      await addApplication(formData);
      
      setSuccessMessage('Candidatura enviada com sucesso! Os restaurantes poderão ver seu perfil pelos próximos 20 dias.');
      
      setTimeout(() => {
        navigate('/jobseeker');
      }, 2000);
    } catch (error) {
      setErrorMessage('Erro ao enviar candidatura. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidata-se</h1>
          <p className="mt-1 text-sm text-gray-600">
            Informe sua disponibilidade para que os restaurantes possam encontrar você
          </p>
        </div>
      </div>

      {successMessage && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <div className="flex items-center mb-6">
            <MapPin className="h-5 w-5 text-orange-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Localização</h2>
          </div>

          <div>
            <label htmlFor="city" className="label">Cidade*</label>
            <select
              id="city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="input"
              required
            >
              <option value="">Selecione sua cidade</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center mb-6">
            <Briefcase className="h-5 w-5 text-orange-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Cargos de Interesse</h2>
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap gap-2 mb-4">
              {jobCategories.map(category => (
                <button
                  key={category.name}
                  type="button"
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.name
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {jobCategories
                .find(cat => cat.name === selectedCategory)
                ?.roles.map(role => (
                  <label
                    key={role}
                    className={`relative flex items-center p-4 rounded-lg cursor-pointer ${
                      formData.desiredRoles.includes(role)
                        ? 'bg-orange-50 border-2 border-orange-500'
                        : 'bg-white border border-gray-200 hover:border-orange-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={formData.desiredRoles.includes(role)}
                      onChange={(e) => {
                        const newRoles = e.target.checked
                          ? [...formData.desiredRoles, role]
                          : formData.desiredRoles.filter(r => r !== role);
                        setFormData({ ...formData, desiredRoles: newRoles });
                      }}
                    />
                    <span className={`text-sm ${
                      formData.desiredRoles.includes(role)
                        ? 'font-medium text-orange-700'
                        : 'text-gray-700'
                    }`}>
                      {role}
                    </span>
                  </label>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center mb-6">
            <Send className="h-5 w-5 text-orange-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Disponibilidade</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="availability" className="label">Disponibilidade para início*</label>
              <select
                id="availability"
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                className="input"
                required
              >
                {availabilityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="observations" className="label">Observações adicionais</label>
              <textarea
                id="observations"
                value={formData.observations}
                onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                className="input"
                rows={4}
                placeholder="Informações adicionais sobre sua disponibilidade..."
              />
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                <strong>Importante:</strong> Sua candidatura ficará disponível para os restaurantes por 20 dias. 
                Após esse período, você precisará renovar sua disponibilidade.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/jobseeker')}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enviando...
              </span>
            ) : (
              'Enviar Candidatura'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};