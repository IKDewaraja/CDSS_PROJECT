package com.PROJECT.demo.repository;


import com.PROJECT.demo.entity.ScreeningLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ScreeningRepository extends JpaRepository<ScreeningLog, Long> {

    // Custom finder method to fetch historical telemetry logs for a specific patient
    // This is the endpoint the Doctor's chart view will fetch data from!
    List<ScreeningLog> findByPatientIdOrderByTimestampDesc(String patientId);
}