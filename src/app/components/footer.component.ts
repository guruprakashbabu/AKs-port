import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ContentService } from '../services/content.service';
import { EditableComponent } from './editable.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [EditableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer>
      <div class="wrap">
        <div class="top">
          <div class="brand">
            <span class="brand-mark">A</span>
            <div>
              <strong><app-editable path="footer.brand" /></strong>
              <small><app-editable path="footer.brandSub" /></small>
            </div>
          </div>

          <nav aria-label="Footer">
            <a href="#cases">Cases</a>
            <a href="#lab">Results Lab</a>
            <a href="#recent">Recent</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>

        <div class="divider"></div>

        <div class="bottom">
          <div class="copy">© {{ year }} <app-editable path="footer.copyright" /></div>
          <div class="contacts">
            <a [href]="content.footer().emailHref"><app-editable path="footer.emailText" /></a>
            <span class="dot">·</span>
            <a [href]="content.footer().whatsappHref" target="_blank" rel="noopener">
              <app-editable path="footer.whatsappText" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    footer {
      padding: 48px 0 36px;
      background: var(--surface);
      color: var(--muted);
      font-size: 14px;
    }
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 32px;
      margin-bottom: 28px;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .brand-mark {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 38px; height: 38px;
      border-radius: 11px;
      background: var(--ink);
      color: var(--paper);
      font: 800 20px var(--font-display);
      font-variation-settings: "opsz" 144;
    }
    .brand strong {
      display: block;
      color: var(--ink);
      font: 600 15px var(--font-body);
    }
    .brand small {
      display: block;
      font: 500 11.5px var(--font-mono);
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--muted);
      margin-top: 3px;
    }

    nav {
      display: flex;
      gap: 24px;
      align-items: center;
    }
    nav a {
      color: var(--muted);
      font: 500 14px var(--font-body);
      transition: color .2s;
    }
    nav a:hover { color: var(--accent); }

    .divider { height: 1px; background: var(--line); }

    .bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 24px;
      flex-wrap: wrap;
      gap: 12px;
      font-size: 13px;
    }
    .contacts { display: inline-flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    .contacts a { color: var(--ink-2); transition: color .2s; }
    .contacts a:hover { color: var(--accent); }
    .contacts .dot { color: var(--line-strong); }

    @media (max-width: 720px) {
      .top { flex-direction: column; align-items: flex-start; gap: 20px; }
      nav { flex-wrap: wrap; gap: 16px; }
    }
  `]
})
export class FooterComponent {
  readonly content = inject(ContentService);
  readonly year = new Date().getFullYear();
}
