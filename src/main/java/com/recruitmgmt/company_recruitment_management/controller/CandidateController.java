package com.recruitmgmt.company_recruitment_management.controller;

import com.recruitmgmt.company_recruitment_management.dto.*;
import com.recruitmgmt.company_recruitment_management.service.CandidateService;
import com.recruitmgmt.company_recruitment_management.service.FileStorageService;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/api/candidates")
public class CandidateController {

    private final CandidateService candidateService;
    private final FileStorageService fileStorageService;

    public CandidateController(CandidateService candidateService, FileStorageService fileStorageService) {
        this.candidateService = candidateService;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping
    public ResponseEntity<List<CandidateResponse>> getAllCandidates(
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) Integer minExperience) {
        return ResponseEntity.ok(candidateService.filterCandidates(skill, minExperience));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CandidateResponse> getCandidateById(@PathVariable Long id) {
        return ResponseEntity.ok(candidateService.getCandidateById(id));
    }

    @PostMapping
    public ResponseEntity<CandidateResponse> createCandidate(@Valid @RequestBody CandidateRequest request) {
        return ResponseEntity.ok(candidateService.createCandidate(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CandidateResponse> updateCandidate(@PathVariable Long id,
                                                              @Valid @RequestBody CandidateRequest request) {
        return ResponseEntity.ok(candidateService.updateCandidate(id, request));
    }

    @PostMapping("/{id}/resume")
    public ResponseEntity<CandidateResponse> uploadResume(@PathVariable Long id,
                                                           @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(candidateService.uploadResume(id, file));
    }

    @GetMapping("/{id}/resume")
    public ResponseEntity<Resource> downloadResume(@PathVariable Long id) throws MalformedURLException {
        CandidateResponse candidate = candidateService.getCandidateById(id);
        if (candidate.resumePath() == null) {
            return ResponseEntity.notFound().build();
        }
        Path filePath = fileStorageService.loadFile(candidate.resumePath());
        Resource resource = new UrlResource(filePath.toUri());
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + candidate.resumePath() + "\"")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCandidate(@PathVariable Long id) {
        candidateService.deleteCandidate(id);
        return ResponseEntity.noContent().build();
    }
}
