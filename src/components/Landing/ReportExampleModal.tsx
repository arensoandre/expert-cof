import React, { useEffect } from 'react';
import { X, FileText, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

interface ReportExampleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReportExampleModal({ isOpen, onClose }: ReportExampleModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      // Prevent scrolling on body when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const mockResult = {
    filename: "COF_Exemplo_Franquia_X.pdf",
    score: 72,
    summary: "Análise da COF da franquia BURGER KING (CNPJ: 13.574.594/0001-96). A empresa apresenta saúde financeira sólida, com balanços auditados. O modelo de negócio é consolidado, mas exige alto investimento inicial e possui cláusulas rigorosas de padronização.",
    financials: {
        initial_investment: "R$ 1.2M - R$ 2.5M",
        franchise_fee: "R$ 150.000",
        royalties: "5% Faturamento",
        advertising_fund: "3% Faturamento",
        payback_period: "36 a 48 meses",
        profitability: "12% a 15% a.a."
    },
    risks: [
        {
            severity: 'medium',
            title: 'Território de Preferência',
            description: 'A exclusividade é apenas para a loja física, não impedindo vendas online da franqueadora na região.'
        },
        {
            severity: 'high',
            title: 'Multa Rescisória',
            description: 'Multa de 12x a média de royalties em caso de rescisão antecipada pelo franqueado.'
        }
    ],
    missingClauses: ["Detalhamento do suporte de marketing local"],
    recommendations: ["Negociar cláusula de raio de proteção para delivery"]
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400';
    return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400';
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-white dark:bg-dark-bg shadow-2xl border border-gray-200 dark:border-dark-border"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 dark:border-dark-border bg-white dark:bg-dark-bg px-6 py-4">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600 dark:text-brand-blue" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Exemplo de Relatório</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="rounded-full h-8 w-8 p-0 dark:text-gray-400 dark:hover:text-white">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
            
          {/* Top Section: Score & Summary */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-1 p-6 flex flex-col items-center justify-center text-center space-y-4 bg-gray-50 dark:bg-dark-surface border-gray-200 dark:border-dark-border">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Score de Segurança</h3>
              <div className={`relative flex items-center justify-center w-24 h-24 rounded-full border-4 ${getScoreColor(mockResult.score)}`}>
                <span className="text-3xl font-bold">{mockResult.score}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Risco Moderado
              </p>
            </Card>

            <Card className="md:col-span-2 p-6 border-blue-100 bg-blue-50/30 dark:bg-brand-blue/10 dark:border-brand-blue/20">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Resumo Executivo</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                {mockResult.summary}
              </p>
              
              {/* Financial Mini Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-4 border-t border-blue-100 dark:border-brand-blue/20">
                <div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold">Investimento</p>
                    <p className="text-xs font-semibold text-gray-900 dark:text-white">{mockResult.financials.initial_investment}</p>
                </div>
                <div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold">Payback</p>
                    <p className="text-xs font-semibold text-blue-600 dark:text-brand-blue">{mockResult.financials.payback_period}</p>
                </div>
                <div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold">Rentabilidade</p>
                    <p className="text-xs font-semibold text-green-600 dark:text-green-400">{mockResult.financials.profitability}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Risks */}
          <div className="space-y-3">
             <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Pontos de Atenção Identificados
             </h3>
             <div className="grid gap-4 md:grid-cols-2">
                {mockResult.risks.map((risk, i) => (
                    <div key={i} className="p-3 bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-dark-border shadow-sm">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`w-2 h-2 rounded-full ${risk.severity === 'high' ? 'bg-red-500' : 'bg-amber-500'}`} />
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">{risk.title}</h4>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 ml-4">{risk.description}</p>
                    </div>
                ))}
             </div>
          </div>

          {/* CTA Overlay/Footer */}
          <div className="mt-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center shadow-lg">
            <h3 className="text-xl font-bold mb-2">Quer uma análise como esta da sua franquia?</h3>
            <p className="text-blue-100 mb-6 text-sm">Faça upload da sua COF agora mesmo e receba o resultado em minutos.</p>
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 border-none dark:bg-white dark:text-blue-700" onClick={() => window.location.href = '/register'}>
                Criar Minha Conta Grátis <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
