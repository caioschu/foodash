import React, { createContext, useContext, useState } from 'react';

export type Application = {
  id: string;
  city: string;
  desiredRoles: string[];
  availability: string;
  observations?: string;
  createdAt: string;
  expiresAt: string;
};

type ApplicationsContextType = {
  applications: Application[];
  addApplication: (application: Omit<Application, 'id' | 'createdAt' | 'expiresAt'>) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
};

const ApplicationsContext = createContext<ApplicationsContextType | undefined>(undefined);

export const useApplications = () => {
  const context = useContext(ApplicationsContext);
  if (context === undefined) {
    throw new Error('useApplications must be used within an ApplicationsProvider');
  }
  return context;
};

export const ApplicationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<Application[]>([]);

  const addApplication = async (newApplication: Omit<Application, 'id' | 'createdAt' | 'expiresAt'>) => {
    // Create expiration date (20 days from now)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 20);

    const application: Application = {
      id: Date.now().toString(),
      ...newApplication,
      createdAt: new Date().toISOString(),
      expiresAt: expirationDate.toISOString()
    };

    setApplications(prev => [...prev, application]);
  };

  const deleteApplication = async (id: string) => {
    setApplications(prev => prev.filter(app => app.id !== id));
  };

  return (
    <ApplicationsContext.Provider value={{ applications, addApplication, deleteApplication }}>
      {children}
    </ApplicationsContext.Provider>
  );
};