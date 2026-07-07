package com.example.pruebatecnica.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class ProductosEntity {
    @Id
    private int productoId;
    @ManyToOne
    @JoinColumn(name = "orden_id")
    private OrdenesEntity orden;
    private String codigo;
    private String descripcion;
    private float precio;
}
