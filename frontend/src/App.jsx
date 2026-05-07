import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

import DashboardLayout from './pages/DashboardLayout';
import EmployeesTab from './components/EmployeesTab';
import CompaniesTab from './components/CompaniesTab';
import WorkforcesTab from './components/WorkforcesTab';
import NporsTab from './components/NporsTab';
import NrswaTab from './components/NrswaTab';
import EusrTab from './components/EusrTab';
import InhouseTab from './components/InhouseTab';
import NvqTab from './components/NvqTab';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            } 
          >
            <Route path="employees" element={<EmployeesTab />} />
            <Route path="companies" element={<CompaniesTab />} />
            <Route path="workforces" element={<WorkforcesTab />} />
            <Route path="npors" element={<NporsTab />} />
            <Route path="nrswa" element={<NrswaTab />} />
            <Route path="eusr" element={<EusrTab />} />
            <Route path="inhouse" element={<InhouseTab />} />
            <Route path="nvq" element={<NvqTab />} />
            <Route index element={<Navigate to="workforces" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
