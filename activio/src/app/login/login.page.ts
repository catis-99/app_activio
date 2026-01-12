import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { I18nService } from '../services/i18n.service';
import { DataService } from '../services/data.service';

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

    constructor(
        private router: Router,
        private i18nService: I18nService,
        private dataService: DataService,
        private alertController: AlertController
    ) { }

    t(key: string): string {
        return this.i18nService.t(key);
    }

    async onLogin() {
        if (!this.email || !this.password) {
            await this.showAlert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        const success = await this.dataService.login(this.email, this.password);

        if (success) {
            this.router.navigate(['/home']);
        } else {
            await this.showAlert('Erro', 'Email ou palavra-passe incorretos.');
        }
    }

    async showAlert(header: string, message: string) {
        const alert = await this.alertController.create({
            header,
            message,
            buttons: ['OK']
        });
        await alert.present();
    }

    goToRegister() {
        this.router.navigate(['/registro']);
    }
}
