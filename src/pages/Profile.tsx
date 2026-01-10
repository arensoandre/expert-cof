import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CreditCard, Search, Save, Loader2, Edit2, Banknote, Wallet } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  name?: string;
  plan?: string;
  cpf?: string;
  phone?: string;
  zip_code?: string;
  address?: string;
  number?: string;
  complement?: string;
  district?: string;
  city?: string;
  state?: string;
}

export default function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'subscription'>('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);

  // Payment State
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  
  // Cancel Confirmation State
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState('free');
  const [cpf, setCpf] = useState('');
  const [phone, setPhone] = useState('');
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam === 'subscription' || tabParam === 'security' || tabParam === 'profile') {
      setActiveTab(tabParam);
    }
  }, [location]);

  const fetchProfile = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        navigate('/login');
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) throw error;

      setUser(data);
      setName(data.name || '');
      setEmail(data.email || authUser.email || '');
      setPlan(data.plan || 'free');
      setCpf(data.cpf || '');
      setPhone(data.phone || '');
      setCep(data.zip_code || '');
      setAddress(data.address || '');
      setNumber(data.number || '');
      setComplement(data.complement || '');
      setDistrict(data.district || '');
      setCity(data.city || '');
      setState(data.state || '');
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // Helper Functions for Masks
  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '') // Remove non-digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1'); // Limit length
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const fetchAddressByCEP = async (cepValue: string) => {
    const cleanCep = cepValue.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;

    try {
      setLoading(true);
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setMessage({ type: 'error', text: 'CEP não encontrado.' });
        return;
      }

      setAddress(data.logradouro);
      setDistrict(data.bairro);
      setCity(data.localidade);
      setState(data.uf);
    } catch (err) {
      console.error('Error fetching CEP:', err);
      setMessage({ type: 'error', text: 'Erro ao buscar CEP.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCepBlur = () => {
    if (cep && isEditing) fetchAddressByCEP(cep);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('users')
        .update({
          name,
          cpf,
          phone,
          zip_code: cep,
          address,
          number,
          complement,
          district,
          city,
          state
        })
        .eq('id', user?.id);

      if (error) throw error;
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      setIsEditing(false); // Disable edit mode after save
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erro ao atualizar perfil.' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Senha atualizada com sucesso!' });
      setPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erro ao atualizar senha.' });
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async (gateway: 'stripe' | 'mercadopago' | 'pagseguro') => {
    setLoading(true);
    
    if (gateway === 'stripe') {
        try {
            const response = await fetch('http://localhost:8000/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: user?.id,
                    price_id: 'price_1So74jL6KJkeKKprcQNcdnyi' // Stripe Price ID
                })
            });
            
            if (!response.ok) {
                 const errData = await response.json();
                 throw new Error(errData.detail || 'Erro ao criar sessão de pagamento');
            }
            
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url; // Redirect to Stripe
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message });
            setLoading(false);
        }
        return;
    }

    setMessage({ type: 'success', text: `Redirecionando para o pagamento via ${gateway === 'mercadopago' ? 'Mercado Pago' : 'PagSeguro'}...` });
    
    // Simulating redirect delay for others
    setTimeout(async () => {
      try {
        // For MVP Demo: Simulate successful payment callback
        const { error } = await supabase
          .from('users')
          .update({ plan: 'premium' })
          .eq('id', user?.id);

        if (error) throw error;

        setPlan('premium');
        setMessage({ type: 'success', text: `Pagamento processado com sucesso! (Simulação ${gateway})` });
        setShowPaymentOptions(false);
      } catch (error: any) {
        setMessage({ type: 'error', text: error.message || 'Erro ao processar pagamento.' });
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  const handleCancelSubscription = async () => {
      setLoading(true);
      try {
           const response = await fetch('http://localhost:8000/api/cancel-subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: user?.id })
            });
             
             if (!response.ok) {
                 const errData = await response.json().catch(() => ({}));
                 throw new Error(errData.detail || 'Erro ao cancelar assinatura');
             }

             const data = await response.json();
             setMessage({ type: 'success', text: 'Assinatura cancelada com sucesso.' });
             setPlan('free');
             setShowCancelConfirm(false);
      } catch (error: any) {
          setMessage({ type: 'error', text: error.message || 'Erro desconhecido' });
      } finally {
          setLoading(false);
      }
  };

  const handleManageSubscription = async () => {
      setLoading(true);
      try {
           const response = await fetch('http://localhost:8000/api/create-portal-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: user?.id })
            });
             
             if (!response.ok) {
                 const errData = await response.json();
                 throw new Error(errData.detail || 'Erro ao acessar portal de assinatura');
             }

             const data = await response.json();
             if (data.url) window.location.href = data.url;
      } catch (error: any) {
          setMessage({ type: 'error', text: error.message });
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="bg-gray-50 dark:bg-dark-bg transition-colors p-8">
      <main className="container mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary mb-6">
          {activeTab === 'profile' && 'Perfil'}
          {activeTab === 'security' && 'Segurança'}
          {activeTab === 'subscription' && 'Assinatura'}
        </h1>
        
        <div className="space-y-6">
          <Card className="p-6">
            {message && (
                <div className={`mb-4 p-3 rounded-md ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                    : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {message.text}
                </div>
              )}

              {activeTab === 'profile' && (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text-primary">Dados Pessoais</h2>
                    {!isEditing && (
                      <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Editar Perfil
                      </Button>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Nome Completo</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={!isEditing}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-dark-bg dark:border-dark-border dark:text-dark-text-primary disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Email</label>
                      <input
                        type="email"
                        value={email}
                        disabled
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-500 cursor-not-allowed dark:bg-dark-sidebar dark:border-dark-border dark:text-dark-text-secondary"      
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">CPF</label> 
                      <input
                        type="text"
                        value={cpf}
                        placeholder="000.000.000-00"
                        onChange={(e) => setCpf(formatCPF(e.target.value))}
                        disabled={!isEditing}
                        maxLength={14}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-dark-bg dark:border-dark-border dark:text-dark-text-primary disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Telefone</label>
                      <input
                        type="text"
                        value={phone}
                        placeholder="(00) 00000-0000"
                        onChange={(e) => setPhone(formatPhone(e.target.value))}
                        disabled={!isEditing}
                        maxLength={15}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-dark-bg dark:border-dark-border dark:text-dark-text-primary disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Endereço</h3>  
                    <div className="grid gap-4 md:grid-cols-6">
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">CEP</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={cep}
                            onChange={(e) => setCep(e.target.value)}
                            onBlur={handleCepBlur}
                            placeholder="00000-000"
                            disabled={!isEditing}
                            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed"
                          />
                          <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      <div className="md:col-span-4 space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Endereço (Rua/Av)</label>
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          disabled={!isEditing}
                          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div className="md:col-span-1 space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Número</label>
                        <input
                          type="text"
                          value={number}
                          onChange={(e) => setNumber(e.target.value)}
                          disabled={!isEditing}
                          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Complemento</label>
                        <input
                          type="text"
                          value={complement}
                          onChange={(e) => setComplement(e.target.value)}
                          disabled={!isEditing}
                          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div className="md:col-span-3 space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Bairro</label>
                        <input
                          type="text"
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          disabled={!isEditing}
                          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div className="md:col-span-4 space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cidade</label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          disabled={!isEditing}
                          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado (UF)</label>
                        <input
                          type="text"
                          value={state}
                          maxLength={2}
                          onChange={(e) => setState(e.target.value.toUpperCase())}
                          disabled={!isEditing}
                          className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white disabled:opacity-60 disabled:cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="flex gap-4">
                        <Button type="button" variant="outline" onClick={() => {
                            setIsEditing(false);
                            fetchProfile(); // Reset fields to saved values
                        }} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Save className="mr-2 h-4 w-4" />
                            Salvar Alterações
                        </Button>
                    </div>
                  )}
                </form>
              )}

              {activeTab === 'security' && (
                <form onSubmit={handleUpdatePassword} className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Alterar Senha</h2>  
                  <div className="space-y-4 max-w-md">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nova Senha</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Confirmar Nova Senha</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={loading || !password}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Atualizar Senha
                  </Button>
                </form>
              )}

              {activeTab === 'subscription' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Gerenciar Assinatura</h2>

                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Plano Atual</p>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white capitalize">       
                          {plan === 'premium' ? 'Profissional' : 'Gratuito'}
                        </h3>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        plan === 'premium'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {plan === 'premium' ? 'Ativo' : 'Básico'}
                      </span>
                    </div>
                  </div>

                  {plan === 'free' ? (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Faça Upgrade para o Premium</h3>
                      
                      {!showPaymentOptions ? (
                        <>
                          <ul className="space-y-3 mb-6">
                            <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"> 
                              <CheckCircle className="h-4 w-4 text-green-500" /> Análises Ilimitadas
                            </li>
                            <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"> 
                              <CheckCircle className="h-4 w-4 text-green-500" /> Relatórios Financeiros Detalhados
                            </li>
                            <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"> 
                              <CheckCircle className="h-4 w-4 text-green-500" /> Suporte Prioritário
                            </li>
                          </ul>
                          <Button onClick={() => setShowPaymentOptions(true)} disabled={loading} className="w-full md:w-auto">    
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Assinar Premium (R$ 97/mês)
                          </Button>
                          <p className="text-xs text-gray-500 mt-2">
                            *Cancele quando quiser.
                          </p>
                        </>
                      ) : (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                           <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200">Escolha a forma de pagamento:</h4>
                           <div className="grid gap-3 md:grid-cols-3">
                              <Button variant="outline" className="h-24 flex flex-col gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-2 hover:border-blue-500 dark:bg-transparent dark:text-gray-200 dark:border-gray-600" onClick={() => handleProcessPayment('stripe')}>
                                <CreditCard className="h-8 w-8 text-blue-600" />
                                <span>Cartão (Stripe)</span>
                              </Button>
                              <Button variant="outline" className="h-24 flex flex-col gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-2 hover:border-blue-500 dark:bg-transparent dark:text-gray-200 dark:border-gray-600" onClick={() => handleProcessPayment('mercadopago')}>
                                <Banknote className="h-8 w-8 text-blue-500" />
                                <span>Mercado Pago</span>
                              </Button>
                              <Button variant="outline" className="h-24 flex flex-col gap-2 hover:bg-green-50 dark:hover:bg-green-900/20 border-2 hover:border-green-500 dark:bg-transparent dark:text-gray-200 dark:border-gray-600" onClick={() => handleProcessPayment('pagseguro')}>
                                <Wallet className="h-8 w-8 text-green-500" />
                                <span>PagSeguro</span>
                              </Button>
                           </div>
                           <Button variant="ghost" onClick={() => setShowPaymentOptions(false)} className="mt-4">
                             Cancelar
                           </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="mt-6">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        Você já possui acesso a todos os recursos premium. Obrigado por ser um assinante! 
                      </p>
                      
                      {!showCancelConfirm ? (
                        <div className="flex flex-col md:flex-row gap-4">
                            <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900/20" onClick={handleManageSubscription} disabled={loading}>
                              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Gerenciar Assinatura
                            </Button>
                            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => setShowCancelConfirm(true)} disabled={loading}>
                               Cancelar Plano
                            </Button>
                        </div>
                      ) : (
                        <div className="mt-4 p-4 border border-red-200 bg-red-50 rounded-lg animate-in fade-in slide-in-from-top-2">
                            <h4 className="text-red-800 font-semibold mb-2">Tem certeza que deseja cancelar?</h4>
                            <p className="text-red-600 text-sm mb-4">
                                Ao cancelar, você perderá acesso imediato aos recursos exclusivos do plano Profissional.
                            </p>
                            <div className="flex gap-3">
                                <Button 
                                    className="bg-red-600 hover:bg-red-700 text-white border-none" 
                                    onClick={handleCancelSubscription} 
                                    disabled={loading}
                                >
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Sim, Cancelar Agora
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                                    onClick={() => setShowCancelConfirm(false)}
                                    disabled={loading}
                                >
                                    Voltar
                                </Button>
                            </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>
      </main>
    </div>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}
