package com.example.demo.service;

import com.example.demo.model.Especialidad;
import com.example.demo.request.EspecialidadRequest;
import java.util.List;

public interface EspecialidadService {
    List<Especialidad> findAll();
    Especialidad findById(Long id);
    Especialidad create(EspecialidadRequest request);
    Especialidad update(Long id, EspecialidadRequest request);
    void delete(Long id);
    boolean existsByNombre(String nombre);
}
