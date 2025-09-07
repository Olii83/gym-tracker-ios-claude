import { useLocation } from 'react-router-dom';
import { ListTodo, Dumbbell, BarChart2, Settings, ScrollText } from 'lucide-react';

const pageConfig = {
  '/': { title: 'Trainings', icon: ListTodo },
  '/uebungen': { title: 'Übungen', icon: Dumbbell },
  '/protokolle': { title: 'Logs', icon: ScrollText },
  '/statistiken': { title: 'Statistiken', icon: BarChart2 },
  '/einstellungen': { title: 'Einstellungen', icon: Settings },
  '/training': { title: 'Training', icon: ListTodo },
  '/tracking': { title: 'Training', icon: ListTodo },
};

const Header = () => {
  const location = useLocation();
  
  // Find the matching page config, fallback to path-based matching for dynamic routes
  let config = pageConfig[location.pathname as keyof typeof pageConfig];
  
  if (!config) {
    // Handle dynamic routes like /training/123 or /tracking/456
    if (location.pathname.startsWith('/training')) {
      config = pageConfig['/training'];
    } else if (location.pathname.startsWith('/tracking')) {
      config = pageConfig['/tracking'];
    } else {
      config = { title: 'Gym Tracker', icon: ListTodo };
    }
  }

  const { title, icon: Icon } = config;

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800"
      style={{
        paddingTop: 'var(--safe-area-inset-top)',
        paddingLeft: 'var(--safe-area-inset-left)',
        paddingRight: 'var(--safe-area-inset-right)',
      }}
    >
      <div className="flex items-center px-4 py-3">
        <Icon className="text-red-500 mr-3" size={28} />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
      </div>
    </header>
  );
};

export default Header;