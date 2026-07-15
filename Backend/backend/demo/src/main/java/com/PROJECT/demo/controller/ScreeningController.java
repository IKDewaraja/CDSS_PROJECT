package com.PROJECT.demo.controller;

import com.PROJECT.demo.entity.AuditLog;
import com.PROJECT.demo.entity.ScreeningLog;
import com.PROJECT.demo.repository.AuditLogRepository;
import com.PROJECT.demo.service.MlPredictorService;
import com.PROJECT.demo.service.PdfReportService;
import com.lowagie.text.DocumentException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/screening")
@CrossOrigin(origins = "http://localhost:5173")
public class ScreeningController {

    @Autowired
    private MlPredictorService mlPredictorService;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private PdfReportService pdfReportService;

    /**
     * Endpoint to receive new live caregiver vital logs from React UI
     * Route: POST http://localhost:8080/api/screening/submit
     */
    @PostMapping("/submit")
    public ResponseEntity<ScreeningLog> submitScreening(@RequestBody Map<String, Object> payload) {
        String patientId = (String) payload.get("patientId");
        Double bloodSugar = Double.parseDouble(payload.get("bloodSugar").toString());
        Double spo2 = Double.parseDouble(payload.get("spo2").toString());
        Double hrv = Double.parseDouble(payload.get("hrv").toString());

        String activeOperator = payload.get("activeOperator") != null ? payload.get("activeOperator").toString() : "Unknown Operator";

        ScreeningLog savedRecord = mlPredictorService.evaluateAndLogTelemetry(
                patientId,
                bloodSugar,
                spo2,
                hrv,
                activeOperator
        );

        return ResponseEntity.ok(savedRecord);
    }

    /**
     * Endpoint to supply the Doctor Dashboard charts with patient history rows
     * Route: GET http://localhost:8080/api/screening/history/{patientId}
     */
    @GetMapping("/history/{patientId}")
    public ResponseEntity<List<ScreeningLog>> getHistory(@PathVariable String patientId) {
        List<ScreeningLog> historyList = mlPredictorService.getPatientTelemetryHistory(patientId);
        return ResponseEntity.ok(historyList);
    }

    /**
     * Endpoint to supply the Doctor Dashboard with real immutable database audit trails
     * Route: GET http://localhost:8080/api/screening/audit-trail
     */
    @GetMapping("/audit-trail")
    public ResponseEntity<List<AuditLog>> getSystemAuditTrail() {
        List<AuditLog> fullAuditTrail = auditLogRepository.findAllByOrderByTimestampDesc();
        return ResponseEntity.ok(fullAuditTrail);
    }

    /**
     * Endpoint to compile and stream a clinical medical report PDF
     * Route: GET http://localhost:8080/api/screening/export-pdf/{patientId}
     */
    @GetMapping("/export-pdf/{patientId}")
    public ResponseEntity<byte[]> exportPatientPdfReport(
            @PathVariable String patientId,
            @RequestParam String patientName) {
        try {
            // Retrieve history records from the service
            List<ScreeningLog> history = mlPredictorService.getPatientTelemetryHistory(patientId);

            // Build raw binary PDF stream using our PDF service
            byte[] pdfContents = pdfReportService.generatePatientReport(patientId, patientName, history);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "Medical_Report_" + patientId + ".pdf");

            return new ResponseEntity<>(pdfContents, headers, HttpStatus.OK);
        } catch (DocumentException e) {
            System.err.println("❌ Document compilation error: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        } catch (Exception e) {
            System.err.println("❌ Unexpected error during PDF generation: " + e.getMessage());
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}