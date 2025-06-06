package com.example.demo.request;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CitaRequest {
    private LocalDateTime fechaHora;
    private String motivo;
    private Long medicoId;
    private Long pacienteId;
    private String diagnosticoBreve;
    private String observacionesConsulta;
}
