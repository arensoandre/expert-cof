import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { FileText, Loader2, CheckCircle } from 'lucide-react';

export default function UpdatePassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if we have a session (user clicked email link)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // If no session, maybe the link is invalid or expired
        // But let's allow them to try anyway, sometimes session is set async
      }
    });
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres.');
        return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setSuccess(true);
      // Redirect after 3 seconds
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar a senha.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-dark-bg px-4 transition-colors">
            <Card className="w-full max-w-md text-center p-6">
                <div className="flex justify-center mb-4">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Senha Atualizada!</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Sua senha foi alterada com sucesso. Você será redirecionado para o login em instantes.
                </p>
                <Button onClick={() => navigate('/login')} className="w-full">
                    Ir para Login agora
                </Button>
            </Card>
        </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-dark-bg px-4 py-12 sm:px-6 lg:px-8 transition-colors">
      <Link to="/" className="mb-8 flex items-center gap-2">
        <FileText className="h-8 w-8 text-blue-700 dark:text-brand-blue" />
        <span className="text-2xl font-bold text-gray-900 dark:text-white">Expert COF</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Nova Senha</CardTitle>
          <CardDescription>
            Digite sua nova senha segura
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleUpdatePassword}>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Nova Senha
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-dark-surface dark:border-dark-border dark:text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirmar Nova Senha
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                minLength={6}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-dark-surface dark:border-dark-border dark:text-white"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Nova Senha
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
