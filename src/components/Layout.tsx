import { NavLink, Outlet } from 'react-router-dom';
import { ListTodo, Dumbbell, BarChart2, Settings, ScrollText } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Trainings', icon: ListTodo },
  { path: '/uebungen', label: 'Übungen', icon: Dumbbell },
  { path: '/protokolle', label: 'Logs', icon: ScrollText },
  { path: '/statistiken', label: 'Statistiken', icon: BarChart2 },
  { path: '/einstellungen', label: 'Einstellungen', icon: Settings },
];

const Layout = () => {
  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <main className="pb-20">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 flex justify-around">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            end
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full pt-2 pb-1 text-xs ` +
              (isActive ? 'text-red-500' : 'text-gray-400')
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
