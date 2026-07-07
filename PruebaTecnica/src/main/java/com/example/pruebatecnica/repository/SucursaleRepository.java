package com.example.pruebatecnica.repository;

import com.example.pruebatecnica.entity.SucursalesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SucursaleRepository extends JpaRepository <SucursalesEntity, Integer> {

}
