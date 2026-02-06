
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useLife } from '../context/LifeContext';
import { Lock, Loader2, CheckCircle, ArrowRight, ShieldAlert } from 'lucide-react';

const UpdatePassword: React.FC = () => {
  const { navigateTo, setIsRecovering } = useLife();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleUpdate = async (e: React.FormEvent) => {
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
    setError('');

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      // Limpa o estado de recuperação após sucesso para permitir navegação
      setIsRecovering(false);
      
      // Redirecionamento automático após 4 segundos como fallback
      const timer = setTimeout(() => navigateTo('dashboard'), 4000);
      return () => clearTimeout(timer);
    }
  };

  const handleManualContinue = () => {
    setIsRecovering(false);
    navigateTo('dashboard');
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-500">
      <div className="w-full max-w-md bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-blue-600 shadow-inner">
            {success ? <CheckCircle className="w-10 h-10 text-green-500 animate-in zoom-in duration-500" /> : <ShieldAlert className="w-10 h-10" />}
          </div>
          <h2 className="text-3xl font-bold font-display text-slate-900 tracking-tight">
            {success ? 'Senha Atualizada' : 'Segurança de Conta'}
          </h2>
          <p className="text-slate-500 mt-2 text-sm uppercase tracking-widest font-bold">
            {success ? 'Acesso restaurado com sucesso' : 'Defina sua nova senha de comando'}
          </p>
        </div>

        {success ? (
          <div className="space-y-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-green-50 border border-green-100 p-8 rounded-[2.5rem]">
              <p className="text-green-800 font-bold text-lg leading-tight">Sua nova senha mestre já está ativa.</p>
              <p className="text-green-600 text-xs mt-2">O Centro de Comando está pronto para você.</p>
            </div>

            <button 
              onClick={handleManualContinue}
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-95 group"
            >
              Entrar na Minha Conta 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] animate-pulse">
              Redirecionando automaticamente em instantes...
            </p>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Nova Senha Mestra</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="password" 
                  required 
                  autoFocus
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 pl-12 pr-4 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Confirmar Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="password" 
                  required 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a senha"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-5 pl-12 pr-4 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all font-medium"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-500 font-bold text-center bg-red-50 py-3 rounded-2xl border border-red-100 animate-in shake duration-300">
                {error}
              </p>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Validar Nova Senha <ArrowRight className="w-4 h-4" /></>}
            </button>

            <p className="text-center text-[10px] text-slate-400 font-medium px-4">
              Esta é uma medida de segurança obrigatória para restaurar o acesso à sua conta.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdatePassword;
