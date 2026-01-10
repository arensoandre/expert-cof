import React, { useState } from 'react';
import { FileText, Mail, Linkedin, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ReportExampleModal } from '@/components/Landing/ReportExampleModal';

export function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <footer className="border-t border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg pt-16 pb-8 transition-colors">
      <ReportExampleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-blue-700 dark:text-brand-blue" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">Expert COF</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
              Inteligência Artificial para desmistificar franquias. Tome decisões de investimento com segurança e dados.
            </p>
            <div className="flex gap-4">
               {/* Social Icons Mock */}
               <a href="#" className="text-gray-400 hover:text-blue-600 dark:hover:text-brand-blue transition-colors"><Linkedin className="h-5 w-5"/></a>
               <a href="#" className="text-gray-400 hover:text-blue-600 dark:hover:text-brand-blue transition-colors"><Twitter className="h-5 w-5"/></a>
               <a href="#" className="text-gray-400 hover:text-blue-600 dark:hover:text-brand-blue transition-colors"><Instagram className="h-5 w-5"/></a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Produto</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="/#how-it-works" className="hover:text-blue-700 dark:hover:text-brand-blue transition-colors">Como Funciona</a></li>
              <li><a href="/#pricing" className="hover:text-blue-700 dark:hover:text-brand-blue transition-colors">Planos e Preços</a></li>
              <li>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="hover:text-blue-700 dark:hover:text-brand-blue transition-colors text-left"
                >
                  Exemplo de Relatório
                </button>
              </li>
              <li><Link to="/login" className="hover:text-blue-700 dark:hover:text-brand-blue transition-colors">Entrar</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recursos</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="#" className="hover:text-blue-700 dark:hover:text-brand-blue transition-colors">Blog (Em breve)</a></li>
              <li><a href="#" className="hover:text-blue-700 dark:hover:text-brand-blue transition-colors">Guia de Franquias</a></li>
              <li><a href="#" className="hover:text-blue-700 dark:hover:text-brand-blue transition-colors">Calculadora de ROI</a></li>
              <li><a href="#" className="hover:text-blue-700 dark:hover:text-brand-blue transition-colors">Suporte</a></li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Contato & Legal</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:contato@expertcof.com.br" className="hover:text-blue-700 dark:hover:text-brand-blue transition-colors">contato@expertcof.com.br</a>
              </li>
              <li><Link to="/terms" className="hover:text-blue-700 dark:hover:text-brand-blue transition-colors">Termos de Uso</Link></li>
              <li><Link to="/privacy" className="hover:text-blue-700 dark:hover:text-brand-blue transition-colors">Política de Privacidade</Link></li>
              <li><Link to="/lgpd" className="hover:text-blue-700 dark:hover:text-brand-blue transition-colors">LGPD</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-dark-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Expert COF. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span>Desenvolvido com</span>
            <span className="text-red-500">♥</span>
            <span>para o mercado brasileiro</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
