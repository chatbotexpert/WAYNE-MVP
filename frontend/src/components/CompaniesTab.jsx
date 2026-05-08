import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Building2, FileText, Phone, Mail, FileDigit, Briefcase, Trash2 } from 'lucide-react';

export default function CompaniesTab() {
  const [formData, setFormData] = useState({
    name: '',
    registered_address: '',
    company_reg_number: '',
    vat_no: '',
    tel_no: '',
    email: '',
    accounts_contact_name: '',
    accounts_address: '',
    accounts_contact_number: '',
    accounts_email: '',
    notes_prices_agreed: '',
    size: 'Medium',
    main_contact: ''
  });
  
  const [companies, setCompanies] = useState([]);

  const fetchCompanies = () => {
    api.get('/companies').then(res => setCompanies(res.data));
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/companies', formData);
      setFormData({
        name: '', registered_address: '', company_reg_number: '',
        vat_no: '', tel_no: '', email: '', accounts_contact_name: '',
        accounts_address: '', accounts_contact_number: '', accounts_email: '',
        notes_prices_agreed: '', size: 'Medium', main_contact: ''
      });
      fetchCompanies();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;
    try {
      await api.delete(`/companies/${id}`);
      fetchCompanies();
    } catch (err) {
      console.error(err);
      alert("Failed to delete company. It may be linked to existing employees or workforces.");
    }
  };

  return (
    <div className="pb-10">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Manage Companies</h2>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-slate-200 mb-8 max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* General Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-blue-400 flex items-center"><Building2 className="w-4 h-4 mr-2"/> General</h3>
            <div>
              <label className="block text-xs font-medium mb-1 text-slate-600">Company Name *</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-slate-600">Company Reg Number</label>
              <input type="text" name="company_reg_number" value={formData.company_reg_number} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-slate-600">VAT No</label>
              <input type="text" name="vat_no" value={formData.vat_no} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-slate-600">Company Size *</label>
              <select name="size" value={formData.size} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm focus:ring-1 focus:ring-blue-500 outline-none">
                <option>Small</option>
                <option>Medium</option>
                <option>Large</option>
                <option>Enterprise</option>
              </select>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-blue-400 flex items-center"><Phone className="w-4 h-4 mr-2"/> Primary Contact</h3>
            <div>
              <label className="block text-xs font-medium mb-1 text-slate-600">Main Contact Name</label>
              <input type="text" name="main_contact" value={formData.main_contact} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-slate-600">Tel No</label>
              <input type="text" name="tel_no" value={formData.tel_no} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-slate-600">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-slate-600">Registered Address</label>
              <textarea name="registered_address" value={formData.registered_address} onChange={handleChange} rows="3" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm focus:ring-1 focus:ring-blue-500 outline-none"></textarea>
            </div>
          </div>

          {/* Accounts Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-blue-400 flex items-center"><Briefcase className="w-4 h-4 mr-2"/> Accounts</h3>
            <div>
              <label className="block text-xs font-medium mb-1 text-slate-600">Accounts Contact Name</label>
              <input type="text" name="accounts_contact_name" value={formData.accounts_contact_name} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-slate-600">Accounts Contact Number</label>
              <input type="text" name="accounts_contact_number" value={formData.accounts_contact_number} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-slate-600">Accounts Email</label>
              <input type="email" name="accounts_email" value={formData.accounts_email} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-slate-600">Accounts Address</label>
              <input type="text" name="accounts_address" value={formData.accounts_address} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-slate-600">Notes / Prices Agreed</label>
              <input type="text" name="notes_prices_agreed" value={formData.notes_prices_agreed} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm focus:ring-1 focus:ring-blue-500 outline-none" />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end border-t border-slate-200 pt-6">
          <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
            Add Company
          </button>
        </div>
      </form>

      <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto w-full">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-slate-50/50 text-slate-600 text-sm">
            <tr>
              <th className="px-6 py-3 font-medium">Number</th>
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Size</th>
              <th className="px-6 py-3 font-medium">Caps (TM/Sup/Dep)</th>
              <th className="px-6 py-3 font-medium">Reg Address</th>
              <th className="px-6 py-3 font-medium">Reg Number</th>
              <th className="px-6 py-3 font-medium">VAT No</th>
              <th className="px-6 py-3 font-medium">Tel No</th>
              <th className="px-6 py-3 font-medium">Email</th>
              <th className="px-6 py-3 font-medium">Main Contact</th>
              <th className="px-6 py-3 font-medium">Accounts Contact</th>
              <th className="px-6 py-3 font-medium">Accounts Address</th>
              <th className="px-6 py-3 font-medium">Accounts Number</th>
              <th className="px-6 py-3 font-medium">Accounts Email</th>
              <th className="px-6 py-3 font-medium">Notes</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {companies.map(c => (
              <tr key={c.id} className="hover:bg-slate-50 text-sm">
                <td className="px-6 py-4 text-blue-400 font-medium">{c.company_number || '-'}</td>
                <td className="px-6 py-4 font-bold text-slate-900">{c.name}</td>
                <td className="px-6 py-4 text-slate-500">{c.size}</td>
                <td className="px-6 py-4 text-slate-600">
                  <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-xs mr-1">{c.max_tm} TM</span>
                  <span className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded text-xs mr-1">{c.max_sup} Sup</span>
                  <span className="bg-green-500/10 text-green-400 px-2 py-1 rounded text-xs">{c.max_departments} Dep</span>
                </td>
                <td className="px-6 py-4 text-slate-600">{c.registered_address || '-'}</td>
                <td className="px-6 py-4 text-slate-600">{c.company_reg_number || '-'}</td>
                <td className="px-6 py-4 text-slate-600">{c.vat_no || '-'}</td>
                <td className="px-6 py-4 text-slate-600">{c.tel_no || '-'}</td>
                <td className="px-6 py-4 text-slate-600">{c.email || '-'}</td>
                <td className="px-6 py-4 text-slate-500">{c.main_contact || '-'}</td>
                <td className="px-6 py-4 text-slate-600">{c.accounts_contact_name || '-'}</td>
                <td className="px-6 py-4 text-slate-600">{c.accounts_address || '-'}</td>
                <td className="px-6 py-4 text-slate-600">{c.accounts_contact_number || '-'}</td>
                <td className="px-6 py-4 text-slate-600">{c.accounts_email || '-'}</td>
                <td className="px-6 py-4 text-slate-600">{c.notes_prices_agreed || '-'}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(c.id)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
