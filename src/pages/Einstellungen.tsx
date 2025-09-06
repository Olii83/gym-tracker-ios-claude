import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useTheme, accentColors, type AccentColor } from '../contexts/ThemeContext';
import SettingsItem from '../components/SettingsItem';
import Button from '../components/Button';
import Modal from '../components/Modal';
import ProfileManagementForm from '../components/ProfileManagementForm';
import { Weight, Moon, Sun, Download, LogOut, User, Palette } from 'lucide-react';

const Einstellungen = () => {
  const { signOut } = useAuth();
  const { profile, updateProfile } = useData();
  const { isDarkMode, accentColor, toggleTheme, setAccentColor, getAccentClasses } = useTheme();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleUnitChange = (unit: 'kg' | 'lb') => {
    if (profile) {
      updateProfile({ ...profile, unit });
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Einstellungen</h1>

      <div className="space-y-4">
        <h2 className={`text-xl font-semibold mb-3 ${getAccentClasses().primary.replace('bg-', 'text-')}`}>Profil</h2>
        <div className="bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
          <SettingsItem
            icon={<User className="text-gray-600 dark:text-gray-400" />}
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
        <h2 className={`text-xl font-semibold mb-3 ${getAccentClasses().primary.replace('bg-', 'text-')}`}>Allgemein</h2>
        <div className="bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden divide-y divide-gray-200 dark:divide-gray-800">
          <SettingsItem
            icon={<Weight className="text-gray-600 dark:text-gray-400" />}
            label="Einheit"
            action={
              <div className="flex items-center space-x-1 bg-gray-300 dark:bg-gray-700 p-1 rounded-lg">
                <button onClick={() => handleUnitChange('kg')} className={`px-3 py-1 rounded text-gray-900 dark:text-white ${profile?.unit === 'kg' ? `${getAccentClasses().primary} text-white` : ''}`}>kg</button>
                <button onClick={() => handleUnitChange('lb')} className={`px-3 py-1 rounded text-gray-900 dark:text-white ${profile?.unit === 'lb' ? `${getAccentClasses().primary} text-white` : ''}`}>lb</button>
              </div>
            }
          />
          <SettingsItem
            icon={isDarkMode ? <Moon className="text-gray-600 dark:text-gray-400" /> : <Sun className="text-gray-600 dark:text-gray-400" />}
            label="Dark Mode"
            action={
              <button 
                onClick={toggleTheme}
                className={`w-12 h-7 rounded-full flex items-center p-1 transition-colors ${isDarkMode ? getAccentClasses().primary : 'bg-gray-400'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${isDarkMode ? 'translate-x-5' : ''}`} />
              </button>
            }
          />
          <SettingsItem
            icon={<Palette className="text-gray-600 dark:text-gray-400" />}
            label="Akzentfarbe"
            description="Wähle deine bevorzugte Farbe für Buttons und Hervorhebungen"
            action={
              <div className="flex items-center space-x-2">
                {Object.entries(accentColors).map(([colorKey, colorData]) => (
                  <button
                    key={colorKey}
                    onClick={() => setAccentColor(colorKey as AccentColor)}
                    className={`w-8 h-8 rounded-full ${colorData.primary} transition-all duration-200 ${
                      accentColor === colorKey 
                        ? 'ring-2 ring-gray-400 dark:ring-gray-300 ring-offset-2 ring-offset-gray-100 dark:ring-offset-gray-900 scale-110' 
                        : 'hover:scale-105'
                    }`}
                    title={colorData.name}
                  />
                ))}
              </div>
            }
          />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className={`text-xl font-semibold mb-3 ${getAccentClasses().primary.replace('bg-', 'text-')}`}>Daten</h2>
        <div className="bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
          <SettingsItem
            icon={<Download className="text-gray-600 dark:text-gray-400" />}
            label="Backup erstellen"
            action={<button className={`font-semibold ${getAccentClasses().primary.replace('bg-', 'text-')}`}>Export</button>}
          />
        </div>
      </div>

      <div className="pt-4">
        <Button onClick={signOut} variant="secondary">
          <div className="flex items-center justify-center space-x-2">
            <LogOut size={18} />
            <span>Abmelden</span>
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
