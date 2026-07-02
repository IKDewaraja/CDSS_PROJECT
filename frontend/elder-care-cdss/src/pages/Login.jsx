import React, { useState } from 'react';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); // Added password tracking field
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      alert('Please populate both employee credential inputs.');
      return;
    }

    setIsAuthenticating(true);
    try {
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        throw new Error('Authentication rejected: Invalid username or passcode matching keys.');
      }

      const verifiedUserRow = await response.json();
      onLoginSuccess(verifiedUserRow); // Passes user object with its real DB role to App.jsx
    } catch (error) {
      alert(error.message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f5f7fb', fontFamily: 'sans-serif' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '360px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '8px', color: '#1a202c' }}>CDSS Gateway</h2>
        <p style={{ textAlign: 'center', color: '#718096', fontSize: '14px', marginBottom: '24px' }}>Elderly Fall Risk Prediction Platform</p>
        
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 'bold', color: '#4a5568' }}>Employee Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. admin_root or nurse_amal" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 'bold', color: '#4a5568' }}>Security Password Key</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
        </div>

        <button type="submit" disabled={isAuthenticating} style={{ width: '100%', padding: '12px', background: '#2b6cb0', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
          {isAuthenticating ? 'Validating Session...' : 'Authenticate Session'}
        </button>
      </form>
    </div>
  );
}