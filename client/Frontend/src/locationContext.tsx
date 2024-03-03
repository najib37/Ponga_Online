import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LocationContextProps {
  location: string;
  setLocationData: (newLocation: string) => void;
}

const LocationContext = createContext<LocationContextProps | undefined>(
  undefined,
);

interface LocationProviderProps {
  children: ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({
  children,
}) => {
  const [location, setLocation] = useState('');

  const setLocationData = (newLocation: string) => {
    setLocation(newLocation);
  };

  return (
    <LocationContext.Provider value={{ location, setLocationData }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = (): LocationContextProps => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error(
      'useLocationContext must be used within a LocationProvider',
    );
  }
  return context;
};
