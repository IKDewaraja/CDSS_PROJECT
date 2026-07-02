import React, { useState } from 'react';
import Login from './pages/Login';
import MainContainer from './pages/MainContainer';
import CaregiverDashboard from './pages/CaregiverDashboard';
import DoctorDashboard from './pages/DoctorDashboard';

export default function App() {
  // Global Session State Variable Tracking Authenticated User Details
  const [currentUser, setCurrentUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Guard Boundary Check: If session state is empty, freeze workspace and isolate user at Login Gateway
  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Session Validated: Render the Master UI Container Shell and inject the corresponding role-view inside
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