package com.PROJECT.demo.repository;

import com.PROJECT.demo.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    // Fetch logs descending so that the newest system actions appear at the top
    List<AuditLog> findAllByOrderByTimestampDesc();
}