package com.example.demo.service.impl;

import com.example.demo.model.Especialidad;
import com.example.demo.repository.EspecialidadRepository;
import com.example.demo.request.EspecialidadRequest;
import com.example.demo.service.EspecialidadService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class EspecialidadServiceImpl implements EspecialidadService {

    private final EspecialidadRepository especialidadRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Especialidad> findAll() {
        return especialidadRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Especialidad findById(Long id) {
        return especialidadRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Especialidad no encontrada"));
    }

    @Override
    public Especialidad create(EspecialidadRequest request) {
        Especialidad especialidad = new Especialidad();
        especialidad.setNombre(request.getNombre());
        especialidad.setDescripcion(request.getDescripcion());
        return especialidadRepository.save(especialidad);
    }

    @Override
    public Especialidad update(Long id, EspecialidadRequest request) {
        Especialidad especialidad = findById(id);
        especialidad.setNombre(request.getNombre());
        especialidad.setDescripcion(request.getDescripcion());
        return especialidadRepository.save(especialidad);
    }

    @Override
    public void delete(Long id) {
        if (!especialidadRepository.existsById(id)) {
            throw new EntityNotFoundException("Especialidad no encontrada");
        }
        especialidadRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByNombre(String nombre) {
        return especialidadRepository.existsByNombre(nombre);
    }
}
