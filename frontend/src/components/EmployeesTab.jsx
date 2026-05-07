import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function EmployeesTab() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Supervisor');
  const [companyId, setCompanyId] = useState('');
  const [companies, setCompanies] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState('');

  const fetchEmployees = () => {
    api.get('/users').then(res => setEmployees(res.data)).catch(err => console.error(err));
  };

  useEffect(() => {
    api.get('/companies').then(res => setCompanies(res.data));
    fetchEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/employee', { name, email, role, company_id: companyId || null });
      setMessage('Employee created and email sent!');
      setName('');
      setEmail('');
      fetchEmployees();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error creating employee');
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Add New Employee</h2>
      
      {message && <div className="mb-6 p-4 rounded-lg bg-white border border-slate-200 text-blue-400">{message}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-500">Name</label>
          <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-500">Email</label>
          <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-slate-500">Role</label>
          <select value={role} onChange={e => setRole(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="Supervisor">Supervisor</option>
            <option value="Training_Manager">Training Manager</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        {(role === 'Supervisor' || role === 'Training_Manager') && (
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-500">Company Assignment</label>
            <select value={companyId} onChange={e => setCompanyId(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="">Select a company</option>
              {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        )}
        <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-slate-900 font-medium rounded-lg transition-colors">
          Create Employee
        </button>
      </form>

      <div className="mt-12">
        <h3 className="text-xl font-bold text-slate-900 mb-4">All Employees</h3>
        <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto w-full">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50/50 text-slate-600 text-sm">
              <tr>
                <th className="px-6 py-3 font-medium">Name</th>
                <th className="px-6 py-3 font-medium">Email</th>
                <th className="px-6 py-3 font-medium">Role</th>
                <th className="px-6 py-3 font-medium">Company</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {employees.map(e => (
                <tr key={e.id} className="hover:bg-slate-50 text-sm">
                  <td className="px-6 py-4 font-bold text-slate-900">{e.name}</td>
                  <td className="px-6 py-4 text-slate-600">{e.email}</td>
                  <td className="px-6 py-4 text-slate-500">
                    <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-xs">{e.role.replace('_', ' ')}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{e.company?.name || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
