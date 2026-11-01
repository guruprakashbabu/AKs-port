import { ChangeDetectionStrategy, Component } from '@angular/core';

import { CasesComponent } from '../components/cases.component';
import { ContactCtaComponent } from '../components/contact-cta.component';
import { HeroComponent } from '../components/hero.component';
import { ProcessComponent } from '../components/process.component';
import { ResultsLabComponent } from '../components/results-lab.component';
import { TestimonialsComponent } from '../components/testimonials.component';
import { TimelineComponent } from '../components/timeline.component';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [
    HeroComponent,
    CasesComponent,
    ResultsLabComponent,
    TimelineComponent,
    ProcessComponent,
    TestimonialsComponent,
    ContactCtaComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-hero />
    <main>
      <app-cases />
      <app-results-lab />
      <app-timeline />
      <app-process />
      <app-testimonials />
      <app-contact-cta />
    </main>
  `,
  styles: [`
    main { display: block; }
  `]
})
export class PortfolioComponent {}
