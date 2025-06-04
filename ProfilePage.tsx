import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, MapPin, Clock, Briefcase, GraduationCap, Plus, X, Check } from 'lucide-react';

// Brazilian states
const states = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' }
];

// Cities by state
const citiesByState: { [key: string]: string[] } = {
  SP: ['São Paulo', 'Campinas', 'Santos', 'Ribeirão Preto', 'São José dos Campos', 'Sorocaba'],
  RJ: ['Rio de Janeiro', 'Niterói', 'São Gonçalo', 'Duque de Caxias', 'Nova Iguaçu'],
  MG: ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim'],
  RS: ['Porto Alegre', 'Caxias do Sul', 'Canoas', 'Pelotas', 'Santa Maria'],
  PR: ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel'],
  BA: ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari', 'Itabuna'],
  // Add more states and cities as needed
};

// Restaurant job roles
const jobRoles = [
  // Cozinha
  { category: 'Cozinha', roles: [
    'Chef de Cozinha',
    'Sous Chef',
    'Chef de Partida',
    'Cozinheiro(a)',
    'Auxiliar de Cozinha',
    'Confeiteiro(a)',
    'Padeiro(a)',
    'Sushiman',
    'Pizzaiolo(a)'
  ]},
  // Salão
  { category: 'Salão', roles: [
    'Maître',
    'Gerente de Salão',
    'Garçom/Garçonete',
    'Sommelier',
    'Hostess',
    'Barista',
    'Bartender',
    'Cumim'
  ]},
  // Administrativo
  { category: 'Administrativo', roles: [
    'Gerente Geral',
    'Gerente Administrativo',
    'Supervisor(a)',
    'Coordenador(a)',
    'Assistente Administrativo',
    'Comprador(a)',
    'Financeiro',
    'RH'
  ]},
  // Delivery
  { category: 'Delivery', roles: [
    'Atendente de Delivery',
    'Motoboy/Motogirl',
    'Entregador(a)',
    'Coordenador(a) de Delivery'
  ]},
  // Outros
  { category: 'Outros', roles: [
    'Auxiliar de Limpeza',
    'Auxiliar de Serviços Gerais',
    'Estoquista',
    'Segurança',
    'Manobrista'
  ]}
];

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Job seeker form states
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    whatsapp: '',
    city: '',
    state: '',
    desiredRoles: [] as string[],
    availability: 'immediate', // immediate, 15days, 30days, negotiable
    experienceYears: '',
    education: '',
    skills: [] as string[],
    experiences: [
      { company: '', role: '', period: '', description: '' }
    ],
    about: ''
  });

  const [newSkill, setNewSkill] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Cozinha');

  const availabilityOptions = [
    { value: 'immediate', label: 'Imediata' },
    { value: '15days', label: 'Em 15 dias' },
    { value: '30days', label: 'Em 30 dias' },
    { value: 'negotiable', label: 'A negociar' }
  ];

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(newSkill.trim())) {
        setFormData({
          ...formData,
          skills: [...formData.skills, newSkill.trim()]
        });
      }
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const toggleRole = (role: string) => {
    setFormData({
      ...formData,
      desiredRoles: formData.desiredRoles.includes(role)
        ? formData.desiredRoles.filter(r => r !== role)
        : [...formData.desiredRoles, role]
    });
  };

  const addExperience = () => {
    setFormData({
      ...formData,
      experiences: [
        ...formData.experiences,
        { company: '', role: '', period: '', description: '' }
      ]
    });
  };

  const removeExperience = (index: number) => {
    setFormData({
      ...formData,
      experiences: formData.experiences.filter((_, i) => i !== index)
    });
  };

  const updateExperience = (index: number, field: string, value: string) => {
    setFormData({
      ...formData,
      experiences: formData.experiences.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    });
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    setFormData({
      ...formData,
      state: newState,
      city: '' // Reset city when state changes
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // Here you would typically make an API call to save the profile
      // For now, we'll simulate a successful save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      setSuccessMessage('Perfil atualizado com sucesso!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      setErrorMessage('Erro ao salvar o perfil. Por favor, tente novamente.');
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meu Currículo</h1>
          <p className="mt-1 text-sm text-gray-600">
            Complete seu perfil para aumentar suas chances de conseguir uma vaga
          </p>
        </div>
        <div className="flex space-x-3">
          <button type="button" className="btn btn-secondary">
            Cancelar
          </button>
          <button type="submit" form="profile-form" className="btn btn-primary">
            Salvar Perfil
          </button>
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

      <form id="profile-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="card">
          <div className="flex items-center mb-6">
            <User className="h-5 w-5 text-orange-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Informações Pessoais</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="label">Nome Completo</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              <label htmlFor="phone" className="label">Telefone</label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input"
                placeholder="(00) 0000-0000"
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
                placeholder="(00) 00000-0000"
              />
            </div>

            <div>
              <label htmlFor="state" className="label">Estado</label>
              <select
                id="state"
                value={formData.state}
                onChange={handleStateChange}
                className="input"
                required
              >
                <option value="">Selecione o estado</option>
                {states.map(state => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="city" className="label">Cidade</label>
              <select
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="input"
                required
                disabled={!formData.state}
              >
                <option value="">
                  {formData.state ? 'Selecione a cidade' : 'Selecione um estado primeiro'}
                </option>
                {formData.state && citiesByState[formData.state]?.map(city => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center mb-6">
            <Briefcase className="h-5 w-5 text-orange-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Cargos Desejados</h2>
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {jobRoles.map(category => (
                <button
                  key={category.category}
                  type="button"
                  onClick={() => setSelectedCategory(category.category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.category
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {category.category}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {jobRoles.find(cat => cat.category === selectedCategory)?.roles.map(role => (
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
                    onChange={() => toggleRole(role)}
                  />
                  <span className={`text-sm ${
                    formData.desiredRoles.includes(role)
                      ? 'font-medium text-orange-700'
                      : 'text-gray-700'
                  }`}>
                    {role}
                  </span>
                  {formData.desiredRoles.includes(role) && (
                    <Check className="absolute top-2 right-2 h-4 w-4 text-orange-500" />
                  )}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="availability" className="label">Disponibilidade</label>
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
              <label htmlFor="experienceYears" className="label">Anos de Experiência</label>
              <input
                type="number"
                id="experienceYears"
                value={formData.experienceYears}
                onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                className="input"
                min="0"
                required
              />
            </div>

            <div>
              <label htmlFor="education" className="label">Formação</label>
              <input
                type="text"
                id="education"
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                className="input"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Habilidades</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.skills.map(skill => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-orange-100 text-orange-800"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1.5 text-orange-600 hover:text-orange-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="Digite uma habilidade e pressione Enter"
                className="input"
              />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <GraduationCap className="h-5 w-5 text-orange-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Experiências Profissionais</h2>
            </div>
            <button
              type="button"
              onClick={addExperience}
              className="btn btn-secondary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Experiência
            </button>
          </div>

          <div className="space-y-6">
            {formData.experiences.map((exp, index) => (
              <div key={index} className="relative border border-gray-200 rounded-lg p-4">
                <button
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Empresa</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">Cargo</label>
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => updateExperience(index, 'role', e.target.value)}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label className="label">Período</label>
                    <input
                      type="text"
                      value={exp.period}
                      onChange={(e) => updateExperience(index, 'period', e.target.value)}
                      className="input"
                      placeholder="Ex: Jan 2020 - Dez 2022"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="label">Descrição das Atividades</label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(index, 'description', e.target.value)}
                      className="input"
                      rows={3}
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center mb-4">
            <User className="h-5 w-5 text-orange-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Sobre Mim</h2>
          </div>

          <textarea
            value={formData.about}
            onChange={(e) => setFormData({ ...formData, about: e.target.value })}
            className="input"
            rows={4}
            placeholder="Fale um pouco sobre você, suas experiências e objetivos profissionais..."
            required
          />
        </div>
      </form>
    </div>
  );
};