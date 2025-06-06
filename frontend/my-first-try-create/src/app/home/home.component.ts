import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DoctorService } from '../services/doctor.service';
import { AppointmentService } from '../services/appointment.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  stats = {
    totalDoctors: 0,
    activeDoctors: 0,
    todayAppointments: 0,
    pendingAppointments: 0
  };

  recentAppointments: any[] = [];

  constructor(
    private doctorService: DoctorService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit() {
    this.loadStats();
    this.loadRecentAppointments();
  }

  private loadStats() {
    this.doctorService.getDoctors().subscribe(doctors => {
      this.stats.totalDoctors = doctors.length;
      this.stats.activeDoctors = doctors.filter(d => d.active).length;
    });

    this.appointmentService.getAppointments().subscribe(appointments => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      this.stats.todayAppointments = appointments.filter(a => 
        new Date(a.date).toDateString() === today.toDateString()
      ).length;
      
      this.stats.pendingAppointments = appointments.filter(a => 
        a.status === 'PENDING'
      ).length;
    });
  }

  private loadRecentAppointments() {
    this.appointmentService.getAppointments().subscribe(appointments => {
      this.recentAppointments = appointments
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
    });
  }
}
