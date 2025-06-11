package com.haguma.applydash.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.haguma.applydash.entities.Company;
import com.haguma.applydash.repositories.CompanyRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final CompanyRepository companyRepository;
    private final ResourceLoader resourceLoader;

    public DataInitializer(CompanyRepository companyRepository, ResourceLoader resourceLoader) {
        this.companyRepository = companyRepository;
        this.resourceLoader = resourceLoader;
    }

    @Override
    public void run(String... args) throws Exception {
        // Check if the companies table is already populated
        if (companyRepository.count() == 0) {
            System.out.println("No companies found in DB. Initializing from JSON...");

            // Load the JSON file from the classpath
            Resource resource = resourceLoader.getResource("classpath:companies.json");
            InputStream inputStream = resource.getInputStream();

            // Use Jackson's ObjectMapper to read the JSON
            ObjectMapper mapper = new ObjectMapper();
            List<Company> companies = mapper.readValue(inputStream, new TypeReference<List<Company>>() {
            });

            // Save all companies to the database
            companyRepository.saveAll(companies);
            System.out.println("Successfully loaded " + companies.size() + " companies into the database.");
        } else {
            System.out.println("Database already contains company data. Skipping initialization.");
        }
    }
}