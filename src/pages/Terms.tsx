import React from 'react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';

export default function Terms() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-24 md:px-6 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Termos de Uso</h1>
        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-4">
          <p>Última atualização: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">1. Aceitação dos Termos</h2>
          <p>Ao acessar e usar o Expert COF, você concorda em cumprir e estar vinculado aos seguintes termos e condições de uso.</p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">2. Descrição do Serviço</h2>
          <p>O Expert COF é uma ferramenta de análise de Circulares de Oferta de Franquia (COF) baseada em Inteligência Artificial. Fornecemos insights e resumos, mas não constituímos aconselhamento jurídico oficial.</p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">3. Responsabilidades</h2>
          <p>O usuário reconhece que a decisão final de investimento é de sua inteira responsabilidade. O Expert COF não se responsabiliza por prejuízos financeiros decorrentes de decisões baseadas em nossas análises automatizadas.</p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">4. Planos e Pagamentos</h2>
          <p>Os serviços podem ser oferecidos gratuitamente ou mediante pagamento de assinatura. Os pagamentos são processados de forma segura por terceiros (Stripe).</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
