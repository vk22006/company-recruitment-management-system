package com.recruitmgmt.company_recruitment_management.service;

import com.recruitmgmt.company_recruitment_management.dto.*;
import com.recruitmgmt.company_recruitment_management.entity.Application;
import com.recruitmgmt.company_recruitment_management.entity.Interview;
import com.recruitmgmt.company_recruitment_management.enums.InterviewResult;
import com.recruitmgmt.company_recruitment_management.exception.ResourceNotFoundException;
import com.recruitmgmt.company_recruitment_management.repository.ApplicationRepository;
import com.recruitmgmt.company_recruitment_management.repository.InterviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final ApplicationRepository applicationRepository;

    public InterviewService(InterviewRepository interviewRepository,
                            ApplicationRepository applicationRepository) {
        this.interviewRepository = interviewRepository;
        this.applicationRepository = applicationRepository;
    }

    public List<InterviewResponse> getAllInterviews() {
        return interviewRepository.findAll().stream().map(this::toResponse).toList();
    }

    public InterviewResponse getInterviewById(Long id) {
        return toResponse(findInterview(id));
    }

    public List<InterviewResponse> getByApplicationId(Long applicationId) {
        return interviewRepository.findByApplicationId(applicationId).stream().map(this::toResponse).toList();
    }

    public List<InterviewResponse> getUpcoming() {
        return interviewRepository.findByScheduledAtAfterOrderByScheduledAtAsc(LocalDateTime.now())
                .stream().map(this::toResponse).toList();
    }

    public InterviewResponse createInterview(InterviewRequest request) {
        Application application = applicationRepository.findById(request.applicationId())
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + request.applicationId()));

        Interview interview = Interview.builder()
                .application(application)
                .scheduledAt(request.scheduledAt())
                .interviewType(request.interviewType())
                .interviewerName(request.interviewerName())
                .build();

        return toResponse(interviewRepository.save(interview));
    }

    public InterviewResponse updateInterview(Long id, InterviewRequest request) {
        Interview interview = findInterview(id);
        interview.setScheduledAt(request.scheduledAt());
        interview.setInterviewType(request.interviewType());
        interview.setInterviewerName(request.interviewerName());
        return toResponse(interviewRepository.save(interview));
    }

    public InterviewResponse updateFeedback(Long id, String feedback, InterviewResult result) {
        Interview interview = findInterview(id);
        interview.setFeedback(feedback);
        interview.setResult(result);
        return toResponse(interviewRepository.save(interview));
    }

    public void deleteInterview(Long id) {
        if (!interviewRepository.existsById(id)) {
            throw new ResourceNotFoundException("Interview not found with id: " + id);
        }
        interviewRepository.deleteById(id);
    }

    private Interview findInterview(Long id) {
        return interviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found with id: " + id));
    }

    private InterviewResponse toResponse(Interview i) {
        Application app = i.getApplication();
        return new InterviewResponse(
                i.getId(), app.getId(),
                app.getCandidate().getFullName(), app.getJob().getTitle(),
                i.getScheduledAt(), i.getInterviewType(),
                i.getInterviewerName(), i.getFeedback(),
                i.getResult(), i.getCreatedAt()
        );
    }
}
