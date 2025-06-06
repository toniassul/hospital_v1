import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import bodyParser from 'body-parser';

interface Specialty {
  id: number;
  nombre: string;
}

interface Doctor {
  id: number;
  nombre: string;
  apellido: string;
  especialidad_id: number;
  activo: boolean;
}

interface Appointment {
  id: number;
  fecha_hora: string;
  motivo: string;
  estado: string;
  diagnostico_breve?: string;
  observaciones_consulta?: string;
  medico_id: number;
  paciente_id: number;
}

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();

// Enable CORS and JSON body parsing
app.use(cors());
app.use(bodyParser.json());

// Mock data
const specialties: Specialty[] = [
  { id: 1, nombre: 'Cardiología' },
  { id: 2, nombre: 'Dermatología' },
  { id: 3, nombre: 'Pediatría' },
  { id: 4, nombre: 'Neurología' },
];

const doctors: Doctor[] = [
  { id: 1, nombre: 'Juan', apellido: 'Pérez', especialidad_id: 1, activo: true },
  { id: 2, nombre: 'María', apellido: 'García', especialidad_id: 1, activo: true },
  { id: 3, nombre: 'Carlos', apellido: 'López', especialidad_id: 2, activo: true },
  { id: 4, nombre: 'Ana', apellido: 'Martínez', especialidad_id: 3, activo: true },
];

const appointments: Appointment[] = [];

// API Endpoints
app.get('/api/especialidades', (req, res) => {
  res.json(specialties);
});

app.get('/api/medicos', (req, res) => {
  res.json(doctors.filter(d => d.activo));
});

app.get('/api/medicos/especialidad/:id', (req, res) => {
  const specialtyId = parseInt(req.params.id);
  const filteredDoctors = doctors.filter(d => d.especialidad_id === specialtyId && d.activo);
  res.json(filteredDoctors);
});

app.get('/api/citas/horarios-disponibles', (req, res) => {
  const { doctorId, date } = req.query;
  // Generate time slots from 8 AM to 5 PM
  const timeSlots = [];
  for (let hour = 8; hour <= 17; hour++) {
    // Skip lunch hour
    if (hour !== 13) {
      timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
      timeSlots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
  }
  res.json(timeSlots);
});

app.post('/api/citas', (req, res) => {
  const appointment: Appointment = {
    id: appointments.length + 1,
    ...req.body
  };
  appointments.push(appointment);
  res.status(201).json(appointment);
});

app.get('/api/citas', (req, res) => {
  res.json(appointments);
});

const angularApp = new AngularNodeAppEngine();

// Serve static files
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

// Handle all other requests by rendering the Angular application
app.use('/**', (req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 8080;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
