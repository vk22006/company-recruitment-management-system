package com.recruitmgmt.company_recruitment_management.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CandidateRequest(
    @NotBlank String fullName,
    @NotBlank @Email String email,
    String phone,
    String skills,
    Integer experienceYears
) {}
