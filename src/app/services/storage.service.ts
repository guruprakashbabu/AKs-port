import { Injectable, signal } from '@angular/core';

const KEY = 'akash.images.v1';

type ImageStore = Record<string, string | string[]>;

/**
 * Persists uploaded images (data URLs) in localStorage.
 * - Single-slot keys: profile, logo.<channelId>
 * - Multi-slot keys:  reports.<channelId>, recent.<index>
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly store = signal<ImageStore>(this.read());

  readonly snapshot = this.store.asReadonly();

  getOne(key: string): string | null {
    const v = this.store()[key];
    return typeof v === 'string' ? v : null;
  }

  getMany(key: string): string[] {
    const v = this.store()[key];
    return Array.isArray(v) ? v : [];
  }

  setOne(key: string, value: string): void {
    this.update({ ...this.store(), [key]: value });
  }

  addMany(key: string, value: string): void {
    const next = { ...this.store() };
    const existing = Array.isArray(next[key]) ? (next[key] as string[]) : [];
    next[key] = [...existing, value];
    this.update(next);
  }

  removeAt(key: string, index: number): void {
    const existing = this.getMany(key);
    const next = { ...this.store() };
    next[key] = existing.filter((_, i) => i !== index);
    this.update(next);
  }

  clear(key: string): void {
    const next = { ...this.store() };
    delete next[key];
    this.update(next);
  }

  private update(next: ImageStore): void {
    this.store.set(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* quota */ }
  }

  private read(): ImageStore {
    if (typeof localStorage === 'undefined') return {};
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as ImageStore) : {};
    } catch {
      return {};
    }
  }
}
