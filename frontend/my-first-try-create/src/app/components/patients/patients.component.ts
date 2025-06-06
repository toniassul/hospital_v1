import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../interfaces/patient.interface';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {
  patients: Patient[] = [];
  selectedPatient: Patient | null = null;
  isEditing = false;
  showOnlyActive = true;

  constructor(private patientService: PatientService) {}

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    if (this.showOnlyActive) {
      this.patientService.getActivePatients().subscribe(
        patients => this.patients = patients,
        error => console.error('Error loading active patients:', error)
      );
    } else {
      this.patientService.getPatients().subscribe(
        patients => this.patients = patients,
        error => console.error('Error loading patients:', error)
      );
    }
  }

  toggleActiveFilter() {
    this.showOnlyActive = !this.showOnlyActive;
    this.loadPatients();
  }

  startNewPatient() {
    this.selectedPatient = {
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      fecha_registro: new Date(),
      fecha_nacimiento: new Date(),
      activo: true
    };
    this.isEditing = false;
  }

  editPatient(patient: Patient) {
    this.selectedPatient = {...patient};
    this.isEditing = true;
  }

  savePatient() {
    if (!this.selectedPatient) return;

    const operation = this.isEditing 
      ? this.patientService.updatePatient(this.selectedPatient.id!, this.selectedPatient)
      : this.patientService.createPatient(this.selectedPatient);

    operation.subscribe(
      () => {
        this.loadPatients();
        this.cancelEdit();
      },
      error => console.error('Error saving patient:', error)
    );
  }

  deletePatient(id: number) {
    if (confirm('¿Está seguro de eliminar este paciente?')) {
      this.patientService.deletePatient(id).subscribe(
        () => this.loadPatients(),
        error => console.error('Error deleting patient:', error)
      );
    }
  }

  cancelEdit() {
    this.selectedPatient = null;
    this.isEditing = false;
  }
}