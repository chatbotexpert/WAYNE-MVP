import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Users, Building2, FileText, CheckCircle2 } from 'lucide-react';

export default function PublicIntake() {
  const { token } = useParams();
  const navigate = useNavigate();
  
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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
    consent_date: new Date().toISOString().split('T')[0],
    privacy_policy_version: 'v1.0'
  });

  useEffect(() => {
    // Fetch company info using the token
    api.get(`/intake/${token}/company`)
      .then(res => {
        setCompany(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Invalid or expired intake link. Please contact your company administrator.');
        setLoading(false);
      });
  }, [token]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/intake/${token}`, formData);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'An error occurred during submission. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 font-medium animate-pulse">Loading intake form...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-2xl border border-red-200 shadow-sm max-w-md">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Access Denied</h2>
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-10 rounded-2xl border border-green-200 shadow-sm max-w-md flex flex-col items-center">
          <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Registration Complete</h2>
          <p className="text-slate-600">Your profile has been successfully submitted to {company.name}. You may now close this window.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="max-w-3xl w-full">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Candidate Onboarding</h1>
          <p className="mt-2 text-slate-600">Registering with <span className="font-bold text-blue-600">{company.name}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-8">
          
          {/* General Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center border-b border-slate-100 pb-2"><Users className="w-5 h-5 mr-2 text-blue-500"/> Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Full Name *</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Date of Birth *</label>
                <input required type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">NI Number *</label>
                <input required type="text" name="ni_number" value={formData.ni_number} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="QQ 12 34 56 A" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Department</label>
                <input type="text" name="department" value={formData.department} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="e.g. Groundworks" />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center border-b border-slate-100 pb-2"><Building2 className="w-5 h-5 mr-2 text-blue-500"/> Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Email Address *</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">Contact Number *</label>
                <input required type="tel" name="contact_number" value={formData.contact_number} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="07123456789" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-slate-700">Home Address *</label>
                <textarea required name="candidate_address" value={formData.candidate_address} onChange={handleChange} rows="2" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="123 Example Street, City, Postcode"></textarea>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-4 bg-blue-50/30 p-6 rounded-xl border border-blue-100/50">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center mb-4"><FileText className="w-5 h-5 mr-2 text-blue-500"/> Current Qualifications <span className="text-xs font-normal text-slate-500 ml-2">(Fill any that apply)</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">CSCS Number</label>
                <input type="text" name="cscs_number" value={formData.cscs_number} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">CSCS Expiry</label>
                <input type="date" name="cscs_expiry" value={formData.cscs_expiry} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">SWQR Number</label>
                <input type="text" name="swqr_number" value={formData.swqr_number} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">SWQR Expiry</label>
                <input type="date" name="swqr_expiry" value={formData.swqr_expiry} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">EUSR Number</label>
                <input type="text" name="eusr_number" value={formData.eusr_number} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-slate-700">EUSR Expiry</label>
                <input type="date" name="eusr_expiry" value={formData.eusr_expiry} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-slate-700">NPORS Number</label>
                <input type="text" name="npors_number" value={formData.npors_number} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1 text-slate-700">In-House Cert Number</label>
                <input type="text" name="in_house_cert_number" value={formData.in_house_cert_number} onChange={handleChange} className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
              </div>
            </div>
          </div>

          {/* Consent */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input required type="checkbox" className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
              <span className="text-sm text-slate-600">
                I consent to Pave Training processing and storing my personal data, including my National Insurance Number and contact details, for the purpose of managing my training records and certifications. I agree to the <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a> (Version: {formData.privacy_policy_version}).
              </span>
            </label>
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-sm transition-all focus:ring-4 focus:ring-blue-500/20">
              Submit Registration
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
