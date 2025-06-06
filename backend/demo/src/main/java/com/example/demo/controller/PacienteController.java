package com.example.demo.controller;

import com.example.demo.dto.PacienteDTO;
import com.example.demo.model.Paciente;
import com.example.demo.request.PacienteRequest;
import com.example.demo.service.PacienteService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pacientes")
@RequiredArgsConstructor
public class PacienteController {

    private final PacienteService pacienteService;
    private final ModelMapper modelMapper;

    @GetMapping
    public ResponseEntity<List<PacienteDTO>> findAll() {
        List<PacienteDTO> pacientes = pacienteService.findAll()
                .stream()
                .map(paciente -> modelMapper.map(paciente, PacienteDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(pacientes);
    }

    @GetMapping("/activos")
    public ResponseEntity<List<PacienteDTO>> findAllActivos() {
        List<PacienteDTO> pacientes = pacienteService.findAllActivos()
                .stream()
                .map(paciente -> modelMapper.map(paciente, PacienteDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(pacientes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PacienteDTO> findById(@PathVariable Long id) {
        Paciente paciente = pacienteService.findById(id);
        return ResponseEntity.ok(modelMapper.map(paciente, PacienteDTO.class));
    }

    @PostMapping
    public ResponseEntity<PacienteDTO> create(@RequestBody PacienteRequest request) {
        Paciente paciente = pacienteService.create(request);
        return new ResponseEntity<>(modelMapper.map(paciente, PacienteDTO.class), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PacienteDTO> update(@PathVariable Long id, @RequestBody PacienteRequest request) {
        Paciente paciente = pacienteService.update(id, request);
        return ResponseEntity.ok(modelMapper.map(paciente, PacienteDTO.class));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        pacienteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
