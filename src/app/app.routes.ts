import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const rutas: Routes = [
  { path: '', redirectTo: 'lobby', pathMatch: 'full' },
  { path: 'login',    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) },
  { path: 'lobby',     canActivate: [authGuard], loadComponent: () => import('./components/lobby/lobby.component').then(m => m.LobbyComponent) },
  { path: 'slots',     canActivate: [authGuard], loadComponent: () => import('./components/slots/slots.component').then(m => m.SlotsComponent) },
  { path: 'roulette',  canActivate: [authGuard], loadComponent: () => import('./components/roulette/roulette.component').then(m => m.RouletteComponent) },
  { path: 'blackjack', canActivate: [authGuard], loadComponent: () => import('./components/blackjack/blackjack.component').then(m => m.BlackjackComponent) },
  { path: 'profile',   canActivate: [authGuard], loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent) },
  { path: 'history',   canActivate: [authGuard], loadComponent: () => import('./components/history/history.component').then(m => m.HistoryComponent) },
  { path: '**', redirectTo: 'lobby' }
];
