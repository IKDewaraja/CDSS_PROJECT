import React, { useState } from 'react';

export default function RegisterPatient({ onBack, onRegistrationSuccess }) {
  const [patientId, setPatientId] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [roomLocation, setRoomLocation] = useState('');
  const [medicalCondition, setMedicalCondition] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patientId || !name || !age || !roomLocation) {
      alert('Please populate all mandatory identification fields.');
      return;
    }

    setIsSubmitting(true);
    const payload = { patientId, name, age: parseInt(age), roomLocation, medicalCondition };

    try {
      const response = await fetch('http://localhost:8080/api/patients/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Network transaction rejected.');

      alert(`Success! Profile for ${name} has been synchronized into the master database.`);
      onRegistrationSuccess(); // Refreshes directory list
    } catch (error) {
      console.error('Registration Failure:', error);
      alert('Database Connection Error: Unable to record patient profile.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#2b6cb0', cursor: 'pointer', fontWeight: 'bold', marginBottom: '20px' }}>
        ← Back to Directory
      </button>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#2d3748' }}>New Patient Admission Intake</h3>
        <p style={{ margin: '0 0 25px 0', color: '#718096', fontSize: '14px' }}>Register a new resident to initialize clinical telemetry tracking metrics.</p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>System Assignment ID</label>
            <input type="text" placeholder="e.g. PT-204" value={patientId} onChange={(e) => setPatientId(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>Full Name</label>
            <input type="text" placeholder="e.g. Mrs. Sunethra Silva" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>Age</label>
              <input type="number" placeholder="e.g. 78" value={age} onChange={(e) => setAge(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>Ward / Room Location</label>
              <input type="text" placeholder="e.g. Ward C - Bed 02" value={roomLocation} onChange={(e) => setRoomLocation(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '14px' }}>Primary Medical Assessment Note (Optional)</label>
            <input type="text" placeholder="e.g. Cognitive decline baseline, high diabetic tracking" value={medicalCondition} onChange={(e) => setMedicalCondition(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
          </div>

          <button type="submit" disabled={isSubmitting} style={{ width: '100%', padding: '12px', background: '#38a169', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
            {isSubmitting ? 'Synchronizing Ledger...' : 'Commit Admission Record'}
          </button>
        </form>
      </div>
    </div>
  );
}