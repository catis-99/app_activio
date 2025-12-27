import { Injectable } from '@angular/core';
import { I18nService } from './i18n.service';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly THEME_KEY = 'darkMode';

    constructor(private i18nService: I18nService) {
        // Não carrega automaticamente o tema
        // O tema só é aplicado quando o utilizador faz o toggle
    }

    loadTheme() {
        const savedTheme = localStorage.getItem(this.THEME_KEY);
        let isDarkMode = true; // padrão é escuro

        if (savedTheme !== null) {
            isDarkMode = savedTheme === 'true';
        }

        this.applyTheme(isDarkMode);
    }

    toggleTheme(): boolean {
        const currentTheme = document.body.classList.contains('dark');
        const newTheme = !currentTheme;

        this.applyTheme(newTheme);
        localStorage.setItem(this.THEME_KEY, newTheme.toString());

        return newTheme;
    }

    setTheme(isDarkMode: boolean): void {
        this.applyTheme(isDarkMode);
        localStorage.setItem(this.THEME_KEY, isDarkMode.toString());
    }

    applyTheme(isDarkMode: boolean): void {
        const body = document.body;

        if (isDarkMode) {
            body.classList.remove('light');
            body.classList.add('dark');
        } else {
            body.classList.remove('dark');
            body.classList.add('light');
        }
    }

    isDarkMode(): boolean {
        return document.body.classList.contains('dark');
    }

    // Métodos para mudança de idioma
    selectLanguage(language: string): void {
        this.i18nService.setLanguage(language);
    }

    getCurrentLanguage(): string {
        return this.i18nService.getCurrentLanguage();
    }

    getAvailableLanguages(): string[] {
        return this.i18nService.getAvailableLanguages();
    }

    getLanguageName(language: string): string {
        return this.i18nService.getLanguageName(language);
    }

    translate(key: string): any {
        return this.i18nService.translate(key);
    }
}
