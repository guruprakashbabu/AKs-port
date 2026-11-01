import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ContentService } from '../services/content.service';
import { EditableComponent } from './editable.component';

@Component({
  selector: 'app-contact-cta',
  standalone: true,
  imports: [EditableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="contact">
      <div class="wrap">
        <div class="cta">
          <div class="cta-bg" aria-hidden="true">
            <div class="glow"></div>
            <div class="grid-lines"></div>
          </div>
          <div class="cta-copy">
            <span class="eyebrow light"><app-editable path="contact.eyebrow" /></span>
            <h2><app-editable path="contact.titleHtml" [html]="true" /></h2>
            <p><app-editable path="contact.sub" [multiline]="true" /></p>
            <div class="actions">
              <a class="btn cta-primary" [href]="content.contact().emailHref">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M22 6l-10 7L2 6"/>
                </svg>
                <app-editable path="contact.emailText" />
              </a>
              <a class="btn cta-ghost" [href]="content.contact().whatsappHref" target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                  <path d="M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.47 0 .13 5.34.13 11.91c0 2.1.55 4.14 1.6 5.95L0 24l6.3-1.66a11.86 11.86 0 0 0 5.74 1.47h.01c6.57 0 11.91-5.34 11.91-11.91 0-3.18-1.24-6.17-3.44-8.42zM12.04 21.8h-.01a9.89 9.89 0 0 1-5.04-1.38l-.36-.22-3.74.98 1-3.64-.24-.37a9.86 9.86 0 0 1-1.52-5.26c0-5.46 4.45-9.9 9.9-9.9 2.65 0 5.13 1.03 7 2.9a9.84 9.84 0 0 1 2.9 7c0 5.46-4.44 9.9-9.9 9.9z"/>
                </svg>
                <app-editable path="contact.whatsappText" />
              </a>
            </div>
          </div>

          <div class="cta-aside">
            <span class="aside-label"><app-editable path="contact.addressLabel" /></span>
            <div class="addr"><app-editable path="contact.addressHtml" [html]="true" [multiline]="true" /></div>
            <div class="rule-light"></div>
            <span class="aside-label"><app-editable path="contact.hoursLabel" /></span>
            <div class="addr"><app-editable path="contact.hours" /></div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .cta {
      position: relative;
      background: var(--ink);
      color: var(--paper);
      border-radius: var(--radius-xl);
      padding: 72px 60px;
      overflow: hidden;
      isolation: isolate;
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 48px;
      align-items: center;
    }
    .cta-bg { position: absolute; inset: 0; z-index: -1; }
    .glow {
      position: absolute;
      left: -120px; top: -120px;
      width: 480px; height: 480px;
      border-radius: 50%;
      background: var(--accent);
      opacity: 0.35;
      filter: blur(100px);
    }
    .grid-lines {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(243, 236, 220, 0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(243, 236, 220, 0.04) 1px, transparent 1px);
      background-size: 44px 44px;
      mask-image: radial-gradient(ellipse at 70% 50%, #000 30%, transparent 75%);
      -webkit-mask-image: radial-gradient(ellipse at 70% 50%, #000 30%, transparent 75%);
    }

    .cta-copy { max-width: 56ch; }
    .cta h2 {
      font-size: clamp(36px, 5vw, 56px);
      font-weight: 500;
      margin: 10px 0 20px;
      color: var(--paper);
      font-variation-settings: "opsz" 144;
    }
    .cta h2 ::ng-deep em { font-style: italic; color: var(--accent); font-weight: 500; }
    .cta p {
      opacity: 0.85;
      font-size: 17px;
      line-height: 1.6;
      margin: 0 0 32px;
    }

    .eyebrow.light { color: var(--accent); }
    .eyebrow.light::before { background: var(--accent); }

    .actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    .btn.cta-primary {
      background: var(--accent);
      color: var(--paper);
      border-color: var(--accent);
    }
    .btn.cta-primary:hover { background: var(--accent-2); border-color: var(--accent-2); }
    .btn.cta-ghost {
      background: transparent;
      color: var(--paper);
      border: 1px solid rgba(243, 236, 220, 0.3);
    }
    .btn.cta-ghost:hover { background: rgba(243, 236, 220, 0.1); border-color: var(--paper); }

    .cta-aside {
      padding-left: 32px;
      border-left: 1px solid rgba(243, 236, 220, 0.15);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .aside-label {
      font: 600 11px var(--font-mono);
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--accent);
    }
    .addr {
      font: 500 italic 20px/1.4 var(--font-display);
      font-variation-settings: "opsz" 144;
      color: var(--paper);
      font-weight: 500;
    }
    .rule-light {
      height: 1px;
      background: rgba(243, 236, 220, 0.15);
      margin: 16px 0 8px;
    }

    @media (max-width: 820px) {
      .cta { padding: 44px 32px; grid-template-columns: 1fr; gap: 32px; }
      .cta-aside { padding-left: 0; padding-top: 24px; border-left: 0; border-top: 1px solid rgba(243, 236, 220, 0.15); }
    }
    @media (max-width: 520px) {
      .actions .btn { flex: 1; min-width: 100%; }
    }
  `]
})
export class ContactCtaComponent {
  readonly content = inject(ContentService);
}
