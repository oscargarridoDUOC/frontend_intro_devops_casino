import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CasinoService } from '../../services/casino.service';
import { AuthService } from '../../services/auth.service';
import { Juego } from '../../models/casino.models';

@Component({
  selector: 'app-lobby',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="hero tarjeta">
      <h1>Hola, {{ auth.usuario()?.username }}</h1>
      <p>Tu saldo es <strong>$ {{ auth.usuario()?.saldo | number:'1.0-0' }}</strong>.</p>
      <p class="muted">Elige un juego para empezar a apostar.</p>
    </section>

    <section class="grilla">
      <a *ngFor="let j of juegos" [routerLink]="['/' + j.codigo]" class="juego tarjeta">
        <div class="icono">
          <ng-container [ngSwitch]="j.codigo">
            <span *ngSwitchCase="'slots'">🎰</span>
            <span *ngSwitchCase="'roulette'">🎡</span>
            <span *ngSwitchCase="'blackjack'">🃏</span>
          </ng-container>
        </div>
        <h3>{{ j.nombre }}</h3>
        <p>{{ j.descripcion }}</p>
        <div class="rangos">
          Apuesta: $ {{ j.apuesta_min }} – $ {{ j.apuesta_max }}
        </div>
      </a>
    </section>

    <p *ngIf="error" class="error">{{ error }}</p>
  `,
  styles: [`
    .hero { text-align: center; margin-bottom: 28px; }
    .hero h1 { color: #f5c542; margin: 0 0 8px; }
    .muted { color: #c8b988; }
    .grilla {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 18px;
    }
    .juego {
      display: block; color: inherit; text-decoration: none;
      transition: transform .12s ease, box-shadow .12s ease;
    }
    .juego:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 28px rgba(0,0,0,.5);
      border-color: rgba(245,197,66,.5);
    }
    .icono { font-size: 56px; text-align: center; margin-bottom: 8px; }
    .juego h3 { margin: 6px 0; color: #f5c542; }
    .juego p { color: #d8cfb6; min-height: 40px; }
    .rangos { margin-top: 8px; color: #c8b988; font-size: 14px; }
  `]
})
export class LobbyComponent implements OnInit {
  juegos: Juego[] = [];
  error = '';
  constructor(public auth: AuthService, private casino: CasinoService) {}
  ngOnInit() {
    this.casino.miPerfil().subscribe();
    this.casino.listarJuegos().subscribe({
      next: (j) => (this.juegos = j),
      error: (e) => (this.error = e.error?.error || 'No se pudo cargar el catálogo')
    });
  }
}
