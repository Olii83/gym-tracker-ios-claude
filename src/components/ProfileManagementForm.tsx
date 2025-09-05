import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import Button from './Button';
import { User, Mail, Lock, Check, X } from 'lucide-react';

interface ProfileManagementFormProps {
  onClose: () => void;
}

const ProfileManagementForm = ({ onClose }: ProfileManagementFormProps) => {
  const { user } = useAuth();
  const { profile, updateProfile, updateUserEmail, updateUserPassword } = useData();
  
  const [name, setName] = useState(profile?.full_name || profile?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<'name' | 'email' | 'password' | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleUpdateName = async () => {
    if (!name.trim()) {
      alert('Bitte geben Sie einen Namen ein.');
      return;
    }
    setLoading(true);
    const { error } = await updateProfile({ 
      username: profile?.username || user?.email || 'User',
      full_name: name.trim(), 
      unit: profile?.unit || 'kg' 
    });
    if (error) {
      alert('Fehler beim Aktualisieren des Namens: ' + error.message);
    } else {
      showSuccess('Name erfolgreich aktualisiert');
      setActiveSection(null);
    }
    setLoading(false);
  };

  const handleUpdateEmail = async () => {
    if (!email.trim() || !email.includes('@')) {
      alert('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return;
    }
    setLoading(true);
    const { error } = await updateUserEmail(email.trim());
    if (error) {
      alert('Fehler beim Aktualisieren der E-Mail: ' + error.message);
    } else {
      showSuccess('E-Mail erfolgreich aktualisiert. Bitte überprüfen Sie Ihr Postfach zur Bestätigung.');
      setActiveSection(null);
    }
    setLoading(false);
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      alert('Das Passwort muss mindestens 6 Zeichen lang sein.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('Die Passwörter stimmen nicht überein.');
      return;
    }
    setLoading(true);
    const { error } = await updateUserPassword(newPassword);
    if (error) {
      alert('Fehler beim Aktualisieren des Passworts: ' + error.message);
    } else {
      showSuccess('Passwort erfolgreich aktualisiert');
      setActiveSection(null);
      setNewPassword('');
      setConfirmPassword('');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {successMessage && (
        <div className="bg-green-900 border border-green-600 text-green-200 px-4 py-3 rounded-lg">
          {successMessage}
        </div>
      )}

      {/* Name Section */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <User className="text-gray-400" size={20} />
            <div>
              <h3 className="font-medium text-white">Name</h3>
              <p className="text-sm text-gray-400">{profile?.full_name || profile?.username || 'Nicht festgelegt'}</p>
            </div>
          </div>
          <Button 
            variant="secondary" 
            onClick={() => setActiveSection(activeSection === 'name' ? null : 'name')}
            className="px-3 py-1 text-sm"
          >
            {activeSection === 'name' ? 'Abbrechen' : 'Bearbeiten'}
          </Button>
        </div>
        
        {activeSection === 'name' && (
          <div className="space-y-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Ihr Name"
            />
            <div className="flex space-x-2">
              <Button onClick={handleUpdateName} disabled={loading} className="flex-1">
                <Check size={16} className="mr-1" />
                Speichern
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Email Section */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Mail className="text-gray-400" size={20} />
            <div>
              <h3 className="font-medium text-white">E-Mail</h3>
              <p className="text-sm text-gray-400">{user?.email || 'Nicht festgelegt'}</p>
            </div>
          </div>
          <Button 
            variant="secondary" 
            onClick={() => setActiveSection(activeSection === 'email' ? null : 'email')}
            className="px-3 py-1 text-sm"
          >
            {activeSection === 'email' ? 'Abbrechen' : 'Bearbeiten'}
          </Button>
        </div>
        
        {activeSection === 'email' && (
          <div className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Neue E-Mail-Adresse"
            />
            <div className="flex space-x-2">
              <Button onClick={handleUpdateEmail} disabled={loading} className="flex-1">
                <Check size={16} className="mr-1" />
                Speichern
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Password Section */}
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Lock className="text-gray-400" size={20} />
            <div>
              <h3 className="font-medium text-white">Passwort</h3>
              <p className="text-sm text-gray-400">••••••••</p>
            </div>
          </div>
          <Button 
            variant="secondary" 
            onClick={() => setActiveSection(activeSection === 'password' ? null : 'password')}
            className="px-3 py-1 text-sm"
          >
            {activeSection === 'password' ? 'Abbrechen' : 'Ändern'}
          </Button>
        </div>
        
        {activeSection === 'password' && (
          <div className="space-y-3">
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Neues Passwort (min. 6 Zeichen)"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              placeholder="Neues Passwort bestätigen"
            />
            <div className="flex space-x-2">
              <Button onClick={handleUpdatePassword} disabled={loading} className="flex-1">
                <Check size={16} className="mr-1" />
                Passwort ändern
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4">
        <Button onClick={onClose} variant="secondary" className="w-full">
          <X size={16} className="mr-1" />
          Schließen
        </Button>
      </div>
    </div>
  );
};

export default ProfileManagementForm;