import React, { useState } from 'react';
import { Eye, EyeOff, Lock, ShieldCheck, UserRound } from 'lucide-react';

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
      onLoginSuccess(verifiedUserRow);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', overflow: 'hidden', fontFamily: 'Inter, "Segoe UI", sans-serif' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("https://westmontliving.com/wp-content/uploads/2024/10/Lakeview-Senior-Living-7.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'blur(1px)', transform: 'scale(1.01)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(240,247,255,0.45) 0%, rgba(246,255,248,0.45) 100%)' }} />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '1000px', display: 'flex', flexWrap: 'wrap', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.45)', borderRadius: '28px', boxShadow: '0 24px 80px rgba(15, 23, 42, 0.12)', overflow: 'hidden' }}>
        <div style={{ flex: '1 1 320px', minWidth: '280px', background: 'linear-gradient(135deg, #2563eb 0%, #0f766e 100%)', color: '#fff', padding: '40px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <ShieldCheck size={24} />
            </div>
            <h1 style={{ fontSize: '28px', margin: '0 0 10px', fontWeight: 700 }}>Elder_Shield</h1>
            <p style={{ margin: '0 0 20px', fontSize: '15px', lineHeight: 1.6, opacity: 0.95 }}>Secure access for caregivers, doctors, and administrators managing elderly care insights.</p>
            <div style={{ display: 'grid', gap: '12px' }}>
              {['Fall-risk monitoring', 'Clinical decision support', 'Downloadable medical reports'].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.12)', padding: '10px 12px', borderRadius: '12px', fontSize: '14px' }}>
                  <ShieldCheck size={16} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: '24px', fontSize: '13px', opacity: 0.8 }}>Trusted care coordination for modern eldercare teams.</div>
        </div>

        <div style={{ flex: '1 1 360px', minWidth: '280px', padding: '40px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ marginBottom: '28px' }}>
            <p style={{ margin: '0 0 8px', color: '#2563eb', fontSize: '13px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}> Sign In</p>
            <h2 style={{ margin: '0', color: '#0f172a', fontSize: '24px', fontWeight: 700 }}>Welcome back</h2>
            <p style={{ margin: '8px 0 0', color: '#64748b', fontSize: '14px' }}>Use your employee credentials to access the platform.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
            <label style={{ display: 'grid', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>Employee Username</span>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #dbe4f0', borderRadius: '14px', padding: '0 12px', background: '#f8fbff' }}>
                <UserRound size={18} color="#64748b" />
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. admin_root or nurse_amal" style={{ width: '100%', padding: '12px 10px', border: 'none', outline: 'none', background: 'transparent', fontSize: '15px', color: '#0f172a' }} />
              </div>
            </label>

            <label style={{ display: 'grid', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>Security Password</span>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #dbe4f0', borderRadius: '14px', padding: '0 12px', background: '#f8fbff' }}>
                <Lock size={18} color="#64748b" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '12px 10px', border: 'none', outline: 'none', background: 'transparent', fontSize: '15px', color: '#0f172a' }} />
                <button type="button" onClick={() => setShowPassword((prev) => !prev)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
                <input type="checkbox" style={{ accentColor: '#2563eb' }} />
                Keep me signed in
              </label>
            
            </div>

            <button type="submit" disabled={isAuthenticating} style={{ width: '100%', padding: '13px 16px', background: 'linear-gradient(135deg, #2563eb 0%, #0f766e 100%)', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: 700, cursor: 'pointer', fontSize: '15px', boxShadow: '0 12px 24px rgba(37, 99, 235, 0.24)' }}>
              {isAuthenticating ? 'Validating Session...' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#64748b' }}>
            Contact admin to change your credentials or reset your password if you encounter issues.
          </div>
        </div>
      </div>
    </div>
  );
}