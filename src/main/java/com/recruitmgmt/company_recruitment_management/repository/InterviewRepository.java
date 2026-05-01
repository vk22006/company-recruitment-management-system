package com.recruitmgmt.company_recruitment_management.repository;

import com.recruitmgmt.company_recruitment_management.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findByApplicationId(Long applicationId);
    List<Interview> findByScheduledAtBetween(LocalDateTime start, LocalDateTime end);
    List<Interview> findByScheduledAtAfterOrderByScheduledAtAsc(LocalDateTime after);
}
