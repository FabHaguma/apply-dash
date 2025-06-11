package com.haguma.applydash.dto;

import com.haguma.applydash.entities.Company;
import com.haguma.applydash.entities.TrackedApplication;

public class DtoMapper {
    public static CompanyDto toCompanyDto(Company company) {
        if (company == null)
            return null;
        CompanyDto dto = new CompanyDto();
        dto.setId(company.getId());
        dto.setCompanyName(company.getCompanyName());
        dto.setWebsiteUrl(company.getWebsiteUrl());
        dto.setHqCountry(company.getHqCountry());
        dto.setWhatTheyDo(company.getWhatTheyDo());
        dto.setVibes(company.getVibes());
        dto.setTechStack(company.getTechStack());
        dto.setHiringBar(company.getHiringBar());
        dto.setInterviewNotes(company.getInterviewNotes());
        dto.setInteresting(company.isInteresting());
        return dto;
    }

    public static TrackedApplicationDto toTrackedApplicationDto(TrackedApplication app) {
        if (app == null)
            return null;
        TrackedApplicationDto dto = new TrackedApplicationDto();
        dto.setId(app.getId());
        dto.setCompanyId(app.getCompanyId());
        dto.setCompanyName(app.getCompanyName());
        dto.setJobTitle(app.getJobTitle());
        dto.setStatus(app.getStatus());
        dto.setNotes(app.getNotes());
        dto.setDateApplied(app.getDateApplied());
        dto.setNextActionDate(app.getNextActionDate());
        return dto;
    }
}
