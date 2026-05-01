package com.recruitmgmt.company_recruitment_management.dto;

import com.recruitmgmt.company_recruitment_management.enums.ApplicationStatus;
import java.time.LocalDateTime;

public record ApplicationResponse(
    Long id,
    Long jobId,
    String jobTitle,
    Long candidateId,
    String candidateName,
    String candidateEmail,
    ApplicationStatus status,
    String coverLetter,
    String notes,
    LocalDateTime appliedAt,
    LocalDateTime updatedAt
) {}
