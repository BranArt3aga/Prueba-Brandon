package com.example.pruebatecnica.repository;

import com.example.pruebatecnica.entity.ProductosEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductosRepository extends JpaRepository<ProductosEntity, Integer> {
}
