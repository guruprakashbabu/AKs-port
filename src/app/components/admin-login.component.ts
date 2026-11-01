import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AdminService } from '../services/admin.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (admin.showLogin()) {
      <div class="backdrop" (click)="onBackdrop($event)" role="dialog" aria-modal="true" aria-label="Admin login">
        <div class="dialog">
          <div class="head">
            <span class="eyebrow">Admin · Private</span>
            <button class="close" type="button" (click)="admin.closeLogin()" aria-label="Close">&times;</button>
          </div>

          @if (admin.isAdmin()) {
            <h3>Logged in as <em>AKASH</em></h3>
            <p class="desc">You can upload, replace or delete images across the site. Changes are saved to this browser.</p>
            <div class="actions">
              <button class="btn ghost" type="button" (click)="admin.closeLogin()">Keep going</button>
              <button class="btn primary" type="button" (click)="onLogout()">Sign out</button>
            </div>
          } @else {
            <h3>Sign in to <em>edit</em></h3>
            <p class="desc">Upload and manage images for the portfolio.</p>

            <form (ngSubmit)="submit()">
              <div class="field">
                <label for="u">Username</label>
                <input id="u" name="username" type="text" autocomplete="off" [(ngModel)]="username" required>
              </div>
              <div class="field">
                <label for="p">Password</label>
                <input id="p" name="password" type="password" autocomplete="current-password" [(ngModel)]="password" required>
              </div>

              @if (admin.loginError(); as err) {
                <div class="error">{{ err }}</div>
              }

              <div class="actions">
                <button type="button" class="btn ghost" (click)="admin.closeLogin()">Cancel</button>
                <button type="submit" class="btn primary">Sign in</button>
              </div>
            </form>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 60;
      background: rgba(26, 22, 18, 0.6);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      animation: fade .2s var(--ease-out);
    }
    @keyframes fade { from { opacity: 0; } }

    .dialog {
      width: 100%;
      max-width: 440px;
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: var(--radius-xl);
      padding: 32px;
      box-shadow: var(--shadow-lg);
      position: relative;
      animation: pop .3s var(--ease-out);
    }
    @keyframes pop {
      from { opacity: 0; transform: translateY(10px) scale(.98); }
    }

    .head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 18px;
    }
    .close {
      background: transparent;
      border: 0;
      width: 36px; height: 36px;
      border-radius: 50%;
      font: 300 28px/1 var(--font-body);
      color: var(--muted);
      cursor: pointer;
      transition: background-color .2s, color .2s;
    }
    .close:hover { background: var(--surface-2); color: var(--ink); }

    h3 {
      font: 500 32px/1.1 var(--font-display);
      margin: 0 0 8px;
      font-variation-settings: "opsz" 144;
    }
    h3 em { font-style: italic; color: var(--accent); font-weight: 500; }
    .desc { color: var(--muted); margin-bottom: 20px; font-size: 15px; }

    form { display: flex; flex-direction: column; gap: 14px; }

    .error {
      padding: 10px 14px;
      background: color-mix(in srgb, var(--bad) 14%, transparent);
      color: var(--bad);
      border-radius: var(--radius-md);
      font-size: 13.5px;
      font-weight: 500;
    }

    .actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 8px;
    }
  `]
})
export class AdminLoginComponent {
  readonly admin = inject(AdminService);
  username = '';
  password = '';

  submit(): void {
    this.admin.login(this.username, this.password);
    if (this.admin.isAdmin()) {
      this.username = '';
      this.password = '';
    }
  }

  onLogout(): void {
    this.admin.logout();
    this.admin.closeLogin();
  }

  onBackdrop(e: MouseEvent): void {
    if (e.target === e.currentTarget) this.admin.closeLogin();
  }

  @HostListener('document:keydown.escape')
  onEsc(): void {
    if (this.admin.showLogin()) this.admin.closeLogin();
  }
}
