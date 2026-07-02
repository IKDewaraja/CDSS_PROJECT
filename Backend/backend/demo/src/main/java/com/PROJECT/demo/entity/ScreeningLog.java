package com.PROJECT.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "screening_logs")
public class ScreeningLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "patient_id", nullable = false)
    private String patientId;

    @Column(name = "blood_sugar", nullable = false)
    private Double bloodSugar;

    @Column(name = "spo2", nullable = false)
    private Double spo2;

    @Column(name = "hrv", nullable = false)
    private Double hrv;

    @Column(name = "predicted_class", nullable = false)
    private Integer predictedClass; // Stores 0 (Normal), 1 (Stumble), or 2 (Fall)

    @Column(name = "confidence_score")
    private String confidenceScore;

    @Column(name = "timestamp", nullable = false)
    private LocalDateTime timestamp;

    // Constructors
    public ScreeningLog() {}

    public ScreeningLog(String patientId, Double bloodSugar, Double spo2, Double hrv, Integer predictedClass, String confidenceScore, LocalDateTime timestamp) {
        this.patientId = patientId;
        this.bloodSugar = bloodSugar;
        this.spo2 = spo2;
        this.hrv = hrv;
        this.predictedClass = predictedClass;
        this.confidenceScore = confidenceScore;
        this.timestamp = timestamp;
    }

    // Standard Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public Double getBloodSugar() { return bloodSugar; }
    public void setBloodSugar(Double bloodSugar) { this.bloodSugar = bloodSugar; }

    public Double getSpo2() { return spo2; }
    public void setSpo2(Double spo2) { this.spo2 = spo2; }

    public Double getHrv() { return hrv; }
    public void setHrv(Double hrv) { this.hrv = hrv; }

    public Integer getPredictedClass() { return predictedClass; }
    public void setPredictedClass(Integer predictedClass) { this.predictedClass = predictedClass; }

    public String getConfidenceScore() { return confidenceScore; }
    public void setConfidenceScore(String confidenceScore) { this.confidenceScore = confidenceScore; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}