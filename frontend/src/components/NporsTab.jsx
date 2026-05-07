import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Trash2, Calendar, Building2, HardHat } from 'lucide-react';

export default function NporsTab() {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    workforce_id: '',
    training_date: '',
    training_address: '',
    on_number: '',
    novice_or_ewt: 'Novice',
    expiry: '',
    tester: '',
    date_pw_uploaded: '',
    cards_posted_info: '',
    category: ''
  });

  const [nporsMetrics, setNporsMetrics] = useState([]);
  const [workforces, setWorkforces] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [nRes, wRes] = await Promise.all([
        api.get('/npors'),
        api.get('/workforce')
      ]);
      setNporsMetrics(nRes.data);
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
      await api.post('/npors', formData);
      setFormData({
        workforce_id: '', training_date: '', training_address: '', on_number: '',
        novice_or_ewt: 'Novice', expiry: '', tester: '', date_pw_uploaded: '',
        cards_posted_info: '', category: ''
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this NPORS metric?")) return;
    try {
      await api.delete(`/npors/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Find selected candidate to display lookup fields
  const selectedCandidate = workforces.find(w => w.id === formData.workforce_id);

  return (
    <div className="pb-10">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">NPORS Tracker</h2>

      {user.role !== 'Supervisor' && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-slate-200 mb-8 max-w-5xl">
          
          <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <h3 className="font-semibold text-blue-400 mb-4 flex items-center"><HardHat className="w-4 h-4 mr-2"/> Candidate Selection</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <label className="block text-xs font-medium mb-1 text-slate-500">NI Number (Lookup)</label>
                <div className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm">{selectedCandidate?.ni_number || '-'}</div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-500">NPORS Number (Lookup)</label>
                <div className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm">{selectedCandidate?.npors_number || '-'}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="space-y-4">
              <h3 className="font-semibold text-blue-400 flex items-center"><Calendar className="w-4 h-4 mr-2"/> Training Info</h3>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">Training Date</label>
                <input type="date" name="training_date" value={formData.training_date} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">NPORS Category</label>
                <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="e.g. Excavator" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">Training Address</label>
                <textarea name="training_address" value={formData.training_address} onChange={handleChange} rows="2" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none focus:ring-1 focus:ring-blue-500"></textarea>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-blue-400 flex items-center"><FileText className="w-4 h-4 mr-2"/> Test Details</h3>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">On/Number</label>
                <input type="text" name="on_number" value={formData.on_number} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">Novice or EWT</label>
                <select name="novice_or_ewt" value={formData.novice_or_ewt} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none focus:ring-1 focus:ring-blue-500">
                  <option>Novice</option>
                  <option>EWT</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">Tester Name</label>
                <input type="text" name="tester" value={formData.tester} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">Expiry Date</label>
                <input type="date" name="expiry" value={formData.expiry} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-blue-400 flex items-center"><Building2 className="w-4 h-4 mr-2"/> Admin Logistics</h3>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">Date PW Uploaded</label>
                <input type="date" name="date_pw_uploaded" value={formData.date_pw_uploaded} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">Cards Posted Date/Address</label>
                <textarea name="cards_posted_info" value={formData.cards_posted_info} onChange={handleChange} rows="3" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none focus:ring-1 focus:ring-blue-500"></textarea>
              </div>
            </div>

          </div>

          <div className="mt-8 flex justify-end border-t border-slate-200 pt-6">
            <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-slate-900 font-medium rounded-lg transition-colors">
              Add NPORS Record
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
              <th className="px-6 py-3 font-medium">NI No (Lookup)</th>
              <th className="px-6 py-3 font-medium">NPORS No (Lookup)</th>
              <th className="px-6 py-3 font-medium">Category</th>
              <th className="px-6 py-3 font-medium">Type</th>
              <th className="px-6 py-3 font-medium">Training Date</th>
              <th className="px-6 py-3 font-medium">Expiry</th>
              <th className="px-6 py-3 font-medium">Tester</th>
              <th className="px-6 py-3 font-medium">On/No</th>
              <th className="px-6 py-3 font-medium">PW Uploaded</th>
              <th className="px-6 py-3 font-medium">Training Address</th>
              <th className="px-6 py-3 font-medium">Cards Info</th>
              {user.role === 'Admin' && <th className="px-6 py-3 font-medium text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {nporsMetrics.map(n => (
              <tr key={n.id} className="hover:bg-slate-50 text-sm">
                <td className="px-6 py-4 font-bold text-slate-900">{n.workforce?.name}</td>
                <td className="px-6 py-4 text-slate-600">{n.workforce?.company?.name || '-'}</td>
                <td className="px-6 py-4 text-slate-600">{n.workforce?.ni_number || '-'}</td>
                <td className="px-6 py-4 text-slate-600">{n.workforce?.npors_number || '-'}</td>
                <td className="px-6 py-4 text-slate-500">{n.category || '-'}</td>
                <td className="px-6 py-4 text-blue-400">{n.novice_or_ewt || '-'}</td>
                <td className="px-6 py-4 text-slate-600">{n.training_date ? new Date(n.training_date).toLocaleDateString() : '-'}</td>
                <td className="px-6 py-4 text-slate-600">{n.expiry ? new Date(n.expiry).toLocaleDateString() : '-'}</td>
                <td className="px-6 py-4 text-slate-600">{n.tester || '-'}</td>
                <td className="px-6 py-4 text-slate-600">{n.on_number || '-'}</td>
                <td className="px-6 py-4 text-slate-600">{n.date_pw_uploaded ? new Date(n.date_pw_uploaded).toLocaleDateString() : '-'}</td>
                <td className="px-6 py-4 text-slate-600 truncate max-w-[150px]" title={n.training_address}>{n.training_address || '-'}</td>
                <td className="px-6 py-4 text-slate-600 truncate max-w-[150px]" title={n.cards_posted_info}>{n.cards_posted_info || '-'}</td>
                {user.role === 'Admin' && (
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(n.id)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 rounded-lg transition-colors">
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
