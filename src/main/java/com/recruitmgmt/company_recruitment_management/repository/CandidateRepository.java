package com.recruitmgmt.company_recruitment_management.repository;

import com.recruitmgmt.company_recruitment_management.entity.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    Optional<Candidate> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("SELECT c FROM Candidate c WHERE LOWER(c.skills) LIKE LOWER(CONCAT('%', :skill, '%'))")
    List<Candidate> findBySkill(@Param("skill") String skill);

    List<Candidate> findByExperienceYearsGreaterThanEqual(Integer years);

    @Query("SELECT c FROM Candidate c WHERE LOWER(c.skills) LIKE LOWER(CONCAT('%', :skill, '%')) AND c.experienceYears >= :years")
    List<Candidate> findBySkillAndMinExperience(@Param("skill") String skill, @Param("years") Integer years);
}
