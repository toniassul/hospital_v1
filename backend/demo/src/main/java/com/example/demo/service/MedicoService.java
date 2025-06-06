package com.example.demo.service;

import com.example.demo.model.Medico;
import com.example.demo.request.MedicoRequest;
import java.util.List;

public interface MedicoService {
    List<Medico> findAll();
    List<Medico> findAllActivos();
    List<Medico> findByEspecialidad(Long especialidadId);
    Medico findById(Long id);
    Medico create(MedicoRequest request);
    Medico update(Long id, MedicoRequest request);
    void delete(Long id);
    boolean existsByEmail(String email);
}
