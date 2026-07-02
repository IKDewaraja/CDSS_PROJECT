import React, { useState, useEffect } from 'react';
import ScreeningForm from './ScreeningForm';
import RegisterPatient from './RegisterPatient';

export default function CaregiverDashboard({ user }) {
  const [activeView, setActiveView] = useState('list'); // 'list', 'screening', 'register'
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientRegistry, setPatientRegistry] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Function to pull profiles out of your live MySQL Database
  const fetchActivePatients = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/patients/list');
      if (!response.ok) throw new Error('Data fetch failed.');
      const data = await response.json();
      setPatientRegistry(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivePatients();
  }, []);

  const triggerScreeningWorkflow = (patient) => {
    setSelectedPatient(patient);
    setActiveView('screening');
  };

  const handleRegistrationSuccess = () => {
    fetchActivePatients(); // Reload list with the new addition
    setActiveView('list');
  };

  if (activeView === 'screening') {
    return <ScreeningForm patient={selectedPatient} onBack={() => setActiveView('list')} />;
  }

  if (activeView === 'register') {
    return <RegisterPatient onBack={() => setActiveView('list')} onRegistrationSuccess={handleRegistrationSuccess} />;
  }

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div>
          <h2 style={{ margin: '0 0 5px 0', color: '#1a202c' }}>Elder Resident Directory</h2>
          <p style={{ margin: 0, color: '#718096', fontSize: '14px' }}>Select an active resident to map physiological parameters or log admission details.</p>
        </div>
        <button onClick={() => setActiveView('register')} style={{ padding: '10px 16px', background: '#38a169', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
          ➕ Admit New Resident
        </button>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>Syncing with master records ledger...</div>
      ) : patientRegistry.length === 0 ? (
        <div style={{ border: '2px dashed #cbd5e0', padding: '40px', borderRadius: '8px', textAlign: 'center', color: '#a0aec0' }}>
          No records found in database tables. Click 'Admit New Resident' to seed system entries.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {patientRegistry.map((patient) => (
            <div key={patient.patientId} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', background: '#edf2f7', padding: '3px 8px', borderRadius: '4px', color: '#4a5568', fontWeight: 'bold' }}>{patient.patientId}</span>
                  <span style={{ fontSize: '13px', color: '#718096' }}>Age: {patient.age}</span>
                </div>
                <h3 style={{ margin: '0 0 5px 0', color: '#2d3748', fontSize: '18px' }}>{patient.name}</h3>
                <p style={{ margin: '0 0 15px 0', color: '#a0aec0', fontSize: '13px' }}>📍 Location: {patient.roomLocation}</p>
                {patient.medicalCondition && (
                  <p style={{ margin: '0 0 20px 0', fontSize: '12px', color: '#718096', background: '#f7fafc', padding: '8px', borderRadius: '4px', borderLeft: '3px solid #cbd5e0' }}>📝 {patient.medicalCondition}</p>
                )}
              </div>
              
              <button onClick={() => triggerScreeningWorkflow(patient)} style={{ width: '100%', padding: '10px', background: '#2b6cb0', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                Run Active Screening
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}