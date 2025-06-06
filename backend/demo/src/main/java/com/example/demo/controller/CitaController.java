package com.example.demo.controller;

import com.example.demo.dto.CitaDTO;
import com.example.demo.model.Cita;
import com.example.demo.request.CitaRequest;
import com.example.demo.service.CitaService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/citas")
@RequiredArgsConstructor
public class CitaController {

    private final CitaService citaService;
    private final ModelMapper modelMapper;

    @GetMapping
    public ResponseEntity<List<CitaDTO>> findAll() {
        List<CitaDTO> citas = citaService.findAll()
                .stream()
                .map(cita -> modelMapper.map(cita, CitaDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(citas);
    }

    @GetMapping("/medico/{medicoId}")
    public ResponseEntity<List<CitaDTO>> findByMedico(@PathVariable Long medicoId) {
        List<CitaDTO> citas = citaService.findByMedico(medicoId)
                .stream()
                .map(cita -> modelMapper.map(cita, CitaDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(citas);
    }

    @GetMapping("/paciente/{pacienteId}")
    public ResponseEntity<List<CitaDTO>> findByPaciente(@PathVariable Long pacienteId) {
        List<CitaDTO> citas = citaService.findByPaciente(pacienteId)
                .stream()
                .map(cita -> modelMapper.map(cita, CitaDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(citas);
    }

    @GetMapping("/medico/{medicoId}/fecha")
    public ResponseEntity<List<CitaDTO>> findByMedicoAndFecha(
            @PathVariable Long medicoId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        List<CitaDTO> citas = citaService.findByMedicoAndFecha(medicoId, inicio, fin)
                .stream()
                .map(cita -> modelMapper.map(cita, CitaDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(citas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CitaDTO> findById(@PathVariable Long id) {
        Cita cita = citaService.findById(id);
        return ResponseEntity.ok(modelMapper.map(cita, CitaDTO.class));
    }

    @PostMapping
    public ResponseEntity<CitaDTO> create(@RequestBody CitaRequest request) {
        Cita cita = citaService.create(request);
        return new ResponseEntity<>(modelMapper.map(cita, CitaDTO.class), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CitaDTO> update(@PathVariable Long id, @RequestBody CitaRequest request) {
        Cita cita = citaService.update(id, request);
        return ResponseEntity.ok(modelMapper.map(cita, CitaDTO.class));
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<CitaDTO> actualizarEstado(@PathVariable Long id, @RequestParam String estado) {
        Cita cita = citaService.actualizarEstado(id, estado);
        return ResponseEntity.ok(modelMapper.map(cita, CitaDTO.class));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        citaService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
