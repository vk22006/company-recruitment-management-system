package com.recruitmgmt.company_recruitment_management.service;

import com.recruitmgmt.company_recruitment_management.dto.*;
import com.recruitmgmt.company_recruitment_management.entity.Candidate;
import com.recruitmgmt.company_recruitment_management.exception.ResourceNotFoundException;
import com.recruitmgmt.company_recruitment_management.repository.CandidateRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@Transactional
public class CandidateService {

    private final CandidateRepository candidateRepository;
    private final FileStorageService fileStorageService;

    public CandidateService(CandidateRepository candidateRepository, FileStorageService fileStorageService) {
        this.candidateRepository = candidateRepository;
        this.fileStorageService = fileStorageService;
    }

    public List<CandidateResponse> getAllCandidates() {
        return candidateRepository.findAll().stream().map(this::toResponse).toList();
    }

    public CandidateResponse getCandidateById(Long id) {
        return toResponse(findCandidate(id));
    }

    public List<CandidateResponse> filterCandidates(String skill, Integer minExperience) {
        if (skill != null && minExperience != null) {
            return candidateRepository.findBySkillAndMinExperience(skill, minExperience)
                    .stream().map(this::toResponse).toList();
        } else if (skill != null) {
            return candidateRepository.findBySkill(skill)
                    .stream().map(this::toResponse).toList();
        } else if (minExperience != null) {
            return candidateRepository.findByExperienceYearsGreaterThanEqual(minExperience)
                    .stream().map(this::toResponse).toList();
        }
        return getAllCandidates();
    }

    public CandidateResponse createCandidate(CandidateRequest request) {
        if (candidateRepository.existsByEmail(request.email())) {
            throw new IllegalArgumentException("Candidate with email " + request.email() + " already exists");
        }
        Candidate candidate = Candidate.builder()
                .fullName(request.fullName())
                .email(request.email())
                .phone(request.phone())
                .skills(request.skills())
                .experienceYears(request.experienceYears())
                .build();
        return toResponse(candidateRepository.save(candidate));
    }

    public CandidateResponse updateCandidate(Long id, CandidateRequest request) {
        Candidate candidate = findCandidate(id);
        candidate.setFullName(request.fullName());
        candidate.setEmail(request.email());
        candidate.setPhone(request.phone());
        candidate.setSkills(request.skills());
        candidate.setExperienceYears(request.experienceYears());
        return toResponse(candidateRepository.save(candidate));
    }

    public CandidateResponse uploadResume(Long id, MultipartFile file) {
        Candidate candidate = findCandidate(id);
        if (candidate.getResumePath() != null) {
            fileStorageService.deleteFile(candidate.getResumePath());
        }
        String filename = fileStorageService.storeFile(file);
        candidate.setResumePath(filename);
        return toResponse(candidateRepository.save(candidate));
    }

    public void deleteCandidate(Long id) {
        Candidate candidate = findCandidate(id);
        if (candidate.getResumePath() != null) {
            fileStorageService.deleteFile(candidate.getResumePath());
        }
        candidateRepository.deleteById(id);
    }

    private Candidate findCandidate(Long id) {
        return candidateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found with id: " + id));
    }

    private CandidateResponse toResponse(Candidate c) {
        return new CandidateResponse(
                c.getId(), c.getFullName(), c.getEmail(), c.getPhone(),
                c.getSkills(), c.getExperienceYears(), c.getResumePath(), c.getCreatedAt()
        );
    }
}
