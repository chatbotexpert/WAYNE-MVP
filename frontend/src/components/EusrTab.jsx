import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Trash2, Calendar, HardHat } from 'lucide-react';
import Select from 'react-select';

const eusrCategoryOptions = [
  { value: "Eusr National Water Hygiene", label: "Eusr National Water Hygiene" },
  { value: "Eusr Shea Water", label: "Eusr Shea Water" },
  { value: "EUSR Shea Power", label: "EUSR Shea Power" },
  { value: "EUSR Shea Tele", label: "EUSR Shea Tele" },
  { value: "EUSR Shea Gas", label: "EUSR Shea Gas" }
];

export default function EusrTab() {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    workforce_id: '',
    training_date: '',
    batch_number: '',
    expiry: '',
    category: '',
    date_resulted: '',
    card_type: '',
    dates_card_posted: '',
    notes: ''
  });

  const [eusrMetrics, setEusrMetrics] = useState([]);
  const [workforces, setWorkforces] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eRes, wRes] = await Promise.all([
        api.get('/eusr'),
        api.get('/workforce')
      ]);
      setEusrMetrics(eRes.data);
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
    const hasWriteAccess = ['Admin', 'Super_Admin', 'Training manager', 'Training Manager'].includes(user.role);
    if (!hasWriteAccess) return;
    try {
      await api.post('/eusr', formData);
      setFormData({
        workforce_id: '', training_date: '', batch_number: '', expiry: '',
        category: '', date_resulted: '', card_type: '', dates_card_posted: '', notes: ''
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this EUSR metric?")) return;
    try {
      await api.delete(`/eusr/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Find selected candidate to display lookup fields
  const selectedCandidate = workforces.find(w => w.id === formData.workforce_id);

  return (
    <div className="pb-10">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">EUSR Tracker</h2>

      {['Admin', 'Super_Admin', 'Training manager', 'Training Manager'].includes(user.role) && (
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
                <label className="block text-xs font-medium mb-1 text-slate-500">NI Number (Lookup)</label>
                <div className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm">{selectedCandidate?.ni_number || '-'}</div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-500">EUSR Number (Lookup)</label>
                <div className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm">{selectedCandidate?.eusr_number || '-'}</div>
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
                <label className="block text-xs font-medium mb-1 text-slate-600">Expiry Date</label>
                <input type="date" name="expiry" value={formData.expiry} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">EUSR Category</label>
                <Select
                  options={eusrCategoryOptions}
                  value={eusrCategoryOptions.find(c => c.value === formData.category) || null}
                  onChange={(selectedOption) => setFormData(prev => ({ ...prev, category: selectedOption ? selectedOption.value : '' }))}
                  isClearable
                  isSearchable
                  placeholder="Select or type..."
                  className="text-sm"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderColor: '#e2e8f0',
                      borderRadius: '0.5rem',
                      padding: '1px',
                      boxShadow: 'none',
                      '&:hover': {
                        borderColor: '#94a3b8'
                      }
                    })
                  }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-blue-400 flex items-center"><FileText className="w-4 h-4 mr-2"/> Results & Card Info</h3>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">Batch Number</label>
                <input type="text" name="batch_number" value={formData.batch_number} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">Date Resulted</label>
                <input type="date" name="date_resulted" value={formData.date_resulted} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">Card Type</label>
                <input type="text" name="card_type" value={formData.card_type} onChange={handleChange} placeholder="e.g. Physical, Virtual" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-blue-400 flex items-center"><FileText className="w-4 h-4 mr-2"/> Logistics & Notes</h3>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">Dates Card Posted</label>
                <input type="date" name="dates_card_posted" value={formData.dates_card_posted} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">Notes</label>
                <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none focus:ring-1 focus:ring-blue-500"></textarea>
              </div>
            </div>

          </div>

          <div className="mt-8 flex justify-end border-t border-slate-200 pt-6">
            <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
              Add EUSR Record
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
              <th className="px-6 py-3 font-medium">EUSR No (Lookup)</th>
              <th className="px-6 py-3 font-medium">Category</th>
              <th className="px-6 py-3 font-medium">Batch Number</th>
              <th className="px-6 py-3 font-medium">Training Date</th>
              <th className="px-6 py-3 font-medium">Expiry</th>
              <th className="px-6 py-3 font-medium">Date Resulted</th>
              <th className="px-6 py-3 font-medium">Card Type</th>
              <th className="px-6 py-3 font-medium">Date Posted</th>
              <th className="px-6 py-3 font-medium">Notes</th>
              {['Admin', 'Super_Admin', 'Training manager', 'Training Manager'].includes(user.role) && <th className="px-6 py-3 font-medium text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {eusrMetrics.map(e => (
              <tr key={e.id} className="hover:bg-slate-50 text-sm">
                <td className="px-6 py-4 font-bold text-slate-900">{e.workforce?.name}</td>
                <td className="px-6 py-4 text-slate-600">{e.workforce?.ni_number || '-'}</td>
                <td className="px-6 py-4 text-slate-600">{e.workforce?.eusr_number || '-'}</td>
                <td className="px-6 py-4 text-blue-400">{e.category || '-'}</td>
                <td className="px-6 py-4 text-slate-500">{e.batch_number || '-'}</td>
                <td className="px-6 py-4 text-slate-600">{e.training_date ? new Date(e.training_date).toLocaleDateString() : '-'}</td>
                <td className="px-6 py-4 text-slate-600">{e.expiry ? new Date(e.expiry).toLocaleDateString() : '-'}</td>
                <td className="px-6 py-4 text-slate-600">{e.date_resulted ? new Date(e.date_resulted).toLocaleDateString() : '-'}</td>
                <td className="px-6 py-4 text-slate-600">{e.card_type || '-'}</td>
                <td className="px-6 py-4 text-slate-600">{e.dates_card_posted ? new Date(e.dates_card_posted).toLocaleDateString() : '-'}</td>
                <td className="px-6 py-4 text-slate-600 truncate max-w-[150px]" title={e.notes}>{e.notes || '-'}</td>
                {['Admin', 'Super_Admin', 'Training manager', 'Training Manager'].includes(user.role) && (
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(e.id)} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 rounded-lg transition-colors">
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
