'use client';

import React, { useState } from 'react';
import { 
  FolderKanban, 
  Upload, 
  FileText, 
  Globe, 
  CheckCircle2, 
  Trash2, 
  Sparkles, 
  HardDrive,
  RefreshCw,
  Plus
} from 'lucide-react';

interface StoredFile {
  id: number;
  name: string;
  type: 'pdf' | 'gdrive';
  size?: string;
  date: string;
  status: 'indexed' | 'processing';
}

export default function DashboardKnowledge() {
  const [files, setFiles] = useState<StoredFile[]>([
    {
      id: 1,
      name: 'Catálogo_de_Produtos_e_Preços_2026.pdf',
      type: 'pdf',
      size: '2.4 MB',
      date: new Date().toLocaleDateString(),
      status: 'indexed',
    },
    {
      id: 2,
      name: 'Política_de_Atendimento_e_Trocas.pdf',
      type: 'pdf',
      size: '890 KB',
      date: new Date().toLocaleDateString(),
      status: 'indexed',
    },
  ]);

  const [uploading, setUploading] = useState(false);
  const [driveConnecting, setDriveConnecting] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    setUploading(true);

    setTimeout(() => {
      const newFile: StoredFile = {
        id: Date.now(),
        name: uploadedFiles[0].name,
        type: 'pdf',
        size: `${(uploadedFiles[0].size / 1024 / 1024).toFixed(1)} MB`,
        date: new Date().toLocaleDateString(),
        status: 'indexed',
      };

      setFiles((prev) => [newFile, ...prev]);
      setUploading(false);
    }, 1500);
  };

  const handleConnectDrive = async () => {
    setDriveConnecting(true);
    try {
      const res = await fetch('/api/drive');
      const data = await res.json();
      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error('Error connecting Google Drive:', error);
    } finally {
      setDriveConnecting(false);
    }
  };

  const handleDeleteFile = (id: number) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
          <FolderKanban className="w-7 h-7 text-brand-amber" />
          <span>Base de Conhecimento RAG</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Faça upload de PDFs institucionais ou conecte o Google Drive para contextualizar a IA
        </p>
      </div>

      {/* Action Upload Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PDF Upload Card */}
        <div className="glass-panel p-6 rounded-3xl border border-brand-violet/20 hover:border-brand-violet/40 transition-all">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-violet/20 border border-brand-violet/40 flex items-center justify-center">
              <Upload className="w-5 h-5 text-brand-amber" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Upload Direct PDF</h3>
              <p className="text-xs text-slate-400">Suporta arquivos PDF de até 25MB</p>
            </div>
          </div>

          <label className="border-2 border-dashed border-slate-700 hover:border-brand-violet rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-900/60 transition-all text-center">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
            {uploading ? (
              <div className="flex flex-col items-center space-y-2 text-brand-amber">
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span className="text-xs font-semibold">Extraindo e indexando PDF...</span>
              </div>
            ) : (
              <>
                <FileText className="w-8 h-8 text-brand-lavender mb-2" />
                <span className="text-xs font-bold text-white">Clique para selecionar PDF</span>
                <span className="text-[10px] text-slate-400 mt-1">ou arraste e solte seu arquivo aqui</span>
              </>
            )}
          </label>
        </div>

        {/* Google Drive Card */}
        <div className="glass-panel p-6 rounded-3xl border border-brand-violet/20 hover:border-brand-violet/40 transition-all">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-brand-magenta/20 border border-brand-magenta/40 flex items-center justify-center">
              <HardDrive className="w-5 h-5 text-brand-lavender" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Google Drive API</h3>
              <p className="text-xs text-slate-400">Sincronização via OAuth 2.0</p>
            </div>
          </div>

          <div className="border border-slate-800 rounded-2xl p-6 bg-slate-900/60 flex flex-col items-center justify-center text-center space-y-4">
            <p className="text-xs text-slate-300 leading-relaxed">
              Conecte sua conta corporativa do Google para ler pastas com manuais e documentos institucionais.
            </p>
            <button
              onClick={handleConnectDrive}
              disabled={driveConnecting}
              className="bg-brand-violet text-white font-bold px-6 py-2.5 rounded-xl hover:bg-brand-darkViolet transition-all shadow-md text-xs flex items-center space-x-2"
            >
              <Globe className="w-4 h-4 text-brand-amber" />
              <span>{driveConnecting ? 'Conectando...' : 'Conectar Google Drive'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Files List Table */}
      <div className="glass-panel p-6 rounded-2xl border border-brand-violet/20 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <FileText className="w-5 h-5 text-brand-amber" />
            <span>Documentos Indexados na Base ({files.length})</span>
          </h2>
          <span className="text-xs text-emerald-400 font-mono">STATUS: RAG ACTIVE</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">Nome do Arquivo</th>
                <th className="p-3">Tipo</th>
                <th className="p-3">Tamanho</th>
                <th className="p-3">Data de Upload</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {files.map((file) => (
                <tr key={file.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-3 font-semibold text-white flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-brand-violet shrink-0" />
                    <span className="truncate max-w-xs">{file.name}</span>
                  </td>
                  <td className="p-3">
                    <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                      {file.type}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">{file.size || 'N/A'}</td>
                  <td className="p-3 text-slate-400">{file.date}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center space-x-1 text-emerald-400 font-semibold text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Indexado</span>
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      className="text-slate-500 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
