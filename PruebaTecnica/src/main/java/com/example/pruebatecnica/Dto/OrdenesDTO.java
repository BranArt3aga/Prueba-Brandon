package com.example.pruebatecnica.Dto;

import lombok.Data;

@Data
public class OrdenesDTO {
    private int ordenId;
    private int sucursalId;
    private String fecha;
    private float total;
}
