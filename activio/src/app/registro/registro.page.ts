import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonItem, IonIcon, IonInput, IonCheckbox, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

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

  constructor(private router: Router) { }

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

  onRegister() {
    if (!this.fullName || !this.phone || !this.email || !this.password) {
      console.log('Please fill all fields');
      return;
    }

    if (!this.acceptedTerms) {
      console.log('Please accept terms and conditions');
      return;
    }

    // Implement registration logic here
    console.log('Register:', { 
      fullName: this.fullName, 
      phone: this.phone, 
      email: this.email 
    });
    
    // Navigate to success page after registration
    this.router.navigate(['/sucesso-registo']);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
