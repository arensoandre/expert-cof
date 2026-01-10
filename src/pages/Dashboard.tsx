import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DashboardUpload } from '@/components/Dashboard/DashboardUpload';
import { AnalysisResultView } from '@/components/Dashboard/AnalysisResult';
import { RecentAnalyses } from '@/components/Dashboard/RecentAnalyses';
import { DashboardStats } from '@/components/Dashboard/DashboardStats';
import { AnalysisResult } from '@/types/analysis';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [refreshList, setRefreshList] = useState(0);

  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId && user) {
        const verifyPayment = async () => {
             try {
                 const response = await fetch('http://localhost:8000/api/verify-checkout-session', {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({ session_id: sessionId, user_id: user.id })
                 });
                 const data = await response.json();
                 if (data.status === 'success') {
                     alert("Pagamento confirmado! Plano Premium ativado.");
                     window.history.replaceState({}, document.title, "/dashboard");
                     window.location.reload();
                 }
             } catch (e) {
                 console.error('Payment verification failed:', e);
             }
        };
        verifyPayment();
    }
  }, [sessionId, user]);



  const handleUploadSuccess = (data: AnalysisResult) => {
    setCurrentAnalysis(data);
    setRefreshList(prev => prev + 1); // Trigger refresh of the list
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg p-8 transition-colors">
      <div className="container mx-auto">
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary">Dashboard</h1>
            <p className="text-gray-500 dark:text-dark-text-secondary">Bem-vindo, {user?.email}</p>
        </div>

        {/* Stats Overview - Only show when not viewing a specific result */}
        {!currentAnalysis && <DashboardStats />}
        
        <div className="">
          {/* Main Content */}
          <div className="space-y-6">
            <section>
              {currentAnalysis ? (
                <AnalysisResultView 
                  result={currentAnalysis} 
                  onBack={() => setCurrentAnalysis(null)} 
                />
              ) : (
                <>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary mb-4">Nova Análise</h2>
                  <DashboardUpload onUploadSuccess={handleUploadSuccess} />
                  
                  {/* Recent Analysis inside Dashboard when no analysis selected */}
                  <div className="mt-8" id="recent-analyses-section">
                     <RecentAnalyses 
                        onSelectAnalysis={setCurrentAnalysis} 
                        refreshTrigger={refreshList}
                     />
                  </div>
                </>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
