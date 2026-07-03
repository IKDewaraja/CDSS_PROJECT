package com.PROJECT.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String transactionId; // Unique UUID string representing the operation hash

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(nullable = false)
    private String operator; // The employee username who did the action

    @Column(nullable = false)
    private String action; // e.g., "Submitted screening metrics payload", "Created user profile"

    @Column(nullable = false)
    private String targetContext; // e.g., "PT-091", "nurse_amal", "ALL"

    @Column(nullable = false)
    private String inferenceStatus; // e.g., "Class 2: Definite Fall Event", "Success"

    // Constructors
    public AuditLog() {}

    public AuditLog(String transactionId, LocalDateTime timestamp, String operator, String action, String targetContext, String inferenceStatus) {
        this.transactionId = transactionId;
        this.timestamp = timestamp;
        this.operator = operator;
        this.action = action;
        this.targetContext = targetContext;
        this.inferenceStatus = inferenceStatus;
    }

    // Standard Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public String getOperator() { return operator; }
    public void setOperator(String operator) { this.operator = operator; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getTargetContext() { return targetContext; }
    public void setTargetContext(String targetContext) { this.targetContext = targetContext; }

    public String getInferenceStatus() { return inferenceStatus; }
    public void setInferenceStatus(String inferenceStatus) { this.inferenceStatus = inferenceStatus; }
}