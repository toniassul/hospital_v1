package com.example.demo.request;

import lombok.Data;
import java.time.LocalDate;

@Data
public class PacienteRequest {
    private String nombre;
    private String apellido;
    private String email;
    private String telefono;
    private LocalDate fechaNacimiento;
}
