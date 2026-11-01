import { Injectable, signal } from '@angular/core';

const USERNAME = 'AKASH';
const PASSWORD = 'VMHSS-2020';
const KEY = 'akash.admin';

@Injectable({ providedIn: 'root' })
export class AdminService {
  readonly isAdmin   = signal<boolean>(this.readPersisted());
  readonly showLogin = signal<boolean>(false);
  readonly loginError = signal<string | null>(null);

  openLogin(): void {
    this.loginError.set(null);
    this.showLogin.set(true);
  }

  closeLogin(): void {
    this.loginError.set(null);
    this.showLogin.set(false);
  }

  login(username: string, password: string): boolean {
    if (username.trim() === USERNAME && password === PASSWORD) {
      this.isAdmin.set(true);
      try { localStorage.setItem(KEY, '1'); } catch { /* ignore */ }
      this.showLogin.set(false);
      this.loginError.set(null);
      return true;
    }
    this.loginError.set('Wrong username or password.');
    return false;
  }

  logout(): void {
    this.isAdmin.set(false);
    try { localStorage.removeItem(KEY); } catch { /* ignore */ }
  }

  private readPersisted(): boolean {
    if (typeof localStorage === 'undefined') return false;
    try { return localStorage.getItem(KEY) === '1'; } catch { return false; }
  }
}
