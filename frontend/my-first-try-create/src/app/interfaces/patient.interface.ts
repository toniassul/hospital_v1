export interface Patient {
    id?: number;
    nombre: string;
    apellido: string;
    fecha_nacimiento: Date;
    email: string;
    telefono: string;
    fecha_registro: Date;
    activo: boolean;
}