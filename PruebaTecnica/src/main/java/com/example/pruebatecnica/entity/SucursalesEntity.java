package com.example.pruebatecnica.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

@Entity
@Data
public class SucursalesEntity {
    @Id
    private int sucursalId;
    private String nombre;
}
