import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { AdminService } from '../services/admin.service';
import { StorageService } from '../services/storage.service';

/**
 * Single-image slot. Public visitors only see it when an image exists.
 * Admins see an "add" tile when empty and get a delete button when filled.
 */
@Component({
  selector: 'app-upload-image',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (image(); as src) {
      <div class="slot filled" [style.aspect-ratio]="aspect()">
        <img [src]="src" [alt]="alt()" />
        @if (admin.isAdmin()) {
          <button type="button" class="del" (click)="remove()" title="Remove image" aria-label="Remove image">×</button>
        }
      </div>
    } @else if (admin.isAdmin()) {
      <label class="slot empty" [style.aspect-ratio]="aspect()">
        <input type="file" accept="image/*" (change)="onFile($event)" />
        <div class="plus">+</div>
        <span>{{ label() }}</span>
      </label>
    }
  `,
  styles: [`
    :host { display: block; }

    .slot {
      position: relative;
      width: 100%;
      border-radius: var(--radius-md);
      overflow: hidden;
      background: var(--surface);
      border: 1px solid var(--line);
    }
    .slot.filled { border: 1px solid var(--line); }

    .slot img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .slot.empty {
      border: 1.5px dashed var(--line-strong);
      background: var(--surface-2);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: var(--muted);
      font: 500 13.5px var(--font-body);
      transition: all .2s var(--ease-out);
    }
    .slot.empty:hover, .slot.empty:focus-within {
      border-color: var(--accent);
      color: var(--accent);
      background: var(--accent-soft);
    }
    .slot.empty input {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
    }
    .plus { font: 300 44px/1 var(--font-display); color: var(--accent); }

    .del {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 0;
      background: var(--ink);
      color: var(--paper);
      font: 300 22px/1 var(--font-body);
      cursor: pointer;
      box-shadow: var(--shadow-md);
      transition: transform .2s var(--ease-out), background-color .2s;
    }
    .del:hover { background: var(--bad); transform: scale(1.08); }
  `]
})
export class UploadImageComponent {
  readonly storageKey = input.required<string>();
  readonly label      = input<string>('Add image');
  readonly aspect     = input<string>('16 / 10');
  readonly alt        = input<string>('Uploaded image');

  readonly admin   = inject(AdminService);
  private readonly storage = inject(StorageService);

  readonly image = computed(() => {
    this.storage.snapshot();
    return this.storage.getOne(this.storageKey());
  });

  onFile(e: Event): void {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => this.storage.setOne(this.storageKey(), reader.result as string);
    reader.readAsDataURL(file);
    input.value = '';
  }

  remove(): void {
    this.storage.clear(this.storageKey());
  }
}
