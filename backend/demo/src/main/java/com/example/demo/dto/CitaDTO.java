package com.example.demo.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CitaDTO {
    private Long id;
    private LocalDateTime fechaHora;
    private String motivo;
    private String estado;
    private String diagnosticoBreve;
    private String observacionesConsulta;
    private MedicoDTO medico;
    private PacienteDTO paciente;
}
