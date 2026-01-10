import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { FileText, Loader2, ArrowLeft, Mail } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // 1. Send password reset email via Supabase
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`, // This page needs to be created
      });

      if (error) throw error;

      setMessage({
        type: 'success',
        text: 'Se houver uma conta com este email, você receberá um link para redefinir sua senha em instantes.'
      });
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err.message || 'Erro ao enviar email de recuperação.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-dark-bg px-4 py-12 sm:px-6 lg:px-8 transition-colors">
      <Link to="/" className="mb-8 flex items-center gap-2">
        <FileText className="h-8 w-8 text-blue-700 dark:text-brand-blue" />
        <span className="text-2xl font-bold text-gray-900 dark:text-white">Expert COF</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Recuperar Senha</CardTitle>
          <CardDescription className="text-center">
            Digite seu email para receber o link de redefinição
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleResetPassword}>
          <CardContent className="space-y-4">
            {message && (
              <div className={`rounded-md p-3 text-sm flex items-start gap-2 ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                  : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                {message.type === 'success' && <Mail className="h-4 w-4 mt-0.5" />}
                {message.text}
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email cadastrado
              </label>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                required
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-dark-surface dark:border-dark-border dark:text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enviar Link de Recuperação
            </Button>
            <div className="text-center text-sm">
              <Link to="/login" className="flex items-center justify-center gap-1 font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                <ArrowLeft className="h-3 w-3" /> Voltar para Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
