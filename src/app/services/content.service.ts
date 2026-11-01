import { computed, Injectable, signal } from '@angular/core';

import {
  CaseStudy,
  ChannelReport,
  Kpi,
  Phase,
  SeriesPoint,
  Testimonial,
  TimelineItem
} from '../models/types';

const STORAGE_KEY = 'akash.content.v2';

interface HeroStat { value: string; label: string; }

export interface AppContent {
  hero: {
    eyebrow: string;
    meta: string;
    headlineHtml: string;
    sub: string;
    primaryBtnText: string;
    primaryBtnHref: string;
    ghostBtnText: string;
    ghostBtnHref: string;
    footnote: string;
    statsHeading: string;
    statsNote: string;
    stats: HeroStat[];
  };
  cases: {
    eyebrow: string;
    titleHtml: string;
    lead: string;
    items: CaseStudy[];
  };
  resultsLab: {
    eyebrow: string;
    titleHtml: string;
    lead: string;
    channels: ChannelReport[];
  };
  timeline: {
    eyebrow: string;
    titleHtml: string;
    lead: string;
    items: TimelineItem[];
  };
  process: {
    eyebrow: string;
    titleHtml: string;
    phases: Phase[];
    skillsEyebrow: string;
    skillsTitleHtml: string;
    skills: string[];
  };
  testimonials: {
    eyebrow: string;
    titleHtml: string;
    items: Testimonial[];
    aboutEyebrow: string;
    aboutNameHtml: string;
    bio: string;
  };
  contact: {
    eyebrow: string;
    titleHtml: string;
    sub: string;
    emailText: string;
    emailHref: string;
    whatsappText: string;
    whatsappHref: string;
    addressLabel: string;
    addressHtml: string;
    hoursLabel: string;
    hours: string;
  };
  footer: {
    brand: string;
    brandSub: string;
    copyright: string;
    emailText: string;
    emailHref: string;
    whatsappText: string;
    whatsappHref: string;
  };
}

/** -------------------------------------------------------------
 * Deep-path helpers (immutable set / push / remove)
 * ------------------------------------------------------------- */
function getPath<T = unknown>(obj: unknown, path: string): T | undefined {
  if (!path) return obj as T;
  return path.split('.').reduce<any>((o, k) => (o == null ? undefined : o[k]), obj) as T;
}

function setPathDeep(obj: any, keys: string[], value: unknown): any {
  if (!keys.length) return value;
  const [head, ...rest] = keys;
  const key = head!;
  if (Array.isArray(obj)) {
    const idx = Number(key);
    const next = obj.slice();
    next[idx] = setPathDeep(obj[idx], rest, value);
    return next;
  }
  const src = (obj && typeof obj === 'object') ? obj : {};
  return { ...src, [key]: setPathDeep(src[key], rest, value) };
}

function setPath<T>(root: T, path: string, value: unknown): T {
  return setPathDeep(root, path.split('.'), value) as T;
}

/** -------------------------------------------------------------
 * Defaults — the canonical content shipped with the app.
 * ------------------------------------------------------------- */
