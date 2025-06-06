package com.example.demo.service.impl;

import com.example.demo.model.Paciente;
import com.example.demo.repository.PacienteRepository;
import com.example.demo.request.PacienteRequest;
import com.example.demo.service.PacienteService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PacienteServiceImpl implements PacienteService {

    private final PacienteRepository pacienteRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Paciente> findAll() {
        return pacienteRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Paciente> findAllActivos() {
        return pacienteRepository.findByActivoTrue();
    }

    @Override
    @Transactional(readOnly = true)
    public Paciente findById(Long id) {
        return pacienteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Paciente no encontrado"));
    }

    @Override
    public Paciente create(PacienteRequest request) {
        validatePacienteData(request);
        
        if (pacienteRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Ya existe un paciente con este email");
        }

        Paciente paciente = new Paciente();
        mapPacienteFromRequest(paciente, request);
        paciente.setActivo(true); // Default value for new patients
        
        return pacienteRepository.save(paciente);
    }

    @Override
    public Paciente update(Long id, PacienteRequest request) {
        validatePacienteData(request);
        
        Paciente paciente = findById(id);
        
        // Check if email is changed and new email doesn't exist
        if (!paciente.getEmail().equals(request.getEmail()) && 
            pacienteRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Ya existe un paciente con este email");
        }

        mapPacienteFromRequest(paciente, request);
        // Don't modify activo status during update
        
        return pacienteRepository.save(paciente);
    }

    private void validatePacienteData(PacienteRequest request) {
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
    }

    private void mapPacienteFromRequest(Paciente paciente, PacienteRequest request) {
        paciente.setNombre(request.getNombre().trim());
        paciente.setApellido(request.getApellido().trim());
        paciente.setEmail(request.getEmail().trim());
        paciente.setTelefono(request.getTelefono() != null ? request.getTelefono().trim() : null);
        paciente.setFechaNacimiento(request.getFechaNacimiento());
    }

    @Override
    public void delete(Long id) {
        Paciente paciente = findById(id);
        paciente.setActivo(false);
        pacienteRepository.save(paciente);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsByEmail(String email) {
        return pacienteRepository.existsByEmail(email);
    }
}
