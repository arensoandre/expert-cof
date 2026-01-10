import React from 'react';
import { AnalysisResult } from '@/types/analysis';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, CheckCircle, FileText, ArrowLeft, Download, FileSpreadsheet } from 'lucide-react';
import { generateAnalysisPDF } from '@/lib/pdfGenerator';
import { generateExcel } from '@/lib/excelGenerator';

interface AnalysisResultProps {
  result: AnalysisResult;
  onBack: () => void;
}

export function AnalysisResultView({ result, onBack }: AnalysisResultProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400';
    return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400';
  };

  const handleDownloadPDF = () => {
    generateAnalysisPDF(result);
  };

  const handleDownloadExcel = () => {
    generateExcel(result);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 dark:text-gray-200 dark:hover:bg-gray-800">
          <ArrowLeft className="h-4 w-4" />
          Voltar para Upload
        </Button>
        <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Arquivo: {result.filename}</span>
            
            <Button onClick={handleDownloadExcel} variant="outline" className="flex items-center gap-2 text-green-700 border-green-200 hover:bg-green-50 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-900/20">
                <FileSpreadsheet className="h-4 w-4" />
                Excel
            </Button>
            
            <Button onClick={handleDownloadPDF} variant="outline" className="flex items-center gap-2 text-blue-700 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/20">
                <Download className="h-4 w-4" />
                PDF
            </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column: Score + Recent Analyses Placeholder (if needed, but for now just Score) */}
        <div className="space-y-6">
            {/* Score Card */}
            <Card className="p-6 flex flex-col items-center justify-center text-center space-y-4 h-full">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Pontuação de Segurança</h3>
                <div className={`relative flex items-center justify-center w-32 h-32 rounded-full border-4 ${getScoreColor(result.score)}`}>
                    <span className="text-4xl font-bold">{result.score}</span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Baseado na análise de cláusulas de risco e conformidade.
                </p>
            </Card>
        </div>
        
        {/* Right Column: Recent Analyses (We can reuse the component or list specific to this context if needed, 
            but user asked for "Análises Recentes" column. Since we are INSIDE a result view, 
            maybe they mean "Other Recent Analyses" or just wants the layout. 
            For now, I'll put a placeholder or re-fetch recent analyses if I had access, 
            but strictly following layout: 2 columns top.
            Let's put "Financial Highlights" here as it matches the "Análises Recentes" visual weight or simply leave it for the user's specific "Recent Analysis" component if passed.
            
            Actually, user said: "Ordenar os Cards na primeira linha, duas colunas de cards, 'Pontuação de Segurança' e 'Análises Recentes'".
            I will assume they want to see the list of recent analyses side-by-side with the score of the CURRENT analysis.
        */}
         <div className="h-full">
            {/* We need to render RecentAnalyses here but simplified or just the list. 
                Since RecentAnalyses fetches its own data, we can just drop it here. 
            */}
             <RecentAnalysesWrapper /> 
         </div>
      </div>

      {/* Second Row: Executive Summary (Full Width) */}
      <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Resumo Executivo
          </h3>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
            {result.summary}
          </p>
           {/* Financial Highlights moved here or kept? User said "Resumo Executivo" full width. 
               Financials are part of summary usually. Let's keep them inside.
           */}
           {result.financials && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Investimento Inicial</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{result.financials.initial_investment}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Taxa de Franquia</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{result.financials.franchise_fee}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Retorno (Payback)</p>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">{result.financials.payback_period}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Royalties</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{result.financials.royalties}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Fundo Propaganda</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{result.financials.advertising_fund}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Rentabilidade</p>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">{result.financials.profitability}</p>
              </div>
            </div>
          )}
      </Card>

      {/* Third Row: Risk Points (3 columns or more) */}
       <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Pontos de Atenção
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            {result.risks.map((risk, index) => (
              <div key={index} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 text-xs rounded-full font-medium uppercase
                    ${risk.severity === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                      risk.severity === 'medium' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                    {risk.severity === 'high' ? 'Alto' : risk.severity === 'medium' ? 'Médio' : 'Baixo'}
                  </span>
                </div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1 line-clamp-2" title={risk.title}>{risk.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-4" title={risk.description}>{risk.description}</p>
              </div>
            ))}
          </div>
       </div>

      {/* Fourth Row: Missing Clauses & Recommendations */}
      <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Cláusulas Ausentes
            </h3>
            <ul className="space-y-2">
              {result.missingClauses.map((clause, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <span className="block w-1.5 h-1.5 mt-1.5 rounded-full bg-red-400 flex-shrink-0" />
                  {clause}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Recomendações
            </h3>
            <ul className="space-y-2">
              {result.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <span className="block w-1.5 h-1.5 mt-1.5 rounded-full bg-green-400 flex-shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </Card>
      </div>
    </div>
  );
}

// Internal wrapper to avoid circular dependency or prop drilling issues if RecentAnalyses is complex
// For now, we assume RecentAnalyses is available. We need to import it.
import { RecentAnalyses } from './RecentAnalyses';

function RecentAnalysesWrapper() {
    // This is a bit of a hack to show the list without navigation context conflicts
    // Ideally state should be lifted, but for display purposes:
    return (
        <RecentAnalyses 
            onSelectAnalysis={() => {}} // No-op or handle selection
            currentAnalysisId="current" // Highlight nothing specific or current
            // We might want to pass a prop to RecentAnalyses to make it "compact" or "read-only"
        />
    )
}
