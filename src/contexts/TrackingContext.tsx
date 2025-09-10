import { createContext, useContext, useState, type ReactNode } from 'react';

interface TrackingContextType {
  isTraining: boolean;
  currentTrainingId: number | null;
  startTraining: (trainingId: number) => void;
  stopTraining: () => void;
}

const TrackingContext = createContext<TrackingContextType | undefined>(undefined);

export const TrackingProvider = ({ children }: { children: ReactNode }) => {
  const [isTraining, setIsTraining] = useState(false);
  const [currentTrainingId, setCurrentTrainingId] = useState<number | null>(null);

  const startTraining = (trainingId: number) => {
    setIsTraining(true);
    setCurrentTrainingId(trainingId);
  };

  const stopTraining = () => {
    setIsTraining(false);
    setCurrentTrainingId(null);
  };

  return (
    <TrackingContext.Provider 
      value={{ 
        isTraining, 
        currentTrainingId, 
        startTraining, 
        stopTraining 
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
};

export const useTracking = () => {
  const context = useContext(TrackingContext);
  if (!context) {
    throw new Error('useTracking must be used within TrackingProvider');
  }
  return context;
};