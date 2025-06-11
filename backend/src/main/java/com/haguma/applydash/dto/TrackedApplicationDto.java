package com.haguma.applydash.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class TrackedApplicationDto {
    private Long id;
    private Long companyId;
    private String companyName;
    private String jobTitle;
    private String status;
    private String notes;
    private LocalDate dateApplied;
    private LocalDate nextActionDate;
}
