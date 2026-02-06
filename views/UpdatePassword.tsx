import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useLife } from '../context/LifeContext';
import { Lock, Loader2, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';

const UpdatePassword: React.FC = () => {
  const { navigateTo } = useLife();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [sessionChecked, setSessionChecked] = useState(false);

  // Tenta recuperar a sessão do link de recuperação automaticamente ao carregar a página
  useEffect(() => {
    const recoverSession = async () => {
      if (sessionChecked) return;
      setSessionChecked(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log('Sessão já ativa');
        return;
      }

      const url = new URL(window.location.href);
      
      // Tenta pegar tanto de query string quanto de hash (para cobrir os dois formatos)
      const params = url.searchParams;
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      
      const type = params.get('type') || hashParams.get('type');
      const token_hash = params.get('token_hash') || hashParams.get('token_hash');

      if (type === 'recovery' && token_hash) {
        console.log('Tentando verificar recovery com token_hash:', token_hash);
        const { error: verifyError } = await supabase.auth.verifyOtp({
          token_hash,
          type: 'recovery',
        });

        if (verifyError) {
          console.error('Erro no verifyOtp:', verifyError.message);
          setError(`Falha ao validar o link: ${verifyError.message}. O link pode ter sido usado ou expirado. Solicite um novo.`);
        } else {
          console.log('Recovery validado com sucesso');
          // Opcional: recarrega a sessão
          await supabase.auth.getSession();
        }
      } else {
        setError('Parâmetros de recuperação não encontrados na URL.');
      }
    };

    recoverSession();
  }, [sessionChecked]);

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

    try {
      // Garante que temos uma sessão antes de atualizar
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setError('Sessão não encontrada. Tente clicar novamente no link enviado por email.');
        setLoading(false);
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message);
        console.error('Erro ao atualizar senha:', updateError);
      } else {
        setSuccess(true);
        // Opcional: faz logout após atualizar a senha (recomendado)
        await supabase.auth.signOut();
        setTimeout(() => navigateTo('login'), 3000);
      }
    } catch (err: any) {
      setError('Ocorreu um erro inesperado. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold font-display text-slate-900">Nova Senha</h2>
          <p className="text-slate-500 mt-2 text-sm uppercase tracking-widest font-bold">
            Defina suas novas credenciais de acesso
          </p>
        </div>

        {success ? (
          <div className="space-y-6 text-center animate-in zoom-in-95">
            <div className="bg-green-50 border border-green-200 p-8 rounded-3xl">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-green-700 font-bold text-lg">Senha atualizada com sucesso!</p>
              <p className="text-green-600 text-sm mt-1">
                Você será redirecionado para o login em instantes.
              </p>
            </div>
            <button
              onClick={() => navigateTo('login')}
              className="text-blue-600 font-bold hover:underline text-sm uppercase tracking-widest"
            >
              Ir para o Login agora
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                Nova Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">
                Confirmar Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-blue-500/50 transition-all"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-500 font-bold text-center bg-red-50 py-2 rounded-lg border border-red-100 animate-in fade-in">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Atualizar Senha <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdatePassword;
