package com.recruitmgmt.company_recruitment_management.dto;

import com.recruitmgmt.company_recruitment_management.enums.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record JobResponse(
    Long id,
    String title,
    String description,
    String department,
    String location,
    EmploymentType employmentType,
    ExperienceLevel experienceLevel,
    String requiredSkills,
    BigDecimal salaryMin,
    BigDecimal salaryMax,
    JobStatus status,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    LocalDateTime deadline,
    String createdByName,
    long applicationCount
) {}
