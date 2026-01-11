export interface FinancialData {
  initial_investment: string;
  franchise_fee: string;
  royalties: string;
  advertising_fund: string;
  payback_period: string;
  profitability: string;
}

export interface AnalysisResult {
  filename: string;
  franchise_name?: string;
  cnpj?: string;
  uploadDate: string;
  score: number;
  summary: string;
  financials?: FinancialData;
  risks: {
    severity: 'high' | 'medium' | 'low';
    title: string;
    description: string;
  }[];
  missingClauses: string[];
  recommendations: string[];
  from_cache?: boolean;
  extracted_data?: {
    cnpj?: string;
  };
  id?: string;
}
