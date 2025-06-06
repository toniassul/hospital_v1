import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpecialtyService } from '../../services/specialty.service';
import { Specialty } from '../../interfaces/specialty.interface';

@Component({
  selector: 'app-specialties',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './specialties.component.html',
  styleUrls: ['./specialties.component.css']
})
export class SpecialtiesComponent implements OnInit {
  specialties: Specialty[] = [];
  selectedSpecialty: Specialty | null = null;
  isEditing = false;

  constructor(private specialtyService: SpecialtyService) {}

  ngOnInit() {
    this.loadSpecialties();
  }

  loadSpecialties() {
    this.specialtyService.getSpecialties().subscribe(
      specialties => this.specialties = specialties,
      error => console.error('Error loading specialties:', error)
    );
  }

  startNewSpecialty() {
    this.selectedSpecialty = {
      id: 0,
      nombre: '',
      descripcion: ''
    };
    this.isEditing = false;
  }

  editSpecialty(specialty: Specialty) {
    this.selectedSpecialty = {...specialty};
    this.isEditing = true;
  }

  saveSpecialty() {
    if (!this.selectedSpecialty) return;

    const operation = this.isEditing 
      ? this.specialtyService.updateSpecialty(this.selectedSpecialty.id, this.selectedSpecialty)
      : this.specialtyService.createSpecialty(this.selectedSpecialty);

    operation.subscribe(
      () => {
        this.loadSpecialties();
        this.cancelEdit();
      },
      error => console.error('Error saving specialty:', error)
    );
  }

  deleteSpecialty(id: number) {
    if (confirm('¿Está seguro de eliminar esta especialidad? Esto podría afectar a los médicos asociados.')) {
      this.specialtyService.deleteSpecialty(id).subscribe(
        () => this.loadSpecialties(),
        error => console.error('Error deleting specialty:', error)
      );
    }
  }

  cancelEdit() {
    this.selectedSpecialty = null;
    this.isEditing = false;
  }
}
