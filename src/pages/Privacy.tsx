import React from 'react';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-24 md:px-6 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Política de Privacidade</h1>
        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-4">
          <p>Última atualização: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">1. Coleta de Dados</h2>
          <p>Coletamos apenas os dados necessários para o funcionamento do serviço: nome, email e os documentos (COF) que você envia para análise.</p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">2. Uso das Informações</h2>
          <p>Seus documentos são processados temporariamente para gerar a análise e depois são armazenados de forma segura e privada, acessível apenas à sua conta.</p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">3. Compartilhamento</h2>
          <p>Não vendemos nem compartilhamos seus dados pessoais com terceiros para fins de marketing. Seus dados podem ser processados por provedores de infraestrutura (como OpenAI e Supabase) estritamente para a prestação do serviço.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
