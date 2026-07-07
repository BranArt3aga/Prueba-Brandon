package com.example.pruebatecnica.service;

import com.example.pruebatecnica.entity.OrdenesEntity;
import com.example.pruebatecnica.repository.OrdenesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrdenesService {

    @Autowired
    private OrdenesRepository ordenesRepository;

    public OrdenesEntity crearOrden (OrdenesEntity ordenesEntity) {
        return ordenesRepository.save(ordenesEntity);
    }
}
