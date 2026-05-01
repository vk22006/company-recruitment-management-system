package com.recruitmgmt.company_recruitment_management.service;

import com.recruitmgmt.company_recruitment_management.dto.*;
import com.recruitmgmt.company_recruitment_management.entity.Application;
import com.recruitmgmt.company_recruitment_management.entity.Candidate;
import com.recruitmgmt.company_recruitment_management.entity.Job;
import com.recruitmgmt.company_recruitment_management.enums.ApplicationStatus;
import com.recruitmgmt.company_recruitment_management.exception.ResourceNotFoundException;
import com.recruitmgmt.company_recruitment_management.repository.ApplicationRepository;
import com.recruitmgmt.company_recruitment_management.repository.CandidateRepository;
import com.recruitmgmt.company_recruitment_management.repository.JobRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final CandidateRepository candidateRepository;

    public ApplicationService(ApplicationRepository applicationRepository,
                              JobRepository jobRepository,
                              CandidateRepository candidateRepository) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.candidateRepository = candidateRepository;
    }

    public List<ApplicationResponse> getAllApplications() {
        return applicationRepository.findAll().stream().map(this::toResponse).toList();
    }

    public ApplicationResponse getApplicationById(Long id) {
        return toResponse(findApplication(id));
    }

    public List<ApplicationResponse> getByJobId(Long jobId) {
        return applicationRepository.findByJobId(jobId).stream().map(this::toResponse).toList();
    }

    public List<ApplicationResponse> getByCandidateId(Long candidateId) {
        return applicationRepository.findByCandidateId(candidateId).stream().map(this::toResponse).toList();
    }

    public List<ApplicationResponse> getByStatus(ApplicationStatus status) {
        return applicationRepository.findByStatus(status).stream().map(this::toResponse).toList();
    }

    public ApplicationResponse createApplication(ApplicationRequest request) {
        Job job = jobRepository.findById(request.jobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + request.jobId()));
        Candidate candidate = candidateRepository.findById(request.candidateId())
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found with id: " + request.candidateId()));

        if (applicationRepository.existsByJobIdAndCandidateId(request.jobId(), request.candidateId())) {
            throw new IllegalArgumentException("Application already exists for this job and candidate");
        }

        Application application = Application.builder()
                .job(job)
                .candidate(candidate)
                .coverLetter(request.coverLetter())
                .notes(request.notes())
                .build();

        return toResponse(applicationRepository.save(application));
    }

    public ApplicationResponse updateStatus(Long id, StatusUpdateRequest request) {
        Application application = findApplication(id);
        application.setStatus(request.status());
        if (request.notes() != null) {
            application.setNotes(request.notes());
        }
        return toResponse(applicationRepository.save(application));
    }

    public void deleteApplication(Long id) {
        if (!applicationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Application not found with id: " + id);
        }
        applicationRepository.deleteById(id);
    }

    private Application findApplication(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + id));
    }

    private ApplicationResponse toResponse(Application a) {
        return new ApplicationResponse(
                a.getId(), a.getJob().getId(), a.getJob().getTitle(),
                a.getCandidate().getId(), a.getCandidate().getFullName(),
                a.getCandidate().getEmail(), a.getStatus(),
                a.getCoverLetter(), a.getNotes(),
                a.getAppliedAt(), a.getUpdatedAt()
        );
    }
}
