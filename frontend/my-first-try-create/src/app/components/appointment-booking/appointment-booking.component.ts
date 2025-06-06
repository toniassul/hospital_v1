import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

import { AppointmentService } from '../../services/appointment.service';
import { DoctorService } from '../../services/doctor.service';
import { SpecialtyService } from '../../services/specialty.service';
import { Specialty } from '../../interfaces/specialty.interface';
import { Doctor } from '../../interfaces/doctor.interface';
import { Appointment, AppointmentStatus } from '../../interfaces/appointment.interface';

@Component({
  selector: 'app-appointment-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './appointment-booking.component.html',
  styleUrls: ['./appointment-booking.component.css']
})
export class AppointmentBookingComponent implements OnInit {
  appointmentForm!: FormGroup;
  specialties: Specialty[] = [];
  doctors: Doctor[] = [];
  availableTimes: string[] = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ]; // Default time slots until backend endpoint is ready
  loading = false;
  loadingDoctors = false;
  loadingTimeSlots = false;
  submitted = false;
  error = '';
  success = false;
  today = new Date().toISOString().split('T')[0];

  constructor(
    private formBuilder: FormBuilder,
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private specialtyService: SpecialtyService,
    private router: Router
  ) {
    this.initForm();
  }

  private initForm() {
    this.appointmentForm = this.formBuilder.group({
      especialidad_id: ['', Validators.required],
      medico_id: ['', Validators.required],
      fecha_hora: ['', Validators.required],
      hora: ['', Validators.required],
      motivo: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(255) // Match VARCHAR(255) from database
      ]]
    });

    // Reset dependent fields when specialty changes
    this.appointmentForm.get('especialidad_id')?.valueChanges.subscribe(() => {
      this.appointmentForm.patchValue({
        medico_id: '',
        fecha_hora: '',
        hora: ''
      });
      this.doctors = [];
      if (this.appointmentForm.get('especialidad_id')?.value) {
        this.onSpecialtyChange();
      }
    });

    // Reset time when date or doctor changes
    this.appointmentForm.get('fecha_hora')?.valueChanges.subscribe(() => {
      this.appointmentForm.patchValue({ hora: '' });
    });
  }

  ngOnInit() {
    this.loadSpecialties();
  }

  loadSpecialties() {
    this.loading = true;
    this.error = '';

    this.specialtyService.getSpecialties()
      .pipe(
        catchError(error => {
          this.error = 'Error al cargar las especialidades. ' + error.message;
          console.error('Error loading specialties:', error);
          return of([]);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(specialties => {
        this.specialties = specialties;
      });
  }

  onSpecialtyChange() {
    const specialtyId = this.appointmentForm.get('especialidad_id')?.value;
    if (!specialtyId) return;

    this.loadingDoctors = true;
    this.error = '';

    this.doctorService.getDoctorsBySpecialty(specialtyId)
      .pipe(
        catchError(error => {
          this.error = 'Error al cargar los médicos. ' + error.message;
          console.error('Error loading doctors:', error);
          return of([]);
        }),
        finalize(() => this.loadingDoctors = false)
      )
      .subscribe(doctors => {
        this.doctors = doctors.filter(doctor => doctor.activo);
      });
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';
    this.success = false;

    if (this.appointmentForm.invalid) {
      return;
    }

    const formValues = this.appointmentForm.value;
    const appointment: Omit<Appointment, 'id'> = {
      fecha_hora: new Date(`${formValues.fecha_hora}T${formValues.hora}`),
      motivo: formValues.motivo.trim(),
      estado: AppointmentStatus.PENDIENTE,
      medico_id: parseInt(formValues.medico_id),
      paciente_id: 1, // TODO: Get from authenticated user
      diagnostico_breve: null,
      observaciones_consulta: null
    };

    this.loading = true;
    this.appointmentService.createAppointment(appointment)
      .pipe(
        catchError(error => {
          this.error = error.message || 'Error al crear la cita. Por favor, intente nuevamente.';
          console.error('Error creating appointment:', error);
          return of(null);
        }),
        finalize(() => this.loading = false)
      )
      .subscribe(result => {
        if (result) {
          this.success = true;
          this.appointmentForm.reset();
          this.submitted = false;
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000);
        }
      });
  }

  // Helper methods for the template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.appointmentForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.submitted));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.appointmentForm.get(fieldName);
    if (!field) return '';

    if (field.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `Debe tener al menos ${minLength} caracteres`;
    }
    if (field.hasError('maxlength')) {
      const maxLength = field.errors?.['maxlength'].requiredLength;
      return `No debe exceder ${maxLength} caracteres`;
    }
    return '';
  }

  getDoctorFullName(doctor: Doctor): string {
    return `Dr. ${doctor.nombre} ${doctor.apellido}`;
  }
}