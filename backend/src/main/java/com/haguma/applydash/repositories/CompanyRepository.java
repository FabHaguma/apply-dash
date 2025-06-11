package com.haguma.applydash.repositories;

import com.haguma.applydash.entities.Company;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyRepository extends JpaRepository<Company, Long> {
}