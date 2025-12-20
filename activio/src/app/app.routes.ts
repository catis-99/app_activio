import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'welcome',
    loadComponent: () => import('./welcome/welcome.page').then(m => m.WelcomePage)
  },
  {
    path: 'intro',
    loadComponent: () => import('./intro-slider/intro-slider.page').then((m) => m.IntroSliderPage),
  },
  {
    path: 'intro-2',
    loadComponent: () => import('./intro-slider-2/intro-slider-2.page').then((m) => m.IntroSlider2Page),
  },
  {
    path: 'intro-3',
    loadComponent: () => import('./intro-slider-3/intro-slider-3.page').then((m) => m.IntroSlider3Page),
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },
];
