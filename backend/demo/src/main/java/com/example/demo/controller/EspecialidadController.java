package com.example.demo.controller;

import com.example.demo.dto.EspecialidadDTO;
import com.example.demo.model.Especialidad;
import com.example.demo.request.EspecialidadRequest;
import com.example.demo.service.EspecialidadService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/especialidades")
@RequiredArgsConstructor
public class EspecialidadController {

    private final EspecialidadService especialidadService;
    private final ModelMapper modelMapper;

    @GetMapping
    public ResponseEntity<List<EspecialidadDTO>> findAll() {
        List<EspecialidadDTO> especialidades = especialidadService.findAll()
                .stream()
                .map(especialidad -> modelMapper.map(especialidad, EspecialidadDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(especialidades);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EspecialidadDTO> findById(@PathVariable Long id) {
        Especialidad especialidad = especialidadService.findById(id);
        return ResponseEntity.ok(modelMapper.map(especialidad, EspecialidadDTO.class));
    }

    @PostMapping
    public ResponseEntity<EspecialidadDTO> create(@RequestBody EspecialidadRequest request) {
        Especialidad especialidad = especialidadService.create(request);
        return new ResponseEntity<>(modelMapper.map(especialidad, EspecialidadDTO.class), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EspecialidadDTO> update(@PathVariable Long id, @RequestBody EspecialidadRequest request) {
        Especialidad especialidad = especialidadService.update(id, request);
        return ResponseEntity.ok(modelMapper.map(especialidad, EspecialidadDTO.class));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        especialidadService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
