
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useLife } from '../context/LifeContext';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

const Login: React.FC = () => {
  const { navigateTo, setUser } = useLife();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setError('Credenciais inválidas. Tente novamente.');
      setLoading(false);
    } else {
      setUser({ 
        id: data.user.id, 
        email: data.user.email!, 
        full_name: data.user.user_metadata?.full_name 
      });
      navigateTo('dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold font-display text-slate-900">APICE<span className="text-blue-600">4</span></h1>
          <p className="text-slate-500 mt-2 text-sm uppercase tracking-widest font-bold">Acesse seu Centro de Comando</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 outline-none transition-all"
              />
            </div>
            <div className="flex justify-end pt-1">
              <button 
                type="button" 
                onClick={() => navigateTo('forgot-password')}
                className="text-[10px] font-bold text-blue-600 hover:underline uppercase tracking-widest"
              >
                Esqueci minha senha
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-red-500 font-bold text-center bg-red-50 py-2 rounded-lg">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Entrar no Comando <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-sm text-slate-500">
            Ainda não tem uma conta?{' '}
            <button onClick={() => navigateTo('signup')} className="text-blue-600 font-bold hover:underline">
              Crie agora gratuitamente
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
