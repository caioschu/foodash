import React from 'react';
import { CreditCard, Check, X } from 'lucide-react';

export const SubscriptionPlans: React.FC = () => {
  const plans = [
    {
      name: 'Mensal',
      price: 299.90,
      period: '/mês',
      highlight: false,
      features: [
        { text: 'Catálogo de produtos ilimitado', included: true },
        { text: 'Suporte por email', included: true },
        { text: 'Acesso aos restaurantes disponíveis', included: false, important: true },
        { text: 'Suporte prioritário', included: false },
        { text: 'Consultoria personalizada', included: false }
      ]
    },
    {
      name: 'Semestral',
      price: 249.90,
      period: '/mês',
      highlight: true,
      savings: '16%',
      features: [
        { text: 'Catálogo de produtos ilimitado', included: true },
        { text: 'Suporte por email', included: true },
        { text: 'Acesso aos restaurantes disponíveis', included: true, important: true },
        { text: 'Suporte prioritário', included: true },
        { text: 'Consultoria personalizada', included: false }
      ]
    },
    {
      name: 'Anual',
      price: 199.90,
      period: '/mês',
      highlight: false,
      savings: '33%',
      bestPrice: true,
      features: [
        { text: 'Catálogo de produtos ilimitado', included: true },
        { text: 'Suporte por email', included: true },
        { text: 'Acesso aos restaurantes disponíveis', included: true, important: true },
        { text: 'Suporte prioritário', included: true },
        { text: 'Consultoria personalizada', included: true }
      ]
    }
  ];

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Planos e Preços</h1>
          <p className="mt-1 text-sm text-gray-600">
            Escolha o melhor plano para o seu negócio
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-lg p-6 ${
              plan.highlight 
                ? 'bg-orange-50 border-2 border-orange-500 relative' 
                : 'bg-white border border-gray-200'
            }`}
          >
            {plan.highlight && (
              <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Mais Popular
              </span>
            )}
            
            {plan.bestPrice && (
              <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Melhor Preço
              </span>
            )}

            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
              
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">
                  R$ {plan.price.toFixed(2)}
                </span>
                <span className="text-gray-500">{plan.period}</span>
              </div>

              {plan.savings && (
                <span className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Economia de {plan.savings}
                </span>
              )}
            </div>

            <ul className="mt-6 space-y-4">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  {feature.included ? (
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0 mr-2" />
                  ) : (
                    <X className="h-5 w-5 text-red-500 flex-shrink-0 mr-2" />
                  )}
                  <span className={`${
                    feature.included ? 'text-gray-600' : 'text-gray-400'
                  } ${feature.important ? 'font-medium' : ''}`}>
                    {feature.text}
                    {feature.important && !feature.included && (
                      <span className="block text-xs text-red-500 mt-0.5">
                        Disponível apenas nos planos semestral e anual
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>

            <button className={`mt-8 w-full py-2 px-4 rounded-lg text-center font-medium ${
              plan.highlight 
                ? 'bg-orange-500 text-white hover:bg-orange-600' 
                : 'bg-white text-orange-600 border border-orange-500 hover:bg-orange-50'
            }`}>
              Assinar Agora
            </button>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <CreditCard className="h-5 w-5 text-orange-500 mr-2" />
          <h2 className="text-lg font-medium text-gray-900">Informações Importantes</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Formas de Pagamento</h3>
            <p>Aceitamos cartões de crédito, boleto bancário e PIX.</p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Política de Cancelamento</h3>
            <p>Cancele a qualquer momento sem multa ou fidelidade.</p>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Suporte</h3>
            <p>Atendimento especializado para ajudar no seu negócio.</p>
          </div>
        </div>
      </div>
    </div>
  );
};