import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChefHat, Truck, Briefcase, ChevronsLeft } from 'lucide-react';
import { useAuth, UserType } from '../contexts/AuthContext';

export const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [userType, setUserType] = useState<UserType>('restaurant'); // Pre-selected as restaurant
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      return setError('As senhas não coincidem.');
    }
    
    if ((userType === 'restaurant' || userType === 'supplier') && !businessName) {
      return setError(`Por favor, informe o nome ${userType === 'restaurant' ? 'do restaurante' : 'da empresa'}.`);
    }
    
    setIsLoading(true);

    try {
      await register(email, password, name, userType, businessName);
      
      switch (userType) {
        case 'restaurant':
          navigate('/profile');
          break;
        case 'supplier':
          navigate('/supplier/profile');
          break;
        case 'jobseeker':
          navigate('/jobseeker');
          break;
      }
    } catch (err) {
      setError('Falha no cadastro. Tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <ChevronsLeft className="h-12 w-12 text-orange-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Crie sua conta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Escolha seu perfil e comece a usar a plataforma
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-4">
                Selecione seu perfil
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setUserType('restaurant')}
                  className={`p-6 border-2 rounded-xl text-center transition-all duration-200 ${
                    userType === 'restaurant'
                      ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-lg shadow-orange-100'
                      : 'border-gray-200 hover:border-orange-200 hover:bg-orange-50'
                  }`}
                >
                  <ChefHat className="h-8 w-8 mx-auto mb-3 text-orange-500" />
                  <span className="block text-sm font-medium">Restaurante</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setUserType('supplier')}
                  className={`p-6 border-2 rounded-xl text-center transition-all duration-200 ${
                    userType === 'supplier'
                      ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-lg shadow-orange-100'
                      : 'border-gray-200 hover:border-orange-200 hover:bg-orange-50'
                  }`}
                >
                  <Truck className="h-8 w-8 mx-auto mb-3 text-orange-500" />
                  <span className="block text-sm font-medium">Fornecedor</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setUserType('jobseeker')}
                  className={`p-6 border-2 rounded-xl text-center transition-all duration-200 ${
                    userType === 'jobseeker'
                      ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-lg shadow-orange-100'
                      : 'border-gray-200 hover:border-orange-200 hover:bg-orange-50'
                  }`}
                >
                  <Briefcase className="h-8 w-8 mx-auto mb-3 text-orange-500" />
                  <span className="block text-sm font-medium">Busco Emprego</span>
                </button>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="name" className="label">
                Seu Nome
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="Digite seu nome completo"
              />
            </div>

            {(userType === 'restaurant' || userType === 'supplier') && (
              <div className="input-group">
                <label htmlFor="businessName" className="label">
                  {userType === 'restaurant' ? 'Nome do Restaurante' : 'Nome da Empresa'}
                </label>
                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="input"
                  placeholder={`Digite o nome ${userType === 'restaurant' ? 'do restaurante' : 'da empresa'}`}
                />
              </div>
            )}

            <div className="input-group">
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="Digite seu email"
              />
            </div>

            <div className="input-group">
              <label htmlFor="password" className="label">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Digite sua senha"
              />
            </div>

            <div className="input-group">
              <label htmlFor="confirmPassword" className="label">
                Confirme a Senha
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input"
                placeholder="Digite a senha novamente"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Registrando...
                  </span>
                ) : (
                  'Registrar'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <p className="text-center text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link to="/login" className="font-medium text-orange-600 hover:text-orange-500">
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};