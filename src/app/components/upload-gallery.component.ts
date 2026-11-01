import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';

import { AdminService } from '../services/admin.service';
import { StorageService } from '../services/storage.service';

/**
 * Multi-image grid. Visitors see uploaded images; admins get add + delete controls.
 */
@Component({
  selector: 'app-upload-gallery',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid" [attr.data-min]="minColumn()">
      @for (src of images(); track src; let i = $index) {
        <figure class="tile">
          <button type="button" class="open" (click)="open.emit(i)" aria-label="Open image">
            <img [src]="src" [alt]="(label() || 'Report') + ' ' + (i + 1)" />
          </button>
          @if (admin.isAdmin()) {
            <button type="button" class="del" (click)="remove(i)" title="Remove">×</button>
          }
        </figure>
      }

      @if (admin.isAdmin()) {
        <label class="tile add" tabindex="0">
          <input type="file" accept="image/*" (change)="onFile($event)" aria-label="Add report">
          <div class="plus" aria-hidden="true">+</div>
          <span>{{ addLabel() }}</span>
        </label>
      }
    </div>

    @if (!images().length && !admin.isAdmin()) {
      <p class="empty">{{ emptyText() }}</p>
    }
  `,
  styles: [`
    :host { display: block; }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 14px;
    }

    .tile {
      position: relative;
      margin: 0;
      aspect-ratio: 4 / 3;
      border-radius: var(--radius-md);
      overflow: hidden;
      background: var(--surface);
      border: 1px solid var(--line);
      transition: transform .25s var(--ease-out), box-shadow .25s;
    }
    .tile:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); }

    .tile .open {
      display: block;
      width: 100%;
      height: 100%;
      padding: 0;
      border: 0;
      background: transparent;
      cursor: zoom-in;
    }
    .tile img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform .4s var(--ease-out);
    }
    .tile:hover img { transform: scale(1.04); }

    .tile.add {
      border: 1.5px dashed var(--line-strong);
      background: var(--surface-2);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 10px;
      color: var(--muted);
      font: 500 14px var(--font-body);
    }
    .tile.add:hover, .tile.add:focus-within {
      border-color: var(--accent);
      color: var(--accent);
      background: var(--accent-soft);
    }
    .tile.add input {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
    }
    .plus { font: 300 44px/1 var(--font-display); color: var(--accent); }

    .del {
      position: absolute;
      top: 10px;
      right: 10px;
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
      z-index: 2;
    }
    .del:hover { background: var(--bad); transform: scale(1.1); }

    .empty {
      padding: 32px 20px;
      border: 1.5px dashed var(--line-strong);
      border-radius: var(--radius-lg);
      text-align: center;
      color: var(--muted);
      font-size: 14.5px;
      background: var(--surface-2);
      margin: 0;
    }
  `]
})
export class UploadGalleryComponent {
  readonly storageKey = input.required<string>();
  readonly label      = input<string>('');
  readonly addLabel   = input<string>('Add image');
  readonly emptyText  = input<string>('Coming soon.');
  readonly minColumn  = input<number>(240);

  readonly open = output<number>();

  readonly admin   = inject(AdminService);
  private readonly storage = inject(StorageService);

  readonly images = computed(() => {
    this.storage.snapshot();
    return this.storage.getMany(this.storageKey());
  });

  onFile(e: Event): void {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => this.storage.addMany(this.storageKey(), reader.result as string);
    reader.readAsDataURL(file);
    input.value = '';
  }

  remove(index: number): void {
    this.storage.removeAt(this.storageKey(), index);
  }
}
