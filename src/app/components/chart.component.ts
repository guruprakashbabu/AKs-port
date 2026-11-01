import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

import { SeriesPoint } from '../models/types';

const WIDTH = 580;
const HEIGHT = 300;
const PAD = { left: 46, right: 20, top: 16, bottom: 36 };
const COLORS = ['var(--accent)', 'var(--sage)', 'var(--gold)', 'var(--ok)'];

interface Point { x: number; y: number; }

function niceStep(x: number): number {
  if (x <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(x)));
  const n = x / pow;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * pow;
}

function format(v: number): string {
  return v >= 1000 ? (v / 1000).toFixed(v % 1000 ? 1 : 0).replace(/\.0$/, '') + 'k' : String(v);
}

@Component({
  selector: 'app-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="chart">
      <h4>{{ title() }}</h4>
      <div class="legend">
        @for (s of series(); track s.name; let i = $index) {
          <span>
            <i [style.background]="colorFor(i)"></i>
            {{ s.name }}
          </span>
        }
      </div>

      <div class="plot" (pointerleave)="hover.set(null)">
        <svg [attr.viewBox]="viewBox" role="img" [attr.aria-label]="title()"
             (pointermove)="onMove($event)" (pointerdown)="onMove($event)">
          @for (y of gridLines(); track $index) {
            <line class="grid" [attr.x1]="padLeft" [attr.x2]="width - padRight"
                  [attr.y1]="y.y" [attr.y2]="y.y"/>
            <text class="axis" [attr.x]="padLeft - 8" [attr.y]="y.y + 4" text-anchor="end">
              {{ y.label }}
            </text>
          }
          @for (m of months(); track $index; let i = $index) {
            <text class="axis" [attr.x]="xFor(i)" [attr.y]="height - 10" text-anchor="middle">{{ m }}</text>
          }
          @for (s of series(); track s.name; let si = $index) {
            <path [attr.d]="pathFor(si)" fill="none"
                  [attr.stroke]="colorFor(si)"
                  stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            @for (p of pointsFor(si); track $index) {
              <circle [attr.cx]="p.x" [attr.cy]="p.y" r="4"
                      fill="var(--surface)"
                      [attr.stroke]="colorFor(si)" stroke-width="2.4"/>
            }
          }
          @if (hover() !== null) {
            <line [attr.x1]="xFor(hover() ?? 0)" [attr.x2]="xFor(hover() ?? 0)"
                  [attr.y1]="padTop" [attr.y2]="height - padBottom" class="cursor"/>
          }
        </svg>

        @if (hover() !== null) {
          <div class="tooltip">
            <strong>{{ months()[hover() ?? 0] }}</strong>
            @for (s of series(); track s.name; let i = $index) {
              <div>
                <span class="dot" [style.background]="colorFor(i)"></span>
                {{ s.name }}: {{ formatValue(s.values[hover() ?? 0]) }}{{ unit() }}
              </div>
            }
          </div>
        }
      </div>

      @if (note()) {
        <p class="note">{{ note() }}</p>
      }
    </div>
  `,
  styles: [`
    .chart {
      background: var(--surface);
      border: 1px solid var(--line);
      border-radius: var(--radius-md);
      padding: 20px;
      box-shadow: var(--shadow-sm);
    }
    h4 { font-size: 17px; margin: 0 0 8px; font-weight: 500; font-family: var(--font-display); }
    .legend {
      display: flex;
      gap: 18px;
      flex-wrap: wrap;
      font-size: 13.5px;
      color: var(--muted);
      margin-bottom: 6px;
    }
    .legend i {
      display: inline-block;
      width: 18px;
      height: 3px;
      border-radius: 2px;
      margin-right: 6px;
      vertical-align: middle;
    }
    .plot { position: relative; }
    svg { width: 100%; height: auto; display: block; touch-action: none; }
    .grid { stroke: var(--line); }
    .axis { fill: var(--muted); font: 12px var(--font-body); }
    .cursor { stroke: var(--line-strong); stroke-dasharray: 4 4; }

    .tooltip {
      position: absolute;
      top: 10px;
      right: 10px;
      pointer-events: none;
      background: var(--ink);
      color: var(--paper);
      padding: 10px 12px;
      border-radius: 10px;
      font-size: 13px;
      box-shadow: var(--shadow-md);
      min-width: 150px;
    }
    .tooltip strong {
      display: block;
      margin-bottom: 6px;
      font: 700 13px var(--font-display);
    }
    .tooltip > div { display: flex; align-items: center; gap: 7px; margin-top: 3px; }
    .tooltip .dot { width: 8px; height: 8px; border-radius: 50%; }

    .note {
      margin: 10px 0 0;
      font-size: 12.5px;
      color: var(--muted);
    }
  `]
})
export class ChartComponent {
  readonly title  = input.required<string>();
  readonly series = input.required<SeriesPoint[]>();
  readonly months = input.required<string[]>();
  readonly unit   = input<string>('');
  readonly note   = input<string>('');

  readonly hover = signal<number | null>(null);

  readonly width = WIDTH;
  readonly height = HEIGHT;
  readonly padLeft = PAD.left;
  readonly padRight = PAD.right;
  readonly padTop = PAD.top;
  readonly padBottom = PAD.bottom;
  readonly viewBox = `0 0 ${WIDTH} ${HEIGHT}`;

  private readonly axis = computed(() => {
    const values = this.series().flatMap((s) => s.values);
    const max = values.length ? Math.max(...values) : 1;
    const step = niceStep(max / 4);
    const top = step * Math.ceil(max / step || 1);
    return { step, top: top || step };
  });

  readonly gridLines = computed(() => {
    const { step, top } = this.axis();
    const count = Math.max(1, Math.round(top / step));
    const lines: { y: number; label: string }[] = [];
    for (let i = 0; i <= count; i++) {
      const value = i * step;
      lines.push({ y: this.yForValue(value), label: format(value) });
    }
    return lines;
  });

  colorFor(i: number): string { return COLORS[i % COLORS.length]!; }

  xFor(i: number): number {
    const n = Math.max(1, this.months().length - 1);
    return PAD.left + (i * (WIDTH - PAD.left - PAD.right)) / n;
  }

  yForValue(v: number): number {
    const { top } = this.axis();
    return PAD.top + (1 - v / top) * (HEIGHT - PAD.top - PAD.bottom);
  }

  pointsFor(seriesIndex: number): Point[] {
    const s = this.series()[seriesIndex];
    if (!s) return [];
    return s.values.map((v, i) => ({ x: this.xFor(i), y: this.yForValue(v) }));
  }

  pathFor(seriesIndex: number): string {
    return this.pointsFor(seriesIndex)
      .map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(' ');
  }

  onMove(e: PointerEvent): void {
    const svg = e.currentTarget as SVGSVGElement;
    const rect = svg.getBoundingClientRect();
    const n = Math.max(1, this.months().length);
    const px = (e.clientX - rect.left) / rect.width * WIDTH;
    const relative = (px - PAD.left) / ((WIDTH - PAD.left - PAD.right) / Math.max(1, n - 1));
    const i = Math.max(0, Math.min(n - 1, Math.round(relative)));
    this.hover.set(i);
  }

  formatValue(v: number | undefined): string {
    return (v ?? 0).toLocaleString('en-IN');
  }
}
