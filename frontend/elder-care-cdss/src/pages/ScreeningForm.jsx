import React, { useState } from 'react';

export default function ScreeningForm({ patient, user, onBack }) {
  // 1. Form Inputs State Tracking
  const [bloodSugar, setBloodSugar] = useState('');
  const [spo2, setSpo2] = useState('');
  const [hrv, setHrv] = useState('');
  
  // 2. Machine Learning Inference Output State
  const [mlPrediction, setMlPrediction] = useState(null);

  // 3. Live Production Machine Learning API Integration
  const runMachineLearningInference = async (e) => {
    e.preventDefault();

    const bs = parseFloat(bloodSugar);
    const ox = parseFloat(spo2);
    const hr = parseFloat(hrv);

    if (isNaN(bs) || isNaN(ox) || isNaN(hr)) {
      alert('Please fill out all physiological parameters before executing model prediction.');
      return;
    }

    // Standardized JSON payload schema expected by your Spring Boot REST controller
    const payload = {
      patientId: patient ? patient.patientId : "PT-091", // Dynamically uses selected patient ID
      bloodSugar: bs,
      spo2: ox,
      hrv: hr,
      activeOperator: user ? user.username : "Unknown Operator" // Securely passes active user session credentials
    };

    try {
      const response = await fetch('http://localhost:8080/api/screening/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server returned status code: ${response.status}`);
      }

      const data = await response.json();
      
      let statusText = 'Class 0: Normal Physiological Range Detected';
      let color = '#38a169'; 
      let carePlan = 'Patient displays stable physiological feature vectors. Maintain standard ward monitoring protocols.';

      if (data.predictedClass === 2) {
        statusText = 'Class 2: High-Risk Fall Detected';
        color = '#e53e3e'; 
        carePlan = 'CRITICAL ALERT: High probability of acute balance failure.';
      } else if (data.predictedClass === 1) {
        statusText = 'Class 1: Medium-Risk  Fall Detected';
        color = '#dd6b20'; 
        carePlan = 'WARNING: Enforce mandatory unassisted movement restrictions.';
      }

      setMlPrediction({
        modelClass: data.predictedClass,
        statusText: statusText,
        color: color,
        probability: data.confidenceScore,
        carePlan: carePlan,
        timestamp: new Date(data.timestamp).toLocaleTimeString()
      });

    } catch (error) {
      console.error('API Connection Failure:', error);
      alert(`Backend Communication Error: Could not connect to the Spring Boot service.\nDetails: ${error.message}`);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#2b6cb0', cursor: 'pointer', fontWeight: 'bold', marginBottom: '20px', fontSize: '15px' }}>
        ← Return to Ward Directory
      </button>

      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '30px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
        <h2 style={{ margin: '0 0 10px 0', color: '#2d3748' }}>
          Machine Learning Predictor: Tracking {patient ? patient.name : 'Resident'}
        </h2>
        <p style={{ margin: '0 0 30px 0', color: '#718096', fontSize: '14px' }}>
          Input verified clinical measurements below.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          
          {/* Inputs Section */}
          <form onSubmit={runMachineLearningInference}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', color: '#4a5568' }}>
                Fasting Blood Sugar (mg/dL)
              </label>
              <input type="number" value={bloodSugar} onChange={(e) => setBloodSugar(e.target.value)} placeholder="e.g. 95" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', color: '#4a5568' }}>
                Oxygen Saturation (SpO₂ %)
              </label>
              <input type="number" value={spo2} onChange={(e) => setSpo2(e.target.value)} placeholder="e.g. 98" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px', color: '#4a5568' }}>
                Heart Rate Variability (HRV ms)
              </label>
              <input type="number" value={hrv} onChange={(e) => setHrv(e.target.value)} placeholder="e.g. 55" style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', boxSizing: 'border-box' }} />
            </div>

            <button type="submit" style={{ width: '100%', padding: '12px', background: '#2b6cb0', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
              Check Fall-Risk Level
            </button>
          </form>

          {/* Machine Learning Output Section */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {!mlPrediction ? (
              <div style={{ background: '#f7fafc', border: '2px dashed #cbd5e0', borderRadius: '8px', padding: '40px', textAlign: 'center', color: '#a0aec0' }}>
                <p style={{ fontSize: '18px', margin: 0 }}>Awaiting Risk Level Assessment</p>
                <p style={{ fontSize: '12px', marginTop: '5px' }}>Submit feature vectors to execute risk level prediction.</p>
              </div>
            ) : (
              <div style={{ background: '#fff', border: `2px solid ${mlPrediction.color}`, borderRadius: '8px', padding: '25px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#718096' }}>MODEL INFERENCE OUTPUT</span>
                  <span style={{ fontSize: '11px', color: '#a0aec0' }}>Active Operator: {user ? user.username : 'System'}</span>
                </div>
                
                <h3 style={{ margin: '0 0 5px 0', color: mlPrediction.color, fontSize: '22px' }}>
                  {mlPrediction.statusText}
                </h3>
                {/* <div style={{ fontSize: '13px', color: '#4a5568', marginBottom: '15px' }}>
                  Model Confidence Score: <strong>{mlPrediction.probability}</strong>
                </div>
                 */}
                <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '15px 0' }} />
                
                <h4 style={{ margin: '0 0 5px 0', fontSize: '13px', color: '#718096' }}>Prescriptive Interventions:</h4>
                <p style={{ margin: 0, fontSize: '14px', color: '#2d3748', lineHeight: '1.5' }}>
                  {mlPrediction.carePlan}
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}