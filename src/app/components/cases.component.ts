import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { AdminService } from '../services/admin.service';
import { ContentService } from '../services/content.service';
import { EditableComponent } from './editable.component';

@Component({
  selector: 'app-cases',
  standalone: true,
  imports: [EditableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="cases">
      <div class="wrap">
        <div class="section-head">
          <span class="eyebrow"><app-editable path="cases.eyebrow" /></span>
          <h2><app-editable path="cases.titleHtml" [html]="true" /></h2>
          <p class="lead"><app-editable path="cases.lead" [html]="true" [multiline]="true" /></p>
        </div>

        <div class="scroll-row filters" role="tablist">
          @for (f of filters(); track f) {
            <button class="chip" type="button" [class.active]="activeFilter() === f" (click)="filter.set(f)">
              {{ f }}
              <span class="count">{{ countOf(f) }}</span>
            </button>
          }
        </div>

        <div class="cases-grid">
          @for (c of filteredCases(); track trackCase($index, c); let i = $index) {
            @let realIndex = indexOf(c);
            <article class="case admin-wrap">
              @if (admin.isAdmin()) {
                <button class="admin-remove" type="button" title="Remove case"
                        (click)="content.removeAt('cases.items', realIndex)">×</button>
              }
              <div class="case-no">N° {{ pad(i + 1) }}</div>

              <header>
                <span class="segment"><app-editable [path]="'cases.items.' + realIndex + '.category'" /></span>
                <span class="source" [attr.data-source]="c.source">
                  <app-editable [path]="'cases.items.' + realIndex + '.source'" />
                </span>
              </header>

              <div class="headline"><app-editable [path]="'cases.items.' + realIndex + '.headline'" /></div>
              <div class="subhead"><app-editable [path]="'cases.items.' + realIndex + '.subhead'" /></div>

              <div class="rule"></div>

              <h3><app-editable [path]="'cases.items.' + realIndex + '.channel'" /></h3>
              <div class="client">For a <app-editable [path]="'cases.items.' + realIndex + '.client'" /></div>

              <dl>
                <dt>Problem</dt>
                <dd><app-editable [path]="'cases.items.' + realIndex + '.problem'" [multiline]="true" /></dd>
                <dt>Fix</dt>
                <dd><app-editable [path]="'cases.items.' + realIndex + '.fix'" [multiline]="true" /></dd>
                <dt>Result</dt>
                <dd><app-editable [path]="'cases.items.' + realIndex + '.result'" [multiline]="true" /></dd>
              </dl>
            </article>
          }
        </div>

        @if (admin.isAdmin()) {
          <div class="add-wrap">
            <button class="admin-add" type="button" (click)="addCase()">
              <span class="plus">+</span> Add case study
            </button>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .filters { margin-bottom: 36px; }
    .chip .count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 20px;
      height: 20px;
      padding: 0 6px;
      border-radius: 99px;
      background: var(--line);
      font: 600 11px var(--font-mono);
      color: var(--muted);
      margin-left: 8px;
    }
    .chip.active .count { background: rgba(255,255,255,0.2); color: var(--paper); }

    .cases-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    .case {
      position: relative;
      padding: 36px 32px 32px;
      border: 1px solid var(--line);
      border-radius: var(--radius-lg);
      background: var(--surface);
      transition: transform .3s var(--ease-out), box-shadow .3s;
      overflow: hidden;
    }
    .case::before {
      content: '';
      position: absolute;
      top: 0; left: 0;
      width: 4px; height: 60px;
      background: var(--accent);
      border-radius: 0 4px 4px 0;
      transition: height .3s var(--ease-out);
    }
    .case:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-md);
    }
    .case:hover::before { height: 100%; }

    .case-no {
      position: absolute;
      top: 20px;
      right: 24px;
      font: 500 11px var(--font-mono);
      letter-spacing: 0.2em;
      color: var(--muted);
    }

    header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 24px;
    }
    .segment {
      font: 600 10.5px var(--font-mono);
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--sage);
      padding: 5px 12px;
      border-radius: 99px;
      background: var(--sage-soft);
    }
    .source {
      font: 600 10.5px var(--font-mono);
      letter-spacing: 0.18em;
      text-transform: uppercase;
      padding: 5px 10px;
      border-radius: 99px;
      background: var(--surface-2);
      color: var(--muted);
    }
    .source[data-source="Measured"]  { background: color-mix(in srgb, var(--ok) 18%, transparent); color: var(--ok); }
    .source[data-source="Estimated"] { background: var(--gold-soft); color: var(--gold); }

    .headline {
      font: 500 clamp(56px, 7vw, 76px)/0.95 var(--font-display);
      font-variation-settings: "opsz" 144;
      color: var(--accent);
      letter-spacing: -0.03em;
    }
    .subhead {
      color: var(--muted);
      font-size: 13.5px;
      margin: 10px 0 20px;
    }

    .rule { height: 1px; background: var(--line); margin: 0 0 20px; }

    .case h3 {
      font: 500 22px/1.2 var(--font-display);
      font-variation-settings: "opsz" 144;
      margin: 0 0 6px;
      color: var(--ink);
      font-weight: 500;
    }
    .client {
      font: 500 13.5px var(--font-body);
      color: var(--muted);
      margin-bottom: 18px;
      font-style: italic;
    }

    dl {
      display: grid;
      grid-template-columns: 72px 1fr;
      row-gap: 10px;
      column-gap: 16px;
      margin: 0;
    }
    dt {
      font: 600 10.5px var(--font-mono);
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--muted);
      padding-top: 4px;
    }
    dd {
      margin: 0;
      color: var(--ink-2);
      font-size: 14.5px;
      line-height: 1.6;
    }

    .add-wrap {
      margin-top: 28px;
      display: flex;
      justify-content: center;
    }

    @media (max-width: 820px) {
      .cases-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 520px) {
      .case { padding: 28px 24px 24px; }
      .headline { font-size: 52px; }
      dl { grid-template-columns: 60px 1fr; }
    }
  `]
})
export class CasesComponent {
  readonly content = inject(ContentService);
  readonly admin   = inject(AdminService);

  readonly filter  = signal<string | null>(null);
  readonly filters = computed(() => this.content.caseFilters());

  /** Current filter, falling back to the first available category. */
  readonly activeFilter = computed(() => {
    const chosen = this.filter();
    const list = this.filters();
    if (chosen && list.includes(chosen)) return chosen;
    return list[0] ?? null;
  });

  readonly filteredCases = computed(() => {
    const f = this.activeFilter();
    const items = this.content.cases().items;
    return f ? items.filter((c) => c.category === f) : items;
  });

  countOf(category: string): number {
    return this.content.cases().items.filter((c) => c.category === category).length;
  }

  indexOf(item: unknown): number {
    return this.content.cases().items.indexOf(item as never);
  }

  trackCase(index: number, item: { client: string }): string {
    return `${index}-${item.client}`;
  }

  pad(n: number): string { return n < 10 ? `0${n}` : String(n); }

  addCase(): void {
    this.content.push('cases.items', this.content.newCase());
  }
}
