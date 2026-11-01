import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AdminService } from '../services/admin.service';
import { ContentService } from '../services/content.service';
import { EditableComponent } from './editable.component';
import { LightboxService } from '../services/lightbox.service';
import { StorageService } from '../services/storage.service';
import { UploadGalleryComponent } from './upload-gallery.component';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [EditableComponent, UploadGalleryComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="recent">
      <div class="wrap">
        <div class="section-head">
          <span class="eyebrow"><app-editable path="timeline.eyebrow" /></span>
          <h2><app-editable path="timeline.titleHtml" [html]="true" /></h2>
          <p class="lead"><app-editable path="timeline.lead" [multiline]="true" /></p>
        </div>

        <ol class="timeline">
          @for (item of content.timeline().items; track $index; let i = $index) {
            <li class="admin-wrap">
              @if (admin.isAdmin()) {
                <button class="admin-remove" type="button" title="Remove entry"
                        (click)="content.removeAt('timeline.items', i)">×</button>
              }
              <div class="node">
                <span class="dot"></span>
                <span class="when"><app-editable [path]="'timeline.items.' + i + '.when'" /></span>
              </div>
              <div class="body">
                <div class="tag"><app-editable [path]="'timeline.items.' + i + '.tag'" /></div>
                <h4><app-editable [path]="'timeline.items.' + i + '.title'" /></h4>
                <p><app-editable [path]="'timeline.items.' + i + '.description'" [multiline]="true" /></p>

                <div class="attach">
                  <app-upload-gallery
                    [storageKey]="'recent.' + i"
                    label="Report"
                    addLabel="Add report"
                    emptyText=""
                    (open)="openAt(i, $event)" />
                </div>
              </div>
            </li>
          }
        </ol>

        @if (admin.isAdmin()) {
          <div class="add-wrap">
            <button class="admin-add" type="button" (click)="addEntry()">
              <span class="plus">+</span> Add entry
            </button>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .timeline {
      list-style: none;
      margin: 0;
      padding: 0;
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 40px;
    }
    .timeline::before {
      content: '';
      position: absolute;
      left: 95px;
      top: 10px;
      bottom: 10px;
      width: 1px;
      background: var(--line);
    }
    .timeline li {
      display: grid;
      grid-template-columns: 120px 1fr;
      gap: 24px;
      align-items: start;
      position: relative;
    }
    .timeline li .admin-remove { right: 0; top: -6px; }

    .node {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      padding-top: 4px;
    }
    .node .when {
      font: 500 11px var(--font-mono);
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--muted);
      margin-top: 10px;
      text-align: right;
      max-width: 90px;
      line-height: 1.3;
    }
    .node .dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: var(--accent);
      border: 3px solid var(--paper);
      box-shadow: 0 0 0 1px var(--line-strong);
      position: absolute;
      right: -31px;
      top: 6px;
    }

    .body { padding-left: 16px; }
    .tag {
      display: inline-block;
      font: 600 10.5px var(--font-mono);
      letter-spacing: 0.18em;
      text-transform: uppercase;
      padding: 5px 11px;
      border-radius: 99px;
      background: var(--sage-soft);
      color: var(--sage);
      margin-bottom: 10px;
    }
    .body h4 {
      font: 500 28px/1.15 var(--font-display);
      font-variation-settings: "opsz" 144;
      color: var(--ink);
      margin: 0 0 8px;
      letter-spacing: -0.015em;
      font-weight: 500;
    }
    .body p {
      margin: 0 0 20px;
      color: var(--muted);
      font-size: 15.5px;
      line-height: 1.6;
      max-width: 56ch;
    }
    .attach { margin-top: 8px; }

    .add-wrap { margin-top: 32px; display: flex; justify-content: center; }

    @media (max-width: 820px) {
      .timeline::before { left: 11px; }
      .timeline li { grid-template-columns: 1fr; gap: 10px; }
      .node { flex-direction: row; align-items: center; padding-left: 32px; }
      .node .dot { position: absolute; right: auto; left: -24px; top: 50%; transform: translateY(-50%); }
      .node .when { margin-top: 0; text-align: left; max-width: none; }
      .body { padding-left: 32px; }
    }
  `]
})
export class TimelineComponent {
  readonly content = inject(ContentService);
  readonly admin   = inject(AdminService);
  private readonly storage = inject(StorageService);
  private readonly lb = inject(LightboxService);

  openAt(itemIndex: number, imageIndex: number): void {
    const images = this.storage.getMany(`recent.${itemIndex}`);
    this.lb.show(images.map((src) => ({ src, alt: `Report ${imageIndex + 1}` })), imageIndex);
  }

  addEntry(): void {
    this.content.push('timeline.items', this.content.newTimelineItem());
  }
}
