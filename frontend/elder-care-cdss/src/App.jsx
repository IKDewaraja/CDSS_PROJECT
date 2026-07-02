import React, { useState } from 'react';
import Login from './pages/Login';
import MainContainer from './pages/MainContainer';
import CaregiverDashboard from './pages/CaregiverDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard'; // Import Admin Panel

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // 1. If user role maps to Admin, circumvent standard UI shells and hand over completely to Admin Suite
  if (currentUser.role === 'Admin') {
    return <AdminDashboard user={currentUser} onLogout={handleLogout} />;
  }

  // 2. Otherwise, pass down to standard dynamic shell layout structures (Doctor/Caregiver)
  return (
    <MainContainer user={currentUser} onLogout={handleLogout}>
      {currentUser.role === 'Caregiver' ? (
        <CaregiverDashboard user={currentUser} onLogout={handleLogout} />
      ) : (
        <DoctorDashboard user={currentUser} onLogout={handleLogout} />
      )}
    </MainContainer>
  );
}