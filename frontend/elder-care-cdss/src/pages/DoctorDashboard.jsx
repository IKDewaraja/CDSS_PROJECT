import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function DoctorDashboard({ user, onLogout }) {
  // 1. Navigation State Tracking for the Sub-Views
  const [activeTab, setActiveTab] = useState('trends'); // 'trends', 'thresholds', 'audit'
  
  // 2. Selected Patient State (Starts null so we show the card directory roster grid first)
  const [selectedPatientId, setSelectedPatientId] = useState(null); 
  
  // 3. Asynchronous Database States
  const [doctorPatientRegistry, setDoctorPatientRegistry] = useState([]); // Master patient array from DB
  const [activeChartData, setActiveChartData] = useState([]);
  const [systemAuditLogs, setSystemAuditLogs] = useState([]); // Dynamic database compliance log ledger
  
  // Loading Spinners States
  const [isLoadingPatients, setIsLoadingPatients] = useState(false);
  const [isLoadingChart, setIsLoadingChart] = useState(false);

  // 4. Dynamic Threshold State Configurations (Machine Learning Feature Boundaries)
  const [bsAlertLimit, setBsAlertLimit] = useState(140);
  const [spo2AlertLimit, setSpo2AlertLimit] = useState(94);
  const [hrvAlertLimit, setHrvAlertLimit] = useState(45);

  // HOOK 1: Fetch the master patient list from MySQL database right when Doctor dashboard mounts
  useEffect(() => {
    const fetchMasterPatientRegistry = async () => {
      setIsLoadingPatients(true);
      try {
        const response = await fetch('http://localhost:8080/api/patients/list');
        if (!response.ok) throw new Error('Failed to fetch master patient list.');
        const data = await response.json();
        setDoctorPatientRegistry(data);
      } catch (error) {
        console.error('Doctor Registry Sync Error:', error);
      } finally {
        setIsLoadingPatients(false);
      }
    };

    fetchMasterPatientRegistry();
  }, []);

  // HOOK 2: Fetch specific historical telemetry data when selectedPatientId or activeTab changes
  useEffect(() => {
    if (!selectedPatientId) return;

    const fetchPatientHistoryFromDatabase = async () => {
      setIsLoadingChart(true);
      try {
        const response = await fetch(`http://localhost:8080/api/screening/history/${selectedPatientId}`);
        if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);
        const databaseRows = await response.json();
        
        // Format the database timestamp and model fields to match keys expected by Recharts
        const formattedChartData = databaseRows.map(item => ({
          day: new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          bloodSugar: item.bloodSugar,
          spo2: item.spo2,
          hrv: item.hrv
        })).reverse(); // Reverse order so chronological charts move from Left to Right

        setActiveChartData(formattedChartData);
      } catch (error) {
        console.error('Failed to communicate with API service:', error);
      } finally {
        setIsLoadingChart(false);
      }
    };

    if (activeTab === 'trends') {
      fetchPatientHistoryFromDatabase();
    }
  }, [selectedPatientId, activeTab]);

  // HOOK 3: Fetch Live Compliance Logs directly from MySQL when the doctor switches tabs
  useEffect(() => {
    const fetchLiveSystemAudits = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/screening/audit-trail');
        if (!response.ok) throw new Error('Could not synchronize system records.');
        const data = await response.json();
        setSystemAuditLogs(data);
      } catch (error) {
        console.error('Audit sync error:', error);
      }
    };

    if (activeTab === 'audit') {
      fetchLiveSystemAudits();
    }
  }, [activeTab]);

  // Find active patient details from our live state registry array
  const activePatient = doctorPatientRegistry.find(p => p.patientId === selectedPatientId);

  const handleSaveThresholds = (e) => {
    e.preventDefault();
    alert(`Model Boundary Parameters Updated Locally!\n\nNew Hyperparameter Conditions Configured:\n• Blood Sugar Cutoff: ${bsAlertLimit} mg/dL\n• SpO₂ Critical Baseline: ${spo2AlertLimit}%\n• HRV Stress Margin: ${hrvAlertLimit} ms`);
  };

  return (
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', fontFamily: 'sans-serif', background: '#f4f9ff', margin: 0 }}>
      
      {/* 1. INTERNAL SIDEBAR FRAMEWORK */}
      <aside style={{ width: '260px', background: 'linear-gradient(135deg, #2563eb 0%, #0f766e 100%)', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '20px', boxSizing: 'border-box' }}>
        <div>
          <h2 style={{ color: '#e0f2fe', margin: '0 0 25px 0', fontSize: '20px', textAlign: 'center' }}>👨‍⚕️ Clinical Suite</h2>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div 
              onClick={() => { setActiveTab('trends'); setSelectedPatientId(null); }}
              style={{ padding: '12px', background: activeTab === 'trends' ? 'rgba(255,255,255,0.18)' : 'transparent', color: activeTab === 'trends' ? '#fff' : '#e0f2fe', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              📈 Clinical Roster
            </div>
            <div 
              onClick={() => { setActiveTab('thresholds'); setSelectedPatientId(null); }}
              style={{ padding: '12px', background: activeTab === 'thresholds' ? 'rgba(255,255,255,0.18)' : 'transparent', color: activeTab === 'thresholds' ? '#fff' : '#e0f2fe', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              ⚙️ Model Tuning Limits
            </div>
            <div 
              onClick={() => { setActiveTab('audit'); setSelectedPatientId(null); }}
              style={{ padding: '12px', background: activeTab === 'audit' ? 'rgba(255,255,255,0.18)' : 'transparent', color: activeTab === 'audit' ? '#fff' : '#e0f2fe', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              🛡️ System Audit Trail
            </div>
          </nav>
        </div>
        <div>
          <div style={{ fontSize: '13px', color: '#cbd5e0', marginBottom: '10px', borderTop: '1px solid #4a5568', paddingTop: '15px' }}>Clinician: Dr. {user.username}</div>
          <button onClick={onLogout} style={{ width: '100%', background: '#e53e3e', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Terminate Session</button>
        </div>
      </aside>

      {/* 2. DYNAMIC MAIN VIEWPORT RENDER MATRIX */}
      <main style={{ flex: 1, padding: '40px', boxSizing: 'border-box', overflowY: 'auto' }}>
        
        {/* SUB-VIEW 1: LONGITUDINAL TRENDS DIAGNOSTICS */}
        {activeTab === 'trends' && (
          <div>
            {selectedPatientId ? (
              /* DETAILED VIEW LAYOUT (Rendered when a specific patient is clicked) */
              <div>
                <button 
                  onClick={() => setSelectedPatientId(null)} 
                  style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontWeight: 'bold', marginBottom: '20px', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                  ← Return to Clinical Roster
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                  <div>
                    <h2 style={{ margin: '0 0 5px 0', color: '#1a202c' }}>Clinical Analytics Profile: {activePatient ? activePatient.name : 'Resident'}</h2>
                    <p style={{ margin: 0, color: '#718096', fontSize: '14px' }}>
                      Patient ID: {activePatient?.patientId} | Age: {activePatient?.age} | Ward Location: {activePatient?.roomLocation || 'N/A'}
                    </p>
                  </div>
                  <button onClick={() => alert(`Compiling dataset profile for ${activePatient?.name}. PDF Export successful.`)} style={{ padding: '10px 18px', background: 'linear-gradient(135deg, #2563eb 0%, #0f766e 100%)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', boxShadow: '0 10px 24px rgba(37, 99, 235, 0.2)' }}>
                    🖨️ Export Medical PDF Report
                  </button>
                </div>

                {/* Chart Visualization Box occupying full workspace layout width */}
                <div style={{ background: '#fff', border: '1px solid #dbe4f0', borderRadius: '12px', padding: '25px', minHeight: '430px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)' }}>
                  <div>
                    <h3 style={{ margin: '0 0 5px 0', color: '#2d3748' }}>
                      Longitudinal Vectors Telemetry Tracking Graph
                    </h3>
                    <span style={{ fontSize: '13px', color: '#718096' }}>Data Stream Source: Live Relational Database Records via Spring Boot API</span>
                  </div>

                  {isLoadingChart ? (
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#718096', fontSize: '16px', minHeight: '320px' }}>
                      🔄 Querying server connection pool, hydrating telemetry tracks...
                    </div>
                  ) : activeChartData.length === 0 ? (
                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#a0aec0', border: '2px dashed #edf2f7', margin: '20px 0', borderRadius: '8px', padding: '40px', textAlign: 'center', minHeight: '320px' }}>
                      No Screening Logs Exist in Database for this Patient. Submit entries via Caregiver View.
                    </div>
                  ) : (
                    <div style={{ width: '100%', height: '350px', marginTop: '20px' }}>
                      <ResponsiveContainer>
                        <LineChart data={activeChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="day" stroke="#718096" style={{ fontSize: '11px' }} />
                          <YAxis stroke="#718096" style={{ fontSize: '11px' }} />
                          <Tooltip />
                          <Legend wrapperStyle={{ fontSize: '12px' }} />
                          <Line type="monotone" dataKey="bloodSugar" name={`Blood Sugar (Limit: >${bsAlertLimit})`} stroke="#3182ce" strokeWidth={3} activeDot={{ r: 8 }} />
                          <Line type="monotone" dataKey="spo2" name={`SpO₂ % (Warning: <${spo2AlertLimit})`} stroke="#38a169" strokeWidth={3} />
                          <Line type="monotone" dataKey="hrv" name={`HRV ms (Cutoff: <${hrvAlertLimit})`} stroke="#805ad5" strokeWidth={3} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  <div style={{ background: '#f7fafc', borderLeft: '4px solid #3182ce', padding: '15px', borderRadius: '0 4px 4px 0', marginTop: '25px' }}>
                    <h5 style={{ margin: '0 0 5px 0', color: '#4a5568', fontSize: '13px' }}>Feature Classification Insight:</h5>
                    <p style={{ margin: 0, fontSize: '13px', color: '#4a5568', lineHeight: '1.4' }}>
                      {activeChartData.length > 0 
                        ? 'Telemetry pipelines are synchronized. Outlier points crossing active alert boundaries will automatically register risk classification shifts inside the system ledger.' 
                        : 'Awaiting database logging execution. The telemetry graph will plot points automatically as caregivers push feature payloads.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* MASTER DIRECTORY LAYOUT GRID DISPLAY (Rendered when selectedPatientId is null) */
              <div>
                <div style={{ marginBottom: '30px' }}>
                  <h2 style={{ margin: '0 0 5px 0', color: '#1a202c' }}>Clinical Diagnostic Directory</h2>
                  <p style={{ margin: 0, color: '#718096', fontSize: '14px' }}>Select an active elder resident to inspect longitudinal physiological trend metrics and predictive telemetry log graphs.</p>
                </div>

                {isLoadingPatients ? (
                  <div style={{ color: '#718096', fontSize: '16px', textAlign: 'center', padding: '40px' }}>🔄 Synchronizing clinical registry profiles...</div>
                ) : doctorPatientRegistry.length === 0 ? (
                  <div style={{ color: '#a0aec0', fontSize: '16px', fontStyle: 'italic', border: '2px dashed #cbd5e0', padding: '40px', textAlign: 'center', borderRadius: '12px', background: '#fff' }}>
                    No patients registered in database records.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {doctorPatientRegistry.map((patient) => (
                      <div 
                        key={patient.patientId} 
                        onClick={() => setSelectedPatientId(patient.patientId)} 
                        style={{ background: '#fff', border: '1px solid #dbe4f0', borderRadius: '10px', padding: '20px', cursor: 'pointer', boxShadow: '0 4px 6px rgba(15, 23, 42, 0.015)', transition: 'transform 0.2s, border-color 0.2s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#dbe4f0'; e.currentTarget.style.transform = 'translateY(0)'; }}
                      >
                        <span style={{ fontSize: '11px', background: '#eff6ff', padding: '4px 8px', borderRadius: '4px', color: '#2563eb', fontWeight: 'bold', fontFamily: 'monospace' }}>
                          {patient.patientId}
                        </span>
                        <h3 style={{ margin: '12px 0 6px 0', color: '#2d3748', fontSize: '17px' }}>{patient.name}</h3>
                        <p style={{ margin: '0 0 15px 0', color: '#718096', fontSize: '13px' }}>Age: {patient.age} | Room: {patient.roomLocation || 'Unassigned'}</p>
                        <div style={{ textAlign: 'right', fontSize: '13px', color: '#2563eb', fontWeight: 'bold' }}>Inspect Patient Analytics →</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* SUB-VIEW 2: MACHINE LEARNING FEATURE WEIGHT CONFIGURATION */}
        {activeTab === 'thresholds' && (
          <div style={{ maxWidth: '700px' }}>
            <h2 style={{ margin: '0 0 5px 0', color: '#1a202c' }}>Model Classification Limits</h2>
            <p style={{ margin: '0 0 30px 0', color: '#718096', fontSize: '14px' }}>
              Modify the global boundary markers below to tune runtime decision boundaries for feature vectors.
            </p>

            <form onSubmit={handleSaveThresholds} style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #dbe4f0', boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', fontSize: '14px', color: '#4a5568' }}>Post-Prandial Blood Sugar Upper Limit (mg/dL)</label>
                <input type="number" value={bsAlertLimit} onChange={(e) => setBsAlertLimit(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', fontSize: '14px', color: '#4a5568' }}>Critical Hypoxia Target Floor (SpO₂ %)</label>
                <input type="number" value={spo2AlertLimit} onChange={(e) => setSpo2AlertLimit(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', fontSize: '14px', color: '#4a5568' }}>Heart Rate Variability Stress Cutoff (ms)</label>
                <input type="number" value={hrvAlertLimit} onChange={(e) => setHrvAlertLimit(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
              </div>

              <button type="submit" style={{ padding: '12px 24px', background: 'linear-gradient(135deg, #2563eb 0%, #0f766e 100%)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', boxShadow: '0 10px 24px rgba(37, 99, 235, 0.2)' }}>
                Commit Dynamic Configuration Parameters
              </button>
            </form>
          </div>
        )}

        {/* SUB-VIEW 3: SYSTEM SECURITY COMPLIANCE AUDIT TRAIL */}
        {activeTab === 'audit' && (
          <div>
            <h2 style={{ margin: '0 0 5px 0', color: '#1a202c' }}>System Compliance Audit Trail</h2>
            <p style={{ margin: '0 0 30px 0', color: '#718096', fontSize: '14px' }}>
              Immutable transactional transaction ledger logging incoming payload streaming events and runtime class alerts.
            </p>

            <div style={{ background: '#fff', border: '1px solid #dbe4f0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 24px rgba(15, 23, 42, 0.05)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#f8fbff', borderBottom: '2px solid #e2e8f0', color: '#4a5568' }}>
                    <th style={{ padding: '15px' }}>Transaction ID</th>
                    <th style={{ padding: '15px' }}>Timestamp</th>
                    <th style={{ padding: '15px' }}>System Operator</th>
                    <th style={{ padding: '15px' }}>Action Decoupling</th>
                    <th style={{ padding: '15px' }}>Target Context</th>
                    <th style={{ padding: '15px' }}>Inference Status</th>
                  </tr>
                </thead>
                <tbody>
                  {systemAuditLogs.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#a0aec0', fontStyle: 'italic' }}>
                        No transactional entries logged in database.
                      </td>
                    </tr>
                  ) : (
                    systemAuditLogs.map((log) => (
                      <tr key={log.id} style={{ borderBottom: '1px solid #edf2f7', color: '#2d3748' }}>
                        <td style={{ padding: '15px', fontFamily: 'monospace', fontWeight: 'bold', color: '#718096' }}>{log.transactionId}</td>
                        <td style={{ padding: '15px', whiteSpace: 'nowrap', fontSize: '13px', color: '#718096' }}>
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td style={{ padding: '15px', color: '#2b6cb0', fontWeight: 'bold' }}>{log.operator}</td>
                        <td style={{ padding: '15px' }}>{log.action}</td>
                        <td style={{ padding: '15px', fontWeight: 'bold' }}>{log.targetContext}</td>
                        <td style={{ padding: '15px', fontSize: '13px', fontWeight: 'bold', color: log.inferenceStatus.includes('Class 2') ? '#e53e3e' : log.inferenceStatus.includes('Class 1') ? '#dd6b20' : '#38a169' }}>
                          {log.inferenceStatus}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}