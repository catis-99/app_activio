import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonItem, IonIcon, IonInput, IonCheckbox, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [IonContent, IonItem, IonIcon, IonInput, IonCheckbox, IonButton, CommonModule, FormsModule]
})
export class RegistroPage {
  private router = inject(Router);
  private alertController = inject(AlertController);
  private dataService = inject(DataService);

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
    if (!this.fullName || !this.phone || !this.email || !this.password) {
      const alert = await this.alertController.create({
        header: this.currentLanguage === 'pt' ? 'Campos obrigatórios' : 'Required fields',
        message: this.currentLanguage === 'pt' 
          ? 'Por favor, preencha todos os campos.' 
          : 'Please fill in all fields.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    if (!this.acceptedTerms) {
      const alert = await this.alertController.create({
        header: this.currentLanguage === 'pt' ? 'Termos e Condições' : 'Terms and Conditions',
        message: this.currentLanguage === 'pt' 
          ? 'Por favor, aceite os Termos de Uso e a Política de Privacidade.' 
          : 'Please accept the Terms of Use and Privacy Policy.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      const alert = await this.alertController.create({
        header: this.currentLanguage === 'pt' ? 'Email inválido' : 'Invalid email',
        message: this.currentLanguage === 'pt' 
          ? 'Por favor, insira um email válido.' 
          : 'Please enter a valid email.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    // Validate password length
    if (this.password.length < 6) {
      const alert = await this.alertController.create({
        header: this.currentLanguage === 'pt' ? 'Senha fraca' : 'Weak password',
        message: this.currentLanguage === 'pt' 
          ? 'A senha deve ter pelo menos 6 caracteres.' 
          : 'Password must be at least 6 characters long.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    // Register user in database
    try {
      console.log('=== REGISTRATION ATTEMPT ===');
      console.log('Name:', this.fullName);
      console.log('Email:', this.email);
      console.log('Phone:', this.phone);
      console.log('Password length:', this.password?.length);
      
      const result = await this.dataService.register(
        this.email,
        this.password,
        this.fullName
      );
      
      console.log('Registration result:', result);

      if (result) {
        console.log('Registration successful!');
        // Show success alert before navigating
        const alert = await this.alertController.create({
          header: this.currentLanguage === 'pt' ? 'Sucesso!' : 'Success!',
          message: this.currentLanguage === 'pt' 
            ? 'Conta criada com sucesso! Complete o seu perfil.' 
            : 'Account created successfully! Complete your profile.',
          buttons: [{
            text: 'OK',
            handler: () => {
              this.router.navigate(['/completarperfil']);
            }
          }]
        });
        await alert.present();
      } else {
        console.log('Registration failed - Email already exists');
        const alert = await this.alertController.create({
          header: this.currentLanguage === 'pt' ? 'Erro' : 'Error',
          message: this.currentLanguage === 'pt' 
            ? 'Este email já está registado. Tente fazer login.' 
            : 'This email is already registered. Try logging in.',
          buttons: ['OK']
        });
        await alert.present();
      }
    } catch (error) {
      console.error('Registration error:', error);
      const alert = await this.alertController.create({
        header: this.currentLanguage === 'pt' ? 'Erro' : 'Error',
        message: this.currentLanguage === 'pt' 
          ? 'Ocorreu um erro ao criar a conta. Detalhes: ' + error 
          : 'An error occurred while creating the account. Details: ' + error,
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
