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
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, sans-serif', background: '#f4f8fc', margin: 0 }}>
      <aside style={{ width: '260px', background: 'linear-gradient(135deg, #1e40af 0%, #0f766e 100%)', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px 20px', boxSizing: 'border-box' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>⚙️</div>
            <div>
              <h2 style={{ margin: 0, color: '#f8fbff', fontSize: '18px' }}>Admin Console</h2>
              <p style={{ margin: '2px 0 0 0', color: '#dbeafe', fontSize: '12px' }}>User access management</p>
            </div>
          </div>
          <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.16)', borderRadius: '10px', fontWeight: '600', textAlign: 'center', fontSize: '13px' }}>👥 Manage staff accounts</div>
        </div>
        <div>
          <div style={{ fontSize: '13px', color: '#dbeafe', marginBottom: '12px', padding: '10px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}>Signed in as: {user.username}</div>
          <button onClick={onLogout} style={{ width: '100%', background: '#ef4444', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>Sign Out</button>
        </div>
      </aside>

      <main style={{ flex: 1, padding: '32px 36px', boxSizing: 'border-box' }}>
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ margin: '0 0 6px 0', color: '#0f172a', fontSize: '24px' }}>Control User Access</h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Maintain staff accounts with a clear and secure management view.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.8fr', gap: '24px', alignItems: 'start' }}>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '20px', boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: '#0f172a' }}>Active Employee Accounts</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Review and manage current system users.</p>
              </div>
              <div style={{ padding: '6px 10px', borderRadius: '999px', background: '#eff6ff', color: '#2563eb', fontSize: '12px', fontWeight: '700' }}>{usersList.length} users</div>
            </div>
            {isLoading ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Loading secure registries...</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ background: '#f8fbff', color: '#475569', textAlign: 'left' }}>
                      <th style={{ padding: '12px 10px', borderBottom: '1px solid #e2e8f0' }}>Employee Name</th>
                      <th style={{ padding: '12px 10px', borderBottom: '1px solid #e2e8f0' }}>Username</th>
                      <th style={{ padding: '12px 10px', borderBottom: '1px solid #e2e8f0' }}>Role</th>
                      <th style={{ padding: '12px 10px', borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map(u => (
                      <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 10px', fontWeight: '700', color: '#0f172a' }}>{u.fullName}</td>
                        <td style={{ padding: '12px 10px', color: '#2563eb' }}>{u.username}</td>
                        <td style={{ padding: '12px 10px' }}>
                          <span style={{ background: u.role === 'Admin' ? '#e2e8f0' : u.role === 'Doctor' ? '#ebf8ff' : '#e6fffa', padding: '4px 8px', borderRadius: '999px', fontSize: '12px', fontWeight: '700', color: '#334155' }}>{u.role}</span>
                        </td>
                        <td style={{ padding: '12px 10px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                          <button
                            onClick={() => handleEditToggle(u)}
                            aria-label={`Edit ${u.fullName}`}
                            title="Edit user"
                            style={{ background: '#2563eb', color: '#fff', border: 'none', width: '34px', height: '34px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            aria-label={`Revoke ${u.fullName}`}
                            title="Revoke user"
                            style={{ background: '#ef4444', color: '#fff', border: 'none', width: '34px', height: '34px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '22px', boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '16px', color: '#0f172a' }}>{editingId ? 'Edit Account Details' : 'Create New Account'}</h3>
            <p style={{ margin: '0 0 18px 0', color: '#64748b', fontSize: '13px' }}>{editingId ? 'Update staff access and permissions.' : 'Add a new staff member to the system.'}</p>
            <form onSubmit={handleSaveUser}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px', color: '#1e293b' }}>Full Employee Name</label>
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} style={{ width: '100%', padding: '11px 12px', borderRadius: '8px', border: '1px solid #94a3b8', boxSizing: 'border-box', backgroundColor: '#fff', color: '#0f172a', outline: 'none' }} />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px', color: '#1e293b' }}>System Username</label>
                <input type="text" disabled={!!editingId} value={username} onChange={(e) => setUsername(e.target.value)} style={{ width: '100%', padding: '11px 12px', borderRadius: '8px', border: '1px solid #94a3b8', boxSizing: 'border-box', backgroundColor: editingId ? '#f8fafc' : '#fff', color: '#0f172a', outline: 'none' }} />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px', color: '#1e293b' }}>Passcode Key</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '11px 12px', borderRadius: '8px', border: '1px solid #94a3b8', boxSizing: 'border-box', backgroundColor: '#fff', color: '#0f172a', outline: 'none' }} />
              </div>
              <div style={{ marginBottom: '18px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', marginBottom: '6px', color: '#1e293b' }}>Assigned System Access Role</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: '11px 12px', borderRadius: '8px', border: '1px solid #94a3b8', boxSizing: 'border-box', backgroundColor: '#fff', color: '#0f172a', outline: 'none' }}>
                  <option value="Caregiver">Caregiver (Ward Ops)</option>
                  <option value="Doctor">Medical Professional (Clinical Analysis)</option>
                  <option value="Admin">System Administrator</option>
                </select>
              </div>
              <button type="submit" style={{ width: '100%', padding: '11px', background: 'linear-gradient(135deg, #2563eb 0%, #0f766e 100%)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 10px 24px rgba(37, 99, 235, 0.2)' }}>
                {editingId ? 'Update Identity Settings' : 'Initialize Account Structure'}
              </button>
              {editingId && <button type="button" onClick={clearForm} style={{ width: '100%', padding: '9px', marginTop: '8px', background: '#94a3b8', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>Cancel Modifications</button>}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}