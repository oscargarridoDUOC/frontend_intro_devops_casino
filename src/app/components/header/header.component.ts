import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="barra">
      <a routerLink="/lobby" class="marca">♠ Casino DevOps ♦</a>

      <nav *ngIf="auth.autenticado()">
        <a routerLink="/lobby" routerLinkActive="activo">Lobby</a>
        <a routerLink="/slots" routerLinkActive="activo">Slots</a>
        <a routerLink="/roulette" routerLinkActive="activo">Ruleta</a>
        <a routerLink="/blackjack" routerLinkActive="activo">Blackjack</a>
        <a routerLink="/history" routerLinkActive="activo">Historial</a>
      </nav>

      <div class="acciones" *ngIf="auth.autenticado(); else anon">
        <a routerLink="/profile" class="saldo" title="Mi perfil">
          <span class="user">{{ auth.usuario()?.username }}</span>
          <span class="ficha">{{ saldoFmt() }}</span>
        </a>
        <button class="btn btn-secundario" (click)="salir()">Salir</button>
      </div>

      <ng-template #anon>
        <div class="acciones">
          <a routerLink="/login" class="btn btn-secundario">Login</a>
          <a routerLink="/register" class="btn btn-primario">Registrarse</a>
        </div>
      </ng-template>
    </header>
  `,
  styles: [`
    .barra {
      display: flex; align-items: center; gap: 24px;
      padding: 14px 32px;
      background: linear-gradient(180deg, rgba(0,0,0,.55), rgba(0,0,0,.2));
      border-bottom: 1px solid rgba(245,197,66,.25);
      position: sticky; top: 0; z-index: 10;
      backdrop-filter: blur(6px);
    }
    .marca {
      font-family: 'Georgia', serif;
      font-size: 22px;
      color: #f5c542;
      letter-spacing: 2px;
    }
    nav { display: flex; gap: 16px; flex: 1; }
    nav a {
      color: #f4eeda;
      padding: 6px 10px; border-radius: 6px;
    }
    nav a.activo { background: rgba(245,197,66,.15); color: #f5c542; }
    .acciones { display: flex; gap: 12px; align-items: center; }
    .saldo {
      display: inline-flex; align-items: center; gap: 10px;
      padding: 6px 12px; border-radius: 999px;
      background: rgba(255,255,255,.06);
      border: 1px solid rgba(245,197,66,.4);
    }
    .user { color: #f4eeda; font-weight: 600; }
    .ficha {
      background: linear-gradient(180deg, #f5c542, #c79420);
      color: #2a1a02; padding: 2px 10px; border-radius: 999px;
      font-weight: 700;
    }
  `]
})
export class HeaderComponent {
  saldoFmt = computed(() => {
    const u = this.auth.usuario();
    if (!u) return '';
    return '$ ' + Number(u.saldo).toLocaleString('es-CL', { maximumFractionDigits: 0 });
  });

  constructor(public auth: AuthService, private router: Router) {}

  salir() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
