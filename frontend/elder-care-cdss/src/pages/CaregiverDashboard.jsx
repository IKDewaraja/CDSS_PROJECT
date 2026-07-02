import React, { useState } from 'react';
import ScreeningForm from './ScreeningForm';

export default function CaregiverDashboard({ user }) {
  // State to track whether the caregiver is viewing the main ward list or an active entry form
  const [activeView, setActiveView] = useState('list'); // 'list' or 'screening'
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Simple static array modeling elder profiles in the care home
  const patientRegistry = [
    { id: 'PT-091', name: 'Mrs. Anula Perera', age: 74, room: 'Ward B - Bed 04' },
    { id: 'PT-142', name: 'Mr. K. Sivasubramaniam', age: 81, room: 'Ward A - Bed 12' },
    { id: 'PT-033', name: 'Mr. Gunapala Silva', age: 68, room: 'Ward B - Bed 01' }
  ];

  const triggerScreeningWorkflow = (patient) => {
    setSelectedPatient(patient);
    setActiveView('screening');
  };

  // If screening view is selected, inject the sub-page framework instead
  if (activeView === 'screening') {
    return (
      <ScreeningForm 
        patient={selectedPatient} 
        onBack={() => setActiveView('list')} 
      />
    );
  }

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <div style={{ marginBottom: '25px' }}>
        <h2 style={{ margin: '0 0 5px 0', color: '#1a202c' }}>Elder Resident Directory</h2>
        <p style={{ margin: 0, color: '#718096', fontSize: '14px' }}>
          Select an active resident below to map temporary health parameters and audit fall probability.
        </p>
      </div>

      {/* Grid Display rendering patient cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {patientRegistry.map((patient) => (
          <div key={patient.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', background: '#edf2f7', padding: '3px 8px', borderRadius: '4px', color: '#4a5568', fontWeight: 'bold' }}>{patient.id}</span>
                <span style={{ fontSize: '13px', color: '#718096' }}>Age: {patient.age}</span>
              </div>
              <h3 style={{ margin: '0 0 5px 0', color: '#2d3748', fontSize: '18px' }}>{patient.name}</h3>
              <p style={{ margin: '0 0 20px 0', color: '#a0aec0', fontSize: '13px' }}>📍 Location: {patient.room}</p>
            </div>
            
            <button onClick={() => triggerScreeningWorkflow(patient)} style={{ width: '100%', padding: '10px', background: '#2b6cb0', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', transition: 'background 0.2s' }}>
              Run Active Screening
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}