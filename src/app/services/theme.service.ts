import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'akash.theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly mode = signal<ThemeMode>('light');

  initialise(): void {
    if (typeof window === 'undefined') return;

    const stored = window.localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const next: ThemeMode = stored ?? (prefersDark ? 'dark' : 'light');
    this.apply(next);
  }

  toggle(): void {
    this.apply(this.mode() === 'dark' ? 'light' : 'dark');
  }

  private apply(mode: ThemeMode): void {
    this.mode.set(mode);
    document.documentElement.dataset['theme'] = mode;
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      /* storage not available */
    }
  }
}
