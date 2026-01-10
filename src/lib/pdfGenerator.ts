import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AnalysisResult } from '@/types/analysis';

export const generateAnalysisPDF = (data: AnalysisResult) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  
  // -- HEADER --
  doc.setFontSize(22);
  doc.setTextColor(30, 64, 175); // Blue-800
  doc.text('Expert COF - Relatório de Análise', 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 14, 26);
  
  doc.setLineWidth(0.5);
  doc.setDrawColor(200);
  doc.line(14, 30, pageWidth - 14, 30);

  // -- FRANCHISE INFO --
  let yPos = 40;
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text(`Franquia: ${data.franchise_name || 'Não identificada'}`, 14, yPos);
  
  yPos += 8;
  if (data.cnpj) {
    doc.setFontSize(11);
    doc.setTextColor(80);
    doc.text(`CNPJ: ${data.cnpj}`, 14, yPos);
    yPos += 10;
  }

  // -- SCORE --
  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text('Score de Segurança:', 14, yPos);
  
  doc.setFontSize(14);
  if (data.score >= 80) doc.setTextColor(22, 163, 74); // Green
  else if (data.score >= 50) doc.setTextColor(202, 138, 4); // Yellow/Orange
  else doc.setTextColor(220, 38, 38); // Red
  
  doc.text(`${data.score}/100`, 60, yPos);
  yPos += 12;

  // -- SUMMARY --
  doc.setFontSize(12);
  doc.setTextColor(30, 64, 175);
  doc.text('Resumo Executivo', 14, yPos);
  yPos += 6;
  
  doc.setFontSize(10);
  doc.setTextColor(50);
  const summaryLines = doc.splitTextToSize(data.summary, pageWidth - 28);
  doc.text(summaryLines, 14, yPos);
  yPos += (summaryLines.length * 5) + 10;

  // -- FINANCIALS --
  if (data.financials) {
    doc.setFontSize(12);
    doc.setTextColor(30, 64, 175);
    doc.text('Dados Financeiros', 14, yPos);
    yPos += 4;

    const financialData = [
      ['Investimento Inicial', data.financials.initial_investment],
      ['Taxa de Franquia', data.financials.franchise_fee],
      ['Royalties', data.financials.royalties],
      ['Fundo de Propaganda', data.financials.advertising_fund],
      ['Payback Estimado', data.financials.payback_period],
      ['Rentabilidade', data.financials.profitability]
    ];

    autoTable(doc, {
      startY: yPos,
      head: [['Item', 'Valor']],
      body: financialData,
      theme: 'grid',
      headStyles: { fillColor: [30, 64, 175] },
      styles: { fontSize: 9 }
    });
    
    // @ts-ignore
    yPos = doc.lastAutoTable.finalY + 12;
  }

  // -- RISKS --
  doc.setFontSize(12);
  doc.setTextColor(30, 64, 175);
  doc.text('Pontos de Atenção e Riscos', 14, yPos);
  yPos += 4;

  const riskData = data.risks.map(risk => {
    const severityMap = {
      'high': 'ALTO',
      'medium': 'MÉDIO',
      'low': 'BAIXO'
    };
    return [severityMap[risk.severity], risk.title, risk.description];
  });

  autoTable(doc, {
    startY: yPos,
    head: [['Nível', 'Risco', 'Descrição']],
    body: riskData,
    theme: 'grid',
    headStyles: { fillColor: [220, 38, 38] }, // Red for risks
    columnStyles: {
      0: { fontStyle: 'bold', width: 25 },
      1: { fontStyle: 'bold', width: 40 },
      2: { width: 'auto' }
    },
    styles: { fontSize: 9 }
  });

  // @ts-ignore
  yPos = doc.lastAutoTable.finalY + 12;

  // -- RECOMMENDATIONS --
  // Check if we need a new page
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(12);
  doc.setTextColor(30, 64, 175);
  doc.text('Recomendações', 14, yPos);
  yPos += 6;

  doc.setFontSize(10);
  doc.setTextColor(50);
  data.recommendations.forEach(rec => {
    const recLines = doc.splitTextToSize(`• ${rec}`, pageWidth - 28);
    doc.text(recLines, 14, yPos);
    yPos += (recLines.length * 5) + 2;
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('Gerado por Expert COF - www.expertcof.com.br', pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });
  }

  doc.save(`Analise_ExpertCOF_${data.franchise_name || 'Franquia'}.pdf`);
};
