package com.example.pruebatecnica.service;

import com.example.pruebatecnica.repository.ProductosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductoService {

    @Autowired
    private ProductosRepository productosRepository;
}
