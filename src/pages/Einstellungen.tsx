import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import SettingsItem from '../components/SettingsItem';
import Button from '../components/Button';
import Modal from '../components/Modal';
import ProfileManagementForm from '../components/ProfileManagementForm';
import { Weight, Moon, Sun, Download, LogOut, User } from 'lucide-react';

const Einstellungen = () => {
  const { signOut } = useAuth();
  const { profile, updateProfile } = useData();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // For now, dark mode is just a visual toggle, not functional
  const isDarkMode = true;

  const handleUnitChange = (unit: 'kg' | 'lb') => {
    if (profile) {
      updateProfile({ ...profile, unit });
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold text-white">Einstellungen</h1>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-red-500 mb-3">Profil</h2>
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <SettingsItem
            icon={<User className="text-gray-400" />}
            label="Profil verwalten"
            description="Name, E-Mail und Passwort ändern"
            action={
              <Button 
                variant="secondary" 
                onClick={() => setIsProfileModalOpen(true)}
                className="px-3 py-1 text-sm"
              >
                Bearbeiten
              </Button>
            }
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-red-500 mb-3">Allgemein</h2>
        <div className="bg-gray-900 rounded-lg overflow-hidden divide-y divide-gray-800">
          <SettingsItem
            icon={<Weight className="text-gray-400" />}
            label="Einheit"
            action={
              <div className="flex items-center space-x-1 bg-gray-700 p-1 rounded-lg">
                <button onClick={() => handleUnitChange('kg')} className={`px-3 py-1 rounded ${profile?.unit === 'kg' ? 'bg-red-600' : ''}`}>kg</button>
                <button onClick={() => handleUnitChange('lb')} className={`px-3 py-1 rounded ${profile?.unit === 'lb' ? 'bg-red-600' : ''}`}>lb</button>
              </div>
            }
          />
          <SettingsItem
            icon={isDarkMode ? <Moon className="text-gray-400" /> : <Sun className="text-gray-400" />}
            label="Dark Mode"
            action={<div className={`w-12 h-7 rounded-full flex items-center p-1 transition-colors ${isDarkMode ? 'bg-red-600' : 'bg-gray-600'}`}><div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${isDarkMode ? 'translate-x-5' : ''}`} /></div>}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-red-500 mb-3">Daten</h2>
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <SettingsItem
            icon={<Download className="text-gray-400" />}
            label="Backup erstellen"
            action={<button className="text-red-500 font-semibold">Export</button>}
          />
        </div>
      </div>

      <div className="pt-4">
        <Button onClick={signOut} variant="secondary">
          <div className="flex items-center justify-center space-x-2">
            <LogOut size={18} />
            <span>Log Out</span>
          </div>
        </Button>
      </div>

      <Modal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        title="Profil verwalten"
      >
        <ProfileManagementForm onClose={() => setIsProfileModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Einstellungen;
