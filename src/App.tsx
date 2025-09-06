import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import Trainings from './pages/Trainings';
import Uebungen from './pages/Uebungen';
import Logs from './pages/Logs';
import Statistiken from './pages/Statistiken';
import Einstellungen from './pages/Einstellungen';
import Auth from './pages/Auth';
import TrainingDetail from './pages/TrainingDetail';
import TrackingPage from './pages/TrackingPage';

function App() {
  const { session } = useAuth();

  return (
    <ThemeProvider>
      <BrowserRouter>
        {!session ? (
          <Routes>
            <Route path="*" element={<Auth />} />
          </Routes>
        ) : (
          <DataProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Trainings />} />
                <Route path="trainings/:id" element={<TrainingDetail />} />
                <Route path="track/:id" element={<TrackingPage />} />
                <Route path="uebungen" element={<Uebungen />} />
                <Route path="protokolle" element={<Logs />} />
                <Route path="statistiken" element={<Statistiken />} />
                <Route path="einstellungen" element={<Einstellungen />} />
              </Route>
            </Routes>
          </DataProvider>
        )}
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
