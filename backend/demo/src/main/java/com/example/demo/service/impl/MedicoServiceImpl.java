package com.example.demo.service.impl;

import com.example.demo.model.Medico;
import com.example.demo.model.Especialidad;
import com.example.demo.repository.MedicoRepository;
import com.example.demo.service.EspecialidadService;
import com.example.demo.request.MedicoRequest;
import com.example.demo.service.MedicoService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MedicoServiceImpl implements MedicoService {

    private final MedicoRepository medicoRepository;
    private final EspecialidadService especialidadService;

    @Override
    @Transactional(readOnly = true)
    public List<Medico> findAll() {
        return medicoRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Medico> findAllActivos() {
        return medicoRepository.findByActivoTrue();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Medico> findByEspecialidad(Long especialidadId) {
        return medicoRepository.findByEspecialidadId(especialidadId);
    }

    @Override
    @Transactional(readOnly = true)
    public Medico findById(Long id) {
        return medicoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Médico no encontrado"));
    }

    @Override
    public Medico create(MedicoRequest request) {
        validateMedicoData(request);
        
        if (medicoRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Ya existe un médico con este email");
        }

        Especialidad especialidad = especialidadService.findById(request.getEspecialidadId());
        
        Medico medico = new Medico();
        mapMedicoFromRequest(medico, request, especialidad);
        medico.setActivo(true);
        
        return medicoRepository.save(medico);
    }

    @Override
    public Medico update(Long id, MedicoRequest request) {
        validateMedicoData(request);
        
        Medico medico = findById(id);
        
        if (!medico.getEmail().equals(request.getEmail()) && 
            medicoRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Ya existe un médico con este email");
        }

        Especialidad especialidad = especialidadService.findById(request.getEspecialidadId());
        mapMedicoFromRequest(medico, request, especialidad);
        
        return medicoRepository.save(medico);
    }

    @Override
    public void delete(Long id) {
        Medico medico = findById(id);
        medico.setActivo(false);
        medicoRepository.save(medico);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return medicoRepository.existsByEmail(email);
    }

    private void validateMedicoData(MedicoRequest request) {
        if (request.getNombre() == null || request.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre es obligatorio");
        }
        if (request.getApellido() == null || request.getApellido().trim().isEmpty()) {
            throw new IllegalArgumentException("El apellido es obligatorio");
        }
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new IllegalArgumentException("El email es obligatorio");
        }
        if (request.getEmail() != null && !request.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("El formato del email no es válido");
        }
        if (request.getTelefono() != null && request.getTelefono().length() > 20) {
            throw new IllegalArgumentException("El teléfono no puede exceder los 20 caracteres");
        }
        if (request.getEspecialidadId() == null) {
            throw new IllegalArgumentException("La especialidad es obligatoria");
        }
    }

    private void mapMedicoFromRequest(Medico medico, MedicoRequest request, Especialidad especialidad) {
        medico.setNombre(request.getNombre().trim());
        medico.setApellido(request.getApellido().trim());
        medico.setEmail(request.getEmail().trim());
        medico.setTelefono(request.getTelefono() != null ? request.getTelefono().trim() : null);
        medico.setEspecialidad(especialidad);
    }
}
