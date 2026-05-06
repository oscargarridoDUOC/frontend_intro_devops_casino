import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="caja tarjeta">
      <h2 class="titulo-juego">Crea tu cuenta</h2>
      <form (submit)="registrar(); $event.preventDefault()">
        <label>Usuario
          <input [(ngModel)]="username" name="username" required minlength="3" />
        </label>
        <label>Email
          <input [(ngModel)]="email" name="email" type="email" required />
        </label>
        <label>Contraseña
          <input [(ngModel)]="password" name="password" type="password" required minlength="6" />
        </label>
        <button class="btn btn-primario" [disabled]="cargando">
          {{ cargando ? 'Creando...' : 'Crear cuenta' }}
        </button>
      </form>
      <p *ngIf="error" class="error">{{ error }}</p>
      <p class="alt">¿Ya tienes cuenta? <a routerLink="/login">Inicia sesión</a></p>
    </section>
  `,
  styles: [`
    .caja { max-width: 380px; margin: 60px auto; }
    form { display: flex; flex-direction: column; gap: 14px; margin-top: 10px; }
    label { display: flex; flex-direction: column; gap: 6px; font-size: 14px; }
    .alt { margin-top: 18px; text-align: center; color: #c8b988; }
  `]
})
export class RegisterComponent {
  username = ''; email = ''; password = '';
  cargando = false; error = '';

  constructor(private auth: AuthService, private router: Router) {}

  registrar() {
    this.error = '';
    this.cargando = true;
    this.auth.registrar({
      username: this.username, email: this.email, password: this.password
    }).subscribe({
      next: () => { this.cargando = false; this.router.navigateByUrl('/lobby'); },
      error: (e) => { this.cargando = false; this.error = e.error?.error || 'No se pudo crear la cuenta'; }
    });
  }
}
