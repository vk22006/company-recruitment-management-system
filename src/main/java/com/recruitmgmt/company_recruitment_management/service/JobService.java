package com.recruitmgmt.company_recruitment_management.service;

import com.recruitmgmt.company_recruitment_management.dto.*;
import com.recruitmgmt.company_recruitment_management.entity.Job;
import com.recruitmgmt.company_recruitment_management.entity.User;
import com.recruitmgmt.company_recruitment_management.enums.JobStatus;
import com.recruitmgmt.company_recruitment_management.exception.ResourceNotFoundException;
import com.recruitmgmt.company_recruitment_management.repository.ApplicationRepository;
import com.recruitmgmt.company_recruitment_management.repository.JobRepository;
import com.recruitmgmt.company_recruitment_management.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;

    public JobService(JobRepository jobRepository, UserRepository userRepository,
                      ApplicationRepository applicationRepository) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.applicationRepository = applicationRepository;
    }

    public List<JobResponse> getAllJobs() {
        return jobRepository.findAll().stream().map(this::toResponse).toList();
    }

    public JobResponse getJobById(Long id) {
        return toResponse(findJob(id));
    }

    public List<JobResponse> getJobsByStatus(JobStatus status) {
        return jobRepository.findByStatus(status).stream().map(this::toResponse).toList();
    }

    public List<JobResponse> searchJobs(String keyword) {
        return jobRepository.searchByKeyword(keyword).stream().map(this::toResponse).toList();
    }

    public List<String> getDepartments() {
        return jobRepository.findDistinctDepartments();
    }

    public JobResponse createJob(JobRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Job job = Job.builder()
                .title(request.title())
                .description(request.description())
                .department(request.department())
                .location(request.location())
                .employmentType(request.employmentType())
                .experienceLevel(request.experienceLevel())
                .requiredSkills(request.requiredSkills())
                .salaryMin(request.salaryMin())
                .salaryMax(request.salaryMax())
                .status(request.status() != null ? request.status() : JobStatus.DRAFT)
                .deadline(request.deadline())
                .createdBy(user)
                .build();

        return toResponse(jobRepository.save(job));
    }

    public JobResponse updateJob(Long id, JobRequest request) {
        Job job = findJob(id);
        job.setTitle(request.title());
        job.setDescription(request.description());
        job.setDepartment(request.department());
        job.setLocation(request.location());
        job.setEmploymentType(request.employmentType());
        job.setExperienceLevel(request.experienceLevel());
        job.setRequiredSkills(request.requiredSkills());
        job.setSalaryMin(request.salaryMin());
        job.setSalaryMax(request.salaryMax());
        if (request.status() != null) job.setStatus(request.status());
        job.setDeadline(request.deadline());
        return toResponse(jobRepository.save(job));
    }

    public void deleteJob(Long id) {
        if (!jobRepository.existsById(id)) {
            throw new ResourceNotFoundException("Job not found with id: " + id);
        }
        jobRepository.deleteById(id);
    }

    private Job findJob(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
    }

    private JobResponse toResponse(Job job) {
        long appCount = applicationRepository.findByJobId(job.getId()).size();
        return new JobResponse(
                job.getId(), job.getTitle(), job.getDescription(),
                job.getDepartment(), job.getLocation(),
                job.getEmploymentType(), job.getExperienceLevel(),
                job.getRequiredSkills(), job.getSalaryMin(), job.getSalaryMax(),
                job.getStatus(), job.getCreatedAt(), job.getUpdatedAt(),
                job.getDeadline(),
                job.getCreatedBy() != null ? job.getCreatedBy().getFullName() : null,
                appCount
        );
    }
}
