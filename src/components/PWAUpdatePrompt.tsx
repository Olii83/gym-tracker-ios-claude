import { useState, useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import Button from './Button';
import { Download, X } from 'lucide-react';

const PWAUpdatePrompt = () => {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered:', r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  useEffect(() => {
    if (needRefresh) {
      setShowUpdatePrompt(true);
    }
  }, [needRefresh]);

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
    setShowUpdatePrompt(false);
  };

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  if (!showUpdatePrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <Download className="text-blue-500 flex-shrink-0" size={24} />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Update verfügbar
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Eine neue Version der App ist verfügbar.
              </p>
            </div>
          </div>
          <button 
            onClick={close}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-2"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex space-x-2 mt-4">
          <Button 
            onClick={handleUpdate}
            variant="primary"
            className="flex-1"
          >
            Jetzt aktualisieren
          </Button>
          <Button 
            onClick={close}
            variant="secondary"
            className="flex-1"
          >
            Später
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PWAUpdatePrompt;