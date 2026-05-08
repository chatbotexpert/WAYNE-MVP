import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Trash2, Calendar, HardHat } from 'lucide-react';
import Select from 'react-select';

const nrswaCategoryOptions = [
  { value: "LA", label: "LA" },
  { value: "01", label: "01" },
  { value: "02", label: "02" },
  { value: "03", label: "03" },
  { value: "04", label: "04" },
  { value: "05", label: "05" },
  { value: "06", label: "06" },
  { value: "07", label: "07" },
  { value: "08", label: "08" },
  { value: "S1", label: "S1" },
  { value: "S2", label: "S2" },
  { value: "S3", label: "S3" },
  { value: "S4", label: "S4" },
  { value: "S5", label: "S5" },
  { value: "S6", label: "S6" },
  { value: "S7", label: "S7" }
];

export default function NrswaTab() {
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    workforce_id: '',
    training_date: '',
    expiry_date: '',
    category: '',
    certs_applied: 'false',
    certs_sent_date: '',
    certs_sent_to: '',
    course: ''
  });

  const [nrswaMetrics, setNrswaMetrics] = useState([]);
  const [workforces, setWorkforces] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [nRes, wRes] = await Promise.all([
        api.get('/nrswa'),
        api.get('/workforce')
      ]);
      setNrswaMetrics(nRes.data);
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
      const payload = {
        ...formData,
        certs_applied: formData.certs_applied === 'true'
      };
      await api.post('/nrswa', payload);
      setFormData({
        workforce_id: '', training_date: '', expiry_date: '', category: '',
        certs_applied: 'false', certs_sent_date: '', certs_sent_to: '', course: ''
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this NRSWA metric?")) return;
    try {
      await api.delete(`/nrswa/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Find selected candidate to display lookup fields
  const selectedCandidate = workforces.find(w => w.id === formData.workforce_id);

  return (
    <div className="pb-10">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">NRSWA (Streetworks) Tracker</h2>

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
                <label className="block text-xs font-medium mb-1 text-slate-500">SWQR Number (Lookup)</label>
                <div className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm">{selectedCandidate?.swqr_number || '-'}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-4">
              <h3 className="font-semibold text-blue-400 flex items-center"><Calendar className="w-4 h-4 mr-2"/> Training Info</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-600">Training Date</label>
                  <input type="date" name="training_date" value={formData.training_date} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-slate-600">Expiry Date</label>
                  <input type="date" name="expiry_date" value={formData.expiry_date} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">Streetworks Category</label>
                <Select
                  options={nrswaCategoryOptions}
                  value={nrswaCategoryOptions.find(c => c.value === formData.category) || null}
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
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">Course</label>
                <input type="text" name="course" value={formData.course} onChange={handleChange} placeholder="e.g. Operative, Supervisor" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-blue-400 flex items-center"><FileText className="w-4 h-4 mr-2"/> Certification Logistics</h3>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">Certs & Card Applied For?</label>
                <select name="certs_applied" value={formData.certs_applied} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none focus:ring-1 focus:ring-blue-500">
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">Cert / Card Sent Date</label>
                <input type="date" name="certs_sent_date" value={formData.certs_sent_date} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 text-slate-600">Certs Sent To</label>
                <textarea name="certs_sent_to" value={formData.certs_sent_to} onChange={handleChange} rows="2" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-900 text-sm outline-none focus:ring-1 focus:ring-blue-500"></textarea>
              </div>
            </div>

          </div>

          <div className="mt-8 flex justify-end border-t border-slate-200 pt-6">
            <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
              Add NRSWA Record
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
              <th className="px-6 py-3 font-medium">SWQR No (Lookup)</th>
              <th className="px-6 py-3 font-medium">Course</th>
              <th className="px-6 py-3 font-medium">Category</th>
              <th className="px-6 py-3 font-medium">Training Date</th>
              <th className="px-6 py-3 font-medium">Expiry</th>
              <th className="px-6 py-3 font-medium">Certs Applied?</th>
              <th className="px-6 py-3 font-medium">Sent Date</th>
              <th className="px-6 py-3 font-medium">Sent To</th>
              {['Admin', 'Super_Admin', 'Training manager', 'Training Manager'].includes(user.role) && <th className="px-6 py-3 font-medium text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {nrswaMetrics.map(n => (
              <tr key={n.id} className="hover:bg-slate-50 text-sm">
                <td className="px-6 py-4 font-bold text-slate-900">{n.workforce?.name}</td>
                <td className="px-6 py-4 text-slate-600">{n.workforce?.ni_number || '-'}</td>
                <td className="px-6 py-4 text-slate-600">{n.workforce?.swqr_number || '-'}</td>
                <td className="px-6 py-4 text-slate-500">{n.course || '-'}</td>
                <td className="px-6 py-4 text-blue-400">{n.category || '-'}</td>
                <td className="px-6 py-4 text-slate-600">{n.training_date ? new Date(n.training_date).toLocaleDateString() : '-'}</td>
                <td className="px-6 py-4 text-slate-600">{n.expiry_date ? new Date(n.expiry_date).toLocaleDateString() : '-'}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${n.certs_applied ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
                    {n.certs_applied ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600">{n.certs_sent_date ? new Date(n.certs_sent_date).toLocaleDateString() : '-'}</td>
                <td className="px-6 py-4 text-slate-600 truncate max-w-[150px]" title={n.certs_sent_to}>{n.certs_sent_to || '-'}</td>
                {['Admin', 'Super_Admin', 'Training manager', 'Training Manager'].includes(user.role) && (
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
