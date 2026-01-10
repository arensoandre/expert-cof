import { AnalysisResult } from '@/types/analysis';
import * as XLSX from 'xlsx';

export const generateExcel = (result: AnalysisResult) => {
  // 1. Prepare Data for Sheets
  
  // Sheet 1: Resumo Geral
  const summaryData = [
    ["Relatório de Análise de Franquia - Expert COF"],
    [""],
    ["Franquia", result.franchise_name],
    ["CNPJ", result.extracted_data?.cnpj || result.cnpj || "N/A"],
    ["Data da Análise", new Date().toLocaleDateString('pt-BR')],
    ["Score de Segurança", `${result.score}/100`],
    ["Resumo Executivo", result.summary],
  ];

  // Sheet 2: Financeiro
  const financialData = [
    ["Indicador", "Valor / Detalhe"],
    ["Investimento Inicial", result.financials.initial_investment],
    ["Taxa de Franquia", result.financials.franchise_fee],
    ["Royalties", result.financials.royalties],
    ["Fundo de Propaganda", result.financials.advertising_fund],
    ["Payback Estimado", result.financials.payback_period],
    ["Rentabilidade", result.financials.profitability],
  ];

  // Sheet 3: Riscos e Alertas
  const risksData = [
    ["Nível", "Risco", "Descrição"],
    ...result.risks.map(risk => [
      risk.severity === 'high' ? 'ALTO' : risk.severity === 'medium' ? 'MÉDIO' : 'BAIXO',
      risk.title,
      risk.description
    ])
  ];

  // Sheet 4: Recomendações
  const recommendationsData = [
    ["Recomendações e Próximos Passos"],
    ...result.recommendations.map((rec, index) => [`${index + 1}. ${rec}`]),
    [""],
    ["Cláusulas Ausentes"],
    ...(result.missingClauses || []).map((clause, index) => [`- ${clause}`])
  ];

  // 2. Create Workbook and Sheets
  const wb = XLSX.utils.book_new();

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  const wsFinancial = XLSX.utils.aoa_to_sheet(financialData);
  const wsRisks = XLSX.utils.aoa_to_sheet(risksData);
  const wsRecs = XLSX.utils.aoa_to_sheet(recommendationsData);

  // 3. Append Sheets to Workbook
  XLSX.utils.book_append_sheet(wb, wsSummary, "Resumo");
  XLSX.utils.book_append_sheet(wb, wsFinancial, "Financeiro");
  XLSX.utils.book_append_sheet(wb, wsRisks, "Riscos");
  XLSX.utils.book_append_sheet(wb, wsRecs, "Recomendações");

  // 4. Generate and Download File
  const fileName = `Analise_COF_${result.franchise_name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(wb, fileName);
};
