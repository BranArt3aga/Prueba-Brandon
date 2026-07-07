package com.example.pruebatecnica.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import java.sql.Date;

@Entity
@Data
public class OrdenesEntity {
    @Id
    private int ordenId;
    @ManyToOne
    @JoinColumn(name = "sucursal_id")
    private SucursalesEntity sucursal;
    private Date fecha;
    private float total;
}
