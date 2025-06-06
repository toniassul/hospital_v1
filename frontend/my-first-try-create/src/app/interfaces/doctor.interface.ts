export interface Doctor {
    id?: number;
    nombre: string;
    apellido: string;
    especialidad_id: number;
    email: string;
    telefono: string;
    fecha_registro: Date;
    activo: boolean;
    especialidad?: {
        id: number;
        nombre: string;
        descripcion: string;
    };
}