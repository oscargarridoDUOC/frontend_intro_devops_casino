import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { RespuestaAuth, Usuario } from '../models/casino.models';

const STORAGE_KEY = 'casino.session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = environment.apiBaseUrl;

  private readonly _usuario = signal<Usuario | null>(this.cargarSesion()?.usuario ?? null);
  private readonly _token = signal<string | null>(this.cargarSesion()?.token ?? null);

  readonly usuario = this._usuario.asReadonly();
  readonly token = this._token.asReadonly();
  readonly autenticado = computed(() => !!this._token());

  constructor(private http: HttpClient) {}

  registrar(datos: { username: string; email: string; password: string }) {
    return this.http.post<RespuestaAuth>(`${this.api}/api/auth/register`, datos)
      .pipe(tap((r) => this.persistir(r)));
  }

  login(username: string, password: string) {
    return this.http.post<RespuestaAuth>(`${this.api}/api/auth/login`, { username, password })
      .pipe(tap((r) => this.persistir(r)));
  }

  logout() {
    this._usuario.set(null);
    this._token.set(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  setSaldo(saldo: number) {
    const u = this._usuario();
    if (u) this._usuario.set({ ...u, saldo });
    this.guardarLocal();
  }

  setUsuario(usuario: Usuario) {
    this._usuario.set(usuario);
    this.guardarLocal();
  }

  private persistir(r: RespuestaAuth) {
    this._usuario.set(r.usuario);
    this._token.set(r.token);
    this.guardarLocal();
  }

  private guardarLocal() {
    const data = { usuario: this._usuario(), token: this._token() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  private cargarSesion(): { usuario: Usuario; token: string } | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }
}
