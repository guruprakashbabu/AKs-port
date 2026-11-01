import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AdminLoginComponent } from './components/admin-login.component';
import { FooterComponent } from './components/footer.component';
import { HeaderComponent } from './components/header.component';
import { LightboxComponent } from './components/lightbox.component';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    LightboxComponent,
    AdminLoginComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-header />
    <router-outlet />
    <app-footer />
    <app-lightbox />
    <app-admin-login />
  `
})
export class AppComponent implements OnInit {
  private readonly theme = inject(ThemeService);

  ngOnInit(): void {
    this.theme.initialise();
  }
}
