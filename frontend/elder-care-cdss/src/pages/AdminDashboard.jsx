import React, { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

export default function AdminDashboard({ user, onLogout }) {
  const [usersList, setUsersList] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('Caregiver');
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSystemUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/users/list');
      if (!response.ok) throw new Error('Failed to load user directories.');
      const data = await response.json();
      setUsersList(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemUsers();
  }, []);

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!username || !password || !fullName) {
      alert('Please populate all credential blocks.');
      return;
    }

    const payload = { username, password, fullName, role };
    const url = editingId 
      ? `http://localhost:8080/api/users/update/${editingId}`
      : 'http://localhost:8080/api/users/create';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Transaction execution failure.');
      
      alert(editingId ? 'User parameters updated.' : 'New user synchronized successfully.');
      clearForm();
      fetchSystemUsers();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleEditToggle = (user) => {
    setEditingId(user.id);
    setUsername(user.username);
    setPassword(user.password);
    setFullName(user.fullName);
    setRole(user.role);
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you certain you wish to terminate this system profile?')) return;
    try {
      const response = await fetch(`http://localhost:8080/api/users/delete/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Deletion rejected by database.');
      fetchSystemUsers();
    } catch (error) {
      alert(error.message);
    }
  };

  const clearForm = () => {
    setEditingId(null);
    setUsername('');
    setPassword('');
    setFullName('');
    setRole('Caregiver');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif', background: '#f4f9ff', margin: 0 }}>
      {/* Admin Sidebar */}
      <aside style={{ width: '260px', background: 'linear-gradient(135deg, #2563eb 0%, #0f766e 100%)', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px', boxSizing: 'border-box' }}>
        <div>
          <h2 style={{ color: '#e0f2fe', margin: '0 0 25px 0', fontSize: '20px', textAlign: 'center' }}>⚙️ Admin Control</h2>
          <div style={{ padding: '12px', background: 'rgba(255,255,255,0.16)', borderRadius: '8px', fontWeight: 'bold', textAlign: 'center' }}>👥 User Account Management</div>
        </div>
        <div>
          <div style={{ fontSize: '13px', color: '#e0f2fe', marginBottom: '10px' }}>Root Session: {user.username}</div>
          <button onClick={onLogout} style={{ width: '100%', background: '#e74c3c', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Sign Out</button>
        </div>
      </aside>

      {/* Main Admin Workspace Area */}
      <main style={{ flex: 1, padding: '40px', boxSizing: 'border-box' }}>
        <h2 style={{ margin: '0 0 5px 0', color: '#0f172a' }}>Control User Access</h2>
        {/* <p style={{ margin: '0 0 30px 0', color: '#64748b', fontSize: '14px' }}>Execute secure CRUD parameters to provision structural access roles.</p> */}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '30px' }}>
          {/* Registered Users Data Table */}
          <div style={{ background: '#fff', border: '1px solid #dbe4f0', borderRadius: '12px', padding: '20px', boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#0f172a' }}>Active Employee Accounts</h3>
            {isLoading ? (
              <div>Loading secure registries...</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#f8fbff', borderBottom: '2px solid #e2e8f0', textAlign: 'left' }}>
                    <th style={{ padding: '12px' }}>Employee Name</th>
                    <th style={{ padding: '12px' }}>Username</th>
                    <th style={{ padding: '12px' }}>System Role</th>
                    <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{u.fullName}</td>
                      <td style={{ padding: '12px', color: '#2b6cb0' }}>{u.username}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ background: u.role === 'Admin' ? '#e2e8f0' : u.role === 'Doctor' ? '#ebf8ff' : '#e6fffa', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>{u.role}</span>
                      </td>
                      <td style={{ padding: '12px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <button
                          onClick={() => handleEditToggle(u)}
                          aria-label={`Edit ${u.fullName}`}
                          title="Edit user"
                          style={{ background: '#3498db', color: '#fff', border: 'none', width: '34px', height: '34px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          aria-label={`Revoke ${u.fullName}`}
                          title="Revoke user"
                          style={{ background: '#e74c3c', color: '#fff', border: 'none', width: '34px', height: '34px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Create / Edit Account Side Panel Form */}
          <div style={{ background: '#fff', border: '1px solid #dbe4f0', borderRadius: '12px', padding: '25px', height: 'fit-content', boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)' }}>
            <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#0f172a' }}>{editingId ? 'Modify System Target' : 'Provision New Account'}</h3>
            <form onSubmit={handleSaveUser}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Full Employee Name</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>System Username</label>
                <input type="text" disabled={!!editingId} value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Passcode Key</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>Assigned System Access Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box', backgroundColor: '#fff' }}>
                  <option value="Caregiver">Caregiver (Ward Ops)</option>
                  <option value="Doctor">Medical Professional (Clinical Analysis)</option>
                  <option value="Admin">System Administrator</option>
                </select>
              </div>
              <button type="submit" style={{ width: '100%', padding: '10px', background: 'linear-gradient(135deg, #2563eb 0%, #0f766e 100%)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 10px 24px rgba(37, 99, 235, 0.2)' }}>
                {editingId ? 'Update Identity Settings' : 'Initialize Account Structure'}
              </button>
              {editingId && <button type="button" onClick={clearForm} style={{ width: '100%', padding: '8px', marginTop: '8px', background: '#95a5a6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel Modifications</button>}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}