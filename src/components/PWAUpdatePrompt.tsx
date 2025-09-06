import { useState, useEffect } from 'react';
import Button from './Button';
import { Download, X, RefreshCw } from 'lucide-react';

const PWAUpdatePrompt = () => {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      let refreshing = false;

      // Listen for controlling service worker change
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });

      // Listen for waiting service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SKIP_WAITING') {
          setShowUpdatePrompt(true);
          setUpdateAvailable(true);
        }
      });

      // Check for updates when app starts
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration && registration.waiting) {
          setShowUpdatePrompt(true);
          setUpdateAvailable(true);
        }

        if (registration) {
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setShowUpdatePrompt(true);
                  setUpdateAvailable(true);
                }
              });
            }
          });
        }
      });

      // Check for updates periodically (every 5 minutes)
      const checkForUpdates = () => {
        navigator.serviceWorker.getRegistration().then((registration) => {
          if (registration) {
            registration.update();
          }
        });
      };

      const interval = setInterval(checkForUpdates, 5 * 60 * 1000);
      
      return () => clearInterval(interval);
    }
  }, []);

  const close = () => {
    setShowUpdatePrompt(false);
  };

  const handleUpdate = () => {
    navigator.serviceWorker.getRegistration().then((registration) => {
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      } else {
        window.location.reload();
      }
    });
  };

  if (!showUpdatePrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-sm mx-auto">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="text-blue-500 flex-shrink-0">
              {updateAvailable ? <Download size={24} /> : <RefreshCw size={24} />}
            </div>
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