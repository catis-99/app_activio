import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class SettingsPage {
  settings = {
    darkMode: true,
    popups: true,
    dailySummary: true,
    weeklySummary: true,
    language: 'pt'
  };

  constructor(private router: Router) {}

  toggleDarkMode() {
    this.settings.darkMode = !this.settings.darkMode;
    // Implementar lógica de tema
    console.log('Dark mode:', this.settings.darkMode);
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

  selectLanguage(lang: string) {
    this.settings.language = lang;
    console.log('Idioma selecionado:', lang);
  }

  goBack() {
    this.router.navigate(['/profile']);
  }

  openMenu() {
    console.log('Menu aberto');
  }
}