import React, { useState } from 'react';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('Caregiver'); // Default role dropdown selection

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      alert('Please enter an employee username');
      return;
    }
    // Simulate successful login authentication by returning user details
    onLoginSuccess({ username, role });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f7fb', fontFamily: 'sans-serif' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '360px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '8px', color: '#1a202c' }}>CDSS Gateway</h2>
        <p style={{ textAlign: 'center', color: '#718096', fontSize: '14px', marginBottom: '24px' }}>Elderly Fall Risk Prediction Platform</p>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 'bold', color: '#4a5568' }}>Employee Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. nurse_kamal or dr_perera" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 'bold', color: '#4a5568' }}>Assigned System Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box', backgroundColor: '#fff' }}>
            <option value="Caregiver">Caregiver (Ward Operations)</option>
            <option value="Doctor">Medical Professional (Clinical Analysis)</option>
          </select>
        </div>

        <button type="submit" style={{ width: '100%', padding: '12px', background: '#2b6cb0', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>Authenticate Session</button>
      </form>
    </div>
  );
}