function makeDefaults(): AppContent {
  return {
    hero: {
      eyebrow: 'Volume 01 · Casebook',
      meta: 'Bangalore, India',
      headlineHtml: 'I find where your ad spend <em>leaks</em>.<br>Then I fix it.',
      sub: `Google Ads, Meta Ads, SEO and e-commerce — tracked from the first click to the sale. I report orders, leads and revenue, not just vanity clicks.`,
      primaryBtnText: 'Get a free ad check',
      primaryBtnHref: '#contact',
      ghostBtnText: 'Browse cases',
      ghostBtnHref: '#cases',
      footnote: 'Performance Marketing Specialist · Ajavu Tech · Founder, AK Digital Labz',
      statsHeading: 'Headline figures',
      statsNote: 'Sample data',
      stats: [
        { value: '4.8x',  label: 'ROAS, Google Shopping' },
        { value: '-42%',  label: 'Cost per lead' },
        { value: '3.1x',  label: 'Organic traffic in 6 months' },
        { value: '+68%',  label: 'Online store revenue' }
      ]
    },

    cases: {
      eyebrow: 'Chapter 01 · Case Studies',
      titleHtml: 'Six stories, read in sixty <em>seconds</em>.',
      lead: 'Each one reads <strong>problem · fix · result</strong>. Every number carries a label so you know how solid it is — Measured, Estimated, Assumption or Sample.',
      items: [
        {
          category: 'E-commerce',
          client: 'Fashion store',
          channel: 'Google Shopping and Meta catalog',
          headline: '4.8x',
          subhead: 'ROAS in 90 days',
          problem: 'Spend was spread evenly over products with very different margins.',
          fix: 'Cleaned the product feed, split campaigns by margin, added cart-abandoner remarketing.',
          result: 'ROAS rose to 4.8x after low-margin products were paused.',
          source: 'Sample'
        },
        {
          category: 'Lead generation',
          client: 'Home services',
          channel: 'Google Search and Meta lead forms',
          headline: '-42%',
          subhead: 'Cost per lead',
          problem: 'Broad keywords brought many enquiries and few real calls.',
          fix: 'Rebuilt keyword groups around buying intent and tested shorter forms.',
          result: 'Cost per lead fell 42% and calls were tracked as a separate conversion.',
          source: 'Sample'
        },
        {
          category: 'SEO',
          client: 'B2B consultancy',
          channel: 'Technical SEO and content',
          headline: '3.1x',
          subhead: 'Organic traffic in 6 months',
          problem: 'Few service pages and crawl and speed problems held rankings back.',
          fix: 'Fixed the technical audit issues, published pages mapped to search intent, built relevant links.',
          result: 'Organic traffic grew 3.1x and more keywords reached page 1.',
          source: 'Sample'
        },
        {
          category: 'Social media',
          client: 'Local brand',
          channel: 'Instagram and Facebook',
          headline: '+5.6K',
          subhead: 'Followers in 6 months',
          problem: 'Posting was irregular and not tied to any goal.',
          fix: 'Set a content calendar, tested formats and used insights to double down.',
          result: 'Followers and engagement grew steadily across both platforms.',
          source: 'Sample'
        },
        {
          category: 'Analytics',
          client: 'Tracking set-up',
          channel: 'GA4 and Google Tag Manager',
          headline: '14',
          subhead: 'Key events tracked, up from 2',
          problem: 'Ad platforms and GA4 showed different numbers, and duplicate tags inflated conversions.',
          fix: 'Audited every tag in Tag Manager, removed duplicates, set up key events and checked them against real orders.',
          result: 'Reports now match actual orders, and three Looker Studio dashboards went live.',
          source: 'Sample'
        },
        {
          category: 'Local SEO',
          client: 'Local clinic',
          channel: 'Google Business Profile optimisation',
          headline: '2.4x',
          subhead: 'Calls from the profile in 90 days',
          problem: 'The profile had the wrong categories, a bloated service list and unanswered reviews.',
          fix: 'Corrected categories and services, added photos and posts, replied to every review and added tracked booking links.',
          result: 'Calls and direction requests from the profile rose 2.4x.',
          source: 'Sample'
        }
      ]
    },

    resultsLab: {
      eyebrow: 'Chapter 02 · Results Lab',
      titleHtml: 'Numbers you can actually <em>dig into</em>.',
      lead: 'Charts, tables and dashboard reports for each channel. Sample data below — swap with your account snapshots.',
      channels: [
        {
          id: 'google-ads', name: 'Google Ads',
          kpis: [
            { value: '4.8x', label: 'ROAS' },
            { value: '-35%', label: 'Cost per conversion' },
            { value: '6.2%', label: 'Conversion rate' },
            { value: '₹12L', label: 'Spend managed' }
          ],
          tableHead: ['Campaign', 'Spend', 'Result'],
          tableRows: [
            ['Search (leads)', '₹3.2L', '-42% cost per lead'],
            ['Shopping', '₹5.0L', '5.1x ROAS'],
            ['Performance Max', '₹2.8L', '4.2x ROAS'],
            ['Remarketing', '₹1.0L', '7.4x ROAS']
          ],
          chartTitle: 'Ad spend vs revenue',
          chartSeries: [
            { name: 'Ad spend (₹K)', values: [170, 180, 195, 210, 220, 225] },
            { name: 'Revenue (₹K)',  values: [540, 700, 880, 1060, 1200, 1380] }
          ],
          months: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
          unit: 'K', note: 'Monthly, Apr to Sep. Sample data.'
        },
        {
          id: 'meta-ads', name: 'Meta Ads',
          kpis: [
            { value: '3.9x', label: 'ROAS' },
            { value: '₹140', label: 'Cost per lead' },
            { value: '1.8%', label: 'Click-through rate' },
            { value: '₹9L',  label: 'Spend managed' }
          ],
          tableHead: ['Campaign', 'Spend', 'Result'],
          tableRows: [
            ['Catalog sales', '₹4.0L', '4.5x ROAS'],
            ['Lead forms', '₹2.5L', '₹140 per lead'],
            ['Conversions', '₹1.8L', '3.4x ROAS'],
            ['Retargeting', '₹0.7L', '6.8x ROAS']
          ],
          chartTitle: 'Leads vs qualified leads',
          chartSeries: [
            { name: 'Total leads',     values: [180, 240, 310, 380, 450, 520] },
            { name: 'Qualified leads', values: [60, 95, 135, 180, 225, 275] }
          ],
          months: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
          unit: '', note: 'Monthly, Apr to Sep. Sample data.'
        },
        {
          id: 'seo', name: 'SEO',
          kpis: [
            { value: '3.1x',  label: 'Organic traffic' },
            { value: '42',    label: 'Keywords on page 1' },
            { value: '+120%', label: 'Organic leads' },
            { value: '6 mo',  label: 'Time to result' }
          ],
          tableHead: ['Measure', 'Before', 'After'],
          tableRows: [
            ['Monthly organic visits', '1,800', '5,600'],
            ['Keywords in top 10', '9', '42'],
            ['Page speed score', '48', '86'],
            ['Referring domains', '14', '63']
          ],
          chartTitle: 'Non-branded vs branded visits',
          chartSeries: [
            { name: 'Non-branded', values: [600, 900, 1400, 2100, 3000, 4100] },
            { name: 'Branded',     values: [900, 1000, 1100, 1250, 1400, 1500] }
          ],
          months: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
          unit: '', note: 'Monthly, Apr to Sep. Sample data.'
        },
        {
          id: 'social-media', name: 'Social media',
          kpis: [
            { value: '+5.6K', label: 'Followers' },
            { value: '5.4%',  label: 'Engagement rate' },
            { value: '3.2M',  label: 'Total reach' },
            { value: '24',    label: 'Posts per month' }
          ],
          tableHead: ['Platform', 'Posts / month', 'Result'],
          tableRows: [
            ['Instagram', '12', '6.1% engagement'],
            ['Facebook', '8', '+2.1K followers'],
            ['LinkedIn', '4', '+1.2K followers']
          ],
          chartTitle: 'Follower growth by platform',
          chartSeries: [
            { name: 'Instagram', values: [1800, 2600, 3500, 4600, 5900, 7400] },
            { name: 'Facebook',  values: [1200, 1500, 1900, 2300, 2800, 3300] }
          ],
          months: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
          unit: '', note: 'Monthly, Apr to Sep. Sample data.'
        },
        {
          id: 'ga4', name: 'GA4',
          kpis: [
            { value: '9.8K', label: 'Monthly sessions' },
            { value: '70%',  label: 'Engaged sessions' },
            { value: '14',   label: 'Key events tracked' },
            { value: '3',    label: 'Live dashboards' }
          ],
          tableHead: ['Set-up', 'Before', 'After'],
          tableRows: [
            ['Key events tracked', '2', '14'],
            ['Duplicate tags', 'Yes', 'Removed'],
            ['Looker Studio reports', 'None', '3 live']
          ],
          chartTitle: 'Sessions vs engaged sessions',
          chartSeries: [
            { name: 'Sessions',         values: [5200, 6100, 7000, 7900, 8800, 9800] },
            { name: 'Engaged sessions', values: [2600, 3400, 4300, 5200, 6000, 6900] }
          ],
          months: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
          unit: '', note: 'Monthly, Apr to Sep. Sample data.'
        },
        {
          id: 'search-console', name: 'Search Console',
          kpis: [
            { value: '92K',  label: 'Impressions' },
            { value: '5.6K', label: 'Clicks' },
            { value: '6.1%', label: 'Average CTR' },
            { value: '8.4',  label: 'Average position' }
          ],
          tableHead: ['Keyword group', 'Position before', 'After'],
          tableRows: [
            ['Service keywords', '24', '7'],
            ['Location keywords', '18', '5'],
            ['Blog topics', '35', '12']
          ],
          chartTitle: 'Keywords on page 1 vs page 2',
          chartSeries: [
            { name: 'Page 1', values: [9, 14, 20, 28, 35, 42] },
            { name: 'Page 2', values: [22, 28, 31, 30, 26, 21] }
          ],
          months: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
          unit: '', note: 'Monthly, Apr to Sep. Sample data.'
        }
      ]
    },

    timeline: {
      eyebrow: 'Chapter 03 · Recent Work',
      titleHtml: 'Weekly log, newest <em>first</em>.',
      lead: 'A short, honest log of recent work with reports attached.',
      items: [
        { when: 'This week', tag: 'Google Ads', title: 'Rebuilt search campaigns by treatment',
          description: 'New keyword groups, tighter budgets and a call-tracking set-up. Sample entry.' },
        { when: 'Last week', tag: 'Tracking', title: 'GA4 and Tag Manager clean-up',
          description: 'Removed duplicate tags and added 12 key events. Sample entry.' },
        { when: '2 weeks ago', tag: 'Meta Ads', title: 'Creative test for a lead-form campaign',
          description: 'Three offers tested against one audience. Sample entry.' },
        { when: '3 weeks ago', tag: 'SEO', title: 'Technical audit and service pages',
          description: 'Fixed crawl issues and published four service pages. Sample entry.' }
      ]
    },

    process: {
      eyebrow: 'Chapter 04 · The Method',
      titleHtml: 'Three phases, one <em>goal</em> — profitable growth.',
      phases: [
        { code: 'PHASE 01 · WEEK 1', title: 'Audit & Strategy',
          description: 'I analyze your ad accounts, tracking setup, landing pages, audience targeting and conversion data to identify wasted spend and build a prioritized growth strategy.' },
        { code: 'PHASE 02 · MONTH 1', title: 'Optimize & Launch',
          description: 'I implement tracking improvements, refine campaigns, strengthen landing pages and test audience and creative combinations to improve lead quality and conversion efficiency.' },
        { code: 'PHASE 03 · ONGOING', title: 'Measure & Scale',
          description: 'I monitor performance, report on meaningful KPIs, test new opportunities and scale campaigns based on conversion data, customer acquisition costs and return on ad spend.' }
      ],
      skillsEyebrow: 'Toolkit',
      skillsTitleHtml: 'The stack I run day to day',
      skills: ['Google Ads','Meta Ads','SEO','Social media','GA4','Tag Manager','Search Console','Looker Studio','Shopify','Merchant Center']
    },

    testimonials: {
      eyebrow: 'Chapter 05 · In Their Words',
      titleHtml: 'Short, honest and <em>specific</em>.',
      items: [
        { quote: 'Our cost per lead dropped in the first month and the reports were easy to follow.', cite: 'Client name, Company' },
        { quote: 'Akash fixed our tracking and then scaled the ads that actually made money.',        cite: 'Client name, Company' },
        { quote: 'Traffic and sales grew steadily. Clear communication throughout.',                 cite: 'Client name, Company' }
      ],
      aboutEyebrow: 'The author',
      aboutNameHtml: 'S. <em>Akash</em>',
      bio: 'Performance Marketing Specialist at Ajavu Tech, Bangalore, running Google Ads and Meta Ads for e-commerce, lead generation and IT clients. Also the founder of AK Digital Labz, serving small businesses in Bangalore and Chennai. Mechanical Engineering background, Google Skillshop certified, trained at NIDM Bangalore.'
    },

    contact: {
      eyebrow: 'Chapter 06 · Say Hello',
      titleHtml: 'See a leak in your <em>numbers</em>?',
      sub: 'Send me what you’re seeing. I’ll reply with the closest case and the first thing I would check. No decks. No retainer pitch.',
      emailText: 'akdigitallabz@gmail.com',
      emailHref: 'mailto:akdigitallabz@gmail.com',
      whatsappText: 'WhatsApp me',
      whatsappHref: 'https://wa.me/918838085378',
      addressLabel: 'Address',
      addressHtml: 'Bangalore · Chennai<br>India',
      hoursLabel: 'Working hours',
      hours: 'Mon – Fri · 09:30 – 19:00 IST'
    },

    footer: {
      brand: 'S. Akash',
      brandSub: 'AK Digital Labz · Bangalore + Chennai',
      copyright: 'S. Akash · AK Digital Labz',
      emailText: 'akdigitallabz@gmail.com',
      emailHref: 'mailto:akdigitallabz@gmail.com',
      whatsappText: '+91 88380 85378',
      whatsappHref: 'https://wa.me/918838085378'
    }
  };
}

