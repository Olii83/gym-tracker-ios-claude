import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { ListTodo, Dumbbell, BarChart2, Settings, ScrollText } from 'lucide-react';
import Header from './Header';
import { useTracking } from '../contexts/TrackingContext';

const navItems = [
  { path: '/', label: 'Trainings', icon: ListTodo },
  { path: '/uebungen', label: 'Übungen', icon: Dumbbell },
  { path: '/protokolle', label: 'Logs', icon: ScrollText },
  { path: '/statistiken', label: 'Statistiken', icon: BarChart2 },
  { path: '/einstellungen', label: 'Einstellungen', icon: Settings },
];

const Layout = () => {
  const { isTraining } = useTracking();
  const location = useLocation();
  const isOnTrackingPage = location.pathname.startsWith('/track/');

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    if (isTraining && !isOnTrackingPage) {
      e.preventDefault();
      if (window.confirm('⚠️ Du bist gerade im Training-Modus.\n\nMöchtest du wirklich das Training verlassen? Verwende stattdessen die Buttons "Training beenden" oder "Abbrechen" auf der Tracking-Seite.')) {
        // User confirmed, allow navigation
        window.location.href = path;
      }
    }
  };

  return (
    <div className="bg-white dark:bg-black text-gray-900 dark:text-white min-h-screen font-sans">
      <Header />
      <main 
        className="pb-20" 
        style={{ 
          paddingTop: `calc(4rem + var(--safe-area-inset-top))`, // Header height + safe area
          paddingBottom: `calc(5rem + var(--safe-area-inset-bottom))`,
          paddingLeft: 'var(--safe-area-inset-left)',
          paddingRight: 'var(--safe-area-inset-right)',
        }}
      >
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-around" style={{
        paddingBottom: 'var(--safe-area-inset-bottom)',
        paddingLeft: 'var(--safe-area-inset-left)',
        paddingRight: 'var(--safe-area-inset-right)',
      }}>
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end
            onClick={(e) => handleNavClick(e, path)}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full pt-2 pb-1 text-xs ` +
              (isActive ? 'text-red-500' : 'text-gray-600 dark:text-gray-400')
            }
          >
            <Icon size={24} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
