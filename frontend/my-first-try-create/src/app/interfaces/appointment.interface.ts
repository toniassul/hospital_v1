export interface Appointment {
    id?: number;  // BIGINT
    fecha_hora: Date; // DATETIME(6)
    motivo: string; // VARCHAR(255)
    estado: AppointmentStatus; // VARCHAR(20)
    diagnostico_breve: string | null; // TEXT
    observaciones_consulta: string | null; // TEXT
    medico_id: number; // BIGINT
    paciente_id: number; // BIGINT
}

export enum AppointmentStatus {
    PENDIENTE = 'PENDIENTE',
    CONFIRMADA = 'CONFIRMADA',
    CANCELADA = 'CANCELADA',
    COMPLETADA = 'COMPLETADA'
}