create database Hospitalv1;

use hospitalv1;

-- Tabla de pacientes
CREATE TABLE pacientes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE,
    email VARCHAR(100) UNIQUE,
    telefono VARCHAR(20),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE
);

-- Tabla de especialidades
CREATE TABLE especialidades (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,
    descripcion TEXT
);

-- Tabla de médicos
CREATE TABLE medicos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    especialidad_id BIGINT,
    email VARCHAR(100) UNIQUE,
    telefono VARCHAR(20),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (especialidad_id) REFERENCES especialidades(id)
);

-- Tabla de citas
CREATE TABLE citas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    paciente_id BIGINT NOT NULL,
    medico_id BIGINT NOT NULL,
    especialidad_id BIGINT NOT NULL,
    fecha_hora DATETIME NOT NULL,
    motivo VARCHAR(255),
    estado VARCHAR(20) DEFAULT 'pendiente',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id),
    FOREIGN KEY (medico_id) REFERENCES medicos(id),
    FOREIGN KEY (especialidad_id) REFERENCES especialidades(id)
);

-- Tabla de historia clínica
CREATE TABLE historia_clinica (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    paciente_id BIGINT UNIQUE NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP,
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
);

-- Tabla de diagnosticos (detalles de la historia clínica)
CREATE TABLE diagnosticos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    historia_clinica_id BIGINT NOT NULL,
    fecha DATE NOT NULL,
    descripcion TEXT NOT NULL,
    FOREIGN KEY (historia_clinica_id) REFERENCES historia_clinica(id)
);

-- Tabla de tratamientos (detalles de la historia clínica)
CREATE TABLE tratamientos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    historia_clinica_id BIGINT NOT NULL,
    fecha DATE NOT NULL,
    descripcion TEXT NOT NULL,
    medicamentos TEXT,
    FOREIGN KEY (historia_clinica_id) REFERENCES historia_clinica(id)
);

-- Tabla de notas de consulta (relacionadas con citas e historia clínica)
CREATE TABLE notas_consulta (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cita_id BIGINT NOT NULL,
    historia_clinica_id BIGINT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nota TEXT,
    FOREIGN KEY (cita_id) REFERENCES citas(id),
    FOREIGN KEY (historia_clinica_id) REFERENCES historia_clinica(id)
);

-- Tabla de resultados de laboratorio (detalles de la historia clínica)
CREATE TABLE resultados_laboratorio (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    historia_clinica_id BIGINT NOT NULL,
    fecha DATE NOT NULL,
    tipo_prueba VARCHAR(255) NOT NULL,
    resultado TEXT,
    unidad VARCHAR(50),
    FOREIGN KEY (historia_clinica_id) REFERENCES historia_clinica(id)
);