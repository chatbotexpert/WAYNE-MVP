import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { CalendarDays, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

export default function TrainingMatrix() {
  const { user } = useAuth();
  const [matrixData, setMatrixData] = useState([]);

  useEffect(() => {
    fetchMatrix();
  }, []);

  const fetchMatrix = async () => {
    try {
      const res = await api.get('/workforce');
      setMatrixData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (expiryDate) => {
    if (!expiryDate) return 'bg-slate-100 text-slate-400';
    const daysUntilExpiry = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return 'bg-red-100 text-red-700 border-red-200'; // Expired
    if (daysUntilExpiry <= 30) return 'bg-amber-100 text-amber-700 border-amber-200'; // Expiring Soon
    return 'bg-emerald-100 text-emerald-700 border-emerald-200'; // Valid
  };

  const getStatusIcon = (expiryDate) => {
    if (!expiryDate) return <span className="text-xs">-</span>;
    const daysUntilExpiry = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return <XCircle className="w-4 h-4 mr-1" />;
    if (daysUntilExpiry <= 30) return <AlertTriangle className="w-4 h-4 mr-1" />;
    return <CheckCircle2 className="w-4 h-4 mr-1" />;
  };

  const getMetricDisplay = (workforce, metricType) => {
    let metricArray = [];
    if (metricType === 'NPORS') metricArray = workforce.npors_metrics;
    if (metricType === 'NRSWA') metricArray = workforce.nrswa_metrics;
    if (metricType === 'EUSR') metricArray = workforce.eusr_metrics;
    if (metricType === 'In-House Certificate') metricArray = workforce.inhouse_metrics;
    if (metricType === 'NVQ') metricArray = workforce.nvq_metrics;

    // Get the most recent metric entry or fallback
    let expiryDate = null;
    if (metricArray && metricArray.length > 0) {
      const latestMetric = metricArray.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
      expiryDate = latestMetric.expiry || latestMetric.expiry_date || latestMetric.certification_date;
    } else {
      // Fallback to legacy fields on the workforce object if no specific metric entry exists
      if (metricType === 'NPORS') expiryDate = workforce.npors_expiry; // assuming schema doesn't have it, will be null
      if (metricType === 'NRSWA') expiryDate = workforce.swqr_expiry;
      if (metricType === 'EUSR') expiryDate = workforce.eusr_expiry;
      if (metricType === 'In-House Certificate') expiryDate = workforce.in_house_expiry; // null
      if (metricType === 'NVQ') expiryDate = workforce.cscs_expiry; // using CSCS as fallback for NVQ 
    }

    if (!expiryDate) {
      return <td className="px-4 py-3 bg-slate-50 border-r border-slate-100 text-center text-slate-300">-</td>;
    }

    const colorClass = getStatusColor(expiryDate);
    return (
      <td className="px-4 py-3 border-r border-slate-100">
        <div className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${colorClass}`}>
          {getStatusIcon(expiryDate)}
          {new Date(expiryDate).toLocaleDateString('en-GB')}
        </div>
      </td>
    );
  };

  return (
    <div className="pb-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <CalendarDays className="w-8 h-8 text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-slate-900">Training Matrix</h2>
        </div>
        <div className="flex items-center space-x-4 text-xs font-medium bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-emerald-400 mr-2"></div> Valid</div>
          <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-amber-400 mr-2"></div> Expires {'<'} 30 Days</div>
          <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div> Expired</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-bold border-r border-slate-200 sticky left-0 bg-slate-50 z-10 w-64">Candidate Info</th>
              <th className="px-4 py-4 font-bold text-center border-r border-slate-200">NPORS</th>
              <th className="px-4 py-4 font-bold text-center border-r border-slate-200">NRSWA</th>
              <th className="px-4 py-4 font-bold text-center border-r border-slate-200">EUSR</th>
              <th className="px-4 py-4 font-bold text-center border-r border-slate-200">In-House</th>
              <th className="px-4 py-4 font-bold text-center">NVQ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {matrixData.map(wf => (
              <tr key={wf.id} className="hover:bg-blue-50/30 transition-colors">
                <td className="px-6 py-4 border-r border-slate-200 sticky left-0 bg-white z-10 group-hover:bg-blue-50/30">
                  <div className="font-bold text-slate-900">{wf.name}</div>
                  <div className="text-xs text-slate-500 font-mono mt-1">{wf.workforce_number}</div>
                  <div className="text-xs text-blue-600 mt-0.5">{wf.department || '-'}</div>
                </td>
                {getMetricDisplay(wf, 'NPORS')}
                {getMetricDisplay(wf, 'NRSWA')}
                {getMetricDisplay(wf, 'EUSR')}
                {getMetricDisplay(wf, 'In-House Certificate')}
                {getMetricDisplay(wf, 'NVQ')}
              </tr>
            ))}
            {matrixData.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                  No active workforce records found for this matrix.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
