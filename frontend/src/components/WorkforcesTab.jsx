import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Users, FileText, Calendar, Building2, Trash2 } from 'lucide-react';

export default function WorkforcesTab() {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    candidate_address: '',
    email: '',
    contact_number: '',
    date_of_birth: '',
    ni_number: '',
    cscs_expiry: '',
    swqr_expiry: '',
    eusr_expiry: '',
    cscs_number: '',
    swqr_number: '',
    eusr_number: '',
    npors_number: '',
    in_house_cert_number: '',
    company_id: '',
    supervisor_id: '',
    training_manager_id: ''
  });

  const [workforces, setWorkforces] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [companyEmployees, setCompanyEmployees] = useState([]);

  useEffect(() => {
    fetchWorkforces();
    if (user.role === 'Admin') {
      api.get('/companies').then(res => setCompanies(res.data));
    }
  }, [user.role]);

  useEffect(() => {
    if (formData.company_id) {
      api.get(`/users/employees?companyId=${formData.company_id}`)
         .then(res => setCompanyEmployees(res.data))
         .catch(err => console.error(err));
    } else {
      setCompanyEmployees([]);
    }
  }, [formData.company_id]);

  const fetchWorkforces = () => {
    api.get('/workforce').then(res => setWorkforces(res.data));
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/workforce', formData);
      setFormData({
        name: '', department: '', candidate_address: '', email: '', contact_number: '',
        date_of_birth: '', ni_number: '', cscs_expiry: '', swqr_expiry: '', eusr_expiry: '',
        cscs_number: '', swqr_number: '', eusr_number: '', npors_number: '', in_house_cert_number: '',
        company_id: '', supervisor_id: '', training_manager_id: ''
      });
      fetchWorkforces();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this candidate?")) return;
    try {
      await api.delete(`/workforce/${id}`);
      fetchWorkforces();
    } catch (err) {
      console.error(err);
      alert("Failed to delete workforce.");
    }
  };

  const supervisors = companyEmployees.filter(e => e.role === 'Supervisor');
  const trainingManagers = companyEmployees.filter(e => e.role === 'Training_Manager');

  return (
    <div className="pb-10">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Manage Workforce</h2>

      {user.role === 'Admin' && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-slate-200 mb-8 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* General Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-blue-400 flex items-center"><Users className="w-4 h-4 mr-2"/> General</h3>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">Candidate Name *</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">Department</label>
                <input type="text" name="department" value={formData.department} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">Date of Birth</label>
                <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">NI Number</label>
                <input type="text" name="ni_number" value={formData.ni_number} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none" />
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-blue-400 flex items-center"><Building2 className="w-4 h-4 mr-2"/> Contact & Company</h3>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">Contact Number</label>
                <input type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">Candidate Address</label>
                <textarea name="candidate_address" value={formData.candidate_address} onChange={handleChange} rows="2" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none"></textarea>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">Company Name *</label>
                <select required name="company_id" value={formData.company_id} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none">
                  <option value="">Select a company...</option>
                  {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">Training Manager</label>
                <select name="training_manager_id" value={formData.training_manager_id} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none" disabled={!formData.company_id}>
                  <option value="">Select Training Manager...</option>
                  {trainingManagers.map(tm => <option key={tm.id} value={tm.id}>{tm.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">Supervisor</label>
                <select name="supervisor_id" value={formData.supervisor_id} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none" disabled={!formData.company_id}>
                  <option value="">Select Supervisor...</option>
                  {supervisors.map(sup => <option key={sup.id} value={sup.id}>{sup.name}</option>)}
                </select>
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-4">
              <h3 className="font-semibold text-blue-400 flex items-center"><FileText className="w-4 h-4 mr-2"/> Certifications</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-600">CSCS No</label>
                  <input type="text" name="cscs_number" value={formData.cscs_number} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-slate-900 text-xs outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-600">CSCS Expiry</label>
                  <input type="date" name="cscs_expiry" value={formData.cscs_expiry} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-slate-900 text-xs outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-600">SWQR No</label>
                  <input type="text" name="swqr_number" value={formData.swqr_number} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-slate-900 text-xs outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-600">SWQR Expiry</label>
                  <input type="date" name="swqr_expiry" value={formData.swqr_expiry} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-slate-900 text-xs outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-600">EUSR No</label>
                  <input type="text" name="eusr_number" value={formData.eusr_number} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-slate-900 text-xs outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-600">EUSR Expiry</label>
                  <input type="date" name="eusr_expiry" value={formData.eusr_expiry} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-slate-900 text-xs outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium mb-1 text-slate-600">NPORS Number</label>
                  <input type="text" name="npors_number" value={formData.npors_number} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-slate-900 text-xs outline-none" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium mb-1 text-slate-600">In-House Cert Number</label>
                  <input type="text" name="in_house_cert_number" value={formData.in_house_cert_number} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-slate-900 text-xs outline-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end border-t border-slate-200 pt-6">
            <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-slate-900 font-medium rounded-lg transition-colors">
              Add Workforce
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto w-full">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-slate-50/50 text-slate-600 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 font-medium">Workforce No</th>
              <th className="px-6 py-3 font-medium">Candidate Name</th>
              <th className="px-6 py-3 font-medium">Department</th>
              <th className="px-6 py-3 font-medium">Company</th>
              <th className="px-6 py-3 font-medium">Company No</th>
              <th className="px-6 py-3 font-medium">Training Mgr</th>
              <th className="px-6 py-3 font-medium">Supervisor</th>
              <th className="px-6 py-3 font-medium">DOB</th>
              <th className="px-6 py-3 font-medium">NI No</th>
              <th className="px-6 py-3 font-medium">Contact No</th>
              <th className="px-6 py-3 font-medium">Email</th>
              <th className="px-6 py-3 font-medium">Address</th>
              <th className="px-6 py-3 font-medium">CSCS (No / Exp)</th>
              <th className="px-6 py-3 font-medium">SWQR (No / Exp)</th>
              <th className="px-6 py-3 font-medium">EUSR (No / Exp)</th>
              <th className="px-6 py-3 font-medium">NPORS</th>
              <th className="px-6 py-3 font-medium">In-House Cert</th>
              {user.role === 'Admin' && <th className="px-6 py-3 font-medium text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {workforces.map(w => (
              <tr key={w.id} className="hover:bg-slate-50 text-sm">
                <td className="px-6 py-4 text-blue-400 font-medium">{w.workforce_number || '-'}</td>
                <td className="px-6 py-4 font-bold text-slate-900">{w.name}</td>
                <td className="px-6 py-4 text-slate-500">{w.department || '-'}</td>
                <td className="px-6 py-4 text-slate-500">{w.company?.name || '-'}</td>
                <td className="px-6 py-4 text-slate-600">{w.company?.company_number || '-'}</td>
                <td className="px-6 py-4 text-slate-600">{w.training_manager?.name || '-'}</td>
                <td className="px-6 py-4 text-slate-600">{w.supervisor?.name || '-'}</td>
                <td className="px-6 py-4 text-slate-600">{w.date_of_birth ? new Date(w.date_of_birth).toLocaleDateString() : '-'}</td>
                <td className="px-6 py-4 text-slate-600">{w.ni_number || '-'}</td>
                <td className="px-6 py-4 text-slate-600">{w.contact_number || '-'}</td>
                <td className="px-6 py-4 text-slate-600">{w.email || '-'}</td>
                <td className="px-6 py-4 text-slate-600">{w.candidate_address || '-'}</td>
                
                <td className="px-6 py-4 text-slate-600">
                  {w.cscs_number || '-'}{w.cscs_expiry ? ` / ${new Date(w.cscs_expiry).toLocaleDateString()}` : ''}
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {w.swqr_number || '-'}{w.swqr_expiry ? ` / ${new Date(w.swqr_expiry).toLocaleDateString()}` : ''}
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {w.eusr_number || '-'}{w.eusr_expiry ? ` / ${new Date(w.eusr_expiry).toLocaleDateString()}` : ''}
                </td>
                <td className="px-6 py-4 text-slate-600">{w.npors_number || '-'}</td>
                <td className="px-6 py-4 text-slate-600">{w.in_house_cert_number || '-'}</td>
                
                {user.role === 'Admin' && (
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(w.id)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
