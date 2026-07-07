package com.example.pruebatecnica.repository;

import com.example.pruebatecnica.entity.OrdenesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrdenesRepository extends JpaRepository<OrdenesEntity, Integer> {
}
