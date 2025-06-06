import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Navigation -->
    <nav class="navbar" *ngIf="authService.isLoggedIn()">
      <div class="nav-container">
        <div class="nav-brand">
          <h1>Sistema de Gestión Hospitalaria</h1>
        </div>
        <ul class="nav-links">
          <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            <i class="fas fa-home"></i> Home
          </a></li>
          <li><a routerLink="/patients" routerLinkActive="active">
            <i class="fas fa-users"></i> Pacientes
          </a></li>
          <li><a routerLink="/doctors" routerLinkActive="active">
            <i class="fas fa-user-md"></i> Médicos
          </a></li>
          <li><a routerLink="/specialties" routerLinkActive="active">
            <i class="fas fa-stethoscope"></i> Especialidades
          </a></li>
          <li class="dropdown">
            <a (click)="toggleUserMenu($event)" class="dropdown-toggle">
              <i class="fas fa-user-circle"></i> 
              Usuarios 
              <i class="fas fa-chevron-down"></i>
            </a>
            <ul class="dropdown-menu" [class.show]="isUserMenuOpen">
              <li>
                <a routerLink="/profile">
                  <i class="fas fa-id-card"></i> Mi Perfil
                </a>
              </li>
              <li>
                <a routerLink="/users" *ngIf="authService.isAdmin()">
                  <i class="fas fa-users-cog"></i> Gestionar Usuarios
                </a>
              </li>
              <li class="dropdown-divider"></li>
              <li>
                <a (click)="logout()" class="logout-link">
                  <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Main Content -->
    <main [class.main-content]="authService.isLoggedIn()">
      <router-outlet></router-outlet>
    </main>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isUserMenuOpen = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const dropdown = document.querySelector('.dropdown');
    if (!dropdown?.contains(event.target as Node)) {
      this.isUserMenuOpen = false;
    }
  }

  toggleUserMenu(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  async logout() {
    try {
      await this.authService.logout();
      this.isUserMenuOpen = false;
      this.router.navigate(['/login'], {
        replaceUrl: true
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
}