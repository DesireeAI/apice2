
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { FileText, Download, Loader2, Search, Filter, ExternalLink } from 'lucide-react';

const Guide: React.FC = () => {
  const [guides, setGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    setLoading(true);
    try {
      // Lista arquivos diretamente da raiz do bucket 'guides'
      const { data, error } = await supabase.storage.from('guides').list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      });
      
      if (error) throw error;
      if (data) {
        // Filtra placeholders e arquivos de sistema
        setGuides(data.filter(f => f.name !== '.emptyFolderPlaceholder'));
      }
    } catch (err) {
      console.error("Erro ao carregar guias:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (filename: string) => {
    const { data, error } = await supabase.storage.from('guides').download(filename);
    
    if (error) {
      alert("Erro ao baixar arquivo. Verifique a conexão com o Storage.");
      return;
    }

    if (data) {
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const getFileUrl = (filename: string) => {
    const { data } = supabase.storage.from('guides').getPublicUrl(filename);
    return data.publicUrl;
  };

  const filteredGuides = guides.filter(g => 
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-bold font-display text-slate-900 tracking-tight">Guia & Biblioteca</h2>
          <p className="text-slate-500 mt-2 max-w-xl">
            Sua central de documentos técnicos, manuais e protocolos de performance.
          </p>
        </div>
      </header>

      {/* Busca */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Pesquisar manuais ou checklists..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all shadow-sm"
        />
      </div>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Arquivos Disponíveis ({guides.length})
          </h3>
          <button onClick={fetchGuides} className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">
            Sincronizar Storage
          </button>
        </div>
        
        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Carregando biblioteca...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.length > 0 ? filteredGuides.map((file) => (
              <div key={file.id} className="bg-white border border-slate-200 rounded-[2.5rem] p-7 hover:border-blue-300 transition-all group shadow-sm flex flex-col hover:shadow-lg hover:shadow-slate-200/50">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <FileText className="w-6 h-6" />
                  </div>
                  <a 
                    href={getFileUrl(file.name)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 text-slate-300 hover:text-blue-600 transition-colors"
                    title="Visualizar"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-bold font-display text-slate-800 mb-2 truncate" title={file.name}>
                    {file.name.replace('.pdf', '').replace(/-/g, ' ')}
                  </h3>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    <span>PDF</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                    <span>{Math.round((file.metadata?.size || 0) / 1024 / 1024 * 100) / 100} MB</span>
                  </div>
                </div>
                
                <div className="mt-8 flex gap-2">
                  <button 
                    onClick={() => handleDownload(file.name)}
                    className="flex-1 py-4 bg-slate-50 text-slate-600 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center justify-center gap-2 border border-slate-100"
                  >
                    <Download className="w-3.5 h-3.5" /> Baixar PDF
                  </button>
                </div>
              </div>
            )) : (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-[3rem] bg-slate-50/50">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-slate-500 font-bold font-display text-lg">Nenhum guia encontrado</p>
                <p className="text-slate-400 text-sm mt-1 max-w-xs mx-auto">
                  Os arquivos enviados para a raiz do bucket <b>guides</b> aparecerão automaticamente aqui.
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Guide;
