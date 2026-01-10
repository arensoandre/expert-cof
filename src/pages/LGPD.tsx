import React from 'react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';

export default function LGPD() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-24 md:px-6 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">LGPD e Seus Dados</h1>
        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-4">
          <p>O Expert COF está comprometido com a Lei Geral de Proteção de Dados (Lei 13.709/2018).</p>
          
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">Seus Direitos</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Acesso:</strong> Você pode solicitar cópia de todos os seus dados.</li>
            <li><strong>Retificação:</strong> Você pode corrigir dados incompletos ou errados no seu Perfil.</li>
            <li><strong>Exclusão:</strong> Você pode solicitar a exclusão completa da sua conta e dados associados a qualquer momento.</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">Encarregado de Dados (DPO)</h2>
          <p>Para exercer seus direitos ou tirar dúvidas sobre dados pessoais, entre em contato conosco através do email: dpo@expertcof.com.br</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
