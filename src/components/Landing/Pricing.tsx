import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { useNavigate } from 'react-router-dom';

export function Pricing() {
  const navigate = useNavigate();

  return (
    <section className="bg-gray-50 dark:bg-dark-bg py-16 md:py-24 transition-colors" id="pricing">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Planos Simples e Transparentes
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Escolha o plano ideal para sua jornada de investimento.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:max-w-4xl lg:mx-auto">
          {/* Free Plan */}
          <Card className="flex flex-col border-gray-200 dark:border-dark-border dark:bg-dark-surface shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900 dark:text-white">Gratuito</CardTitle>
              <CardDescription className="dark:text-gray-400">Para quem está começando a pesquisar.</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">R$ 0</span>
                <span className="text-gray-500 dark:text-gray-400">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2 p-1 border border-red-500 rounded bg-red-50 dark:bg-red-900/20 dark:border-red-700">
                  <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <strong>3 Análises de COF Gratuitas</strong>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Alertas de Risco "Críticos"
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Resumo Financeiro Básico (ROI)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Benchmarking Geral
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full border-gray-300 dark:border-gray-600 dark:text-white dark:hover:bg-gray-800" onClick={() => navigate('/register?plan=free')}>
                Começar Grátis
              </Button>
            </CardFooter>
          </Card>

          {/* Premium Plan */}
          <Card className="flex flex-col border-blue-200 bg-blue-50/50 dark:bg-blue-900/10 dark:border-blue-800 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              RECOMENDADO
            </div>
            <CardHeader>
              <CardTitle className="text-2xl text-blue-900 dark:text-blue-100">Profissional</CardTitle>
              <CardDescription className="text-blue-700 dark:text-blue-300">Para investidores sérios e consultores.</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-blue-900 dark:text-white">R$ 97</span>
                <span className="text-blue-700 dark:text-blue-300">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <strong>Análises Ilimitadas</strong>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Todos os Níveis de Risco (Alto, Médio, Baixo)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Financeiro Detalhado (Payback Real, TIR)
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <strong>Comparador de Franquias</strong>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Histórico Completo
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  Suporte Prioritário
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700" onClick={() => navigate('/register?plan=premium')}>
                Assinar Agora
              </Button>
              <p className="text-xs text-center w-full mt-2 text-blue-600/70 dark:text-blue-400/70">
                Pagamento seguro via Stripe
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
