import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ContentService } from '../services/content.service';

/**
 * Admin-only editor for a channel's chart data (months + series + values).
 * Rendered beneath the chart in Results Lab when the admin is signed in.
 */
@Component({
  selector: 'app-chart-editor',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="editor">
      <div class="editor-head">
        <span class="label">Chart data</span>
        <div class="editor-actions">
          <button type="button" class="mini" (click)="content.addMonth(channelIndex())">
            + Column
          </button>
          <button type="button" class="mini" (click)="addSeries()">
            + Series
          </button>
        </div>
      </div>

      <div class="editor-table">
        <table>
          <thead>
            <tr>
              <th class="series-name-head">Series</th>
              @for (m of months(); track $index; let mi = $index) {
                <th>
                  <input class="cell month" type="text" [ngModel]="m"
                         (ngModelChange)="setMonth(mi, $event)">
                  @if (months().length > 2) {
                    <button type="button" class="col-del" title="Remove column"
                            (click)="content.removeMonth(channelIndex(), mi)">×</button>
                  }
                </th>
              }
            </tr>
          </thead>
          <tbody>
            @for (s of series(); track $index; let si = $index) {
              <tr>
                <td class="series-name">
                  <input class="cell" type="text" [ngModel]="s.name"
                         (ngModelChange)="setSeriesName(si, $event)">
                  @if (series().length > 1) {
                    <button type="button" class="row-del" title="Remove series"
                            (click)="removeSeries(si)">×</button>
                  }
                </td>
                @for (v of s.values; track $index; let vi = $index) {
                  <td>
                    <input class="cell num" type="number" step="any"
                           [ngModel]="v" (ngModelChange)="setValue(si, vi, $event)">
                  </td>
                }
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .editor {
      margin-top: 18px;
      padding: 16px;
      background: var(--surface-2);
      border: 1px dashed var(--line-strong);
      border-radius: var(--radius-md);
    }
    .editor-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      gap: 8px;
      flex-wrap: wrap;
    }
    .label {
      font: 600 10.5px var(--font-mono);
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--accent);
    }
    .editor-actions { display: flex; gap: 8px; }
    .mini {
      padding: 6px 12px;
      border-radius: 99px;
      border: 1px solid var(--line-strong);
      background: var(--surface);
      color: var(--ink);
      font: 600 11.5px var(--font-mono);
      letter-spacing: 0.1em;
      cursor: pointer;
      transition: all .2s var(--ease-out);
    }
    .mini:hover { background: var(--accent-soft); border-color: var(--accent); color: var(--accent); }

    .editor-table {
      overflow-x: auto;
      border-radius: var(--radius-sm);
      background: var(--surface);
      border: 1px solid var(--line);
    }
    table { border-collapse: collapse; width: 100%; font-size: 13px; }
    th, td {
      padding: 6px;
      border-bottom: 1px solid var(--line);
      border-right: 1px solid var(--line);
      position: relative;
      vertical-align: middle;
    }
    th:last-child, td:last-child { border-right: 0; }
    tr:last-child td { border-bottom: 0; }
    th {
      background: var(--surface-2);
      font: 600 11px var(--font-mono);
      letter-spacing: 0.08em;
      color: var(--muted);
    }
    .series-name-head { min-width: 110px; }

    .cell {
      width: 100%;
      min-width: 70px;
      padding: 6px 8px;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 6px;
      font: 500 13px var(--font-body);
      color: var(--ink);
      outline: none;
    }
    .cell:focus {
      background: var(--paper-2);
      border-color: var(--accent);
    }
    .cell.num { text-align: right; font-variant-numeric: tabular-nums; }
    .cell.month { font-weight: 600; text-align: center; }

    .col-del, .row-del {
      position: absolute;
      top: 2px; right: 2px;
      width: 16px; height: 16px;
      border-radius: 50%;
      border: 0;
      background: var(--ink);
      color: var(--paper);
      font: 300 14px/1 var(--font-body);
      cursor: pointer;
      opacity: 0;
      transition: opacity .15s, background-color .2s;
    }
    th:hover .col-del, td.series-name:hover .row-del { opacity: 1; }
    .col-del:hover, .row-del:hover { background: var(--bad); }
  `]
})
export class ChartEditorComponent {
  readonly channelIndex = input.required<number>();
  readonly content = inject(ContentService);

  private channel() {
    return this.content.resultsLab().channels[this.channelIndex()]!;
  }

  months()  { return this.channel().months; }
  series()  { return this.channel().chartSeries; }

  setMonth(index: number, value: string): void {
    this.content.set(`resultsLab.channels.${this.channelIndex()}.months.${index}`, value);
  }

  setSeriesName(seriesIndex: number, value: string): void {
    this.content.set(
      `resultsLab.channels.${this.channelIndex()}.chartSeries.${seriesIndex}.name`,
      value
    );
  }

  setValue(seriesIndex: number, valueIndex: number, value: number): void {
    const num = typeof value === 'number' ? value : Number(value) || 0;
    this.content.set(
      `resultsLab.channels.${this.channelIndex()}.chartSeries.${seriesIndex}.values.${valueIndex}`,
      num
    );
  }

  addSeries(): void {
    this.content.push(
      `resultsLab.channels.${this.channelIndex()}.chartSeries`,
      this.content.newSeries(this.months().length)
    );
  }

  removeSeries(index: number): void {
    this.content.removeAt(`resultsLab.channels.${this.channelIndex()}.chartSeries`, index);
  }
}
