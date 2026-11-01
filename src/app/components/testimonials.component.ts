import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AdminService } from '../services/admin.service';
import { ContentService } from '../services/content.service';
import { EditableComponent } from './editable.component';
import { UploadImageComponent } from './upload-image.component';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [EditableComponent, UploadImageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="about">
      <div class="wrap">
        <div class="section-head">
          <span class="eyebrow"><app-editable path="testimonials.eyebrow" /></span>
          <h2><app-editable path="testimonials.titleHtml" [html]="true" /></h2>
        </div>

        <div class="quotes">
          @for (q of content.testimonials().items; track $index; let i = $index) {
            <figure class="quote admin-wrap">
              @if (admin.isAdmin() && content.testimonials().items.length > 1) {
                <button class="admin-remove" type="button" title="Remove testimonial"
                        (click)="content.removeAt('testimonials.items', i)">×</button>
              }
              <div class="q-no">N° {{ pad(i + 1) }}</div>
              <svg class="mark" viewBox="0 0 32 32" aria-hidden="true" fill="currentColor">
                <path d="M11 10c-4 0-7 3-7 7v5h7v-5H8c0-2 1-3 3-3V10zm13 0c-4 0-7 3-7 7v5h7v-5h-3c0-2 1-3 3-3V10z"/>
              </svg>
              <blockquote>
                <app-editable [path]="'testimonials.items.' + i + '.quote'" [multiline]="true" />
              </blockquote>
              <figcaption>
                <span class="dash">—</span>
                <app-editable [path]="'testimonials.items.' + i + '.cite'" />
              </figcaption>
            </figure>
          }

          @if (admin.isAdmin()) {
            <button class="quote add-quote" type="button" (click)="addTestimonial()">
              <span class="plus">+</span>
              <span>Add testimonial</span>
            </button>
          }
        </div>

        <div class="bio">
          <div class="avatar-wrap">
            <app-upload-image
              storageKey="profile"
              label="Add profile photo"
              aspect="1 / 1"
              alt="Akash" />
          </div>
          <div class="bio-copy">
            <span class="eyebrow"><app-editable path="testimonials.aboutEyebrow" /></span>
            <h3><app-editable path="testimonials.aboutNameHtml" [html]="true" /></h3>
            <p><app-editable path="testimonials.bio" [multiline]="true" /></p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .quotes {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }

    .quote {
      position: relative;
      padding: 36px 28px 28px;
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: var(--radius-lg);
      display: flex;
      flex-direction: column;
      gap: 16px;
      transition: transform .3s var(--ease-out), box-shadow .3s;
    }
    .quote:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); }

    .q-no {
      font: 500 10.5px var(--font-mono);
      letter-spacing: 0.2em;
      color: var(--muted);
    }
    .mark {
      position: absolute;
      top: 24px;
      right: 24px;
      width: 32px; height: 32px;
      color: var(--accent);
      opacity: 0.2;
    }
    blockquote {
      margin: 0;
      font: 500 italic 18px/1.5 var(--font-display);
      font-variation-settings: "opsz" 144;
      color: var(--ink);
      letter-spacing: -0.01em;
    }
    blockquote::before { content: '\\201C'; margin-right: 2px; }
    blockquote::after  { content: '\\201D'; margin-left: 2px; }

    figcaption {
      display: flex;
      gap: 8px;
      font: 500 13.5px var(--font-body);
      color: var(--muted);
      font-style: normal;
      padding-top: 14px;
      border-top: 1px solid var(--line);
    }
    .dash { color: var(--accent); }

    .add-quote {
      border: 2px dashed var(--line-strong);
      background: transparent;
      cursor: pointer;
      align-items: center;
      justify-content: center;
      color: var(--muted);
      font: 500 14px var(--font-body);
      min-height: 220px;
    }
    .add-quote:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-soft); }
    .add-quote .plus { font: 300 44px/1 var(--font-display); color: var(--accent); display: block; margin-bottom: 8px; }

    .bio {
      display: grid;
      grid-template-columns: 180px 1fr;
      gap: 36px;
      align-items: center;
      margin-top: 56px;
      padding: 36px;
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: var(--radius-xl);
    }
    .avatar-wrap {
      width: 180px;
      border-radius: 50%;
      overflow: hidden;
    }
    .avatar-wrap ::ng-deep .slot {
      border-radius: 50% !important;
    }
    .bio-copy .eyebrow { margin-bottom: 10px; display: inline-flex; }
    .bio h3 {
      font: 500 42px/1 var(--font-display);
      font-variation-settings: "opsz" 144;
      margin: 0 0 14px;
      letter-spacing: -0.025em;
      font-weight: 500;
    }
    .bio h3 ::ng-deep em { font-style: italic; color: var(--accent); font-weight: 500; }
    .bio p {
      margin: 0;
      color: var(--muted);
      font-size: 16px;
      line-height: 1.65;
      max-width: 60ch;
    }

    @media (max-width: 820px) {
      .quotes { grid-template-columns: 1fr; }
      .bio { grid-template-columns: 1fr; text-align: center; padding: 28px; }
      .avatar-wrap { margin: 0 auto; }
      .bio p { margin: 0 auto; }
    }
  `]
})
export class TestimonialsComponent {
  readonly content = inject(ContentService);
  readonly admin   = inject(AdminService);

  pad(n: number): string { return n < 10 ? `0${n}` : String(n); }

  addTestimonial(): void {
    this.content.push('testimonials.items', this.content.newTestimonial());
  }
}
