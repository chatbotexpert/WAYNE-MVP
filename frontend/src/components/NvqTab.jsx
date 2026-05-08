import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Trash2, Calendar, HardHat, CheckSquare } from 'lucide-react';

export default function NvqTab() {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    workforce_id: '',
    nvq_title: '',
    bolt_on_nvq: '',
    uln_number: '',
    po_number: '',
    card_scheme_category: '',
    site_address: '',
    site_contact_info: '',
    english_understanding_confirmed: 'false',
    tc_acknowledged: 'false',
    gdpr_consent: 'false',
    card_extension_date: '',
    date_registered: '',
    date_induction_booked: '',
    stage_of_nvq: '',
    notes: '',
    completed_date: '',
    certification_date: ''
  });

  const [nvqMetrics, setNvqMetrics] = useState([]);
  const [workforces, setWorkforces] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [nRes, wRes] = await Promise.all([
        api.get('/nvq'),
        api.get('/workforce')
      ]);
      setNvqMetrics(nRes.data);
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
      const payload = {
        ...formData,
        english_understanding_confirmed: formData.english_understanding_confirmed === 'true',
        tc_acknowledged: formData.tc_acknowledged === 'true',
        gdpr_consent: formData.gdpr_consent === 'true',
      };
      await api.post('/nvq', payload);
      setFormData({
        workforce_id: '', nvq_title: '', bolt_on_nvq: '', uln_number: '', po_number: '',
        card_scheme_category: '', site_address: '', site_contact_info: '',
        english_understanding_confirmed: 'false', tc_acknowledged: 'false', gdpr_consent: 'false',
        card_extension_date: '', date_registered: '', date_induction_booked: '', stage_of_nvq: '',
        notes: '', completed_date: '', certification_date: ''
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this NVQ metric?")) return;
    try {
      await api.delete(`/nvq/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const selectedCandidate = workforces.find(w => w.id === formData.workforce_id);

  return (
    <div className="pb-10">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">NVQ Tracker</h2>

      {user.role !== 'Supervisor' && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border border-slate-200 mb-8 max-w-6xl">
          
          <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <h3 className="font-semibold text-blue-400 mb-4 flex items-center"><HardHat className="w-4 h-4 mr-2"/> Candidate Selection</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">Candidate Name *</label>
                <select required name="workforce_id" value={formData.workforce_id} onChange={handleChange} className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none focus:ring-1 focus:ring-blue-500">
                  <option value="">Select Candidate...</option>
                  {workforces.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-500">NI Number (Lookup)</label>
                <div className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm">{selectedCandidate?.ni_number || '-'}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="space-y-4">
              <h3 className="font-semibold text-blue-400 flex items-center"><FileText className="w-4 h-4 mr-2"/> Course Info</h3>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">NVQ Title</label>
                <input type="text" name="nvq_title" value={formData.nvq_title} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">Bolt on NVQ</label>
                <input type="text" name="bolt_on_nvq" value={formData.bolt_on_nvq} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">ULN Number</label>
                <input type="text" name="uln_number" value={formData.uln_number} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">Card Scheme Category</label>
                <input type="text" name="card_scheme_category" value={formData.card_scheme_category} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-blue-400 flex items-center"><Calendar className="w-4 h-4 mr-2"/> Logistics</h3>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">PO Number</label>
                <input type="text" name="po_number" value={formData.po_number} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">Site Address</label>
                <textarea name="site_address" value={formData.site_address} onChange={handleChange} rows="2" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none focus:ring-1 focus:ring-blue-500"></textarea>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">Site Contact Name/Number</label>
                <input type="text" name="site_contact_info" value={formData.site_contact_info} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-600">Induction Booked</label>
                  <input type="date" name="date_induction_booked" value={formData.date_induction_booked} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-slate-900 text-xs outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-600">Date Registered</label>
                  <input type="date" name="date_registered" value={formData.date_registered} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-slate-900 text-xs outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-blue-400 flex items-center"><CheckSquare className="w-4 h-4 mr-2"/> Compliance & Status</h3>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-600">English OK</label>
                  <select name="english_understanding_confirmed" value={formData.english_understanding_confirmed} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-slate-900 text-xs outline-none">
                    <option value="false">No</option><option value="true">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-600">T&C</label>
                  <select name="tc_acknowledged" value={formData.tc_acknowledged} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-slate-900 text-xs outline-none">
                    <option value="false">No</option><option value="true">Yes</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-600">GDPR</label>
                  <select name="gdpr_consent" value={formData.gdpr_consent} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-slate-900 text-xs outline-none">
                    <option value="false">No</option><option value="true">Yes</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-600">Completed</label>
                  <input type="date" name="completed_date" value={formData.completed_date} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-slate-900 text-xs outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-600">Cert Date</label>
                  <input type="date" name="certification_date" value={formData.certification_date} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-slate-900 text-xs outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-600">Card Extension</label>
                  <input type="date" name="card_extension_date" value={formData.card_extension_date} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-slate-900 text-xs outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-600">Stage</label>
                  <input type="text" name="stage_of_nvq" value={formData.stage_of_nvq} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-2 text-slate-900 text-xs outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows="2" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none"></textarea>
              </div>
            </div>

          </div>

          <div className="mt-8 flex justify-end border-t border-slate-200 pt-6">
            <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
              Add NVQ Record
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto w-full">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-slate-50/50 text-slate-600 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 font-medium">Candidate Name</th>
              <th className="px-6 py-3 font-medium">NI No (Lookup)</th>
              <th className="px-6 py-3 font-medium">NVQ Title</th>
              <th className="px-6 py-3 font-medium">Bolt on NVQ</th>
              <th className="px-6 py-3 font-medium">ULN</th>
              <th className="px-6 py-3 font-medium">PO Number</th>
              <th className="px-6 py-3 font-medium">Category</th>
              <th className="px-6 py-3 font-medium">Stage</th>
              <th className="px-6 py-3 font-medium">Eng/TC/GDPR</th>
              <th className="px-6 py-3 font-medium">Registered</th>
              <th className="px-6 py-3 font-medium">Completed</th>
              <th className="px-6 py-3 font-medium">Cert Date</th>
              <th className="px-6 py-3 font-medium">Site Address</th>
              <th className="px-6 py-3 font-medium">Contact</th>
              <th className="px-6 py-3 font-medium">Notes</th>
              {['Admin', 'Super_Admin'].includes(user.role) && <th className="px-6 py-3 font-medium text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {nvqMetrics.map(n => (
              <tr key={n.id} className="hover:bg-slate-50 text-sm">
                <td className="px-6 py-4 font-bold text-slate-900">{n.workforce?.name}</td>
                <td className="px-6 py-4 text-slate-600">{n.workforce?.ni_number || '-'}</td>
                <td className="px-6 py-4 text-blue-400">{n.nvq_title || '-'}</td>
                <td className="px-6 py-4 text-slate-500">{n.bolt_on_nvq || '-'}</td>
                <td className="px-6 py-4 text-slate-600">{n.uln_number || '-'}</td>
                <td className="px-6 py-4 text-slate-600">{n.po_number || '-'}</td>
                <td className="px-6 py-4 text-slate-600">{n.card_scheme_category || '-'}</td>
                <td className="px-6 py-4 font-medium text-slate-500">{n.stage_of_nvq || '-'}</td>
                <td className="px-6 py-4 text-slate-600">
                  {n.english_understanding_confirmed ? '✅' : '❌'}/
                  {n.tc_acknowledged ? '✅' : '❌'}/
                  {n.gdpr_consent ? '✅' : '❌'}
                </td>
                <td className="px-6 py-4 text-slate-600">{n.date_registered ? new Date(n.date_registered).toLocaleDateString() : '-'}</td>
                <td className="px-6 py-4 text-slate-600">{n.completed_date ? new Date(n.completed_date).toLocaleDateString() : '-'}</td>
                <td className="px-6 py-4 text-slate-600">{n.certification_date ? new Date(n.certification_date).toLocaleDateString() : '-'}</td>
                <td className="px-6 py-4 text-slate-600 truncate max-w-[150px]" title={n.site_address}>{n.site_address || '-'}</td>
                <td className="px-6 py-4 text-slate-600">{n.site_contact_info || '-'}</td>
                <td className="px-6 py-4 text-slate-600 truncate max-w-[150px]" title={n.notes}>{n.notes || '-'}</td>
                {['Admin', 'Super_Admin'].includes(user.role) && (
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