/** -------------------------------------------------------------
 * ContentService
 * ------------------------------------------------------------- */
@Injectable({ providedIn: 'root' })
export class ContentService {
  readonly state = signal<AppContent>(this.load());

  readonly hero         = computed(() => this.state().hero);
  readonly cases        = computed(() => this.state().cases);
  readonly resultsLab   = computed(() => this.state().resultsLab);
  readonly timeline     = computed(() => this.state().timeline);
  readonly process      = computed(() => this.state().process);
  readonly testimonials = computed(() => this.state().testimonials);
  readonly contact      = computed(() => this.state().contact);
  readonly footer       = computed(() => this.state().footer);

  /** Filters derived from cases list — unique categories, no "All". */
  readonly caseFilters = computed(() => {
    const seen = new Set<string>();
    for (const c of this.state().cases.items) seen.add(c.category);
    return [...seen];
  });

  get<T = string>(path: string): T {
    return (getPath<T>(this.state(), path) ?? ('' as unknown as T));
  }

  set(path: string, value: unknown): void {
    this.state.set(setPath(this.state(), path, value));
    this.persist();
  }

  push(path: string, value: unknown): void {
    const current = getPath<unknown[]>(this.state(), path) ?? [];
    this.set(path, [...current, value]);
  }

  removeAt(path: string, index: number): void {
    const current = getPath<unknown[]>(this.state(), path) ?? [];
    this.set(path, current.filter((_, i) => i !== index));
  }

