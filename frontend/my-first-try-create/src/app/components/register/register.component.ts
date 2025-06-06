import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RegisterRequest } from '../../interfaces/user.interface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  formData: RegisterRequest = {
    username: '',
    password: '',
    role: 'staff',
    email: '',
    firstName: '',
    lastName: ''
  };
  
  showPassword = false;
  error: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (!this.formData.username || !this.formData.password || !this.formData.role) {
      this.error = 'Por favor complete todos los campos';
      return;
    }

    this.authService.register(this.formData).subscribe(
      success => {
        if (success) {
          this.router.navigate(['/login']);
        } else {
          this.error = 'Error al registrar usuario';
        }
      },
      error => {
        console.error('Register error:', error);
        this.error = 'Error al intentar registrar usuario';
      }
    );
  }
}