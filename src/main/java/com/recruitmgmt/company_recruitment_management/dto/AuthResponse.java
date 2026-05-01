package com.recruitmgmt.company_recruitment_management.dto;

public record AuthResponse(
    String token,
    String username,
    String fullName
) {}
