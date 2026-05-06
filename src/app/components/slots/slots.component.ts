import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CasinoService } from '../../services/casino.service';
import { ResultadoSlots } from '../../models/casino.models';

@Component({
  selector: 'app-slots',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="tarjeta sl-cont">
      <h2 class="titulo-juego">🎰 Tragamonedas</h2>

      <div class="rodillos">
        <div class="rodillo" *ngFor="let s of rodillos; let i = index"
             [class.girando]="girando">
          <span>{{ s }}</span>
        </div>
      </div>

      <div *ngIf="resultado" class="resumen"
           [class.gano]="resultado.premio > 0"
           [class.perdio]="resultado.premio === 0">
        <ng-container *ngIf="resultado.premio > 0; else perdida">
          🎉 ¡Ganaste $ {{ resultado.premio | number:'1.0-0' }}!
          ({{ resultado.tipo }} × {{ resultado.multiplicador }})
        </ng-container>
        <ng-template #perdida>Sin suerte esta vez. Intenta de nuevo.</ng-template>
      </div>

      <div class="controles">
        <label>Apuesta
          <input type="number" [(ngModel)]="apuesta" min="10" max="500" step="10" />
        </label>
        <button class="btn btn-primario" (click)="girar()" [disabled]="girando">
          {{ girando ? 'Girando...' : 'Girar' }}
        </button>
      </div>

      <p class="hint">Apuesta entre $10 y $500. Tres iguales paga hasta 50×.</p>
      <p *ngIf="error" class="error">{{ error }}</p>
    </section>
  `,
  styles: [`
    .sl-cont { max-width: 560px; margin: 30px auto; text-align: center; }
    .rodillos {
      display: flex; justify-content: center; gap: 14px;
      margin: 20px 0;
    }
    .rodillo {
      width: 110px; height: 130px;
      background: linear-gradient(180deg, #fff8dc, #d4be7a);
      border: 4px solid #f5c542; border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      font-size: 64px;
      box-shadow: inset 0 0 12px rgba(0,0,0,.25), 0 6px 18px rgba(0,0,0,.4);
    }
    .rodillo.girando { animation: girar .4s linear infinite; }
    @keyframes girar { to { transform: translateY(-6px); } 50% { transform: translateY(6px); } }
    .controles { display: flex; justify-content: center; gap: 12px; align-items: end; }
    .controles label { display: flex; flex-direction: column; gap: 4px; font-size: 13px; }
    .controles input { width: 110px; }
    .resumen { margin: 12px 0; font-size: 18px; }
    .resumen.gano { color: #aef0a8; }
    .resumen.perdio { color: #ffb1b1; }
    .hint { color: #c8b988; font-size: 13px; }
  `]
})
export class SlotsComponent {
  rodillos: string[] = ['🍀', '🔔', '⭐'];
  apuesta = 50;
  girando = false;
  resultado: ResultadoSlots | null = null;
  error = '';

  constructor(private casino: CasinoService) {}

  girar() {
    this.error = '';
    this.resultado = null;
    this.girando = true;

    this.casino.jugarSlots(this.apuesta).subscribe({
      next: (r) => {
        // Animación: vamos cambiando símbolos durante 800ms y luego mostramos el real.
        const intervalo = setInterval(() => {
          this.rodillos = [aleatorio(), aleatorio(), aleatorio()];
        }, 80);
        setTimeout(() => {
          clearInterval(intervalo);
          this.rodillos = r.resultado.rodillos;
          this.resultado = r.resultado;
          this.girando = false;
        }, 900);
      },
      error: (e) => {
        this.girando = false;
        this.error = e.error?.error || 'No se pudo jugar';
      }
    });
  }
}

const SIMS = ['🍒','🍋','🔔','⭐','💎','7️⃣','🍀','🍇'];
function aleatorio() { return SIMS[Math.floor(Math.random() * SIMS.length)]; }
