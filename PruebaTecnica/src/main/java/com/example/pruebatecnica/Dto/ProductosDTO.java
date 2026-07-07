package com.example.pruebatecnica.Dto;

import lombok.Data;

@Data
public class ProductosDTO {
    private int productoId;
    private int ordenId;
    private String codigo;
    private String descripcion;
    private float precio;
}
