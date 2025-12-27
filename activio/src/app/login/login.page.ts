import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { I18nService } from '../services/i18n.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule, FormsModule]
})
export class LoginPage {
    email = '';
    password = '';

    constructor(private router: Router, private i18nService: I18nService) { }

    t(key: string): string {
        return this.i18nService.t(key);
    }

    onLogin() {
        // Implementar lógica de login
        console.log('Login attempt', this.email, this.password);
        this.router.navigate(['/home']);
    }

    goToRegister() {
        this.router.navigate(['/registro']);
    }
}
