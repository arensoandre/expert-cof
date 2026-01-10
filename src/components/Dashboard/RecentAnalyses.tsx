import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AnalysisResult } from '@/types/analysis';
import { FileText, Calendar, ChevronRight, Loader2, BarChart2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

interface AnalysisRecord {
  id: string;
  franchise_name: string;
  created_at: string;
  risk_analysis: AnalysisResult;
  status: string;
}

interface RecentAnalysesProps {
  onSelectAnalysis: (analysis: AnalysisResult) => void;
  currentAnalysisId?: string;
  refreshTrigger?: number; // Prop to force refresh when a new upload happens
}

export function RecentAnalyses({ onSelectAnalysis, currentAnalysisId, refreshTrigger }: RecentAnalysesProps) {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Selection mode for comparison
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    fetchAnalyses();
  }, [refreshTrigger]);

  const fetchAnalyses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20); // Increased limit

      if (error) throw error;

      setAnalyses(data || []);
    } catch (err: any) {
      console.error('Error fetching analyses:', err);
      setError('Erro ao carregar histórico.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    setSelectedIds([]);
  };

  const handleCheckboxChange = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sid => sid !== id));
    } else {
        if (selectedIds.length >= 3) {
            // Optional: alert user max 3
            return;
        }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleCompare = () => {
    if (selectedIds.length < 2) return;
    navigate(`/compare?ids=${selectedIds.join(',')}`);
  };

  if (loading && analyses.length === 0) {
    return (
      <Card className="p-6 h-full flex flex-col justify-center">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Análises Recentes</h3>
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4 h-full">
      <Card className="p-6 h-full flex flex-col">
        <div className="flex flex-col gap-4 mb-4 flex-shrink-0">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-white">Análises Recentes</h3>
                {analyses.length > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-2 py-1 rounded-full">
                    {analyses.length}
                    </span>
                )}
            </div>
            
            {/* Comparison Controls */}
            {analyses.length >= 2 && (
                <div className="flex items-center gap-2">
                    {isSelectionMode ? (
                        <div className="flex w-full gap-2">
                             <Button 
                                size="sm" 
                                variant="outline" 
                                className="flex-1 text-xs dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                                onClick={toggleSelectionMode}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                size="sm" 
                                className="flex-1 text-xs"
                                disabled={selectedIds.length < 2}
                                onClick={handleCompare}
                            >
                                Comparar ({selectedIds.length})
                            </Button>
                        </div>
                    ) : (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="w-full text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20"
                            onClick={toggleSelectionMode}
                        >
                            <BarChart2 className="h-3 w-3 mr-2" />
                            Comparar Franquias
                        </Button>
                    )}
                </div>
            )}
        </div>

        {analyses.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4 flex-grow flex items-center justify-center">
            Nenhuma análise encontrada.
          </p>
        ) : (
          <div className="space-y-3 overflow-y-auto flex-grow pr-1 max-h-[300px]">
            {analyses.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                    if (isSelectionMode) {
                        handleCheckboxChange(item.id);
                    } else {
                        onSelectAnalysis(item.risk_analysis);
                    }
                }}
                className={`group flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer hover:shadow-md dark:hover:shadow-none
                  ${isSelectionMode && selectedIds.includes(item.id) 
                    ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500 dark:bg-blue-900/20 dark:border-blue-500' 
                    : ''}
                  ${!isSelectionMode && currentAnalysisId === item.id 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500' 
                    : 'border-gray-100 hover:border-blue-200 bg-white dark:bg-gray-800 dark:border-gray-700 dark:hover:border-blue-500/50'}
                  `}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                    {isSelectionMode && (
                        <div className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center
                            ${selectedIds.includes(item.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800'}
                        `}>
                            {selectedIds.includes(item.id) && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                    )}
                    
                  <div className={`p-2 rounded-lg ${
                    (item.risk_analysis?.score || 0) >= 70 ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                    (item.risk_analysis?.score || 0) >= 40 ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-medium text-sm text-gray-900 dark:text-gray-200 truncate group-hover:text-blue-700 dark:group-hover:text-blue-400">
                      {item.franchise_name}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <Calendar className="h-3 w-3" />
                      {new Date(item.created_at).toLocaleDateString('pt-BR')}
                      <span className="text-gray-300 dark:text-gray-600">•</span>
                      <span>Score: {item.risk_analysis?.score}</span>
                    </div>
                  </div>
                </div>
                {!isSelectionMode && (
                    <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-600 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
