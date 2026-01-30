
import React, { useState } from 'react';
import { Shield, CreditCard, RefreshCw, Key, LogOut, Download, Trash2, User, Sliders, CheckCircle2 } from 'lucide-react';
import { useLife } from '../context/LifeContext';

const Settings: React.FC = () => {
  const { isSynced, toggleSync, subscriptionStatus } = useLife();
  const [pixStatus, setPixStatus] = useState<'idle' | 'generating' | 'success'>('idle');

  const generatePix = () => {
    setPixStatus('generating');
    setTimeout(() => setPixStatus('success'), 1500);
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500 pb-20 mx-auto">
      <header>
        <h2 className="text-3xl lg:text-4xl font-bold font-display tracking-tight text-slate-900">Configurações</h2>
        <p className="text-slate-500 mt-1">Gerencie seus dados e integrações estratégicas.</p>
      </header>

      <div className="grid grid-cols-1 gap-8">
        <section className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
              <User className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-display text-slate-900">Perfil Estratégico</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Nome de Comando</label>
              <input type="text" defaultValue="Ricardo Santos" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-5 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 focus:outline-none text-slate-800 transition-all font-medium" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email de Acesso</label>
              <input type="email" defaultValue="ricardo.apice@exec.com" className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 px-5 focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 focus:outline-none text-slate-800 transition-all font-medium" />
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-display text-slate-900">Sincronização de Calendários</h3>
          </div>
          <div className="space-y-4">
            <div className={`flex items-center justify-between p-6 bg-slate-50 rounded-3xl border ${isSynced.google ? 'border-green-200 bg-green-50/30' : 'border-slate-100'}`}>
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-6" />
                </div>
                <div>
                  <p className="font-bold text-slate-800">Google Calendar</p>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${isSynced.google ? 'text-green-600' : 'text-slate-400'}`}>
                    {isSynced.google ? 'Sincronizado via OAuth2' : 'Não Conectado'}
                  </p>
                </div>
              </div>
              <button onClick={() => toggleSync('google')} className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all text-slate-600 shadow-sm">
                {isSynced.google ? 'Desconectar' : 'Conectar'}
              </button>
            </div>

            <div className={`flex items-center justify-between p-6 bg-slate-50 rounded-3xl border ${isSynced.outlook ? 'border-green-200 bg-green-50/30' : 'border-slate-100'}`}>
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                  <div className="text-blue-600 font-bold">O</div>
                </div>
                <div>
                  <p className="font-bold text-slate-800">Outlook</p>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${isSynced.outlook ? 'text-green-600' : 'text-slate-400'}`}>
                    {isSynced.outlook ? 'Sincronizado' : 'Offline'}
                  </p>
                </div>
              </div>
              <button onClick={() => toggleSync('outlook')} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all text-white shadow-lg shadow-blue-100">
                {isSynced.outlook ? 'Desconectar' : 'Conectar'}
              </button>
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-display text-slate-900">Pagamentos & Assinatura</h3>
          </div>
          <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-inner">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-slate-200 pb-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Seu Plano Ativo</p>
                <p className="text-3xl font-bold font-display text-blue-600">APICE Master VIP</p>
                <p className="text-sm text-slate-500 mt-1">R$ 147,00 / faturamento mensal</p>
              </div>
              <div className="text-left sm:text-right">
                <span className="inline-block px-4 py-1.5 bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-green-200 shadow-sm">
                   {subscriptionStatus === 'active' ? 'Assinatura Ativa' : 'Em Análise'}
                </span>
              </div>
            </div>
            
            {pixStatus === 'success' ? (
              <div className="p-6 bg-green-50 border border-green-200 rounded-2xl flex items-center gap-4 animate-in zoom-in-95">
                 <CheckCircle2 className="w-8 h-8 text-green-600" />
                 <div>
                   <p className="font-bold text-slate-800">Pagamento Processado</p>
                   <p className="text-xs text-slate-500">Comprovante disponível em seu painel financeiro.</p>
                 </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={generatePix}
                  disabled={pixStatus === 'generating'}
                  className="flex-1 flex items-center justify-center gap-3 py-4 bg-white border border-slate-300 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all text-slate-700 shadow-sm disabled:opacity-50"
                >
                  <Key className="w-4 h-4 text-blue-600" /> {pixStatus === 'generating' ? 'Gerando QR Code...' : 'Pagar Fatura Pendente'}
                </button>
                <button className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl text-xs font-bold uppercase tracking-widest text-white shadow-xl shadow-blue-100 transition-all active:scale-95">
                  Gerenciar Ciclo
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
