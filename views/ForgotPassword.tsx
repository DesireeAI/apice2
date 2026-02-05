import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useLife } from '../context/LifeContext';
import { Mail, ArrowLeft, Loader2, Send } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const { navigateTo } = useLife();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // URL completa para onde o link de recuperação deve redirecionar
    const redirectTo = `${window.location.origin}/#update-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo, // Isso ajuda o Supabase a redirecionar corretamente
    });

    if (error) {
      alert(error.message);
    } else {
      setMessage('E-mail de recuperação enviado! Verifique sua caixa de entrada (incluindo spam).');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100">
        <button 
          onClick={() => navigateTo('login')} 
          className="mb-6 flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Login
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold font-display text-slate-900">Recuperar Acesso</h2>
          <p className="text-slate-500 mt-2 text-sm uppercase tracking-widest font-bold">Enviaremos um link para seu e-mail</p>
        </div>

        {message ? (
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-3xl text-center">
            <p className="text-blue-700 font-bold">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Seu E-mail Cadastrado</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Enviar Link <Send className="w-4 h-4" /></>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
