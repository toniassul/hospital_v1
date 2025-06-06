package com.example.demo.service;

import com.example.demo.model.Cita;
import com.example.demo.request.CitaRequest;
import java.time.LocalDateTime;
import java.util.List;

public interface CitaService {
    List<Cita> findAll();
    List<Cita> findByMedico(Long medicoId);
    List<Cita> findByPaciente(Long pacienteId);
    List<Cita> findByMedicoAndFecha(Long medicoId, LocalDateTime inicio, LocalDateTime fin);
    Cita findById(Long id);
    Cita create(CitaRequest request);
    Cita update(Long id, CitaRequest request);
    void delete(Long id);
    Cita actualizarEstado(Long id, String estado);
}
