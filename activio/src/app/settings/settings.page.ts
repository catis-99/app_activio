import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../services/theme.service';
import { I18nService } from '../services/i18n.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class SettingsPage implements OnInit, OnDestroy {
  private router = inject(Router);
  private navCtrl = inject(NavController);
  private themeService = inject(ThemeService);
  private i18nService = inject(I18nService);

  settings = {
    darkMode: true,
    popups: true,
    dailySummary: true,
    weeklySummary: true,
    language: 'pt'
  };

  availableLanguages: string[] = [];
  private languageChangeHandler = (event: Event) => this.onLanguageChanged(event as CustomEvent);

  ngOnInit() {
    this.loadThemePreference();
    this.loadCurrentLanguage();
    this.loadAvailableLanguages();

    // Escuta mudanças de idioma
    window.addEventListener('languageChanged', this.languageChangeHandler);
  }

  ngOnDestroy() {
    window.removeEventListener('languageChanged', this.languageChangeHandler);
  }

  toggleDarkMode() {
    this.settings.darkMode = this.themeService.toggleTheme();
    console.log('Dark mode:', this.settings.darkMode);
  }

  loadThemePreference() {
    this.settings.darkMode = this.themeService.isDarkMode();
  }

  togglePopups() {
    this.settings.popups = !this.settings.popups;
    console.log('Pop-ups:', this.settings.popups);
  }

  toggleDailySummary() {
    this.settings.dailySummary = !this.settings.dailySummary;
    console.log('Resumo diário:', this.settings.dailySummary);
  }

  toggleWeeklySummary() {
    this.settings.weeklySummary = !this.settings.weeklySummary;
    console.log('Resumo semanal:', this.settings.weeklySummary);
  }

  async selectLanguage(lang: string) {
    this.settings.language = lang;
    await this.themeService.selectLanguage(lang);
    console.log('Idioma selecionado:', lang);
  }

  private loadCurrentLanguage() {
    this.settings.language = this.i18nService.getCurrentLanguage();
  }

  private loadAvailableLanguages() {
    this.availableLanguages = this.i18nService.getAvailableLanguages();
  }

  private onLanguageChanged(event: CustomEvent) {
    this.loadCurrentLanguage();
    // A página será automaticamente atualizada devido ao binding do Angular
  }

  t(key: string): string {
    return this.i18nService.t(key);
  }

  getLanguageName(lang: string): string {
    return this.i18nService.getLanguageName(lang);
  }

  goBack() {
    this.navCtrl.back();
  }

  openMenu() {
    console.log('Menu aberto');
  }

  // Navegação (como na Home)
  navigateToHome() {
    this.router.navigate(['/home']);
  }

  navigateToProgresso() {
    this.router.navigate(['/progresso']);
  }

  navigateToCriarAtividade() {
    this.router.navigate(['/criar-atividade']);
  }

  navigateToListaAtividades() {
    this.router.navigate(['/lista-atividades']);
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }
}
