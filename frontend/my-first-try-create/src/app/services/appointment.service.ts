import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Appointment, AppointmentStatus } from '../interfaces/appointment.interface';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'http://localhost:8080/api/citas';

  constructor(private http: HttpClient) {}

  createAppointment(appointment: Omit<Appointment, 'id'>): Observable<Appointment> {
    // Convert the date to ISO string format
    const appointmentData = {
      ...appointment,
      fecha_hora: new Date(appointment.fecha_hora).toISOString()
    };
    
    return this.http.post<Appointment>(this.apiUrl, appointmentData).pipe(
      catchError(this.handleError)
    );
  }

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl).pipe(
      map(appointments => appointments.map(app => ({
        ...app,
        fecha_hora: new Date(app.fecha_hora)
      }))),
      catchError(this.handleError)
    );
  }

  getAppointmentById(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`).pipe(
      map(app => ({
        ...app,
        fecha_hora: new Date(app.fecha_hora)
      })),
      catchError(this.handleError)
    );
  }

  updateAppointment(id: number, appointment: Appointment): Observable<Appointment> {
    const appointmentData = {
      ...appointment,
      fecha_hora: new Date(appointment.fecha_hora).toISOString()
    };
    return this.http.put<Appointment>(`${this.apiUrl}/${id}`, appointmentData).pipe(
      catchError(this.handleError)
    );
  }

  deleteAppointment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  getAppointmentsByPatient(patientId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/paciente/${patientId}`).pipe(
      map(appointments => appointments.map(app => ({
        ...app,
        fecha_hora: new Date(app.fecha_hora)
      }))),
      catchError(this.handleError)
    );
  }

  getAppointmentsByDoctor(doctorId: number): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/medico/${doctorId}`).pipe(
      map(appointments => appointments.map(app => ({
        ...app,
        fecha_hora: new Date(app.fecha_hora)
      }))),
      catchError(this.handleError)
    );
  }

  getTodayAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`${this.apiUrl}/hoy`).pipe(
      map(appointments => appointments.map(app => ({
        ...app,
        fecha_hora: new Date(app.fecha_hora)
      }))),
      catchError(this.handleError)
    );
  }

  updateAppointmentStatus(id: number, status: AppointmentStatus): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.apiUrl}/${id}/estado`, { estado: status }).pipe(
      catchError(this.handleError)
    );
  }

  getAvailableTimeSlots(doctorId: number, date: string): Observable<string[]> {
    const params = new HttpParams()
      .set('doctorId', doctorId.toString())
      .set('date', date);
      
    return this.http.get<string[]>(`${this.apiUrl}/horarios-disponibles`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  validateAppointmentSlot(doctorId: number, dateTime: Date): Observable<boolean> {
    const params = new HttpParams()
      .set('doctorId', doctorId.toString())
      .set('dateTime', dateTime.toISOString());

    return this.http.get<boolean>(`${this.apiUrl}/validar-horario`, { params }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error en el servidor.';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || 'Datos inválidos';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado';
          break;
        case 409:
          errorMessage = 'El horario ya no está disponible';
          break;
        case 500:
          errorMessage = 'Error en el servidor. Por favor, intente más tarde';
          break;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}