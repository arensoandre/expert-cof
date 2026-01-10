import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { FileText } from 'lucide-react';

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-gray-200 dark:border-dark-border bg-white/80 dark:bg-dark-bg/80 backdrop-blur-md transition-colors">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-blue-700 dark:text-brand-blue" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">Expert COF</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <a href="/#how-it-works" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-brand-blue transition-colors">
            Como Funciona
          </a>
          <a href="/#pricing" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-brand-blue transition-colors">
            Planos
          </a>
          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-gray-700 dark:text-gray-200 dark:hover:bg-dark-surface-hover">
              Entrar
            </Button>
          </Link>
          <Link to="/register">
            <Button size="sm" className="bg-blue-700 hover:bg-blue-800 text-white dark:bg-brand-blue dark:hover:bg-blue-600">Começar Grátis</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
