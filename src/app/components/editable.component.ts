import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  ViewChild
} from '@angular/core';

import { AdminService } from '../services/admin.service';
import { ContentService } from '../services/content.service';

/**
 * Inline-editable text bound to a ContentService path.
 *
 * - Visitors see the plain rendered text (HTML preserved if html=true).
 * - Admins see the same text with a dashed-underline hover + contenteditable;
 *   Blur or Enter (unless multiline) commits; Esc reverts.
 *
 * We update the DOM only when the external value changes AND the element is
 * not currently focused, so edits in-flight never get clobbered.
 */
@Component({
  selector: 'app-editable',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      #el
      class="editable"
      [class.is-admin]="admin.isAdmin()"
      [class.is-multiline]="multiline()"
      [attr.contenteditable]="admin.isAdmin() ? (html() ? 'true' : 'plaintext-only') : null"
      [attr.spellcheck]="admin.isAdmin() ? 'false' : null"
      [attr.data-placeholder]="placeholder()"
      [attr.data-field]="path()"
      (blur)="commit()"
      (keydown)="onKey($event)"
      (paste)="onPaste($event)"></span>
  `,
  styles: [`
    :host { display: inline; }

    .editable { outline: none; }

    .is-admin {
      display: inline-block;
      min-width: 1em;
      min-height: 1em;
      border-radius: 4px;
      padding: 0 2px;
      margin: 0 -2px;
      transition: background-color .15s var(--ease-out), box-shadow .15s;
      cursor: text;
    }
    .is-admin:hover {
      background: color-mix(in srgb, var(--accent-soft) 55%, transparent);
      box-shadow: inset 0 -1px 0 var(--accent);
    }
    .is-admin:focus {
      background: var(--accent-soft);
      box-shadow: inset 0 0 0 1px var(--accent);
    }
    .is-admin.is-multiline { display: block; }

    .is-admin:empty::before {
      content: attr(data-placeholder);
      opacity: 0.4;
      font-style: italic;
    }
  `]
})
export class EditableComponent implements AfterViewInit {
  readonly path        = input.required<string>();
  readonly html        = input<boolean>(false);
  readonly multiline   = input<boolean>(false);
  readonly placeholder = input<string>('Click to edit');

  @ViewChild('el', { static: true }) el!: ElementRef<HTMLElement>;

  readonly admin   = inject(AdminService);
  readonly content = inject(ContentService);

  constructor() {
    effect(() => {
      const value = this.content.get<string>(this.path());
      const node = this.el?.nativeElement;
      if (!node) return;
      if (document.activeElement === node) return;
      this.render(value);
    });
  }

  ngAfterViewInit(): void {
    this.render(this.content.get<string>(this.path()));
  }

  commit(): void {
    const node = this.el.nativeElement;
    const current = this.html() ? node.innerHTML : node.textContent ?? '';
    const stored = this.content.get<string>(this.path()) ?? '';
    if (current === stored) return;
    this.content.set(this.path(), current);
  }

  onKey(e: KeyboardEvent): void {
    if (e.key === 'Enter' && !this.multiline() && !e.shiftKey) {
      e.preventDefault();
      (e.target as HTMLElement).blur();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      const value = this.content.get<string>(this.path());
      this.render(value);
      (e.target as HTMLElement).blur();
    }
  }

  onPaste(e: ClipboardEvent): void {
    if (!this.admin.isAdmin()) return;
    if (this.html()) return;
    e.preventDefault();
    const text = e.clipboardData?.getData('text/plain') ?? '';
    document.execCommand('insertText', false, text);
  }

  private render(value: string | undefined): void {
    const node = this.el.nativeElement;
    const v = value ?? '';
    if (this.html()) node.innerHTML = v;
    else node.textContent = v;
  }
}
