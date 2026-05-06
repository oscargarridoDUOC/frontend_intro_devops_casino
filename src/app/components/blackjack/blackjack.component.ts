import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CasinoService } from '../../services/casino.service';
import { Carta, EstadoBlackjack } from '../../models/casino.models';

@Component({
  selector: 'app-blackjack',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="tarjeta b-cont">
      <h2 class="titulo-juego">🃏 Blackjack</h2>

      <div *ngIf="estado; else inicio" class="mesa">
        <div class="lado">
          <h3>Banca <span *ngIf="estado.terminada">({{ estado.totales?.banca }})</span></h3>
          <div class="cartas">
            <div *ngFor="let c of estado.banca" class="carta"
                 [attr.data-palo]="c.palo"
                 [class.oculta]="c.oculta">
              <span *ngIf="!c.oculta">{{ c.valor }} {{ c.palo }}</span>
              <span *ngIf="c.oculta">🂠</span>
            </div>
          </div>
        </div>

        <div class="lado">
          <h3>Tú ({{ valorMano(estado.jugador) }})</h3>
          <div class="cartas">
            <div *ngFor="let c of estado.jugador" class="carta" [attr.data-palo]="c.palo">
              <span>{{ c.valor }} {{ c.palo }}</span>
            </div>
          </div>
        </div>

        <div *ngIf="estado.terminada" class="resultado">
          <p [ngSwitch]="estado.resultado">
            <span *ngSwitchCase="'gana'"      class="gano">¡Ganaste! +$ {{ estado.retorno - estado.apuesta | number:'1.0-0' }}</span>
            <span *ngSwitchCase="'blackjack'" class="gano">¡BLACKJACK! +$ {{ estado.retorno - estado.apuesta | number:'1.0-0' }}</span>
            <span *ngSwitchCase="'pierde'"    class="perdio">Pierdes –$ {{ estado.apuesta | number:'1.0-0' }}</span>
            <span *ngSwitchCase="'empate'"    class="empate">Empate</span>
          </p>
          <button class="btn btn-primario" (click)="reiniciar()">Nueva mano</button>
        </div>

        <div *ngIf="!estado.terminada" class="acciones">
          <button class="btn btn-verde" (click)="accion('pedir')" [disabled]="cargando">Pedir</button>
          <button class="btn btn-rojo"  (click)="accion('plantarse')" [disabled]="cargando">Plantarse</button>
          <button class="btn btn-secundario" (click)="accion('doblar')"
                  [disabled]="cargando || estado.jugador.length !== 2">Doblar</button>
        </div>
      </div>

      <ng-template #inicio>
        <div class="iniciar">
          <p>Apuesta entre $20 y $2000.</p>
          <label>Apuesta
            <input type="number" [(ngModel)]="apuesta" min="20" max="2000" step="20" />
          </label>
          <button class="btn btn-primario" (click)="iniciar()" [disabled]="cargando">
            {{ cargando ? 'Repartiendo...' : 'Repartir' }}
          </button>
        </div>
      </ng-template>

      <p *ngIf="error" class="error">{{ error }}</p>
    </section>
  `,
  styles: [`
    .b-cont { max-width: 720px; margin: 20px auto; }
    .iniciar { text-align: center; }
    .iniciar label { display: inline-flex; flex-direction: column; gap: 6px; margin: 12px; }
    .iniciar input { width: 110px; }
    .lado { margin: 18px 0; }
    .lado h3 { margin: 0 0 10px; color: #f5c542; }
    .cartas { display: flex; gap: 10px; flex-wrap: wrap; }
    .carta {
      width: 70px; height: 100px;
      background: #fff; color: #1a1a1a;
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; font-weight: 700;
      box-shadow: 0 4px 10px rgba(0,0,0,.45);
      border: 1px solid #ddd;
    }
    .carta[data-palo="♥"], .carta[data-palo="♦"] { color: #c0392b; }
    .carta.oculta {
      background: linear-gradient(135deg, #1e3a8a, #1e40af);
      color: #fff;
    }
    .acciones { display: flex; gap: 10px; margin-top: 14px; }
    .resultado { margin-top: 14px; text-align: center; }
    .resultado p { font-size: 22px; margin: 8px 0 16px; }
    .gano   { color: #aef0a8; font-weight: 700; }
    .perdio { color: #ff8a8a; font-weight: 700; }
    .empate { color: #f5c542; font-weight: 700; }
  `]
})
export class BlackjackComponent {
  apuesta = 100;
  estado: EstadoBlackjack | null = null;
  cargando = false;
  error = '';

  constructor(private casino: CasinoService) {}

  iniciar() {
    this.error = '';
    this.cargando = true;
    this.casino.blackjackIniciar(this.apuesta).subscribe({
      next: (e) => { this.estado = e; this.cargando = false; },
      error: (e) => {
        this.cargando = false;
        this.error = e.error?.error || 'No se pudo iniciar la mano';
      }
    });
  }

  accion(a: 'pedir' | 'plantarse' | 'doblar') {
    if (!this.estado) return;
    this.error = '';
    this.cargando = true;
    this.casino.blackjackAccion(this.estado.sesionId, a).subscribe({
      next: (e) => { this.estado = e; this.cargando = false; },
      error: (e) => {
        this.cargando = false;
        this.error = e.error?.error || 'Acción inválida';
      }
    });
  }

  reiniciar() {
    this.estado = null;
    this.error = '';
  }

  valorMano(cartas: Carta[]) {
    let total = 0, ases = 0;
    for (const c of cartas) {
      if (c.oculta) continue;
      if (c.valor === 'A') { total += 11; ases++; }
      else if (['J','Q','K'].includes(c.valor)) total += 10;
      else total += Number(c.valor);
    }
    while (total > 21 && ases > 0) { total -= 10; ases--; }
    return total;
  }
}
