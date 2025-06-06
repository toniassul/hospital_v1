package com.example.demo.request;

import lombok.Data;

@Data
public class MedicoRequest {
    private String nombre;
    private String apellido;
    private String email;
    private String telefono;
    private Long especialidadId;
}
