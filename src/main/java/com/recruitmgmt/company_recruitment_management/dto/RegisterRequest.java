package com.recruitmgmt.company_recruitment_management.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;

public record RegisterRequest(
        @NotBlank String username,
        @NotBlank String password,
        @NotBlank String fullName,
        @NotBlank @Email String email) {
}
