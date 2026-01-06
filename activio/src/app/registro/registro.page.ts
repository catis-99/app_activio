import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonItem, IonIcon, IonInput, IonCheckbox, IonButton, AlertController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [IonContent, IonItem, IonIcon, IonInput, IonCheckbox, IonButton, CommonModule, FormsModule]
})
export class RegistroPage implements OnInit {
  currentLanguage: string = 'pt';
  fullName: string = '';
  phone: string = '';
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  acceptedTerms: boolean = false;

  private translations: any = {
    pt: {
      registro: {
        title: 'Bem-vindo',
        createAccount: 'Criar Conta',
        name: 'Nome Completo',
        phone: 'Telefone',
        email: 'Email',
        password: 'Palavra-passe',
        termsAccept: 'Aceito a',
        privacyPolicy: 'Política de Privacidade',
        and: 'e os',
        termsOfUse: 'Termos de Uso',
        haveAccount: 'Já tem uma conta?',
        loginHere: 'Entre aqui'
      }
    },
    en: {
      registro: {
        title: 'Welcome',
        createAccount: 'Create Account',
        name: 'Full Name',
        phone: 'Phone',
        email: 'Email',
        password: 'Password',
        termsAccept: 'I accept the',
        privacyPolicy: 'Privacy Policy',
        and: 'and the',
        termsOfUse: 'Terms of Use',
        haveAccount: 'Already have an account?',
        loginHere: 'Login here'
      }
    }
  };

  constructor(
    private router: Router,
    private dataService: DataService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
  }

  changeLanguage(lang: string) {
    this.currentLanguage = lang;
  }

  t(key: string): string {
    const keys = key.split('.');
    let value = this.translations[this.currentLanguage];

    for (const k of keys) {
      value = value[k];
      if (!value) return key;
    }

    return value;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  openPrivacyPolicy() {
    // Navigate to privacy policy page or open in browser
    console.log('Open privacy policy');
  }

  openTerms() {
    // Navigate to terms page or open in browser
    console.log('Open terms');
  }

  async onRegister() {
    if (!this.fullName || !this.email || !this.password) {
      await this.showAlert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!this.acceptedTerms) {
      await this.showAlert('Erro', 'Por favor, aceite os termos e condições.');
      return;
    }

    const success = await this.dataService.register(this.email, this.password, this.fullName);

    if (success) {
      // Salvar nome e email do utilizador no perfil
      await this.dataService.saveUserProfile({
        name: this.fullName,
        age: 25,
        height: 170,
        email: this.email
      });

      this.router.navigate(['/completarperfil']);
    } else {
      await this.showAlert('Erro', 'Este email já está registado.');
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

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
