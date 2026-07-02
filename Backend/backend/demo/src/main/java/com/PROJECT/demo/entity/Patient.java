package com.PROJECT.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "patients")
public class Patient {

    @Id
    private String patientId; // e.g., PT-091, PT-142 (Manually assigned or auto)

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer age;

    @Column(nullable = false)
    private String roomLocation;

    private String medicalCondition;

    private LocalDateTime registeredAt;

    // Constructors
    public Patient() {}

    public Patient(String patientId, String name, Integer age, String roomLocation, String medicalCondition, LocalDateTime registeredAt) {
        this.patientId = patientId;
        this.name = name;
        this.age = age;
        this.roomLocation = roomLocation;
        this.medicalCondition = medicalCondition;
        this.registeredAt = registeredAt;
    }

    // Getters and Setters
    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getRoomLocation() { return roomLocation; }
    public void setRoomLocation(String roomLocation) { this.roomLocation = roomLocation; }

    public String getMedicalCondition() { return medicalCondition; }
    public void setMedicalCondition(String medicalCondition) { this.medicalCondition = medicalCondition; }

    public LocalDateTime getRegisteredAt() { return registeredAt; }
    public void setRegisteredAt(LocalDateTime registeredAt) { this.registeredAt = registeredAt; }
}