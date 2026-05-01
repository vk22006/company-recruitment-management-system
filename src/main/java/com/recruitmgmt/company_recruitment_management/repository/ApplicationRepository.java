package com.recruitmgmt.company_recruitment_management.repository;

import com.recruitmgmt.company_recruitment_management.entity.Application;
import com.recruitmgmt.company_recruitment_management.enums.ApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByJobId(Long jobId);
    List<Application> findByCandidateId(Long candidateId);
    List<Application> findByStatus(ApplicationStatus status);
    List<Application> findByJobIdAndStatus(Long jobId, ApplicationStatus status);

    long countByStatus(ApplicationStatus status);

    @Query("SELECT a.status, COUNT(a) FROM Application a GROUP BY a.status")
    List<Object[]> countByStatusGroup();

    @Query("SELECT FUNCTION('MONTH', a.appliedAt), COUNT(a) FROM Application a WHERE FUNCTION('YEAR', a.appliedAt) = FUNCTION('YEAR', CURRENT_DATE) GROUP BY FUNCTION('MONTH', a.appliedAt) ORDER BY FUNCTION('MONTH', a.appliedAt)")
    List<Object[]> countByMonthCurrentYear();

    boolean existsByJobIdAndCandidateId(Long jobId, Long candidateId);
}
