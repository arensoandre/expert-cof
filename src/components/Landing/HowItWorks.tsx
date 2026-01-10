import React from 'react';
import { Upload, Cpu, FileText, ArrowRight } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: <Upload className="h-8 w-8 text-blue-600 dark:text-brand-blue" />,
      title: '1. Envie sua COF',
      description: 'Faça upload do arquivo PDF da Circular de Oferta de Franquia no nosso painel seguro.'
    },
    {
      icon: <Cpu className="h-8 w-8 text-blue-600 dark:text-brand-blue" />,
      title: '2. Análise de IA',
      description: 'Nossa inteligência artificial varre o documento identificando riscos jurídicos e extraindo dados financeiros.'
    },
    {
      icon: <FileText className="h-8 w-8 text-blue-600 dark:text-brand-blue" />,
      title: '3. Relatório Detalhado',
      description: 'Receba instantaneamente um relatório com Score de Segurança, Payback real e Pontos de Atenção.'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-dark-surface border-y border-gray-200 dark:border-dark-border" id="how-it-works">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-dark-text-primary sm:text-4xl">
            Como funciona a análise?
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-dark-text-secondary">
            Transformamos documentos complexos em informações claras para sua tomada de decisão.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-blue-200 dark:via-blue-900 to-transparent -z-10" />

          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center relative">
              <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-2xl bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border shadow-sm z-10">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-dark-text-primary mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-dark-text-secondary leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
