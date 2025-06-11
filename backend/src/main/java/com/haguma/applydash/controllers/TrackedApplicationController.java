package com.haguma.applydash.controllers;

import com.haguma.applydash.dto.DtoMapper;
import com.haguma.applydash.dto.TrackedApplicationDto;
import com.haguma.applydash.entities.TrackedApplication;
import com.haguma.applydash.repositories.TrackedApplicationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/applications")
public class TrackedApplicationController {

    private final TrackedApplicationRepository repository;

    public TrackedApplicationController(TrackedApplicationRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<TrackedApplicationDto> getAllApplications() {
        return repository.findAll().stream()
                .map(DtoMapper::toTrackedApplicationDto)
                .collect(Collectors.toList());
    }

    @PostMapping
    public TrackedApplication createApplication(@RequestBody TrackedApplication application) {
        // Set a default status if none is provided
        if (application.getStatus() == null || application.getStatus().isEmpty()) {
            application.setStatus("Will Apply");
        }
        return repository.save(application);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrackedApplication> updateApplication(@PathVariable Long id,
            @RequestBody TrackedApplication updatedApplication) {
        return repository.findById(id)
                .map(application -> {
                    application.setCompanyName(updatedApplication.getCompanyName());
                    application.setJobTitle(updatedApplication.getJobTitle());
                    application.setStatus(updatedApplication.getStatus());
                    application.setNotes(updatedApplication.getNotes());
                    application.setNextActionDate(updatedApplication.getNextActionDate());
                    return ResponseEntity.ok(repository.save(application));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build(); // 204 No Content for successful deletion
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}