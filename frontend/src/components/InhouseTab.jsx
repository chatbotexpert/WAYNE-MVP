import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Trash2, Calendar, HardHat } from 'lucide-react';

export default function InhouseTab() {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    workforce_id: '',
    course_date: '',
    expiry_date: '',
    customer: '',
    cert_sent_date: '',
    certs_sent_to: '',
    notes: '',
    category: ''
  });

  const [inhouseMetrics, setInhouseMetrics] = useState([]);
  const [workforces, setWorkforces] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [iRes, wRes] = await Promise.all([
        api.get('/inhouse'),
        api.get('/workforce')
      ]);
      setInhouseMetrics(iRes.data);
      setWorkforces(wRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.role === 'Supervisor') return;
    try {
      await api.post('/inhouse', formData);
      setFormData({
        workforce_id: '', course_date: '', expiry_date: '', customer: '',
        cert_sent_date: '', certs_sent_to: '', notes: '', category: ''
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this In-House Certification record?")) return;
    try {
      await api.delete(`/inhouse/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Find selected candidate to display lookup fields
  const selectedCandidate = workforces.find(w => w.id === formData.workforce_id);

  return (
    <div className="pb-10">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">In-House Certification Tracker</h2>

      {user.role !== 'Supervisor' && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-slate-200 mb-8 max-w-5xl">
          
          <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <h3 className="font-semibold text-blue-400 mb-4 flex items-center"><HardHat className="w-4 h-4 mr-2"/> Candidate Selection</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-xs font-medium mb-1 text-slate-600">Candidate Name *</label>
                <select required name="workforce_id" value={formData.workforce_id} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none focus:ring-1 focus:ring-blue-500">
                  <option value="">Select Candidate...</option>
                  {workforces.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
              
              {/* Lookup Display Fields */}
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-500">Company Name (Lookup)</label>
                <div className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm">{selectedCandidate?.company?.name || '-'}</div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-500">In-House Cert No. (Lookup)</label>
                <div className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm">{selectedCandidate?.in_house_cert_number || '-'}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-4">
              <h3 className="font-semibold text-blue-400 flex items-center"><Calendar className="w-4 h-4 mr-2"/> Certification Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-600">Course Date</label>
                  <input type="date" name="course_date" value={formData.course_date} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-600">Expiry Date</label>
                  <input type="date" name="expiry_date" value={formData.expiry_date} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">Customer</label>
                <input type="text" name="customer" value={formData.customer} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">Certificate Category</label>
                <input type="text" name="category" value={formData.category} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-blue-400 flex items-center"><FileText className="w-4 h-4 mr-2"/> Logistics & Notes</h3>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">Certificate Sent Date</label>
                <input type="date" name="cert_sent_date" value={formData.cert_sent_date} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">Certs Sent To</label>
                <textarea name="certs_sent_to" value={formData.certs_sent_to} onChange={handleChange} rows="2" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none focus:ring-1 focus:ring-blue-500"></textarea>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows="2" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none focus:ring-1 focus:ring-blue-500"></textarea>
              </div>
            </div>

          </div>

          <div className="mt-8 flex justify-end border-t border-slate-200 pt-6">
            <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-slate-900 font-medium rounded-lg transition-colors">
              Add Record
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto w-full">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-slate-50/50 text-slate-600 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 font-medium">Candidate Name</th>
              <th className="px-6 py-3 font-medium">Company (Lookup)</th>
              <th className="px-6 py-3 font-medium">Cert No (Lookup)</th>
              <th className="px-6 py-3 font-medium">Category</th>
              <th className="px-6 py-3 font-medium">Customer</th>
              <th className="px-6 py-3 font-medium">Course Date</th>
              <th className="px-6 py-3 font-medium">Expiry</th>
              <th className="px-6 py-3 font-medium">Sent Date</th>
              <th className="px-6 py-3 font-medium">Sent To</th>
              <th className="px-6 py-3 font-medium">Notes</th>
              {user.role === 'Admin' && <th className="px-6 py-3 font-medium text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {inhouseMetrics.map(i => (
              <tr key={i.id} className="hover:bg-slate-50 text-sm">
                <td className="px-6 py-4 font-bold text-slate-900">{i.workforce?.name}</td>
                <td className="px-6 py-4 text-slate-600">{i.workforce?.company?.name || '-'}</td>
                <td className="px-6 py-4 text-slate-600">{i.workforce?.in_house_cert_number || '-'}</td>
                <td className="px-6 py-4 text-blue-400">{i.category || '-'}</td>
                <td className="px-6 py-4 text-slate-500">{i.customer || '-'}</td>
                <td className="px-6 py-4 text-slate-600">{i.course_date ? new Date(i.course_date).toLocaleDateString() : '-'}</td>
                <td className="px-6 py-4 text-slate-600">{i.expiry_date ? new Date(i.expiry_date).toLocaleDateString() : '-'}</td>
                <td className="px-6 py-4 text-slate-600">{i.cert_sent_date ? new Date(i.cert_sent_date).toLocaleDateString() : '-'}</td>
                <td className="px-6 py-4 text-slate-600 truncate max-w-[150px]" title={i.certs_sent_to}>{i.certs_sent_to || '-'}</td>
                <td className="px-6 py-4 text-slate-600 truncate max-w-[150px]" title={i.notes}>{i.notes || '-'}</td>
                {user.role === 'Admin' && (
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(i.id)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 rounded-lg transition-colors">
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
