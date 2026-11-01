export interface Leak {
  id: string;
  stage: string;
  area: string;
  problem: string;
  fix: string;
}

export type CaseCategory =
  | 'E-commerce'
  | 'Lead generation'
  | 'SEO'
  | 'Social media'
  | 'Analytics'
  | 'Local SEO';

export type SourceLabel = 'Measured' | 'Estimated' | 'Assumption' | 'Sample';

export interface CaseStudy {
  category: CaseCategory;
  client: string;
  channel: string;
  headline: string;
  subhead: string;
  problem: string;
  fix: string;
  result: string;
  source: SourceLabel;
}

export interface Kpi {
  value: string;
  label: string;
}

export interface SeriesPoint {
  name: string;
  values: number[];
}

export interface ChannelReport {
  id: string;
  name: string;
  kpis: Kpi[];
  tableHead: string[];
  tableRows: string[][];
  chartTitle: string;
  chartSeries: SeriesPoint[];
  months: string[];
  unit: string;
  note: string;
}

export interface TimelineItem {
  when: string;
  tag: string;
  title: string;
  description: string;
}

export interface Phase {
  code: string;
  title: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  cite: string;
}
