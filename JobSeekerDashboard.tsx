import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApplications } from '../contexts/ApplicationsContext';
import { User, MapPin, Briefcase, Clock, Send, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const JobSeekerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { applications, deleteApplication } = useApplications();

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'immediate':
        return 'Imediata';
      case '15days':
        return 'Em 15 dias';
      case '30days':
        return 'Em 30 dias';
      default:
        return availability;
    }
  };

  const getDaysRemaining = (expiresAt: string) => {
    const today = new Date();
    const expiration = new Date(expiresAt);
    const diffTime = Math.abs(expiration.getTime() - today.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleDeleteApplication = async (id: string) => {
    try {
      await deleteApplication(id);
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
          <p className="mt-1 text-sm text-gray-600">
            Painel do Candidato
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center mb-6">
            <User className="h-5 w-5 text-orange-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Meu Perfil</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-2" />
              <span>São Paulo, SP</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Briefcase className="h-5 w-5 mr-2" />
              <span>Cozinheiro</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-5 w-5 mr-2" />
              <span>Disponibilidade Imediata</span>
            </div>
          </div>

          <div className="mt-6">
            <Link to="/jobseeker/profile" className="btn btn-primary w-full">
              Atualizar Currículo
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Send className="h-5 w-5 text-orange-500 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Minhas Candidaturas</h2>
            </div>
            <Link to="/jobseeker/availability" className="btn btn-secondary">
              Nova Candidatura
            </Link>
          </div>

          {applications.length > 0 ? (
            <div className="space-y-4">
              {applications.map(application => (
                <div 
                  key={application.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-orange-200 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center text-gray-900 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="font-medium">{application.city}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {application.desiredRoles.map(role => (
                          <span
                            key={role}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {role}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        Disponibilidade {getAvailabilityText(application.availability)}
                      </div>

                      {application.observations && (
                        <p className="mt-2 text-sm text-gray-600">
                          {application.observations}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteApplication(application.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      Criada em {new Date(application.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                    <span className="text-xs font-medium text-orange-600">
                      Expira em {getDaysRemaining(application.expiresAt)} dias
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma candidatura ativa</h3>
              <p className="text-gray-500 mb-4">
                Crie uma nova candidatura para que os restaurantes possam encontrar você.
              </p>
              <Link to="/jobseeker/availability" className="btn btn-primary">
                Criar Candidatura
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};