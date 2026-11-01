import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AdminService } from '../services/admin.service';
import { ChartComponent } from './chart.component';
import { ChartEditorComponent } from './chart-editor.component';
import { ContentService } from '../services/content.service';
import { EditableComponent } from './editable.component';
import { UploadImageComponent } from './upload-image.component';

@Component({
  selector: 'app-results-lab',
  standalone: true,
  imports: [
    ChartComponent,
    ChartEditorComponent,
    EditableComponent,
    RouterLink,
    UploadImageComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="lab">
      <div class="wrap">
        <div class="section-head">
          <span class="eyebrow"><app-editable path="resultsLab.eyebrow" /></span>
          <h2><app-editable path="resultsLab.titleHtml" [html]="true" /></h2>
          <p class="lead"><app-editable path="resultsLab.lead" [multiline]="true" /></p>
        </div>

        <div class="scroll-row tabs" role="tablist">
          @for (ch of channels(); track ch.id; let i = $index) {
            <button class="tab-btn" role="tab" type="button"
                    [class.active]="active() === i" (click)="active.set(i)">
              {{ ch.name }}
            </button>
          }
          @if (admin.isAdmin()) {
            <button class="admin-add tab-add" type="button" (click)="addChannel()">
              <span class="plus">+</span> Add channel
            </button>
          }
        </div>

        <article class="panel admin-wrap">
          @if (admin.isAdmin() && channels().length > 1) {
            <button class="admin-remove channel-remove" type="button" title="Remove channel"
                    (click)="removeChannel()">×</button>
          }

          <header class="panel-head">
            <div class="brand-slot">
              <app-upload-image
                [storageKey]="'logo.' + current().id"
                [label]="'Add ' + current().name + ' logo'"
                aspect="3 / 2"
                [alt]="current().name + ' logo'" />
            </div>
            <div class="panel-title">
              <span class="label">Channel</span>
              <h3><app-editable [path]="'resultsLab.channels.' + active() + '.name'" /></h3>
              <div class="meta">
                {{ current().months.length }}-month snapshot · {{ current().chartSeries.length }} series tracked
              </div>
            </div>
          </header>

          <div class="kpis">
            @for (k of current().kpis; track $index; let i = $index) {
              <div class="kpi admin-wrap">
                @if (admin.isAdmin() && current().kpis.length > 1) {
                  <button class="admin-remove tiny" type="button" title="Remove KPI"
                          (click)="removeKpi(i)">×</button>
                }
                <span class="no">{{ pad(i + 1) }}</span>
                <strong><app-editable [path]="'resultsLab.channels.' + active() + '.kpis.' + i + '.value'" /></strong>
                <span class="lbl"><app-editable [path]="'resultsLab.channels.' + active() + '.kpis.' + i + '.label'" [multiline]="true" /></span>
              </div>
            }
            @if (admin.isAdmin()) {
              <button class="kpi kpi-add" type="button" (click)="addKpi()">
                <span class="plus">+</span>
                <span class="lbl">Add KPI</span>
              </button>
            }
          </div>

          <div class="split">
            <div class="table-wrap">
              <div class="table-head-label">Line items</div>
              <table>
                <thead>
                  <tr>
                    @for (h of current().tableHead; track $index; let hi = $index) {
                      <th class="admin-wrap">
                        <app-editable [path]="'resultsLab.channels.' + active() + '.tableHead.' + hi" />
                        @if (admin.isAdmin() && current().tableHead.length > 1) {
                          <button class="th-del" type="button" title="Remove column"
                                  (click)="removeColumn(hi)">×</button>
                        }
                      </th>
                    }
                    @if (admin.isAdmin()) {
                      <th class="add-th">
                        <button class="tiny-add" type="button" (click)="addColumn()">+</button>
                      </th>
                    }
                  </tr>
                </thead>
                <tbody>
                  @for (row of current().tableRows; track $index; let ri = $index) {
                    <tr class="admin-wrap">
                      @for (cell of row; track $index; let ci = $index) {
                        <td>
                          <app-editable [path]="'resultsLab.channels.' + active() + '.tableRows.' + ri + '.' + ci" />
                        </td>
                      }
                      @if (admin.isAdmin()) {
                        <td class="row-del-cell">
                          <button class="tiny-add" type="button" title="Remove row"
                                  (click)="removeRow(ri)">×</button>
                        </td>
                      }
                    </tr>
                  }
                  @if (admin.isAdmin()) {
                    <tr>
                      <td [attr.colspan]="current().tableHead.length + 1" class="add-row-cell">
                        <button class="admin-add row-add" type="button" (click)="addRow()">
                          <span class="plus">+</span> Add row
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>

            <div>
              <app-chart
                [title]="current().chartTitle"
                [series]="current().chartSeries"
                [months]="current().months"
                [unit]="current().unit"
                [note]="current().note" />

              @if (admin.isAdmin()) {
                <div class="chart-meta-edit">
                  <div class="field-row">
                    <span class="small-label">Title</span>
                    <app-editable [path]="'resultsLab.channels.' + active() + '.chartTitle'" />
                  </div>
                  <div class="field-row">
                    <span class="small-label">Unit</span>
                    <app-editable [path]="'resultsLab.channels.' + active() + '.unit'" placeholder="(none)" />
                  </div>
                  <div class="field-row">
                    <span class="small-label">Note</span>
                    <app-editable [path]="'resultsLab.channels.' + active() + '.note'" [multiline]="true" />
                  </div>
                </div>
                <app-chart-editor [channelIndex]="active()" />
              }
            </div>
          </div>

          <div class="panel-footer">
            <a class="btn outline" [routerLink]="['/gallery', current().id]">
              View all {{ current().name }} reports
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </a>
          </div>
        </article>
      </div>
    </section>
  `,
  styles: [`
    .tabs { margin-bottom: 28px; align-items: center; }
    .tab-add { margin-left: 4px; }

    .panel {
      padding: 36px;
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-sm);
      position: relative;
    }
    .channel-remove { top: 20px; right: 20px; }

    .panel-head {
      display: grid;
      grid-template-columns: 180px 1fr;
      gap: 28px;
      align-items: center;
      padding-bottom: 28px;
      border-bottom: 1px solid var(--line);
      margin-bottom: 28px;
    }
    .brand-slot { min-height: 120px; }
    .panel-title .label {
      font: 600 10.5px var(--font-mono);
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--muted);
    }
    .panel-title h3 {
      font: 500 44px/1 var(--font-display);
      font-variation-settings: "opsz" 144;
      letter-spacing: -0.02em;
      margin: 8px 0 6px;
    }
    .panel-title .meta {
      color: var(--muted);
      font-size: 13.5px;
    }

    .kpis {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      gap: 0;
      margin-bottom: 28px;
      border-top: 1px solid var(--line);
      border-bottom: 1px solid var(--line);
    }
    .kpi {
      padding: 24px 20px;
      border-right: 1px solid var(--line);
      position: relative;
    }
    .kpi:last-child { border-right: 0; }
    .kpi .no {
      font: 500 10.5px var(--font-mono);
      letter-spacing: 0.2em;
      color: var(--muted);
      display: block;
      margin-bottom: 10px;
    }
    .kpi strong {
      display: block;
      font: 500 36px/1 var(--font-display);
      font-variation-settings: "opsz" 144;
      color: var(--accent);
      letter-spacing: -0.02em;
    }
    .kpi .lbl {
      font-size: 13px;
      color: var(--muted);
      display: block;
      margin-top: 8px;
      line-height: 1.4;
    }
    .admin-remove.tiny { width: 22px; height: 22px; font-size: 16px; top: 6px; right: 6px; }

    .kpi-add {
      padding: 24px 20px;
      border: 2px dashed var(--line-strong);
      background: transparent;
      cursor: pointer;
      transition: all .2s var(--ease-out);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      color: var(--muted);
    }
    .kpi-add:hover { background: var(--accent-soft); border-color: var(--accent); color: var(--accent); }
    .kpi-add .plus { font: 300 32px/1 var(--font-display); color: var(--accent); }

    .split {
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      gap: 20px;
      align-items: start;
    }

    .table-wrap {
      background: var(--surface-2);
      border: 1px solid var(--line);
      border-radius: var(--radius-md);
      overflow: hidden;
    }
    .table-head-label {
      padding: 14px 18px;
      font: 600 10.5px var(--font-mono);
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--muted);
      border-bottom: 1px solid var(--line);
      background: var(--surface);
    }
    table { border-collapse: collapse; width: 100%; font-size: 14px; }
    th, td {
      text-align: left;
      padding: 13px 18px;
      border-bottom: 1px solid var(--line);
      position: relative;
    }
    th {
      font: 600 11px var(--font-mono);
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--muted);
      background: var(--surface);
    }
    tbody tr:last-child td { border-bottom: 0; }
    tbody tr:not(.admin-add):hover { background: var(--accent-soft); }

    .th-del, .tiny-add {
      border: 0;
      background: transparent;
      color: var(--muted);
      cursor: pointer;
      border-radius: 50%;
      width: 20px; height: 20px;
      font: 300 16px/1 var(--font-body);
      transition: background-color .18s, color .18s;
    }
    .th-del:hover { background: var(--bad); color: var(--paper); }
    .tiny-add:hover { background: var(--accent-soft); color: var(--accent); }
    .add-th { width: 32px; padding: 6px; text-align: center; }
    .row-del-cell { width: 32px; padding: 6px; text-align: center; }
    .add-row-cell { padding: 10px 18px; background: var(--surface); border-bottom: 0; }
    .row-add { font-size: 12px; padding: 8px 14px; }

    .chart-meta-edit {
      margin-top: 14px;
      padding: 14px;
      background: var(--surface-2);
      border: 1px dashed var(--line-strong);
      border-radius: var(--radius-md);
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .field-row { display: flex; align-items: center; gap: 12px; font-size: 13.5px; }
    .small-label {
      flex: 0 0 44px;
      font: 600 10.5px var(--font-mono);
      letter-spacing: 0.14em;
      color: var(--muted);
    }

    .panel-footer {
      margin-top: 28px;
      padding-top: 24px;
      border-top: 1px dashed var(--line);
    }

    @media (max-width: 820px) {
      .panel { padding: 26px; }
      .panel-head { grid-template-columns: 1fr; gap: 20px; }
      .brand-slot { min-height: auto; max-width: 160px; }
      .kpis { grid-template-columns: 1fr 1fr; }
      .split { grid-template-columns: 1fr; }
    }
  `]
})
export class ResultsLabComponent {
  readonly content = inject(ContentService);
  readonly admin   = inject(AdminService);

  readonly active   = signal(0);
  readonly channels = computed(() => this.content.resultsLab().channels);
  readonly current  = computed(() => {
    const ch = this.channels()[this.active()];
    return ch ?? this.channels()[0]!;
  });

  pad(n: number): string { return n < 10 ? `0${n}` : String(n); }

  addKpi(): void {
    this.content.push(`resultsLab.channels.${this.active()}.kpis`, this.content.newKpi());
  }
  removeKpi(index: number): void {
    this.content.removeAt(`resultsLab.channels.${this.active()}.kpis`, index);
  }

  addColumn(): void {
    const i = this.active();
    const head = [...this.current().tableHead, 'New'];
    const rows = this.current().tableRows.map((r) => [...r, '-']);
    this.content.set(`resultsLab.channels.${i}.tableHead`, head);
    this.content.set(`resultsLab.channels.${i}.tableRows`, rows);
  }
  removeColumn(colIndex: number): void {
    const i = this.active();
    const head = this.current().tableHead.filter((_, j) => j !== colIndex);
    const rows = this.current().tableRows.map((r) => r.filter((_, j) => j !== colIndex));
    this.content.set(`resultsLab.channels.${i}.tableHead`, head);
    this.content.set(`resultsLab.channels.${i}.tableRows`, rows);
  }

  addRow(): void {
    const i = this.active();
    const row = this.current().tableHead.map(() => '-');
    this.content.push(`resultsLab.channels.${i}.tableRows`, row);
  }
  removeRow(rowIndex: number): void {
    this.content.removeAt(`resultsLab.channels.${this.active()}.tableRows`, rowIndex);
  }

  addChannel(): void {
    this.content.push('resultsLab.channels', this.content.newChannel());
    this.active.set(this.channels().length - 1);
  }
  removeChannel(): void {
    const idx = this.active();
    this.content.removeAt('resultsLab.channels', idx);
    this.active.set(Math.max(0, idx - 1));
  }
}