  reset(): void {
    this.state.set(makeDefaults());
    this.persist();
  }

  // -------- Factories (used by + Add buttons) --------
  newHeroStat(): HeroStat {
    return { value: '0x', label: 'New metric' };
  }

  newCase(): CaseStudy {
    return {
      category: 'E-commerce',
      client: 'Client name',
      channel: 'Channel',
      headline: '0x',
      subhead: 'Result label',
      problem: 'Describe the problem.',
      fix: 'Describe the fix.',
      result: 'Describe the result.',
      source: 'Sample'
    };
  }

  newChannel(): ChannelReport {
    return {
      id: `channel-${Date.now()}`,
      name: 'New channel',
      kpis: [{ value: '0', label: 'KPI' }],
      tableHead: ['Metric', 'Before', 'After'],
      tableRows: [['Row 1', '-', '-']],
      chartTitle: 'Metric vs metric',
      chartSeries: [
        { name: 'Series A', values: [10, 20, 30, 40, 50, 60] },
        { name: 'Series B', values: [20, 30, 40, 50, 60, 70] }
      ],
      months: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      unit: '',
      note: 'Monthly data. Sample.'
    };
  }

  newKpi(): Kpi { return { value: '0', label: 'New KPI' }; }

  newSeries(months: number): SeriesPoint {
    const values = Array.from({ length: months }, () => 0);
    return { name: 'New series', values };
  }

