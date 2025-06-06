package com.example.demo.dto;

import lombok.Data;

@Data
public class MedicoDTO {
    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    private String telefono;
    private Boolean activo;
    private EspecialidadDTO especialidad;
}
