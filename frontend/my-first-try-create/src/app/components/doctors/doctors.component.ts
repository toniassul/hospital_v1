import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DoctorService } from '../../services/doctor.service';
import { SpecialtyService } from '../../services/specialty.service';
import { Doctor } from '../../interfaces/doctor.interface';
import { Specialty } from '../../interfaces/specialty.interface';

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css']
})
export class DoctorsComponent implements OnInit {
  doctors: Doctor[] = [];
  specialties: Specialty[] = [];
  selectedDoctor: Doctor | null = null;
  selectedSpecialty: number | null = null;
  isEditing = false;
  showOnlyActive = true;

  constructor(
    private doctorService: DoctorService,
    private specialtyService: SpecialtyService
  ) {}

  ngOnInit() {
    this.loadSpecialties();
    this.loadDoctors();
  }

  loadSpecialties() {
    this.specialtyService.getSpecialties().subscribe(
      specialties => this.specialties = specialties,
      error => console.error('Error loading specialties:', error)
    );
  }

  loadDoctors() {
    if (this.selectedSpecialty) {
      this.doctorService.getDoctorsBySpecialty(this.selectedSpecialty).subscribe(
        doctors => this.doctors = this.filterByActive(doctors),
        error => console.error('Error loading doctors by specialty:', error)
      );
    } else if (this.showOnlyActive) {
      this.doctorService.getActiveDoctors().subscribe(
        doctors => this.doctors = doctors,
        error => console.error('Error loading active doctors:', error)
      );
    } else {
      this.doctorService.getDoctors().subscribe(
        doctors => this.doctors = doctors,
        error => console.error('Error loading doctors:', error)
      );
    }
  }

  filterByActive(doctors: Doctor[]): Doctor[] {
    return this.showOnlyActive ? doctors.filter(d => d.activo) : doctors;
  }

  getSpecialtyName(specialtyId: number): string {
    const specialty = this.specialties.find(s => s.id === specialtyId);
    return specialty ? specialty.nombre : 'No especificada';
  }

  onSpecialtyChange() {
    this.loadDoctors();
  }

  toggleActiveFilter() {
    this.showOnlyActive = !this.showOnlyActive;
    this.loadDoctors();
  }

  startNewDoctor() {
    this.selectedDoctor = {
      nombre: '',
      apellido: '',
      especialidad_id: this.specialties[0]?.id || 0,
      email: '',
      telefono: '',
      fecha_registro: new Date(),
      activo: true
    };
    this.isEditing = false;
  }

  editDoctor(doctor: Doctor) {
    this.selectedDoctor = {...doctor};
    this.isEditing = true;
  }

  saveDoctor() {
    if (!this.selectedDoctor) return;

    const operation = this.isEditing 
      ? this.doctorService.updateDoctor(this.selectedDoctor.id!, this.selectedDoctor)
      : this.doctorService.createDoctor(this.selectedDoctor);

    operation.subscribe(
      () => {
        this.loadDoctors();
        this.cancelEdit();
      },
      error => console.error('Error saving doctor:', error)
    );
  }

  deleteDoctor(id: number) {
    if (confirm('¿Está seguro de eliminar este médico?')) {
      this.doctorService.deleteDoctor(id).subscribe(
        () => this.loadDoctors(),
        error => console.error('Error deleting doctor:', error)
      );
    }
  }

  cancelEdit() {
    this.selectedDoctor = null;
    this.isEditing = false;
  }
}