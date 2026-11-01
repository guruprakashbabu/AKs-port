import { Injectable, signal } from '@angular/core';

export interface LightboxImage {
  src: string;
  alt: string;
}

@Injectable({ providedIn: 'root' })
export class LightboxService {
  readonly images = signal<LightboxImage[]>([]);
  readonly index = signal(0);
  readonly open = signal(false);

  show(images: LightboxImage[], index: number): void {
    this.images.set(images);
    this.index.set(index);
    this.open.set(true);
    this.lockScroll(true);
  }

  close(): void {
    this.open.set(false);
    this.lockScroll(false);
  }

  next(): void {
    const total = this.images().length;
    if (!total) return;
    this.index.set((this.index() + 1) % total);
  }

  prev(): void {
    const total = this.images().length;
    if (!total) return;
    this.index.set((this.index() - 1 + total) % total);
  }

  private lockScroll(lock: boolean): void {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = lock ? 'hidden' : '';
  }
}
