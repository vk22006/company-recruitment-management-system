package com.recruitmgmt.company_recruitment_management.dto;

import com.recruitmgmt.company_recruitment_management.enums.*;
import java.time.LocalDateTime;

public record InterviewResponse(
    Long id,
    Long applicationId,
    String candidateName,
    String jobTitle,
    LocalDateTime scheduledAt,
    InterviewType interviewType,
    String interviewerName,
    String feedback,
    InterviewResult result,
    LocalDateTime createdAt
) {}
