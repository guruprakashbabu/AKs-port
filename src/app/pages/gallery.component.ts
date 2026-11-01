import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { AdminService } from '../services/admin.service';
import { ContentService } from '../services/content.service';
import { LightboxImage, LightboxService } from '../services/lightbox.service';
import { StorageService } from '../services/storage.service';
import { UploadGalleryComponent } from '../components/upload-gallery.component';
import { UploadImageComponent } from '../components/upload-image.component';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [RouterLink, UploadGalleryComponent, UploadImageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="gallery-section">
      <div class="wrap">
        <a routerLink="/" class="back">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to casebook
        </a>

        <header class="gallery-head">
          <div class="brand-wrap">
            <app-upload-image
              [storageKey]="'logo.' + channelId()"
              [label]="'Add ' + channelName() + ' logo'"
              aspect="4 / 3"
              [alt]="channelName() + ' logo'" />
          </div>
          <div>
            <span class="eyebrow">Reports · {{ channelName() }}</span>
            <h1>{{ channelName() }} <em>reports</em></h1>
            <p class="lead">
              Dashboard reports uploaded for this channel. Tap any image to view full size.
              @if (admin.isAdmin()) {
                Use the <strong>+</strong> tile to add new reports — they stay stored on this browser.
              }
            </p>
          </div>
        </header>

        <div class="scroll-row tabs">
          @for (ch of channels(); track ch.id) {
            <a class="tab-btn" [class.active]="ch.id === channelId()" [routerLink]="['/gallery', ch.id]">{{ ch.name }}</a>
          }
        </div>

        <div class="toolbar">
          <div class="count">
            <span class="label">Count</span>
            <strong>{{ shots().length }}</strong>
            <span class="unit">reports</span>
          </div>
          @if (!admin.isAdmin()) {
            <div class="hint">Admin can add new reports.</div>
          } @else {
            <div class="hint hint-ok">Admin mode — upload and delete enabled.</div>
          }
        </div>

        <app-upload-gallery
          [storageKey]="'reports.' + channelId()"
          [label]="channelName() + ' report'"
          [addLabel]="'Add ' + channelName() + ' report'"
          [emptyText]="'Reports coming soon.'"
          (open)="open($event)" />
      </div>
    </section>
  `,
  styles: [`
    .gallery-section { padding: 48px 0 100px; min-height: 70vh; }

    .back {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--muted);
      font: 500 13.5px var(--font-body);
      margin-bottom: 32px;
      transition: color .2s, transform .2s var(--ease-out);
    }
    .back:hover { color: var(--accent); transform: translateX(-4px); }

    .gallery-head {
      display: grid;
      grid-template-columns: 220px 1fr;
      gap: 36px;
      align-items: center;
      padding-bottom: 32px;
      border-bottom: 1px solid var(--line);
      margin-bottom: 32px;
    }
    .brand-wrap { max-width: 220px; }

    h1 {
      font: 500 clamp(44px, 6vw, 72px)/1 var(--font-display);
      font-variation-settings: "opsz" 144;
      letter-spacing: -0.025em;
      margin: 10px 0 14px;
      color: var(--ink);
    }
    h1 em { font-style: italic; color: var(--accent); font-weight: 500; }

    .tabs { margin-bottom: 28px; }
    .tabs .tab-btn { text-decoration: none; }

    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 18px 20px;
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: var(--radius-md);
      margin-bottom: 24px;
      gap: 16px;
    }
    .count { display: inline-flex; align-items: baseline; gap: 8px; }
    .count .label {
      font: 600 10.5px var(--font-mono);
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--muted);
    }
    .count strong { font: 500 24px/1 var(--font-display); color: var(--accent); }
    .count .unit { font: 500 13px var(--font-body); color: var(--muted); }
    .hint { font: 500 13px var(--font-body); color: var(--muted); }
    .hint-ok { color: var(--sage); font-weight: 600; }

    @media (max-width: 820px) {
      .gallery-head { grid-template-columns: 1fr; gap: 20px; }
      .brand-wrap { max-width: 180px; }
    }
  `]
})
export class GalleryComponent {
  readonly content = inject(ContentService);
  readonly admin   = inject(AdminService);
  private readonly storage = inject(StorageService);
  private readonly lb = inject(LightboxService);
  private readonly route = inject(ActivatedRoute);

  readonly channels = computed(() => this.content.resultsLab().channels);

  readonly channelId = toSignal(
    this.route.paramMap.pipe(map((p) => p.get('channel') ?? this.channels()[0]!.id)),
    { initialValue: this.channels()[0]!.id }
  );

  readonly channelName = computed(() => {
    const match = this.channels().find((c) => c.id === this.channelId());
    return match?.name ?? 'Channel';
  });

  readonly shots = computed(() => {
    this.storage.snapshot();
    return this.storage.getMany(`reports.${this.channelId()}`);
  });

  open(index: number): void {
    const images: LightboxImage[] = this.shots().map((src, i) => ({
      src,
      alt: `${this.channelName()} report ${i + 1}`
    }));
    this.lb.show(images, index);
  }
}
