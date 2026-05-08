import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Shield, ShieldAlert, Check, X } from 'lucide-react';

export default function PermissionsTab() {
  const [users, setUsers] = useState([]);
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Fetch all employees to manage their permissions
      const res = await api.get('/users');
      // Filter out Super_Admin to prevent self-lockout or removing master access
      setUsers(res.data.filter(u => u.role !== 'Super_Admin'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = (userId, field, currentValue) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          permission_flags: {
            ...u.permission_flags,
            [field]: !currentValue
          }
        };
      }
      return u;
    }));
  };

  const savePermissions = async (user) => {
    setSavingId(user.id);
    try {
      const flags = user.permission_flags || {
        can_manage_users: false, can_manage_billing: false,
        can_export_data: false, can_delete_records: false,
        can_manage_permissions: false
      };
      
      await api.put(`/users/${user.id}/permissions`, flags);
      setTimeout(() => setSavingId(null), 1000);
    } catch (err) {
      console.error(err);
      alert('Failed to save permissions');
      setSavingId(null);
    }
  };

  return (
    <div className="pb-10">
      <div className="flex items-center mb-6">
        <ShieldAlert className="w-8 h-8 text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold text-slate-900">Permissions Matrix</h2>
      </div>
      <p className="text-slate-500 mb-8 max-w-3xl">
        As a Super Admin, you have granular control over what standard Admins, Supervisors, and Training Managers can do across the platform. Toggle capabilities below and click save to enforce them instantly.
      </p>

      <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto w-full">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-slate-50/50 text-slate-600 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 font-medium border-b border-slate-200">User</th>
              <th className="px-6 py-3 font-medium border-b border-slate-200">Role & Company</th>
              <th className="px-4 py-3 font-medium border-b border-slate-200 text-center">Manage Users</th>
              <th className="px-4 py-3 font-medium border-b border-slate-200 text-center">Manage Billing</th>
              <th className="px-4 py-3 font-medium border-b border-slate-200 text-center">Export Data</th>
              <th className="px-4 py-3 font-medium border-b border-slate-200 text-center">Delete Records</th>
              <th className="px-6 py-3 font-medium border-b border-slate-200 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map(u => {
              const flags = u.permission_flags || {};
              return (
                <tr key={u.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{u.name}</div>
                    <div className="text-xs text-slate-500">{u.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {u.role}
                    </span>
                    <div className="text-xs text-slate-500 mt-1">{u.company?.name || 'Internal'}</div>
                  </td>
                  
                  {/* Toggles */}
                  {[
                    { field: 'can_manage_users', val: flags.can_manage_users },
                    { field: 'can_manage_billing', val: flags.can_manage_billing },
                    { field: 'can_export_data', val: flags.can_export_data },
                    { field: 'can_delete_records', val: flags.can_delete_records }
                  ].map((p, idx) => (
                    <td key={idx} className="px-4 py-4 text-center">
                      <button
                        onClick={() => handleToggle(u.id, p.field, p.val)}
                        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${p.val ? 'bg-blue-600' : 'bg-slate-200'}`}
                      >
                        <span aria-hidden="true" className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${p.val ? 'translate-x-4' : 'translate-x-0'}`} />
                      </button>
                    </td>
                  ))}

                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => savePermissions(u)}
                      disabled={savingId === u.id}
                      className="inline-flex items-center px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-md transition-colors disabled:opacity-50"
                    >
                      {savingId === u.id ? <Check className="w-4 h-4 mr-1" /> : <Shield className="w-4 h-4 mr-1" />}
                      {savingId === u.id ? 'Saved' : 'Enforce'}
                    </button>
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-slate-500">
                  No standard users found in the system.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
