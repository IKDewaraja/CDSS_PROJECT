import React from 'react';

export default function MainContainer({ user, onLogout, children }) {
  
  // 1. CAREGIVER WORKSPACE ENVIRONMENT LAYOUT (Top Bar Style)
  if (user.role === 'Caregiver') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', backgroundColor: '#f7fafc' }}>
        {/* Universal Top Nav for Caregivers */}
        <header style={{ background: '#2c5282', color: '#fff', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h1 style={{ margin: 0, fontSize: '18px', letterSpacing: '0.5px' }}>🛡️ ElderShield CDSS | Caregiver Portal</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '14px', background: '#2b6cb0', padding: '4px 10px', borderRadius: '20px' }}>Shift Operator: {user.username}</span>
            <button onClick={onLogout} style={{ background: '#e53e3e', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Sign Out</button>
          </div>
        </header>
        {/* Dynamic Inner Component Render Panel */}
        <main style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '20px', boxSizing: 'border-box' }}>
          {children}
        </main>
      </div>
    );
  }

 
// 2. DOCTOR CLINICAL ANALYTICS ENVIRONMENT LAYOUT (Left Sidebar Style)
  if (user.role === 'Doctor') {
    // We expect children to handle its own sub-routing state now
    return (
      <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'sans-serif', backgroundColor: '#f7fafc' }}>
        {/* Main Work Viewport */}
        <div style={{ flex: 1, display: 'flex', width: '100%' }}>
          {children}
        </div>
      </div>
    );
  }

  return null;
}
