import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ReportExampleModal } from './ReportExampleModal';

export function Hero() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-dark-bg dark:to-dark-surface pt-24 pb-16 md:pt-32 md:pb-24">
      <ReportExampleModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800 px-3 py-1 text-sm text-blue-800 dark:text-blue-300 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400 mr-2 animate-pulse"></span>
            Nova Versão: Análise com IA 2.0
          </div>
          
          <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl mb-6">
            Decifre sua Franquia com{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
              Inteligência Artificial
            </span>
          </h1>
          
          <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-300 md:text-xl mb-10">
            Evite surpresas contratuais e tome decisões certas para seu investimento seguras. 
            Nossa IA analisa riscos, projeta retorno financeiro e compara franquias em segundos.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row w-full sm:w-auto">
            <Button size="lg" className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-none" onClick={() => navigate('/register')}>
              Começar Análise Gratuita <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="h-14 px-8 text-lg border-gray-300 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800" onClick={() => setIsModalOpen(true)}>
              Ver Exemplo de Relatório
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              Análise de Riscos Jurídicos
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              Projeções Financeiras (ROI/TIR)
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              Comparativo de Mercado
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
