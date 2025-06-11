package com.haguma.applydash.repositories;

import com.haguma.applydash.entities.TrackedApplication;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TrackedApplicationRepository extends JpaRepository<TrackedApplication, Long> {
}