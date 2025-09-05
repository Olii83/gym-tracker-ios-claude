import { useState } from 'react';
import { supabase } from '../supabaseClient';
import Button from '../components/Button';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert(error.message);
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          full_name: name,
        }
      }
    });
    if (error) {
      alert(error.message);
    } else {
      alert('Registrierung erfolgreich! Bitte überprüfen Sie Ihre E-Mail zur Verifizierung.');
      setIsSignup(false);
      setName('');
      setEmail('');
      setPassword('');
    }
    setLoading(false);
  };

  if (isSignup) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-red-600">Gym Tracker</h1>
            <p className="text-gray-400 mt-2">Erstelle dein Konto</p>
          </div>
          <form className="space-y-4" onSubmit={handleSignup}>
            <input
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
              type="email"
              placeholder="E-Mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
              type="password"
              placeholder="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="space-y-2">
              <Button type="submit" disabled={loading}>
                {loading ? 'Registrierung...' : 'Registrieren'}
              </Button>
              <Button 
                type="button" 
                onClick={() => setIsSignup(false)} 
                variant="secondary"
                disabled={loading}
              >
                Zurück zum Login
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600">Gym Tracker</h1>
          <p className="text-gray-400 mt-2">Melde dich an, um deinen Fortschritt zu verfolgen</p>
        </div>
        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
            type="email"
            placeholder="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="space-y-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Anmelden...' : 'Anmelden'}
            </Button>
            <Button 
              type="button"
              onClick={() => setIsSignup(true)} 
              variant="secondary"
              disabled={loading}
            >
              Konto erstellen
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;