  newTimelineItem(): TimelineItem {
    return {
      when: 'This week',
      tag: 'Channel',
      title: 'New entry',
      description: 'Describe what was delivered.'
    };
  }

  newPhase(index: number): Phase {
    return {
      code: `PHASE 0${index + 1}`,
      title: 'New phase',
      description: 'Describe this phase.'
    };
  }

  newTestimonial(): Testimonial {
    return { quote: 'Short, specific thing a client said.', cite: 'Client name, Company' };
  }

  // -------- Chart-specific helpers --------
  addMonth(channelIndex: number): void {
    const ch = this.state().resultsLab.channels[channelIndex];
    if (!ch) return;
    const nextMonths = [...ch.months, 'New'];
    const nextSeries = ch.chartSeries.map((s) => ({ ...s, values: [...s.values, 0] }));
    this.set(`resultsLab.channels.${channelIndex}.months`, nextMonths);
    this.set(`resultsLab.channels.${channelIndex}.chartSeries`, nextSeries);
  }

  removeMonth(channelIndex: number, monthIndex: number): void {
    const ch = this.state().resultsLab.channels[channelIndex];
    if (!ch || ch.months.length <= 2) return;
    const nextMonths = ch.months.filter((_, i) => i !== monthIndex);
    const nextSeries = ch.chartSeries.map((s) => ({
      ...s,
      values: s.values.filter((_, i) => i !== monthIndex)
    }));
    this.set(`resultsLab.channels.${channelIndex}.months`, nextMonths);
    this.set(`resultsLab.channels.${channelIndex}.chartSeries`, nextSeries);
  }

  // -------- Persistence --------
  private persist(): void {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state())); } catch { /* quota */ }
  }

  private load(): AppContent {
    const defaults = makeDefaults();
    if (typeof localStorage === 'undefined') return defaults;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaults;
      const parsed = JSON.parse(raw);
      return deepMerge(defaults, parsed);
    } catch {
      return defaults;
    }
  }
}

/** Shallow-recursive merge: saved content wins over defaults, keeps new default keys. */
function deepMerge<T>(base: T, override: unknown): T {
  if (override == null || typeof override !== 'object') return base;
  if (Array.isArray(base)) {
    // Arrays — prefer saved as a whole (don't try to merge item-by-item).
    return (Array.isArray(override) ? override : base) as T;
  }
  if (typeof base !== 'object' || base === null) return (override as T) ?? base;
  const result: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [key, value] of Object.entries(override as Record<string, unknown>)) {
    const baseVal = (base as Record<string, unknown>)[key];
    if (baseVal !== undefined && typeof baseVal === 'object' && baseVal !== null && !Array.isArray(baseVal)) {
      result[key] = deepMerge(baseVal, value);
    } else {
      result[key] = value;
    }
  }
  return result as T;
}
