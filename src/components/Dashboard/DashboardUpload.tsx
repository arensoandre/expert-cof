import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Loader2, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { AnalysisResult } from '@/types/analysis';
import { supabase } from '@/lib/supabase';

interface DashboardUploadProps {
  onUploadSuccess: (data: AnalysisResult) => void;
}

export function DashboardUpload({ onUploadSuccess }: DashboardUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Por favor, envie apenas arquivos PDF.');
      return;
    }

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Get current session token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error('Usuário não autenticado.');
      }

      const response = await fetch('/api/cof/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Falha no upload do arquivo.');
      }

      const data = await response.json();
      console.log('Upload success:', data);
      onUploadSuccess(data);
      
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar arquivo.');
    } finally {
      setUploading(false);
    }
  }, [onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    multiple: false,
  });

  return (
    <Card className={`border-2 border-dashed transition-colors ${
      isDragActive 
        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
        : 'border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800'
    }`}>
      <div {...getRootProps()} className="flex flex-col items-center justify-center p-12 text-center cursor-pointer">
        <input {...getInputProps()} />
        
        <div className="mb-4 rounded-full bg-blue-100 p-4 dark:bg-blue-900/30">
          {uploading ? (
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin dark:text-blue-400" />
          ) : (
            <Upload className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          )}
        </div>

        {uploading ? (
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Processando sua COF...</h3>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {isDragActive ? 'Solte o arquivo aqui' : 'Nova Análise'}
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Arraste seu PDF ou clique para selecionar
            </p>
          </>
        )}

        {error && (
          <div className="mt-4 flex items-center text-sm text-red-600">
            <AlertCircle className="mr-2 h-4 w-4" />
            {error}
          </div>
        )}
      </div>
    </Card>
  );
}
