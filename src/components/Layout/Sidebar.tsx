import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  History as HistoryIcon,
  User, 
  CreditCard, 
  Settings, 
  Lock, 
  LogOut, 
  Moon, 
  Sun,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export function Sidebar({ isDarkMode, toggleDarkMode }: SidebarProps) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSignOut = async () => {
    navigate('/');
    await signOut();
  };

  return (
    <div className="flex flex-col h-screen w-64 bg-white dark:bg-dark-sidebar border-r border-gray-200 dark:border-dark-border transition-colors duration-200">
      <div className="p-6 flex items-center justify-center border-b border-gray-200 dark:border-dark-border">
        <h1 className="text-xl font-bold text-gray-900 dark:text-dark-text-primary">Expert COF</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-blue-50 text-brand-blue dark:bg-brand-blue/10 dark:text-brand-blue'
                : 'text-gray-700 hover:bg-gray-100 dark:text-dark-text-secondary dark:hover:bg-dark-surface-hover dark:hover:text-dark-text-primary'
            }`
          }
        >
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-blue-50 text-brand-blue dark:bg-brand-blue/10 dark:text-brand-blue'
                : 'text-gray-700 hover:bg-gray-100 dark:text-dark-text-secondary dark:hover:bg-dark-surface-hover dark:hover:text-dark-text-primary'
            }`
          }
        >
          <HistoryIcon size={20} />
          Histórico
        </NavLink>

        <NavLink
          to="/profile?tab=profile"
          className={() =>
            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              location.search.includes('tab=profile')
                ? 'bg-blue-50 text-brand-blue dark:bg-brand-blue/10 dark:text-brand-blue'
                : 'text-gray-700 hover:bg-gray-100 dark:text-dark-text-secondary dark:hover:bg-dark-surface-hover dark:hover:text-dark-text-primary'
            }`
          }
        >
          <User size={20} />
          Perfil
        </NavLink>

        <NavLink
          to="/profile?tab=subscription"
          className={() =>
            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              location.search.includes('tab=subscription')
                ? 'bg-blue-50 text-brand-blue dark:bg-brand-blue/10 dark:text-brand-blue'
                : 'text-gray-700 hover:bg-gray-100 dark:text-dark-text-secondary dark:hover:bg-dark-surface-hover dark:hover:text-dark-text-primary'
            }`
          }
        >
          <CreditCard size={20} />
          Assinatura
        </NavLink>

        <div>
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-dark-text-secondary dark:hover:bg-dark-surface-hover dark:hover:text-dark-text-primary transition-colors"
          >
            <div className="flex items-center gap-3">
              <Settings size={20} />
              Configurações
            </div>
            {isSettingsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          
          {isSettingsOpen && (
            <div className="mt-1 ml-4 pl-4 border-l border-gray-200 dark:border-dark-border space-y-1">
              <NavLink
                to="/profile?tab=security"
                className={() =>
                  `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.search.includes('tab=security')
                      ? 'text-brand-blue dark:text-brand-blue'
                      : 'text-gray-600 hover:text-gray-900 dark:text-dark-text-secondary dark:hover:text-dark-text-primary'
                  }`
                }
              >
                <Lock size={18} />
                Segurança
              </NavLink>
            </div>
          )}
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-dark-border space-y-2">
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-dark-text-secondary dark:hover:bg-dark-surface-hover dark:hover:text-dark-text-primary transition-colors"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          {isDarkMode ? 'Modo Claro' : 'Modo Escuro'}
        </button>
        
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-brand-red dark:hover:bg-brand-red/10 transition-colors"
        >
          <LogOut size={20} />
          Sair
        </button>
      </div>
    </div>
  );
}
