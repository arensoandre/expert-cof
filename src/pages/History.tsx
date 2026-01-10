import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FileText, Calendar, AlertTriangle, ArrowRight, Loader2, Search, CheckSquare, Square } from 'lucide-react';
import { AnalysisResult } from '@/types/analysis';
import { AnalysisResultView } from '@/components/Dashboard/AnalysisResult';
import { useNavigate } from 'react-router-dom';

export default function History() {
  const { user } = useAuth();
  const [analyses, setAnalyses] = useState<AnalysisResult[] & { id?: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisResult | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalyses();
  }, [user]);

  const toggleComparison = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedForComparison(prev => {
        if (prev.includes(id)) return prev.filter(item => item !== id);
        if (prev.length >= 3) return prev; // Max 3
        return [...prev, id];
    });
  };

  const handleCompare = () => {
    if (selectedForComparison.length < 2) return;
    navigate(`/compare?ids=${selectedForComparison.join(',')}`);
  };

  const fetchAnalyses = async () => {
    try {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData = data.map((item: any) => ({
        id: item.id,
        filename: item.franchise_name || 'Sem nome', // Using franchise_name as filename fallback
        franchise_name: item.franchise_name,
        score: item.risk_analysis?.score || 0,
        summary: item.risk_analysis?.summary || '',
        financials: item.risk_analysis?.financials || {},
        risks: item.risk_analysis?.risks || [],
        missingClauses: item.risk_analysis?.missingClauses || [],
        recommendations: item.risk_analysis?.recommendations || [],
        uploadDate: item.created_at,
        extracted_data: item.extracted_data
      }));

      setAnalyses(formattedData);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAnalyses = analyses.filter(analysis => 
    analysis.franchise_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    analysis.extracted_data?.cnpj?.includes(searchTerm)
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400';
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400';
    return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400';
  };

  if (selectedAnalysis) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-bg p-8 transition-colors">
        <div className="container mx-auto">
            <AnalysisResultView 
                result={selectedAnalysis} 
                onBack={() => setSelectedAnalysis(null)} 
            />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg p-8 transition-colors">
      <div className="container mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary">Histórico de Análises</h1>
                <p className="text-gray-500 dark:text-dark-text-secondary">Todas as suas análises salvas</p>
            </div>
            
            <div className="flex gap-4 items-center">
                 {selectedForComparison.length > 0 && (
                    <div className="flex items-center gap-4 bg-blue-50 dark:bg-brand-blue/10 px-4 py-2 rounded-lg border border-blue-100 dark:border-brand-blue/20 animate-in fade-in slide-in-from-right-4">
                        <span className="text-sm font-medium text-blue-700 dark:text-brand-blue">
                            {selectedForComparison.length} selecionadas
                        </span>
                        <Button size="sm" onClick={handleCompare} disabled={selectedForComparison.length < 2} className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-brand-blue dark:hover:bg-blue-600">
                            Comparar Agora
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedForComparison([])} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white h-8 w-8 p-0 rounded-full">
                            &times;
                        </Button>
                    </div>
                 )}

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Buscar por franquia ou CNPJ..." 
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-dark-surface dark:border-dark-border dark:text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
        </div>

        {loading ? (
            <div className="flex justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        ) : filteredAnalyses.length === 0 ? (
            <div className="text-center p-12 text-gray-500 dark:text-gray-400">
                {searchTerm ? 'Nenhuma análise encontrada para sua busca.' : 'Você ainda não possui análises.'}
            </div>
        ) : (
            <div className="grid gap-4">
                {filteredAnalyses.map((analysis, index) => (
                    <Card key={index} className={`p-4 flex flex-col md:flex-row items-center justify-between gap-4 hover:shadow-md transition-shadow cursor-pointer bg-white dark:bg-dark-surface border-gray-200 dark:border-dark-border ${selectedForComparison.includes(analysis.id!) ? 'ring-2 ring-blue-500 dark:ring-brand-blue border-blue-500' : ''}`} onClick={() => setSelectedAnalysis(analysis)}>
                        <div className="flex items-center gap-4 w-full md:w-auto">
                             <div onClick={(e) => toggleComparison(analysis.id!, e)} className="cursor-pointer text-gray-400 hover:text-blue-600 dark:hover:text-brand-blue transition-colors">
                                {selectedForComparison.includes(analysis.id!) ? (
                                    <CheckSquare className="h-6 w-6 text-blue-600 dark:text-brand-blue" />
                                ) : (
                                    <Square className="h-6 w-6" />
                                )}
                             </div>

                            <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 font-bold text-sm ${getScoreColor(analysis.score)}`}>
                                {analysis.score}
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">{analysis.franchise_name}</h3>
                                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(analysis.uploadDate).toLocaleDateString()}
                                    </span>
                                    {analysis.extracted_data?.cnpj && (
                                        <span>CNPJ: {analysis.extracted_data.cnpj}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                            <div className="flex gap-2">
                                {analysis.risks.filter(r => r.severity === 'high').length > 0 && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium dark:bg-red-900/30 dark:text-red-400">
                                        <AlertTriangle className="h-3 w-3" />
                                        {analysis.risks.filter(r => r.severity === 'high').length} Críticos
                                    </span>
                                )}
                            </div>
                            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20">
                                Ver Detalhes <ArrowRight className="ml-1 h-4 w-4" />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}
