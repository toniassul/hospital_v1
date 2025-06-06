package com.example.demo.controller;

import com.example.demo.dto.MedicoDTO;
import com.example.demo.model.Medico;
import com.example.demo.request.MedicoRequest;
import com.example.demo.service.MedicoService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/medicos")
@RequiredArgsConstructor
public class MedicoController {

    private final MedicoService medicoService;
    private final ModelMapper modelMapper;

    @GetMapping
    public ResponseEntity<List<MedicoDTO>> findAll() {
        List<MedicoDTO> medicos = medicoService.findAll()
                .stream()
                .map(medico -> modelMapper.map(medico, MedicoDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(medicos);
    }

    @GetMapping("/activos")
    public ResponseEntity<List<MedicoDTO>> findAllActivos() {
        List<MedicoDTO> medicos = medicoService.findAllActivos()
                .stream()
                .map(medico -> modelMapper.map(medico, MedicoDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(medicos);
    }

    @GetMapping("/especialidad/{especialidadId}")
    public ResponseEntity<List<MedicoDTO>> findByEspecialidad(@PathVariable Long especialidadId) {
        List<MedicoDTO> medicos = medicoService.findByEspecialidad(especialidadId)
                .stream()
                .map(medico -> modelMapper.map(medico, MedicoDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(medicos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicoDTO> findById(@PathVariable Long id) {
        Medico medico = medicoService.findById(id);
        return ResponseEntity.ok(modelMapper.map(medico, MedicoDTO.class));
    }

    @PostMapping
    public ResponseEntity<MedicoDTO> create(@RequestBody MedicoRequest request) {
        Medico medico = medicoService.create(request);
        return new ResponseEntity<>(modelMapper.map(medico, MedicoDTO.class), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicoDTO> update(@PathVariable Long id, @RequestBody MedicoRequest request) {
        Medico medico = medicoService.update(id, request);
        return ResponseEntity.ok(modelMapper.map(medico, MedicoDTO.class));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        medicoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
