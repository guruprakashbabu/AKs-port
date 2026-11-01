import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AdminService } from '../services/admin.service';
import { ContentService } from '../services/content.service';
import { EditableComponent } from './editable.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [EditableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="hero" id="top">
      <div class="hero-bg" aria-hidden="true"></div>

      <div class="wrap hero-grid">
        <div class="hero-copy">
          <div class="meta-row">
            <span class="eyebrow"><app-editable path="hero.eyebrow" /></span>
            <span class="dot" aria-hidden="true">·</span>
            <span class="meta"><app-editable path="hero.meta" /></span>
          </div>

          <h1><app-editable path="hero.headlineHtml" [html]="true" /></h1>

          <p class="sub"><app-editable path="hero.sub" [multiline]="true" /></p>

          <div class="actions">
            <a class="btn primary" [href]="content.hero().primaryBtnHref">
              <app-editable path="hero.primaryBtnText" />
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </a>
            <a class="btn ghost" [href]="content.hero().ghostBtnHref">
              <app-editable path="hero.ghostBtnText" />
            </a>
          </div>

          <div class="footnote">
            <span class="tick">—</span>
            <app-editable path="hero.footnote" [multiline]="true" />
          </div>
        </div>

        <aside class="hero-stats">
          <div class="stats-head">
            <span class="label"><app-editable path="hero.statsHeading" /></span>
            <span class="label label-note"><app-editable path="hero.statsNote" /></span>
          </div>

          <div class="stats-grid">
            @for (s of content.hero().stats; track $index; let i = $index) {
              <div class="stat admin-wrap">
                @if (admin.isAdmin()) {
                  <button class="admin-remove" type="button" title="Remove stat"
                          (click)="content.removeAt('hero.stats', i)">×</button>
                }
                <div class="stat-no">{{ pad(i + 1) }}</div>
                <strong><app-editable [path]="'hero.stats.' + i + '.value'" /></strong>
                <span><app-editable [path]="'hero.stats.' + i + '.label'" [multiline]="true" /></span>
              </div>
            }
          </div>

          @if (admin.isAdmin()) {
            <div class="stats-actions">
              <button class="admin-add" type="button" (click)="addStat()">
                <span class="plus">+</span> Add stat
              </button>
            </div>
          }
        </aside>
      </div>

      <div class="scroll-hint">
        <span>Scroll</span>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      position: relative;
      padding: 20px 0 80px;
      overflow: hidden;
      isolation: isolate;
    }
    .hero-bg {
      position: absolute;
      inset: 0;
      z-index: -1;
      background:
        radial-gradient(circle at 15% 20%, var(--accent-soft) 0%, transparent 50%),
        radial-gradient(circle at 85% 80%, var(--sage-soft) 0%, transparent 50%);
      opacity: 0.6;
    }

    .hero-grid {
      display: grid;
      grid-template-columns: 1.3fr 0.9fr;
      gap: 72px;
      align-items: start;
      padding-top: 56px;
    }

    .meta-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }
    .meta-row .dot { color: var(--muted); font-weight: 500; }
    .meta-row .meta {
      font: 500 11.5px var(--font-mono);
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--muted);
    }
    .meta-row .eyebrow { margin: 0; }

    h1 {
      font-size: clamp(44px, 7.2vw, 92px);
      line-height: 1;
      font-weight: 500;
      letter-spacing: -0.03em;
      font-variation-settings: "opsz" 144;
      color: var(--ink);
      margin-bottom: 28px;
    }
    h1 ::ng-deep em {
      font-style: italic;
      font-weight: 500;
      color: var(--accent);
      position: relative;
    }
    h1 ::ng-deep em::after {
      content: '';
      position: absolute;
      left: -4px; right: -4px;
      bottom: 4px;
      height: 10px;
      background: var(--accent-soft);
      z-index: -1;
      border-radius: 2px;
      transform: skew(-6deg);
    }

    .sub {
      color: var(--ink-2);
      max-width: 54ch;
      margin: 0 0 36px;
      font-size: 18.5px;
      line-height: 1.6;
    }

    .actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 48px;
    }

    .footnote {
      display: flex;
      align-items: baseline;
      gap: 12px;
      padding-top: 24px;
      border-top: 1px solid var(--line);
      font: 500 13.5px var(--font-body);
      color: var(--muted);
      max-width: 50ch;
      line-height: 1.5;
    }
    .footnote .tick { color: var(--accent); font-family: var(--font-display); font-weight: 500; }

    .hero-stats {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: var(--radius-xl);
      padding: 32px;
      position: sticky;
      top: 96px;
      box-shadow: var(--shadow-sm);
    }

    .stats-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 18px;
      border-bottom: 1px solid var(--line);
    }
    .label {
      font: 600 11px var(--font-mono);
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--muted);
    }
    .label-note { color: var(--sage); }

    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0;
    }
    .stat {
      padding: 20px 16px;
      position: relative;
      border-right: 1px solid var(--line);
      border-bottom: 1px solid var(--line);
    }
    .stat:nth-child(2n) { border-right: 0; }
    .stat-no {
      font: 500 10.5px var(--font-mono);
      letter-spacing: 0.2em;
      color: var(--muted);
      margin-bottom: 8px;
    }
    .stat strong {
      display: block;
      font: 500 clamp(32px, 4.4vw, 46px)/1 var(--font-display);
      font-variation-settings: "opsz" 144;
      color: var(--accent);
      letter-spacing: -0.02em;
      margin-bottom: 6px;
    }
    .stat span {
      font-size: 13px;
      color: var(--muted);
      display: block;
      line-height: 1.4;
    }

    .stats-actions { margin-top: 18px; display: flex; justify-content: center; }

    .scroll-hint {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      position: absolute;
      left: 32px;
      bottom: 20px;
      font: 500 11px var(--font-mono);
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--muted);
    }
    .scroll-hint svg { animation: bob 2.2s infinite ease-in-out; }
    @keyframes bob { 50% { transform: translateY(4px); } }

    @media (max-width: 920px) {
      .hero-grid { grid-template-columns: 1fr; gap: 36px; padding-top: 28px; }
      .hero-stats { position: static; }
      .scroll-hint { display: none; }
    }
    @media (max-width: 520px) {
      .hero-stats { padding: 22px; }
      .actions .btn { flex: 1; min-width: 140px; }
    }
  `]
})
export class HeroComponent {
  readonly content = inject(ContentService);
  readonly admin   = inject(AdminService);

  pad(n: number): string { return n < 10 ? `0${n}` : String(n); }

  addStat(): void {
    this.content.push('hero.stats', this.content.newHeroStat());
  }
}
