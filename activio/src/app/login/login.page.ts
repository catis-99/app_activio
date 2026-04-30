import { Component, inject } from '@angular/core';
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
    private router = inject(Router);
    private i18nService = inject(I18nService);
    private dataService = inject(DataService);
    private alertController = inject(AlertController);

    email = '';
    password = '';

    t(key: string): string {
        return this.i18nService.t(key);
    }

    async onLogin() {
        console.log('=== LOGIN ATTEMPT ===');
        console.log('Email:', this.email);
        console.log('Password length:', this.password?.length);
        
        if (!this.email || !this.password) {
            await this.showAlert('Campos obrigatórios', 'Por favor, preencha todos os campos.');
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.email)) {
            await this.showAlert('Email inválido', 'Por favor, insira um email válido.');
            return;
        }

        try {
            console.log('Calling dataService.login...');
            const success = await this.dataService.login(this.email, this.password);
            console.log('Login result:', success);

            if (success) {
                // Carregar perfil Gumballl APENAS para o utilizador gumball@gmail.com
                const isGumballl = this.email.toLowerCase() === 'gumball@gmail.com';
                
                if (isGumballl) {
                    console.log('Login successful! Loading Gumballl profile...');
                    try {
                        await this.dataService.loadGumballlProfile();
                        console.log('✅ Perfil Gumballl carregado automaticamente');
                    } catch (profileError) {
                        console.warn('⚠️ Erro ao carregar perfil Gumballl:', profileError);
                    }
                } else {
                    console.log('Login successful! User is not Gumballl, loading default profile...');
                }
                
                // Show success message
                const alert = await this.alertController.create({
                    header: 'Sucesso',
                    message: 'Login realizado com sucesso!',
                    buttons: [{
                        text: 'OK',
                        handler: () => {
                            this.router.navigate(['/home']);
                        }
                    }]
                });
                await alert.present();
            } else {
                console.log('Login failed - Invalid credentials');
                await this.showAlert('Erro de autenticação', 'Email ou palavra-passe incorretos.\n\nSe ainda não tem conta, clique em "Criar conta aqui" para se registar primeiro.');
            }
        } catch (error) {
            console.error('Login error:', error);
            await this.showAlert('Erro', 'Ocorreu um erro ao tentar fazer login. Detalhes: ' + error);
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
