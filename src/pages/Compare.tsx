import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { AnalysisResult } from '@/types/analysis';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, CheckCircle, AlertTriangle, XCircle, Minus, FileText } from 'lucide-react';

interface ComparisonData {
  id: string;
  franchise_name: string;
  analysis: AnalysisResult;
}

export default function Compare() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [data, setData] = useState<ComparisonData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = searchParams.get('ids')?.split(',') || [];
    if (ids.length > 0) {
      fetchComparisonData(ids);
    } else {
        setLoading(false);
    }
  }, [searchParams]);

  const fetchComparisonData = async (ids: string[]) => {
    try {
      const { data: analyses, error } = await supabase
        .from('analyses')
        .select('*')
        .in('id', ids);

      if (error) throw error;

      const formattedData = analyses?.map(item => ({
        id: item.id,
        franchise_name: item.franchise_name,
        analysis: item.risk_analysis
      })) || [];

      setData(formattedData);
    } catch (err) {
      console.error('Error fetching comparison:', err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
    if (score >= 50) return 'text-yellow-700 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
  };

  if (loading) {
    return (
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );
  }

  if (data.length === 0) {
      return (
          <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
              <div className="container mx-auto max-w-4xl text-center pt-20">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Nenhuma análise selecionada</h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">Selecione pelo menos duas franquias no Dashboard para comparar.</p>
                  <Button onClick={() => navigate('/dashboard')}>
                      Ir para Dashboard
                  </Button>
              </div>
          </div>
      )
  }

  return (
    <div className="bg-gray-50 dark:bg-dark-bg min-h-screen transition-colors p-8">
      <main className="container mx-auto">
        <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="flex items-center gap-2 dark:text-dark-text-primary">
                <ArrowLeft className="h-4 w-4" />
                Voltar ao Dashboard
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary">Comparativo de Franquias</h1>
        </div>

        <div className="bg-white dark:bg-dark-surface rounded-xl shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden overflow-x-auto transition-colors">
            <table className="w-full min-w-[800px] border-collapse">
                <thead>
                    <tr className="bg-gray-50 dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border">
                        <th className="p-4 text-left w-48 text-sm font-semibold text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider sticky left-0 z-10 bg-gray-50 dark:bg-dark-surface">
                            Critério
                        </th>
                        {data.map((item, index) => (
                            <th key={item.id} className="p-4 text-left min-w-[250px] border-l border-gray-200 dark:border-dark-border first:border-l-0">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 dark:bg-brand-blue/10 dark:text-brand-blue font-bold text-sm mb-2">
                                        {index + 1}
                                    </div>
                                    <span className="text-lg font-bold text-gray-900 dark:text-dark-text-primary line-clamp-2 h-14" title={item.franchise_name}>
                                        {item.franchise_name}
                                    </span>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-dark-border">
                    
                    {/* Score Row */}
                    <tr>
                        <td className="p-4 font-semibold text-gray-700 dark:text-dark-text-primary sticky left-0 bg-white dark:bg-dark-surface z-10 border-r border-gray-100 dark:border-dark-border">Score de Segurança</td>
                        {data.map(item => (
                            <td key={item.id} className="p-4 border-l border-gray-100 dark:border-dark-border">
                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(item.analysis.score)}`}>
                                    {item.analysis.score}/100
                                </div>
                            </td>
                        ))}
                    </tr>

                    {/* Financials Header */}
                    <tr className="bg-blue-50/50 dark:bg-blue-900/10">
                        <td colSpan={data.length + 1} className="p-3 text-xs font-bold text-blue-800 dark:text-blue-400 uppercase tracking-wider pl-4">
                            Financeiro
                        </td>
                    </tr>
                    
                    {[
                        { label: 'Investimento Inicial', key: 'initial_investment' },
                        { label: 'Taxa de Franquia', key: 'franchise_fee' },
                        { label: 'Royalties', key: 'royalties' },
                        { label: 'Fundo Propaganda', key: 'advertising_fund' },
                        { label: 'Payback', key: 'payback_period', highlight: true },
                        { label: 'Rentabilidade', key: 'profitability', highlight: true },
                    ].map(row => (
                        <tr key={row.key} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="p-4 text-sm font-medium text-gray-600 dark:text-gray-400 sticky left-0 bg-white dark:bg-gray-800 z-10 border-r border-gray-100 dark:border-gray-700 group-hover:bg-gray-50 dark:group-hover:bg-gray-700/50">{row.label}</td>
                            {data.map(item => (
                                <td key={item.id} className={`p-4 text-sm border-l border-gray-100 dark:border-gray-700 ${row.highlight ? 'font-semibold text-blue-700 dark:text-blue-400' : 'text-gray-800 dark:text-gray-200'}`}>
                                    {item.analysis.financials?.[row.key as keyof typeof item.analysis.financials] || '-'}
                                </td>
                            ))}
                        </tr>
                    ))}

                    {/* Risks Header */}
                    <tr className="bg-amber-50/50 dark:bg-amber-900/10">
                        <td colSpan={data.length + 1} className="p-3 text-xs font-bold text-amber-800 dark:text-amber-500 uppercase tracking-wider pl-4">
                            Riscos e Alertas
                        </td>
                    </tr>

                    <tr>
                        <td className="p-4 text-sm font-medium text-gray-600 dark:text-gray-400 sticky left-0 bg-white dark:bg-gray-800 z-10 border-r border-gray-100 dark:border-gray-700 align-top">
                            Riscos Altos
                        </td>
                        {data.map(item => {
                            const highRisks = item.analysis.risks.filter(r => r.severity === 'high');
                            return (
                                <td key={item.id} className="p-4 align-top border-l border-gray-100 dark:border-gray-700">
                                    {highRisks.length > 0 ? (
                                        <ul className="space-y-2">
                                            {highRisks.map((risk, i) => (
                                                <li key={i} className="flex items-start gap-2 text-xs text-red-700 bg-red-50 dark:text-red-300 dark:bg-red-900/20 p-2 rounded">
                                                    <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                                    {risk.title}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                                            <CheckCircle className="h-4 w-4" />
                                            Nenhum risco alto
                                        </div>
                                    )}
                                </td>
                            );
                        })}
                    </tr>

                     <tr>
                        <td className="p-4 text-sm font-medium text-gray-600 dark:text-gray-400 sticky left-0 bg-white dark:bg-gray-800 z-10 border-r border-gray-100 dark:border-gray-700 align-top">
                            Riscos Médios
                        </td>
                        {data.map(item => {
                            const mediumRisks = item.analysis.risks.filter(r => r.severity === 'medium');
                            return (
                                <td key={item.id} className="p-4 align-top border-l border-gray-100 dark:border-gray-700">
                                    <div className="text-sm font-semibold text-amber-600 dark:text-amber-500 mb-2">
                                        {mediumRisks.length} Identificados
                                    </div>
                                    <ul className="space-y-1">
                                        {mediumRisks.slice(0, 3).map((risk, i) => ( 
                                            <li key={i} className="text-xs text-gray-600 dark:text-gray-300 truncate" title={risk.title}>
                                                • {risk.title}
                                            </li>
                                        ))}
                                        {mediumRisks.length > 3 && (
                                            <li className="text-xs text-gray-400 italic">+ {mediumRisks.length - 3} outros</li>
                                        )}
                                    </ul>
                                </td>
                            );
                        })}
                    </tr>

                     {/* Missing Clauses Header */}
                    <tr className="bg-gray-100 dark:bg-gray-800">
                        <td colSpan={data.length + 1} className="p-3 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider pl-4">
                            Conformidade
                        </td>
                    </tr>

                    <tr>
                        <td className="p-4 text-sm font-medium text-gray-600 dark:text-gray-400 sticky left-0 bg-white dark:bg-gray-800 z-10 border-r border-gray-100 dark:border-gray-700 align-top">
                            Cláusulas Ausentes
                        </td>
                        {data.map(item => (
                            <td key={item.id} className="p-4 align-top border-l border-gray-100 dark:border-gray-700">
                                {item.analysis.missingClauses.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                        {item.analysis.missingClauses.map((clause, i) => (
                                            <span key={i} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                                <XCircle className="h-3 w-3 mr-1 text-gray-400" />
                                                {clause.length > 20 ? clause.substring(0, 20) + '...' : clause}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                                        <CheckCircle className="h-4 w-4" />
                                        Completa
                                    </div>
                                )}
                            </td>
                        ))}
                    </tr>

                </tbody>
            </table>
        </div>
      </main>
    </div>
  );
}
