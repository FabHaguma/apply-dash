package com.haguma.applydash.entities;

import com.fasterxml.jackson.annotation.JsonProperty; // Import this
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "companies")
@Data
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonProperty("company_name") // Add this
    @Column(unique = true, nullable = false)
    private String companyName;

    @JsonProperty("link_to_website") // Add this
    private String websiteUrl;

    @JsonProperty("hq_country") // Add this
    private String hqCountry;

    @JsonProperty("what_they_do") // Add this
    @Column(columnDefinition = "TEXT")
    private String whatTheyDo;

    @Column(columnDefinition = "TEXT")
    private String vibes;
    @Column(columnDefinition = "TEXT")
    private String techStack;
    private String hiringBar;
    @Column(columnDefinition = "TEXT")
    private String interviewNotes;
    private boolean isInteresting;

    // public boolean isInteresting() {
    // return isInteresting;
    // }
}