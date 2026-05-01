package com.recruitmgmt.company_recruitment_management.dto;

import java.util.Map;

public record DashboardStats(
    long totalJobs,
    long openJobs,
    long totalApplications,
    long shortlisted,
    long hired,
    long rejected,
    long totalCandidates,
    long upcomingInterviews,
    Map<String, Long> applicationsByStatus,
    Map<Integer, Long> applicationsByMonth
) {}
