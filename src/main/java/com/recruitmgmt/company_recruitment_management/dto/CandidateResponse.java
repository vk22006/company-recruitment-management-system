package com.recruitmgmt.company_recruitment_management.dto;

import java.time.LocalDateTime;

public record CandidateResponse(
    Long id,
    String fullName,
    String email,
    String phone,
    String skills,
    Integer experienceYears,
    String resumePath,
    LocalDateTime createdAt
) {}
