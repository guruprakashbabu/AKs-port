import { ChangeDetectionStrategy, Component, HostListener, inject } from '@angular/core';

import { LightboxService } from '../services/lightbox.service';

@Component({
  selector: 'app-lightbox',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (lb.open()) {
      <div class="lightbox" role="dialog" aria-modal="true" aria-label="Image viewer"
           (click)="onBackdrop($event)">
        <button class="btn-close" type="button" (click)="lb.close()" aria-label="Close">×</button>
        @if (lb.images().length > 1) {
          <button class="btn-nav prev" type="button" (click)="lb.prev()" aria-label="Previous image">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button class="btn-nav next" type="button" (click)="lb.next()" aria-label="Next image">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        }
        <img [src]="currentImage().src" [alt]="currentImage().alt" />
        <div class="counter">{{ lb.index() + 1 }} / {{ lb.images().length }}</div>
      </div>
    }
  `,
  styles: [`
    .lightbox {
      position: fixed;
      inset: 0;
      z-index: 50;
      background: rgba(26, 22, 18, 0.95);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 70px 20px;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      animation: fade .2s var(--ease-out);
    }
    @keyframes fade { from { opacity: 0; } }

    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      border-radius: 10px;
      box-shadow: 0 24px 60px rgba(0,0,0,0.6);
    }

    .btn-close, .btn-nav {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 0;
      background: var(--paper);
      color: var(--ink);
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
      transition: transform .15s var(--ease-out), background-color .2s, color .2s;
    }
    .btn-close:hover { background: var(--accent); color: var(--paper); }
    .btn-nav:hover { background: var(--accent); color: var(--paper); }
    .btn-close:hover, .btn-nav:hover { transform: scale(1.08); }

    .btn-close {
      top: 20px; right: 20px;
      width: 44px; height: 44px;
      font: 300 32px/1 var(--font-body);
    }
    .btn-nav {
      top: 50%;
      width: 48px; height: 48px;
      transform: translateY(-50%);
    }
    .btn-nav:hover { transform: translateY(-50%) scale(1.08); }
    .btn-nav.prev { left: 24px; }
    .btn-nav.next { right: 24px; }

    .counter {
      position: absolute;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      color: #fff;
      font: 600 13px var(--font-body);
      background: rgba(255,255,255,0.1);
      padding: 6px 14px;
      border-radius: 99px;
      border: 1px solid rgba(255,255,255,0.15);
    }

    @media (max-width: 520px) {
      .btn-nav { bottom: 24px; top: auto; transform: none; }
      .btn-nav:hover { transform: scale(1.08); }
      .btn-nav.prev { left: calc(50% - 60px); }
      .btn-nav.next { right: calc(50% - 60px); }
      .counter { bottom: 84px; }
    }
  `]
})
export class LightboxComponent {
  readonly lb = inject(LightboxService);

  currentImage() {
    return this.lb.images()[this.lb.index()] ?? { src: '', alt: '' };
  }

  onBackdrop(e: MouseEvent): void {
    if (e.target === e.currentTarget) this.lb.close();
  }

  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    if (!this.lb.open()) return;
    if (e.key === 'Escape') this.lb.close();
    if (e.key === 'ArrowLeft') this.lb.prev();
    if (e.key === 'ArrowRight') this.lb.next();
  }
}
