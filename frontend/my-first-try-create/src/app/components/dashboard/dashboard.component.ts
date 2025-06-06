import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AppointmentService } from '../../services/appointment.service';
import { Appointment, AppointmentStatus } from '../../interfaces/appointment.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  nextAppointments: Appointment[] = [];
  AppointmentStatus = AppointmentStatus; // Make enum available to template

  constructor(
    private authService: AuthService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.appointmentService.getAppointments().subscribe(
      appointments => {
        this.nextAppointments = appointments
          .filter(app => new Date(app.fecha_hora) > new Date())
          .sort((a, b) => new Date(a.fecha_hora).getTime() - new Date(b.fecha_hora).getTime())
          .slice(0, 5);
      },
      error => console.error('Error loading appointments:', error)
    );
  }

  getDoctorName(doctorId: number): string {
    // This should be implemented to fetch doctor name from a service
    return `Dr. ${doctorId}`;
  }
}