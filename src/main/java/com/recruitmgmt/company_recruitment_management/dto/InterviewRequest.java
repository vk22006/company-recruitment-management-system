package com.recruitmgmt.company_recruitment_management.dto;

import com.recruitmgmt.company_recruitment_management.enums.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public record InterviewRequest(
    @NotNull Long applicationId,
    @NotNull LocalDateTime scheduledAt,
    InterviewType interviewType,
    String interviewerName
) {}
