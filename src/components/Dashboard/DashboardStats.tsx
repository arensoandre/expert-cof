import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { TrendingUp, FileText, Zap, Crown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

export function DashboardStats() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalAnalyses: 0,
    averageScore: 0,
    plan: 'free'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch User Plan
      const { data: userData } = await supabase
        .from('users')
        .select('plan')
        .eq('id', user.id)
        .single();

      // Fetch Analyses for Stats
      const { data: analyses } = await supabase
        .from('analyses')
        .select('risk_analysis')
        .eq('user_id', user.id);

      const total = analyses?.length || 0;
      
      let avg = 0;
      if (total > 0) {
        const sum = analyses?.reduce((acc, curr) => {
          return acc + (curr.risk_analysis?.score || 0);
        }, 0) || 0;
        avg = Math.round(sum / total);
      }

      setStats({
        totalAnalyses: total,
        averageScore: avg,
        plan: userData?.plan || 'free'
      });

    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-8">
      {/* Plan Card */}
      <Card className="p-6 border-l-4 border-l-brand-blue bg-white shadow-sm flex flex-col justify-between relative overflow-hidden dark:bg-dark-surface dark:border-l-brand-blue">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Seu Plano</h3>
            <Crown className={`h-5 w-5 ${stats.plan === 'premium' ? 'text-brand-yellow' : 'text-gray-400 dark:text-dark-text-secondary'}`} />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary capitalize">
            {stats.plan === 'premium' ? 'Profissional' : 'Gratuito'}
          </div>
          <p className="text-xs text-gray-500 dark:text-dark-text-secondary mt-1">
            {stats.plan === 'free' 
              ? 'Plano Gratuito' 
              : 'Análises ilimitadas'}
          </p>
        </div>
        {stats.plan === 'free' && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-4 w-full text-brand-blue hover:text-blue-700 hover:bg-blue-50 border border-blue-100 dark:border-dark-border dark:hover:bg-dark-surface-hover"
            onClick={() => navigate('/profile?tab=subscription')} 
          >
            Assinatura <Zap className="ml-1 h-3 w-3" />
          </Button>
        )}
      </Card>

      {/* Total Analyses Card */}
      <Card className="p-6 bg-white shadow-sm flex flex-col justify-between dark:bg-dark-surface">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Total Analisado</h3>
          <FileText className="h-5 w-5 text-brand-blue" />
        </div>
        <div>
          <div className="text-3xl font-bold text-gray-900 dark:text-dark-text-primary">{stats.totalAnalyses}</div>
          <p className="text-xs text-gray-500 dark:text-dark-text-secondary mt-1">Franquias processadas</p>
        </div>
      </Card>

      {/* Recent Analysis Placeholder/Link (Moved to top row as requested) */}
       <Card className="p-6 bg-white shadow-sm flex flex-col justify-between dark:bg-dark-surface cursor-pointer hover:shadow-md transition-shadow" onClick={() => {
           // Scroll to recent analysis or just serve as a stat
           const el = document.getElementById('recent-analyses-section');
           if (el) el.scrollIntoView({ behavior: 'smooth' });
       }}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-500 dark:text-dark-text-secondary uppercase tracking-wider">Histórico</h3>
          <div className="bg-blue-100 dark:bg-brand-blue/20 p-1.5 rounded-full">
            <span className="text-xs font-bold text-brand-blue">{stats.totalAnalyses}</span>
          </div>
        </div>
        <div>
           <div className="flex items-center gap-2 text-brand-blue font-medium text-sm mt-2">
               Ver todas as análises <TrendingUp className="h-4 w-4" />
           </div>
           <p className="text-xs text-gray-500 dark:text-dark-text-secondary mt-1">Clique para acessar o histórico</p>
        </div>
      </Card>
    </div>
  );
}
