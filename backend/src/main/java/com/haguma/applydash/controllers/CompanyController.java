package com.haguma.applydash.controllers;

import com.haguma.applydash.dto.CompanyDto;
import com.haguma.applydash.dto.DtoMapper;
import com.haguma.applydash.entities.Company;
import com.haguma.applydash.entities.TrackedApplication;
import com.haguma.applydash.repositories.CompanyRepository;
import com.haguma.applydash.repositories.TrackedApplicationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

        private final CompanyRepository companyRepository;
        private final TrackedApplicationRepository trackedApplicationRepository;
        private final Random random = new Random();

        public CompanyController(CompanyRepository companyRepository,
                        TrackedApplicationRepository trackedApplicationRepository) {
                this.companyRepository = companyRepository;
                this.trackedApplicationRepository = trackedApplicationRepository;
        }

        // Endpoint for the "Explore" page
        @GetMapping
        public List<CompanyDto> getAllCompanies(
                        @RequestParam(required = false) String country,
                        @RequestParam(required = false) String search) {
                return companyRepository.findAll().stream()
                                .filter(company -> country == null || country.isEmpty()
                                                || company.getHqCountry().equalsIgnoreCase(country))
                                .filter(company -> search == null || search.isEmpty() ||
                                                company.getCompanyName().toLowerCase().contains(search.toLowerCase()) ||
                                                (company.getWhatTheyDo() != null
                                                                && company.getWhatTheyDo().toLowerCase()
                                                                                .contains(search.toLowerCase()))
                                                ||
                                                (company.getTechStack() != null && company.getTechStack().toLowerCase()
                                                                .contains(search.toLowerCase()))
                                                ||
                                                (company.getVibes() != null && company.getVibes().toLowerCase()
                                                                .contains(search.toLowerCase())))
                                .map(DtoMapper::toCompanyDto)
                                .collect(Collectors.toList());
        }

        // Endpoint for the "Smart Randomizer"
        @GetMapping("/random-suggestion")
        public ResponseEntity<CompanyDto> getRandomSuggestion() {
                List<String> trackedCompanyNames = trackedApplicationRepository.findAll()
                                .stream()
                                .map(TrackedApplication::getCompanyName)
                                .collect(Collectors.toList());

                List<Company> untrackedCompanies = companyRepository.findAll()
                                .stream()
                                .filter(company -> !trackedCompanyNames.contains(company.getCompanyName()))
                                .collect(Collectors.toList());

                if (untrackedCompanies.isEmpty()) {
                        return ResponseEntity.noContent().build(); // No suggestions left
                }

                Company suggestion = untrackedCompanies.get(random.nextInt(untrackedCompanies.size()));
                return ResponseEntity.ok(DtoMapper.toCompanyDto(suggestion));
        }

        // Endpoint to update company intelligence
        @PutMapping("/{id}")
        public ResponseEntity<Company> updateCompanyIntelligence(@PathVariable Long id,
                        @RequestBody Company companyDetails) {
                return companyRepository.findById(id)
                                .map(company -> {
                                        company.setVibes(companyDetails.getVibes());
                                        company.setTechStack(companyDetails.getTechStack());
                                        company.setHiringBar(companyDetails.getHiringBar());
                                        company.setInterviewNotes(companyDetails.getInterviewNotes());
                                        company.setInteresting(companyDetails.isInteresting());
                                        return ResponseEntity.ok(companyRepository.save(company));
                                })
                                .orElse(ResponseEntity.notFound().build());
        }

        // Endpoint for fetching a single company by ID
        @GetMapping("/{id}")
        public ResponseEntity<Company> getCompanyById(@PathVariable Long id) {
                return companyRepository.findById(id)
                                .map(ResponseEntity::ok)
                                .orElse(ResponseEntity.notFound().build());
        }
}