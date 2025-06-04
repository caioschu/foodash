import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

type CardProps = {
  title: string;
  icon: React.ReactNode;
  value: string;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  subtitle: string;
  link: string;
};

export const Card: React.FC<CardProps> = ({
  title,
  icon,
  value,
  trend,
  trendType = 'neutral',
  subtitle,
  link,
}) => {
  const trendColor = 
    trendType === 'positive' ? 'text-green-500' : 
    trendType === 'negative' ? 'text-red-500' : 
    'text-gray-500';

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {icon}
            <h3 className="text-lg font-medium ml-2">{title}</h3>
          </div>
        </div>
        <div className="mb-1">
          <div className="flex items-end">
            <span className="text-2xl font-bold">{value}</span>
            {trend && (
              <span className={`ml-2 text-sm ${trendColor}`}>
                {trend}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
      <Link 
        to={link}
        className="flex items-center justify-between px-6 py-3 bg-gray-50 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-150"
      >
        <span>Ver detalhes</span>
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
};