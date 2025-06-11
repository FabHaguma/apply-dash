package com.haguma.applydash.dto;

import lombok.Data;

@Data
public class CompanyDto {
    private Long id;
    private String companyName;
    private String websiteUrl;
    private String hqCountry;
    private String whatTheyDo;
    private String vibes;
    private String techStack;
    private String hiringBar;
    private String interviewNotes;
    private boolean isInteresting;
}
