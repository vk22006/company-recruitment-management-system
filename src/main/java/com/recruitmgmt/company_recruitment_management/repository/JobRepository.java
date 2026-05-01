package com.recruitmgmt.company_recruitment_management.repository;

import com.recruitmgmt.company_recruitment_management.entity.Job;
import com.recruitmgmt.company_recruitment_management.enums.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByStatus(JobStatus status);
    List<Job> findByDepartment(String department);

    @Query("SELECT j FROM Job j WHERE LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Job> searchByKeyword(@Param("keyword") String keyword);

    long countByStatus(JobStatus status);

    @Query("SELECT DISTINCT j.department FROM Job j WHERE j.department IS NOT NULL")
    List<String> findDistinctDepartments();
}
