import React from 'react';
import { Upload, FileText, Lock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useNavigate } from 'react-router-dom';

export function UploadSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-white py-16" id="upload">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Experimente Agora
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Faça upload da sua COF (PDF) e receba uma análise preliminar gratuita em instantes.
          </p>
        </div>

        <div className="mx-auto max-w-2xl">
          <Card 
            className="border-2 border-dashed border-gray-300 bg-gray-50 p-12 transition-colors hover:border-blue-500 hover:bg-blue-50/50 cursor-pointer"
            onClick={() => navigate('/register')}
          >
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-full bg-blue-100 p-4">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                Arraste e solte seu PDF aqui
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Ou clique para selecionar um arquivo do seu computador
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Suporta apenas arquivos PDF (máx. 10MB)
              </p>
              
              <div className="mt-8 flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-gray-500 shadow-sm">
                <Lock className="h-3 w-3" />
                Seus documentos são criptografados e protegidos
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
