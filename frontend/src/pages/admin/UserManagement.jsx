import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Users, Power } from 'lucide-react';

export default function UserManagement() {
  const { showToast, user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('all');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminUsers(roleFilter);
      setUsers(res.users || []);
    } catch (err) {
      showToast('Failed to fetch user directory.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleToggleActive = async (id, currentActive, name) => {
    try {
      await api.toggleUserActive(id);
      showToast(
        `Account for ${name} is now ${!currentActive ? 'Active' : 'Deactivated'}.`,
        !currentActive ? 'success' : 'warning'
      );
      fetchUsers();
    } catch (err) {
      showToast(err.message || 'Failed to update user state', 'error');
    }
  };

  const roleBadges = {
    patient: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    doctor: 'bg-blue-100 text-blue-800 border-blue-200',
    admin: 'bg-purple-100 text-purple-800 border-purple-200',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Users className="w-7 h-7 text-green-600" />
          <span>User Directory & Access Control</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage system users across Patient, Doctor, and Admin roles. Enable or disable user account access.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['all', 'patient', 'doctor', 'admin'].map((role) => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
              roleFilter === role
                ? 'bg-green-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {role === 'all' ? 'All Roles' : `${role}s`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-sm">Loading user directory...</div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <th className="py-3.5 px-4">User Name</th>
                  <th className="py-3.5 px-4">Gmail Address</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4">Approval</th>
                  <th className="py-3.5 px-4 text-right">Access Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-black text-slate-900">{u.name}</td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                          roleBadges[u.role] || 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                          u.is_active !== false
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {u.is_active !== false ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {u.role === 'doctor' ? (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            u.is_approved ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {u.is_approved ? 'Approved' : 'Pending'}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">N/A</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {u.id === currentUser?.id ? (
                        <span className="text-[10px] text-slate-400 italic">Self (Admin)</span>
                      ) : (
                        <button
                          onClick={() => handleToggleActive(u.id, u.is_active !== false, u.name)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition-colors flex items-center gap-1 ml-auto ${
                            u.is_active !== false
                              ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          <Power className="w-3 h-3" />
                          <span>{u.is_active !== false ? 'Deactivate' : 'Enable'}</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
