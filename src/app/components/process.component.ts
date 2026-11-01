import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { AdminService } from '../services/admin.service';
import { ContentService } from '../services/content.service';
import { EditableComponent } from './editable.component';

@Component({
  selector: 'app-process',
  standalone: true,
  imports: [EditableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="process">
      <div class="wrap">
        <div class="section-head">
          <span class="eyebrow"><app-editable path="process.eyebrow" /></span>
          <h2><app-editable path="process.titleHtml" [html]="true" /></h2>
        </div>

        <div class="phases">
          @for (p of content.process().phases; track $index; let i = $index) {
            <article class="phase admin-wrap">
              @if (admin.isAdmin() && content.process().phases.length > 1) {
                <button class="admin-remove" type="button" title="Remove phase"
                        (click)="content.removeAt('process.phases', i)">×</button>
              }
              <div class="phase-head">
                <span class="phase-no">{{ pad(i + 1) }}</span>
                <span class="phase-code"><app-editable [path]="'process.phases.' + i + '.code'" /></span>
              </div>
              <h3><app-editable [path]="'process.phases.' + i + '.title'" /></h3>
              <p><app-editable [path]="'process.phases.' + i + '.description'" [multiline]="true" /></p>
            </article>
          }
        </div>

        @if (admin.isAdmin()) {
          <div class="add-wrap">
            <button class="admin-add" type="button" (click)="addPhase()">
              <span class="plus">+</span> Add phase
            </button>
          </div>
        }

        <div class="skills-head">
          <span class="eyebrow"><app-editable path="process.skillsEyebrow" /></span>
          <h3><app-editable path="process.skillsTitleHtml" [html]="true" /></h3>
        </div>
        <div class="skills">
          @for (skill of content.process().skills; track $index; let i = $index) {
            <span class="skill admin-wrap">
              <app-editable [path]="'process.skills.' + i" />
              @if (admin.isAdmin() && content.process().skills.length > 1) {
                <button class="skill-remove" type="button" title="Remove"
                        (click)="content.removeAt('process.skills', i)">×</button>
              }
            </span>
          }
          @if (admin.isAdmin()) {
            <button class="admin-add" type="button" (click)="addSkill()">
              <span class="plus">+</span> Add skill
            </button>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .phases {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0;
      border-top: 1px solid var(--line);
      border-bottom: 1px solid var(--line);
      margin-bottom: 32px;
    }
    .phase {
      padding: 36px 32px;
      border-right: 1px solid var(--line);
      position: relative;
      background: transparent;
      transition: background-color .3s var(--ease-out);
    }
    .phase:last-child { border-right: 0; }
    .phase:hover { background: var(--surface-2); }

    .phase-head {
      display: flex;
      align-items: baseline;
      gap: 14px;
      margin-bottom: 24px;
      padding-bottom: 14px;
      border-bottom: 1px solid var(--line);
    }
    .phase-no {
      font: 500 44px/1 var(--font-display);
      font-variation-settings: "opsz" 144;
      color: var(--accent);
      letter-spacing: -0.03em;
    }
    .phase-code {
      font: 600 10.5px var(--font-mono);
      letter-spacing: 0.2em;
      color: var(--muted);
    }
    .phase h3 {
      font: 500 italic 26px/1.15 var(--font-display);
      font-variation-settings: "opsz" 144;
      color: var(--ink);
      margin: 0 0 12px;
      font-weight: 500;
    }
    .phase p {
      margin: 0;
      color: var(--muted);
      line-height: 1.65;
      font-size: 15.5px;
    }

    .add-wrap { display: flex; justify-content: center; margin-bottom: 72px; }

    .skills-head { margin-bottom: 20px; }
    .skills-head h3 {
      font: 500 italic 24px/1.2 var(--font-display);
      font-variation-settings: "opsz" 144;
      color: var(--ink);
      font-weight: 500;
    }

    .skills {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
    }
    .skills .skill {
      padding: 10px 16px;
      border-radius: 99px;
      background: var(--surface);
      border: 1px solid var(--line);
      color: var(--ink-2);
      font: 500 14px var(--font-body);
      transition: all .2s var(--ease-out);
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .skills .skill:hover {
      transform: translateY(-2px);
      border-color: var(--accent);
      color: var(--accent);
      background: var(--accent-soft);
    }
    .skill-remove {
      border: 0;
      background: transparent;
      color: var(--muted);
      cursor: pointer;
      width: 18px; height: 18px;
      border-radius: 50%;
      font: 300 14px/1 var(--font-body);
      transition: background-color .18s, color .18s;
    }
    .skill-remove:hover { background: var(--bad); color: var(--paper); }

    @media (max-width: 820px) {
      .phases { grid-template-columns: 1fr; }
      .phase { border-right: 0; border-bottom: 1px solid var(--line); }
      .phase:last-child { border-bottom: 0; }
    }
  `]
})
export class ProcessComponent {
  readonly content = inject(ContentService);
  readonly admin   = inject(AdminService);

  pad(n: number): string { return n < 10 ? `0${n}` : String(n); }

  addPhase(): void {
    const i = this.content.process().phases.length;
    this.content.push('process.phases', this.content.newPhase(i));
  }

  addSkill(): void {
    this.content.push('process.skills', 'New skill');
  }
}
