package com.example.demo.service;

import com.example.demo.model.Paciente;
import com.example.demo.request.PacienteRequest;
import java.util.List;

public interface PacienteService {
    List<Paciente> findAll();
    List<Paciente> findAllActivos();
    Paciente findById(Long id);
    Paciente create(PacienteRequest request);
    Paciente update(Long id, PacienteRequest request);
    void delete(Long id);
    boolean existsByEmail(String email);
}
