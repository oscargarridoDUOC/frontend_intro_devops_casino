import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import {
  Juego, Transaccion, ResultadoSlots, ResultadoRuleta,
  ApuestaRuleta, EstadoBlackjack, Usuario
} from '../models/casino.models';

@Injectable({ providedIn: 'root' })
export class CasinoService {
  private readonly api = environment.apiBaseUrl;

  constructor(private http: HttpClient, private auth: AuthService) {}

  // ---------- Catalogo ----------
  listarJuegos() {
    return this.http.get<Juego[]>(`${this.api}/api/juegos`);
  }

  // ---------- Perfil ----------
  miPerfil() {
    return this.http.get<Usuario>(`${this.api}/api/usuarios/me`)
      .pipe(tap((u) => this.auth.setUsuario(u)));
  }

  depositar(monto: number) {
    return this.http.post<{ saldo: number }>(`${this.api}/api/usuarios/me/depositar`, { monto })
      .pipe(tap((r) => this.auth.setSaldo(r.saldo)));
  }

  // ---------- Historial ----------
  historial(limit = 50) {
    return this.http.get<Transaccion[]>(`${this.api}/api/transacciones?limit=${limit}`);
  }

  // ---------- Slots ----------
  jugarSlots(apuesta: number) {
    return this.http.post<{ resultado: ResultadoSlots; saldo: number }>(
      `${this.api}/api/juegos/slots/jugar`, { apuesta }
    ).pipe(tap((r) => this.auth.setSaldo(r.saldo)));
  }

  // ---------- Ruleta ----------
  jugarRuleta(apuestas: ApuestaRuleta[]) {
    return this.http.post<{ resultado: ResultadoRuleta; saldo: number }>(
      `${this.api}/api/juegos/roulette/jugar`, { apuestas }
    ).pipe(tap((r) => this.auth.setSaldo(r.saldo)));
  }

  // ---------- Blackjack ----------
  blackjackIniciar(apuesta: number) {
    return this.http.post<EstadoBlackjack>(
      `${this.api}/api/juegos/blackjack/iniciar`, { apuesta }
    ).pipe(tap((r) => this.auth.setSaldo(r.saldo)));
  }
  blackjackAccion(sesionId: number, accion: 'pedir' | 'plantarse' | 'doblar') {
    return this.http.post<EstadoBlackjack>(
      `${this.api}/api/juegos/blackjack/accion`, { sesionId, accion }
    ).pipe(tap((r) => this.auth.setSaldo(r.saldo)));
  }
}
