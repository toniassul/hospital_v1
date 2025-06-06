package com.example.demo.service.impl;

import com.example.demo.model.Cita;
import com.example.demo.model.Medico;
import com.example.demo.model.Paciente;
import com.example.demo.repository.CitaRepository;
import com.example.demo.request.CitaRequest;
import com.example.demo.service.CitaService;
import com.example.demo.service.MedicoService;
import com.example.demo.service.PacienteService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CitaServiceImpl implements CitaService {

    private final CitaRepository citaRepository;
    private final MedicoService medicoService;
    private final PacienteService pacienteService;

    @Override
    @Transactional(readOnly = true)
    public List<Cita> findAll() {
        return citaRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Cita> findByMedico(Long medicoId) {
        return citaRepository.findByMedicoId(medicoId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Cita> findByPaciente(Long pacienteId) {
        return citaRepository.findByPacienteId(pacienteId);
    }

    @Override
    @Transactional(readOnly = true)
    public Cita findById(Long id) {
        return citaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Cita no encontrada"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Cita> findByMedicoAndFecha(Long medicoId, LocalDateTime inicio, LocalDateTime fin) {
        return citaRepository.findByMedicoIdAndFechaHoraBetween(medicoId, inicio, fin);
    }

    @Override
    public Cita create(CitaRequest request) {
        validateCitaData(request);
        
        Medico medico = medicoService.findById(request.getMedicoId());
        Paciente paciente = pacienteService.findById(request.getPacienteId());
        
        checkMedicoAvailability(request.getMedicoId(), request.getFechaHora(), null);

        Cita cita = new Cita();
        mapCitaFromRequest(cita, request, medico, paciente);
        cita.setEstado("PENDIENTE");
        
        return citaRepository.save(cita);
    }

    @Override
    public Cita update(Long id, CitaRequest request) {
        validateCitaData(request);
        
        Cita cita = findById(id);
        Medico medico = medicoService.findById(request.getMedicoId());
        Paciente paciente = pacienteService.findById(request.getPacienteId());
        
        if (!cita.getFechaHora().equals(request.getFechaHora()) || 
            !cita.getMedico().getId().equals(request.getMedicoId())) {
            checkMedicoAvailability(request.getMedicoId(), request.getFechaHora(), id);
        }

        mapCitaFromRequest(cita, request, medico, paciente);
        return citaRepository.save(cita);
    }

    @Override
    public void delete(Long id) {
        if (!citaRepository.existsById(id)) {
            throw new EntityNotFoundException("Cita no encontrada");
        }
        citaRepository.deleteById(id);
    }

    @Override
    public Cita actualizarEstado(Long id, String estado) {
        if (estado == null || estado.trim().isEmpty()) {
            throw new IllegalArgumentException("El estado no puede estar vacío");
        }
        
        Cita cita = findById(id);
        cita.setEstado(estado.trim().toUpperCase());
        return citaRepository.save(cita);
    }

    private void validateCitaData(CitaRequest request) {
        if (request.getFechaHora() == null) {
            throw new IllegalArgumentException("La fecha y hora son obligatorias");
        }
        if (request.getFechaHora().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("La fecha de la cita no puede ser en el pasado");
        }
        if (request.getMedicoId() == null) {
            throw new IllegalArgumentException("El médico es obligatorio");
        }
        if (request.getPacienteId() == null) {
            throw new IllegalArgumentException("El paciente es obligatorio");
        }
        if (request.getMotivo() == null || request.getMotivo().trim().isEmpty()) {
            throw new IllegalArgumentException("El motivo es obligatorio");
        }
    }

    private void checkMedicoAvailability(Long medicoId, LocalDateTime fechaHora, Long excludeCitaId) {
        List<Cita> citasExistentes = citaRepository.findByMedicoIdAndFechaHoraBetween(
            medicoId,
            fechaHora.minusMinutes(30),
            fechaHora.plusMinutes(30)
        );
        
        boolean occupied = citasExistentes.stream()
            .anyMatch(cita -> excludeCitaId == null || !cita.getId().equals(excludeCitaId));
            
        if (occupied) {
            throw new IllegalStateException("El médico ya tiene una cita programada en ese horario");
        }
    }

    private void mapCitaFromRequest(Cita cita, CitaRequest request, Medico medico, Paciente paciente) {
        cita.setFechaHora(request.getFechaHora());
        cita.setMotivo(request.getMotivo().trim());
        cita.setDiagnosticoBreve(request.getDiagnosticoBreve());
        cita.setObservacionesConsulta(request.getObservacionesConsulta());
        cita.setMedico(medico);
        cita.setPaciente(paciente);
    }
}
