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

      let hash = window.location.hash.substring(1);  // Remove o #
      // Correção para hash corrompido (ex: update-password#access_token=...)
      if (hash.includes('#')) {
        hash = hash.split('#')[1] || '';  // Pega só a parte válida
      }

      const hashParams = new URLSearchParams(hash);
      const params = new URLSearchParams(window.location.search);  // Fallback para query

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
          await supabase.auth.getSession();
        }
      } else {
        setError('Parâmetros de recuperação não encontrados na URL. Verifique se o link está completo.');
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
        // Limpa o hash da URL
        window.history.replaceState({}, document.title, window.location.pathname);
        // Força logout para limpar sessões em todas as abas
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
    // ... o resto do return igual ao seu código original ...
  );
};

export default UpdatePassword;
