package com.PROJECT.demo.service;

import com.PROJECT.demo.entity.AuditLog;
import com.PROJECT.demo.entity.ScreeningLog;
import com.PROJECT.demo.repository.AuditLogRepository;
import com.PROJECT.demo.repository.ScreeningRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class MlPredictorService {

    @Autowired
    private ScreeningRepository screeningRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    private final String PYTHON_ML_API_URL = "http://127.0.0.1:5000/predict";

    public ScreeningLog evaluateAndLogTelemetry(String patientId, Double bloodSugar, Double spo2, Double hrv, String activeOperator) {

        int predictedClass = 0;
        String confidence = "95.0%";

        try {
            // Build JSON HTTP request headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Package the vitals payload
            Map<String, Object> requestPayload = new HashMap<>();
            requestPayload.put("bloodSugar", bloodSugar);
            requestPayload.put("spo2", spo2);
            requestPayload.put("hrv", hrv);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestPayload, headers);

            System.out.println("📡 Attempting to send payload to Python ML microservice at " + PYTHON_ML_API_URL);

            // Execute POST request to Flask
            Map response = restTemplate.postForObject(PYTHON_ML_API_URL, entity, Map.class);

            if (response != null && response.containsKey("predictedClass")) {
                predictedClass = Integer.parseInt(response.get("predictedClass").toString());
                confidence = response.get("confidenceScore").toString();
                System.out.println("✅ Received prediction from Python: Class " + predictedClass + " (" + confidence + ")");
            }

        } catch (Exception e) {
            System.err.println("❌ FAILED TO CONNECT TO PYTHON ML SERVICE (Fallback values will be used):");
            e.printStackTrace();
        }

        String inferenceStatus;
        if (predictedClass == 2) {
            inferenceStatus = "Class 2: High Risk Detected";
        } else if (predictedClass == 1) {
            inferenceStatus = "Class 1: Medium";
        } else {
            inferenceStatus = "Class 0: Normal";
        }

        System.out.println("💾 Preparing to save screening log to database for patient: " + patientId);

        // Save entry into MySQL
        ScreeningLog newLog = new ScreeningLog(
                patientId, bloodSugar, spo2, hrv, predictedClass, confidence, LocalDateTime.now()
        );

        try {
            ScreeningLog savedLog = screeningRepository.save(newLog);
            System.out.println("✅ SUCCESS: Saved Screening Log ID " + savedLog.getId() + " to MySQL.");

            // Save Audit Trail into MySQL
            AuditLog auditTrail = new AuditLog(
                    "TX-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase(),
                    LocalDateTime.now(),
                    activeOperator,
                    "Submitted screening metrics payload",
                    patientId,
                    inferenceStatus
            );
            auditLogRepository.save(auditTrail);
            System.out.println("✅ SUCCESS: Saved Audit Log to MySQL.");

            return savedLog;
        } catch (Exception sqlEx) {
            System.err.println("❌ DATABASE ERROR: Failed to execute INSERT query on 'screening_logs' table:");
            sqlEx.printStackTrace();
            return null;
        }
    }

    public List<ScreeningLog> getPatientTelemetryHistory(String patientId) {
        return screeningRepository.findByPatientIdOrderByTimestampDesc(patientId);
    }
}