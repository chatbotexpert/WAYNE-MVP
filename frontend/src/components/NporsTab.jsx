import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { FileText, Trash2, Calendar, Building2, HardHat } from 'lucide-react';
import Select from 'react-select';

const nporsCategoryOptions = [
  { value: "N241 Pay Welder", label: "N241 Pay Welder" },
  { value: "N601 Agricultural Tractor", label: "N601 Agricultural Tractor" },
  { value: "N726 Quick Hitch Awareness", label: "N726 Quick Hitch Awareness" },
  { value: "N214 Road Roller", label: "N214 Road Roller" },
  { value: "N216 Road Planer", label: "N216 Road Planer" },
  { value: "N217 Road Sweeper", label: "N217 Road Sweeper" },
  { value: "N220 Paver", label: "N220 Paver" },
  { value: "N244 Chipper", label: "N244 Chipper" },
  { value: "N609 Winching & Recovery", label: "N609 Winching & Recovery" },
  { value: "N802 Gritter/Snowplough", label: "N802 Gritter/Snowplough" },
  { value: "N027 Excavation Marshal - Banksperson", label: "N027 Excavation Marshal - Banksperson" },
  { value: "N029 Refuse Collection Vehicle", label: "N029 Refuse Collection Vehicle" },
  { value: "N120 Plant Loader & Securer", label: "N120 Plant Loader & Securer" },
  { value: "N210 Tow Tractor", label: "N210 Tow Tractor" },
  { value: "N219 Skip Loader", label: "N219 Skip Loader" },
  { value: "N225 Multi Lift & Drop - Hook Loader Vehicle", label: "N225 Multi Lift & Drop - Hook Loader Vehicle" },
  { value: "N243 Shunter Vehicle", label: "N243 Shunter Vehicle" },
  { value: "N607 4 x 4 Off Road Vehicle", label: "N607 4 x 4 Off Road Vehicle" },
  { value: "N608 All-Terrain Vehicle", label: "N608 All-Terrain Vehicle" },
  { value: "N045 Safe Use of Mobile Loading Ramps", label: "N045 Safe Use of Mobile Loading Ramps" },
  { value: "N017 Abrasive Wheels - Hand Held Cut off Saw", label: "N017 Abrasive Wheels - Hand Held Cut off Saw" },
  { value: "N025 Concrete Cutting Chainsaw", label: "N025 Concrete Cutting Chainsaw" },
  { value: "N301A Abrasive Wheels Awareness", label: "N301A Abrasive Wheels Awareness" },
  { value: "N301 Abrasive Wheels with Practical Cutting/Grinding", label: "N301 Abrasive Wheels with Practical Cutting/Grinding" },
  { value: "N302 Bench Saw", label: "N302 Bench Saw" },
  { value: "N303 Circular Saw", label: "N303 Circular Saw" },
  { value: "N304 Cable Avoidance Tool", label: "N304 Cable Avoidance Tool" },
  { value: "N602 Chainsaw - Maintenance and Cross Cutting", label: "N602 Chainsaw - Maintenance and Cross Cutting" },
  { value: "N603 Wood Chipper/Shredder", label: "N603 Wood Chipper/Shredder" },
  { value: "N604 Grass Cutters/Mowers", label: "N604 Grass Cutters/Mowers" },
  { value: "N605 Strimmer/Brushcutter", label: "N605 Strimmer/Brushcutter" },
  { value: "N606 Stump Grinder", label: "N606 Stump Grinder" },
  { value: "N610 Hand Held Hedge Trimmer", label: "N610 Hand Held Hedge Trimmer" },
  { value: "N710 Cartridge Tools", label: "N710 Cartridge Tools" },
  { value: "N048 Powered Handheld Breaker", label: "N048 Powered Handheld Breaker" },
  { value: "N033 Puller winch", label: "N033 Puller winch" },
  { value: "N038 High Pressure Water Jetting", label: "N038 High Pressure Water Jetting" },
  { value: "N049 Shoring (Install, Inspect, Remove)", label: "N049 Shoring (Install, Inspect, Remove)" },
  { value: "N050 3D GPS Machine Control System", label: "N050 3D GPS Machine Control System" },
  { value: "N015 Soil Displacement Hammer", label: "N015 Soil Displacement Hammer" },
  { value: "N022 Piling Rig Attendant", label: "N022 Piling Rig Attendant" },
  { value: "N026 Roll Crusher - Packer", label: "N026 Roll Crusher - Packer" },
  { value: "N130 Horizontal Directional Drilling Rig", label: "N130 Horizontal Directional Drilling Rig" },
  { value: "N207 Crusher", label: "N207 Crusher" },
  { value: "N208 Screener", label: "N208 Screener" },
  { value: "N211 Concrete Pump (Mobile)", label: "N211 Concrete Pump (Mobile)" },
  { value: "N221 Piling Rig", label: "N221 Piling Rig" },
  { value: "N721 Static Concrete Placing Boom", label: "N721 Static Concrete Placing Boom" },
  { value: "N040 Soil Stabiliser", label: "N040 Soil Stabiliser" },
  { value: "N041 Post Rammer", label: "N041 Post Rammer" },
  { value: "N031 Asbestos Awareness", label: "N031 Asbestos Awareness" },
  { value: "N034 Plant Supervisor Awareness", label: "N034 Plant Supervisor Awareness" },
  { value: "N035 MEWP Supervisor Awareness", label: "N035 MEWP Supervisor Awareness" },
  { value: "N036 FLT Supervisor Awareness", label: "N036 FLT Supervisor Awareness" },
  { value: "N132 Plant Mover - Non Operational Duties", label: "N132 Plant Mover - Non Operational Duties" },
  { value: "N133 Plant Machinery Marshal", label: "N133 Plant Machinery Marshal" },
  { value: "N403 Vehicle Marshal", label: "N403 Vehicle Marshal" },
  { value: "N404 Safe Working at Height", label: "N404 Safe Working at Height" },
  { value: "N702A Confined Spaces-Low Risk", label: "N702A Confined Spaces-Low Risk" },
  { value: "N702B Confined Spaces-Medium Risk", label: "N702B Confined Spaces-Medium Risk" },
  { value: "N702C Confined Spaces-High Risk", label: "N702C Confined Spaces-High Risk" },
  { value: "N703 Fire Warden", label: "N703 Fire Warden" },
  { value: "N704 Manual Handling", label: "N704 Manual Handling" },
  { value: "N711 Safe Use of Ladders and Ladders", label: "N711 Safe Use of Ladders and Ladders" },
  { value: "N714 Safety at Street and Road Works", label: "N714 Safety at Street and Road Works" },
  { value: "N723 Harness and Fall Arrest", label: "N723 Harness and Fall Arrest" },
  { value: "S030 Port Safety Passport", label: "S030 Port Safety Passport" },
  { value: "S001 Site Safety Awareness", label: "S001 Site Safety Awareness" },
  { value: "S029 Construction Site Safety Supervisor", label: "S029 Construction Site Safety Supervisor" },
  { value: "S031 Construction Site Safety Manager", label: "S031 Construction Site Safety Manager" },
  { value: "S032 Construction Site Safety Manager - Refresher", label: "S032 Construction Site Safety Manager - Refresher" },
  { value: "S033 Construction Site Safety Supervisor - Refresher", label: "S033 Construction Site Safety Supervisor - Refresher" }
];

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
    const hasWriteAccess = ['Admin', 'Super_Admin', 'Training manager', 'Training Manager'].includes(user.role);
    if (!hasWriteAccess) return;
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

      {['Admin', 'Super_Admin', 'Training manager', 'Training Manager'].includes(user.role) && (
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
                <Select
                  options={nporsCategoryOptions}
                  value={nporsCategoryOptions.find(c => c.value === formData.category) || null}
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
            <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
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
              {['Admin', 'Super_Admin', 'Training manager', 'Training Manager'].includes(user.role) && <th className="px-6 py-3 font-medium text-right">Actions</th>}
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
