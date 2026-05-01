package com.recruitmgmt.company_recruitment_management.dto;

import jakarta.validation.constraints.NotNull;

public record ApplicationRequest(
    @NotNull Long jobId,
    @NotNull Long candidateId,
    String coverLetter,
    String notes
) {}
