import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="caja tarjeta">
      <h2 class="titulo-juego">Bienvenido al Casino</h2>
      <p class="hint">Usuario demo: <code>demo</code> / <code>demo1234</code></p>

      <form (submit)="ingresar(); $event.preventDefault()">
        <label>
          Usuario
          <input [(ngModel)]="username" name="username" autocomplete="username" required />
        </label>
        <label>
          Contraseña
          <input [(ngModel)]="password" name="password" type="password"
                 autocomplete="current-password" required />
        </label>

        <button class="btn btn-primario" [disabled]="cargando">
          {{ cargando ? 'Ingresando...' : 'Entrar' }}
        </button>
      </form>

      <p *ngIf="error" class="error">{{ error }}</p>
      <p class="alt">¿Sin cuenta? <a routerLink="/register">Regístrate</a></p>
    </section>
  `,
  styles: [`
    .caja { max-width: 380px; margin: 60px auto; }
    form { display: flex; flex-direction: column; gap: 14px; margin-top: 10px; }
    label { display: flex; flex-direction: column; gap: 6px; font-size: 14px; }
    .hint { color: #c8b988; font-size: 13px; margin-top: -4px; }
    .alt { margin-top: 18px; text-align: center; color: #c8b988; }
    code { background: rgba(255,255,255,.08); padding: 1px 6px; border-radius: 4px; }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  cargando = false;
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  ingresar() {
    this.error = '';
    this.cargando = true;
    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigateByUrl('/lobby');
      },
      error: (e) => {
        this.cargando = false;
        this.error = e.error?.error || 'Credenciales inválidas';
      }
    });
  }
}
