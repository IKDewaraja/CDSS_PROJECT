import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import ScreeningForm from './ScreeningForm';
import RegisterPatient from './RegisterPatient';

export default function CaregiverDashboard({ user }) {
  // 1. FIXED STATE INITIALIZATION: Default strictly to 'list' view to show directory first
  const [activeView, setActiveView] = useState('list'); // 'list', 'screening', 'register'
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientRegistry, setPatientRegistry] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Function to pull registered patient profiles out of your live MySQL Database
  const fetchActivePatients = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/patients/list');
      if (!response.ok) throw new Error('Data fetch transaction failed.');
      const data = await response.json();
      setPatientRegistry(data);
    } catch (error) {
      console.error('Error fetching patients registry ledger:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Run database synchronization hook when component initializes
  useEffect(() => {
    fetchActivePatients();
  }, []);

  const triggerScreeningWorkflow = (patient) => {
    setSelectedPatient(patient);
    setActiveView('screening'); // Shifts into input entry panel for chosen elder
  };

  const handleDeletePatient = async (patient) => {
    const patientIdentifier = patient.patientId || patient.id;
    if (!window.confirm(`Remove ${patient.name} from the resident directory?`)) return;

    try {
      const response = await fetch(`http://localhost:8080/api/patients/delete/${encodeURIComponent(patientIdentifier)}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Patient removal failed.');
      fetchActivePatients();
    } catch (error) {
      console.error('Error deleting patient:', error);
      alert(error.message);
    }
  };

  const handleRegistrationSuccess = () => {
    fetchActivePatients(); // Reload list with the fresh database row additions
    setActiveView('list');  // Return securely back to the main grid view
  };

  const followUpCount = patientRegistry.filter((patient) => patient.medicalCondition).length;

  
// Route Routing Check 1: Render the dynamic vitals input entry panel
  if (activeView === 'screening') {
    return (
      <ScreeningForm 
        patient={selectedPatient} 
        user={user} // ◄ MAKE SURE THIS LINE MATCHES EXACTLY TO PROPAGATE USER DOWN
        onBack={() => setActiveView('list')} 
      />
    );
  }

  // Route Routing Check 2: Render the new admission data capture intake form
  if (activeView === 'register') {
    return <RegisterPatient onBack={() => setActiveView('list')} onRegistrationSuccess={handleRegistrationSuccess} />;
  }

  // STANDARD BASELINE: Render the master active patient directory grid map
  return (
    <div style={{ fontFamily: 'sans-serif', minHeight: '100vh', background: 'linear-gradient(135deg, #f8fbff 0%, #eef6ff 100%)', padding: '16px 20px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', marginTop: '6px', padding: '20px 24px', background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.09) 0%, rgba(15, 118, 110, 0.08) 100%)', borderRadius: '16px', border: '1px solid #dbe4f0' }}>
        <div>
          <h2 style={{ margin: '0 0 5px 0', color: '#0f172a' }}>Elder Resident Directory</h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
            Select an active resident below to initialize real-time feature metric predictions.
          </p>
        </div>
        <button onClick={() => setActiveView('register')} style={{ padding: '12px 20px', background: 'linear-gradient(135deg, #2563eb 0%, #0f766e 100%)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', boxShadow: '0 10px 24px rgba(37, 99, 235, 0.2)' }}>
          ➕ Admit New Resident
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '20px' }}>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px 16px', boxShadow: '0 8px 20px rgba(15, 23, 42, 0.04)' }}>
          <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Total Residents</div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>{patientRegistry.length}</div>
        </div>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px 16px', boxShadow: '0 8px 20px rgba(15, 23, 42, 0.04)' }}>
          <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Needs Follow-up</div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: '#2563eb' }}>{followUpCount}</div>
        </div>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px 16px', boxShadow: '0 8px 20px rgba(15, 23, 42, 0.04)' }}>
          <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Quick Action</div>
          <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f766e' }}>Admit or monitor resident</div>
        </div>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', marginBottom: '25px' }} />

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#718096', fontSize: '15px' }}>
          🔄 Synchronizing with master records ledger tier...
        </div>
      ) : patientRegistry.length === 0 ? (
        <div style={{ border: '2px dashed #cbd5e0', padding: '50px 20px', borderRadius: '12px', textAlign: 'center', color: '#64748b', background: '#fff', boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)' }}>
          <p style={{ fontSize: '18px', margin: '0 0 10px 0', fontWeight: 'bold' }}>No Active Residents Tracked</p>
          <p style={{ fontSize: '14px', margin: '0 0 20px 0' }}>The database is currently empty. Please initialize your first admission.</p>
          <button onClick={() => setActiveView('register')} style={{ padding: '10px 16px', background: 'linear-gradient(135deg, #2563eb 0%, #0f766e 100%)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            Open Intake Admission Form
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {patientRegistry.map((patient) => (
            <div key={patient.patientId} style={{ background: '#fff', border: '1px solid #dbe4f0', borderRadius: '8px', padding: '20px', boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'transform 0.2s' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '12px', background: '#edf2f7', padding: '4px 10px', borderRadius: '4px', color: '#4a5568', fontWeight: 'bold', fontFamily: 'monospace' }}>
                    {patient.patientId}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePatient(patient);
                    }}
                    aria-label={`Delete ${patient.name}`}
                    title="Delete patient"
                    style={{ background: '#e74c3c', color: '#fff', border: 'none', width: '32px', height: '32px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                <h3 style={{ margin: '0 0 6px 0', color: '#2d3748', fontSize: '18px' }}>{patient.name}</h3>
                <p style={{ margin: '0 0 15px 0', color: '#a0aec0', fontSize: '13px' }}>📍 Location: {patient.roomLocation}</p>
                
                {patient.medicalCondition && (
                  <div style={{ margin: '0 0 20px 0', fontSize: '12px', color: '#4a5568', background: '#f7fafc', padding: '10px', borderRadius: '6px', borderLeft: '4px solid #3182ce', lineHeight: '1.4' }}>
                    <strong>Condition Note:</strong> {patient.medicalCondition}
                  </div>
                )}
              </div>
              
              <button onClick={() => triggerScreeningWorkflow(patient)} style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg, #2563eb 0%, #0f766e 100%)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', transition: 'background 0.2s' }}>
                Enter clinical measurements
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}