import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';

import { AdminService } from '../services/admin.service';
import { ThemeService } from '../services/theme.service';

const CLICK_WINDOW_MS = 700;
const CLICKS_TO_LOGIN = 3;

@Component({
  selector: 'app-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="site-header" [class.scrolled]="scrolled()">
      <div class="wrap bar">
        <button class="brand" type="button" (click)="onBrandClick()" [attr.aria-label]="brandAriaLabel()">
          <span class="brand-mark" [class.admin]="admin.isAdmin()">A</span>
          <span class="brand-text">
            <strong>S. Akash</strong>
            <small>Performance Marketing · Casebook</small>
          </span>
        </button>

        <nav aria-label="Primary">
          <a href="#cases">Cases</a>
          <a href="#lab">Results Lab</a>
          <a href="#recent">Recent</a>
          <a href="#contact">Contact</a>
        </nav>

        <div class="actions">
          @if (admin.isAdmin()) {
            <span class="admin-pill" (click)="admin.openLogin()" title="Admin mode">
              <span class="live"></span>
              Admin
            </span>
          }
          <button
            class="icon-btn"
            type="button"
            (click)="theme.toggle()"
            [attr.aria-label]="theme.mode() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'">
            @if (theme.mode() === 'dark') {
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
              </svg>
            } @else {
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            }
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .site-header {
      position: sticky;
      top: 0;
      z-index: 20;
      background: color-mix(in srgb, var(--paper) 86%, transparent);
      backdrop-filter: saturate(140%) blur(14px);
      -webkit-backdrop-filter: saturate(140%) blur(14px);
      border-bottom: 1px solid transparent;
      transition: background-color .25s var(--ease-out), border-color .25s var(--ease-out);
    }
    .site-header.scrolled {
      background: color-mix(in srgb, var(--paper) 97%, transparent);
      border-bottom-color: var(--line);
    }

    .bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      padding: 16px 32px;
    }

    .brand {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      background: transparent;
      border: 0;
      cursor: pointer;
      padding: 0;
      color: inherit;
    }
    .brand-mark {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 42px; height: 42px;
      border-radius: 12px;
      background: var(--ink);
      color: var(--paper);
      font: 800 22px var(--font-display);
      font-variation-settings: "opsz" 144;
      transition: background-color .25s, color .25s, transform .2s var(--ease-out);
    }
    .brand:hover .brand-mark { transform: rotate(-6deg); }
    .brand-mark.admin {
      background: var(--accent);
      color: var(--paper);
      box-shadow: 0 0 0 3px var(--accent-soft);
    }
    .brand-text { display: flex; flex-direction: column; line-height: 1.1; text-align: left; }
    .brand-text strong { font: 600 14px var(--font-body); color: var(--ink); }
    .brand-text small { font: 500 11.5px/1.1 var(--font-mono); letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); margin-top: 3px; }

    nav {
      display: flex;
      gap: 28px;
      align-items: center;
    }
    nav a {
      font: 500 14px var(--font-body);
      color: var(--ink-2);
      position: relative;
      transition: color .2s var(--ease-out);
    }
    nav a:hover { color: var(--accent); }
    nav a::after {
      content: '';
      position: absolute;
      left: 0; right: 100%;
      bottom: -6px;
      height: 1px;
      background: var(--accent);
      transition: right .25s var(--ease-out);
    }
    nav a:hover::after { right: 0; }

    .actions { display: inline-flex; align-items: center; gap: 10px; }

    .admin-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 7px 14px;
      border-radius: 99px;
      background: var(--accent);
      color: var(--paper);
      font: 600 11.5px var(--font-mono);
      letter-spacing: 0.18em;
      text-transform: uppercase;
      cursor: pointer;
      transition: transform .18s var(--ease-out);
    }
    .admin-pill:hover { transform: translateY(-1px); }
    .live {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: var(--paper);
      box-shadow: 0 0 0 0 rgba(255,255,255,0.7);
      animation: ping 1.8s infinite;
    }
    @keyframes ping {
      0%   { box-shadow: 0 0 0 0 rgba(255,255,255,0.7); }
      70%  { box-shadow: 0 0 0 8px rgba(255,255,255,0); }
      100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
    }

    .icon-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px; height: 40px;
      border-radius: 12px;
      border: 1px solid var(--line);
      background: var(--surface);
      color: var(--ink);
      cursor: pointer;
      transition: all .2s var(--ease-out);
    }
    .icon-btn:hover { background: var(--accent-soft); border-color: var(--accent); color: var(--accent); }

    @media (max-width: 820px) {
      nav { display: none; }
      .brand-text small { display: none; }
      .bar { padding: 14px 22px; }
    }
  `]
})
export class HeaderComponent {
  readonly theme = inject(ThemeService);
  readonly admin = inject(AdminService);

  readonly scrolled = signal(false);
  private clickCount = 0;
  private clickTimer: ReturnType<typeof setTimeout> | null = null;

  brandAriaLabel(): string {
    return this.admin.isAdmin() ? 'Admin menu' : 'Home — click 3× to sign in';
  }

  onBrandClick(): void {
    this.clickCount += 1;
    if (this.clickTimer) clearTimeout(this.clickTimer);
    this.clickTimer = setTimeout(() => {
      this.clickCount = 0;
    }, CLICK_WINDOW_MS);

    if (this.clickCount >= CLICKS_TO_LOGIN) {
      this.clickCount = 0;
      if (this.clickTimer) clearTimeout(this.clickTimer);
      this.admin.openLogin();
    }
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled.set(window.scrollY > 8);
  }
}
