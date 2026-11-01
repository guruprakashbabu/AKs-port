import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/portfolio.component').then((m) => m.PortfolioComponent),
    title: 'S. Akash – Performance Marketing Casebook'
  },
  {
    path: 'gallery/:channel',
    loadComponent: () =>
      import('./pages/gallery.component').then((m) => m.GalleryComponent),
    title: 'Dashboard screenshots – S. Akash'
  },
  { path: '**', redirectTo: '' }
];
