import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CasinoService } from '../../services/casino.service';
import { ApuestaRuleta, ResultadoRuleta } from '../../models/casino.models';

const ROJOS = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36]);
function colorDe(n: number): 'rojo' | 'negro' | 'verde' {
  if (n === 0) return 'verde';
  return ROJOS.has(n) ? 'rojo' : 'negro';
}

@Component({
  selector: 'app-roulette',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="tarjeta r-cont">
      <h2 class="titulo-juego">🎡 Ruleta</h2>

      <div class="rueda">
        <div class="numero" [class.girando]="girando" [attr.data-color]="resultado?.color">
          {{ resultado?.numero ?? '–' }}
        </div>
        <p *ngIf="resultado">
          Salió <strong>{{ resultado.numero }}</strong>
          (<span [class]="'col-' + resultado.color">{{ resultado.color }}</span>).
          Neto: <strong [class.gano]="resultado.neto > 0" [class.perdio]="resultado.neto < 0">
          $ {{ resultado.neto | number:'1.0-0' }}</strong>
        </p>
      </div>

      <div class="seccion">
        <h3>Tipo de apuesta</h3>
        <div class="tabs">
          <button *ngFor="let t of tipos" class="tab"
                  [class.activa]="tipo === t.codigo" (click)="tipo = t.codigo">
            {{ t.nombre }}
          </button>
        </div>

        <div class="opciones">
          <ng-container [ngSwitch]="tipo">

            <div *ngSwitchCase="'numero'" class="num-grid">
              <button *ngFor="let n of numeros" class="num"
                      [attr.data-color]="colorDe(n)"
                      [class.sel]="valor === n"
                      (click)="valor = n">{{ n }}</button>
            </div>

            <div *ngSwitchCase="'color'" class="opciones-flex">
              <button class="op-color rojo" [class.sel]="valor === 'rojo'" (click)="valor = 'rojo'">Rojo</button>
              <button class="op-color negro" [class.sel]="valor === 'negro'" (click)="valor = 'negro'">Negro</button>
            </div>

            <div *ngSwitchCase="'paridad'" class="opciones-flex">
              <button class="op-color" [class.sel]="valor === 'par'"   (click)="valor = 'par'">Par</button>
              <button class="op-color" [class.sel]="valor === 'impar'" (click)="valor = 'impar'">Impar</button>
            </div>

            <div *ngSwitchCase="'docena'" class="opciones-flex">
              <button class="op-color" [class.sel]="valor === 1" (click)="valor = 1">1ª docena (1-12)</button>
              <button class="op-color" [class.sel]="valor === 2" (click)="valor = 2">2ª docena (13-24)</button>
              <button class="op-color" [class.sel]="valor === 3" (click)="valor = 3">3ª docena (25-36)</button>
            </div>

          </ng-container>
        </div>
      </div>

      <div class="seccion controles">
        <label>Monto
          <input type="number" [(ngModel)]="monto" min="10" max="1000" step="10" />
        </label>
        <button class="btn btn-secundario" (click)="agregar()"
                [disabled]="!puedeAgregar()">
          Agregar al tablero
        </button>
        <button class="btn btn-primario" (click)="girar()"
                [disabled]="apuestas.length === 0 || girando">
          {{ girando ? 'Girando...' : 'Girar (' + totalApostado + ')' }}
        </button>
      </div>

      <div *ngIf="apuestas.length" class="lista">
        <h4>Apuestas en el tablero</h4>
        <ul>
          <li *ngFor="let a of apuestas; let i = index">
            <span>{{ describir(a) }}</span>
            <span>$ {{ a.monto }}</span>
            <button class="btn btn-secundario btn-mini" (click)="apuestas.splice(i,1)">×</button>
          </li>
        </ul>
      </div>

      <div *ngIf="resultado" class="detalle">
        <h4>Resultado por apuesta</h4>
        <table>
          <tr *ngFor="let a of resultado.apuestas">
            <td>{{ describir(a) }}</td>
            <td>$ {{ a.monto }}</td>
            <td [class.gano]="a.gana" [class.perdio]="!a.gana">
              {{ a.gana ? '+ $' + a.retorno : 'pierde' }}
            </td>
          </tr>
        </table>
      </div>

      <p *ngIf="error" class="error">{{ error }}</p>
    </section>
  `,
  styles: [`
    .r-cont { max-width: 760px; margin: 20px auto; }
    .rueda { text-align: center; margin-bottom: 16px; }
    .numero {
      width: 100px; height: 100px; margin: 0 auto;
      display: flex; align-items: center; justify-content: center;
      border-radius: 50%; font-size: 38px; font-weight: 700;
      background: #222; color: #fff;
      border: 6px solid #f5c542;
    }
    .numero[data-color="rojo"]  { background: #c0392b; }
    .numero[data-color="negro"] { background: #1a1a1a; }
    .numero[data-color="verde"] { background: #1e7d32; }
    .numero.girando { animation: spin 1s ease-out; }
    @keyframes spin { from { transform: rotate(0); } to { transform: rotate(720deg); } }
    .col-rojo { color: #ff6b6b; }
    .col-negro { color: #ddd; }
    .col-verde { color: #aef0a8; }
    .seccion { margin: 18px 0; }
    .tabs { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px; }
    .tab {
      background: rgba(255,255,255,.06); color: #f4eeda; border: 1px solid rgba(255,255,255,.12);
      padding: 8px 14px; border-radius: 999px;
    }
    .tab.activa { background: #f5c542; color: #2a1a02; border-color: #f5c542; }
    .num-grid { display: grid; grid-template-columns: repeat(13, 1fr); gap: 4px; }
    .num {
      padding: 6px 0; border: 0; border-radius: 4px; color: #fff;
      font-weight: 600; font-size: 13px;
    }
    .num[data-color="rojo"]  { background: #c0392b; }
    .num[data-color="negro"] { background: #1a1a1a; }
    .num[data-color="verde"] { background: #1e7d32; }
    .num.sel { outline: 3px solid #f5c542; }
    .opciones-flex { display: flex; gap: 8px; flex-wrap: wrap; }
    .op-color {
      flex: 1; min-width: 120px; padding: 12px;
      border: 1px solid rgba(255,255,255,.18);
      background: rgba(255,255,255,.06); color: #f4eeda;
      border-radius: 8px;
    }
    .op-color.rojo  { background: #c0392b; color: #fff; }
    .op-color.negro { background: #1a1a1a; color: #fff; }
    .op-color.sel { outline: 3px solid #f5c542; }
    .controles { display: flex; gap: 12px; align-items: end; flex-wrap: wrap; }
    .controles input { width: 110px; }
    .lista ul { list-style: none; padding: 0; margin: 8px 0; }
    .lista li {
      display: flex; justify-content: space-between; align-items: center;
      padding: 8px 12px; border-bottom: 1px solid rgba(255,255,255,.08);
      gap: 8px;
    }
    .btn-mini { padding: 4px 10px; }
    .gano { color: #aef0a8; font-weight: 600; }
    .perdio { color: #ff8a8a; }
    .detalle { margin-top: 18px; }
  `]
})
export class RouletteComponent {
  tipos: { codigo: ApuestaRuleta['tipo']; nombre: string }[] = [
    { codigo: 'numero', nombre: 'Número' },
    { codigo: 'color', nombre: 'Color' },
    { codigo: 'paridad', nombre: 'Par/Impar' },
    { codigo: 'docena', nombre: 'Docena' }
  ];
  numeros = Array.from({ length: 37 }, (_, i) => i); // 0..36
  tipo: ApuestaRuleta['tipo'] = 'color';
  valor: any = 'rojo';
  monto = 50;
  apuestas: ApuestaRuleta[] = [];
  resultado: ResultadoRuleta | null = null;
  girando = false;
  error = '';

  constructor(private casino: CasinoService) {}

  colorDe = colorDe;

  get totalApostado() {
    return this.apuestas.reduce((s, a) => s + Number(a.monto), 0);
  }

  puedeAgregar() {
    return this.monto >= 10 && this.monto <= 1000 && this.valor !== null && this.valor !== undefined;
  }

  agregar() {
    this.apuestas.push({ tipo: this.tipo, valor: this.valor, monto: this.monto });
  }

  girar() {
    if (this.apuestas.length === 0) return;
    this.error = '';
    this.resultado = null;
    this.girando = true;
    this.casino.jugarRuleta(this.apuestas).subscribe({
      next: (r) => {
        setTimeout(() => {
          this.resultado = r.resultado;
          this.girando = false;
          this.apuestas = [];
        }, 800);
      },
      error: (e) => {
        this.girando = false;
        this.error = e.error?.error || 'No se pudo jugar';
      }
    });
  }

  describir(a: ApuestaRuleta) {
    switch (a.tipo) {
      case 'numero': return `Número ${a.valor}`;
      case 'color':  return `Color ${a.valor}`;
      case 'paridad': return a.valor === 'par' ? 'Pares' : 'Impares';
      case 'docena': return `Docena ${a.valor}`;
    }
  }
}
