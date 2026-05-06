import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  template: `
    <app-header></app-header>
    <div class="contenido">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .contenido { max-width: 1100px; margin: 0 auto; padding: 24px; }
  `]
})
export class AppComponent {}
