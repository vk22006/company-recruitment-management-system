package com.recruitmgmt.company_recruitment_management.controller;

import com.recruitmgmt.company_recruitment_management.dto.*;
import com.recruitmgmt.company_recruitment_management.enums.InterviewResult;
import com.recruitmgmt.company_recruitment_management.service.InterviewService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interviews")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @GetMapping
    public ResponseEntity<List<InterviewResponse>> getAllInterviews(
            @RequestParam(required = false) Long applicationId) {
        if (applicationId != null) {
            return ResponseEntity.ok(interviewService.getByApplicationId(applicationId));
        }
        return ResponseEntity.ok(interviewService.getAllInterviews());
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<InterviewResponse>> getUpcoming() {
        return ResponseEntity.ok(interviewService.getUpcoming());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InterviewResponse> getInterviewById(@PathVariable Long id) {
        return ResponseEntity.ok(interviewService.getInterviewById(id));
    }

    @PostMapping
    public ResponseEntity<InterviewResponse> createInterview(@Valid @RequestBody InterviewRequest request) {
        return ResponseEntity.ok(interviewService.createInterview(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InterviewResponse> updateInterview(@PathVariable Long id,
                                                              @Valid @RequestBody InterviewRequest request) {
        return ResponseEntity.ok(interviewService.updateInterview(id, request));
    }

    @PatchMapping("/{id}/feedback")
    public ResponseEntity<InterviewResponse> updateFeedback(@PathVariable Long id,
                                                             @RequestParam String feedback,
                                                             @RequestParam InterviewResult result) {
        return ResponseEntity.ok(interviewService.updateFeedback(id, feedback, result));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInterview(@PathVariable Long id) {
        interviewService.deleteInterview(id);
        return ResponseEntity.noContent().build();
    }
}
