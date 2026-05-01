package com.recruitmgmt.company_recruitment_management.service;

import com.recruitmgmt.company_recruitment_management.dto.DashboardStats;
import com.recruitmgmt.company_recruitment_management.enums.ApplicationStatus;
import com.recruitmgmt.company_recruitment_management.enums.JobStatus;
import com.recruitmgmt.company_recruitment_management.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class DashboardService {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final CandidateRepository candidateRepository;
    private final InterviewRepository interviewRepository;

    public DashboardService(JobRepository jobRepository,
                            ApplicationRepository applicationRepository,
                            CandidateRepository candidateRepository,
                            InterviewRepository interviewRepository) {
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.candidateRepository = candidateRepository;
        this.interviewRepository = interviewRepository;
    }

    public DashboardStats getStats() {
        long totalJobs = jobRepository.count();
        long openJobs = jobRepository.countByStatus(JobStatus.OPEN);
        long totalApplications = applicationRepository.count();
        long shortlisted = applicationRepository.countByStatus(ApplicationStatus.SHORTLISTED);
        long hired = applicationRepository.countByStatus(ApplicationStatus.HIRED);
        long rejected = applicationRepository.countByStatus(ApplicationStatus.REJECTED);
        long totalCandidates = candidateRepository.count();
        long upcomingInterviews = interviewRepository
                .findByScheduledAtAfterOrderByScheduledAtAsc(LocalDateTime.now()).size();

        Map<String, Long> applicationsByStatus = new LinkedHashMap<>();
        for (Object[] row : applicationRepository.countByStatusGroup()) {
            applicationsByStatus.put(row[0].toString(), (Long) row[1]);
        }

        Map<Integer, Long> applicationsByMonth = new LinkedHashMap<>();
        for (Object[] row : applicationRepository.countByMonthCurrentYear()) {
            applicationsByMonth.put(((Number) row[0]).intValue(), (Long) row[1]);
        }

        return new DashboardStats(
                totalJobs, openJobs, totalApplications,
                shortlisted, hired, rejected,
                totalCandidates, upcomingInterviews,
                applicationsByStatus, applicationsByMonth
        );
    }
}
