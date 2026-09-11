'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  UserCheck, 
  RefreshCw,
  Mail,
  Calendar,
  Lock
} from 'lucide-react';

interface UserItem {
  id: number;
  email: string;
  role?: 'admin' | 'user';
  created_at?: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin');
      if (res.ok) {
        const data = await res.json();
        if (data.users) setUsers(data.users);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRole = async (userId: number) => {
    setActionLoadingId(userId);
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_role', userId }),
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: data.newRole } : u));
      }
    } catch (error) {
      console.error('Error toggling user role:', error);
    } finally {
      setActionLoadingId(null);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center space-x-2">
            <Users className="w-7 h-7 text-[#FACC15]" />
            <span>Gestão de Clientes & Tenants</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Gerencie contas cadastradas na plataforma e defina funções de acesso (Admin vs User)
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="px-4 py-2 rounded-xl bg-[#111936] border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center space-x-2 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Atualizar</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Buscar cliente por e-mail..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#111936] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#86198F]"
        />
      </div>

      {/* Users Table */}
      <div className="p-6 rounded-2xl bg-[#111936] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-white flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-[#FACC15]" />
            <span>Lista de Tenants ({filteredUsers.length})</span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#090E22] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">E-mail Corporativo</th>
                <th className="p-3">Função (Role)</th>
                <th className="p-3">Data de Cadastro</th>
                <th className="p-3 text-right">Ação Administrativa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-[#090E22]/60 transition-colors">
                  <td className="p-3 font-mono text-slate-500">#{user.id}</td>
                  <td className="p-3 font-semibold text-white flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-[#86198F]" />
                    <span>{user.email}</span>
                  </td>
                  <td className="p-3">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      user.role === 'admin'
                        ? 'bg-[#86198F]/20 border-[#86198F]/60 text-[#FACC15]'
                        : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}>
                      {(user.role || 'user').toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Hoje'}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleToggleRole(user.id)}
                      disabled={actionLoadingId === user.id}
                      className="px-3 py-1 rounded-lg bg-[#090E22] border border-slate-700 hover:border-[#86198F] text-xs font-medium text-slate-300 hover:text-white transition-all disabled:opacity-50"
                    >
                      {actionLoadingId === user.id ? 'Alterando...' : user.role === 'admin' ? 'Tornar Usuário' : 'Tornar Admin'}
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
