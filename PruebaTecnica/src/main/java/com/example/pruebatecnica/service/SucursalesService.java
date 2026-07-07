package com.example.pruebatecnica.service;

import com.example.pruebatecnica.repository.SucursaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SucursalesService {

    @Autowired
    private SucursaleRepository sucursaleRepository;
}
