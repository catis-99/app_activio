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
  {
    path: 'registro',
    loadComponent: () => import('./registro/registro.page').then( m => m.RegistroPage)
  },
  {
    path: 'progresso',
    loadComponent: () => import('./progresso/progresso.page').then( m => m.ProgressoPage)
  },
  {
    path: 'conquistas',
    loadComponent: () => import('./conquistas/conquistas.page').then( m => m.ConquistasPage)
  },
  {
    path: 'completarperfil',
    loadComponent: () => import('./completarperfil/completarperfil.page').then( m => m.CompletarperfilPage)
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.page').then( m => m.SettingsPage)
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.page').then( m => m.ProfilePage)
  },
  {
    path: 'settings',
    loadComponent: () => import('./settings/settings.page').then( m => m.SettingsPage)
  },
  {
    path: 'criar-atividade',
    loadComponent: () => import('./criar-atividade/criar-atividade.page').then( m => m.CriarAtividadePage)
  },
  {
    path: 'lista-atividades',
    loadComponent: () => import('./lista-atividades/lista-atividades.page').then( m => m.ListaAtividadesPage)
  },


];
