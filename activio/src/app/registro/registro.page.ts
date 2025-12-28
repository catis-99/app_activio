import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ⚠️ ESSENCIAL para [(ngModel)]
import { Router } from '@angular/router';
import { I18nService } from '../services/i18n.service';
import {
  IonContent,
  IonItem,
  IonInput,
  IonIcon,
  IonButton,
  IonCheckbox
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline,
  callOutline,
  mailOutline,
  lockClosedOutline,
  eyeOffOutline,
  eyeOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true, // ⚠️ STANDALONE = true
  imports: [
    CommonModule,
    FormsModule,      // ⚠️ OBRIGATÓRIO para [(ngModel)]
    IonContent,
    IonItem,
    IonInput,
    IonIcon,
    IonButton,
    IonCheckbox
  ]
})
export class RegistroPage implements OnInit {
  // Dados do formulário
  fullName: string = '';
  phone: string = '';
  email: string = '';
  password: string = '';
  acceptedTerms: boolean = false;
  showPassword: boolean = false;
  currentLanguage: string = 'pt';

  constructor(private router: Router, private i18nService: I18nService) {
    // Registrar os ícones necessários
    addIcons({ personOutline, callOutline, mailOutline, lockClosedOutline, eyeOffOutline, eyeOutline });
    this.currentLanguage = this.i18nService.getCurrentLanguage();
  }

  ngOnInit() { }

  /**
   * Toggle para mostrar/esconder password
   */
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  /**
   * Validação do formulário
   */
  validateForm(): boolean {
    // Temporariamente desativada para permitir registro sem dados
    return true;

    /*
    if (!this.fullName.trim()) {
      this.showError('Nome completo é obrigatório');
      return false;
    }

    if (!this.phone.trim()) {
      this.showError('Telemóvel é obrigatório');
      return false;
    }

    if (!this.email.trim()) {
      this.showError('Email é obrigatório');
      return false;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.showError('Email inválido');
      return false;
    }

    if (!this.password || this.password.length < 6) {
      this.showError('Palavra-passe deve ter pelo menos 6 caracteres');
      return false;
    }

    if (!this.acceptedTerms) {
      this.showError('Deve aceitar os termos e condições');
      return false;
    }

    return true;
    */
  }

  /**
   * Mostrar erro (você pode substituir por Toast/Alert)
   */
  showError(message: string) {
    console.error(message);
    // TODO: Implementar toast ou alert
    // Exemplo:
    // const toast = await this.toastController.create({
    //   message: message,
    //   duration: 2000,
    //   color: 'danger'
    // });
    // toast.present();
  }

  t(key: string): any {
    const result = this.i18nService.t(key);
    return result;
  }

  /**
   * Mudar idioma
   */
  changeLanguage(lang: string) {
    this.currentLanguage = lang;
    this.i18nService.setLanguage(lang);
  }

  /**
   * Método chamado ao clicar no botão Registar
   */
  onRegister() {
    if (!this.validateForm()) {
      return;
    }

    // Dados do registro
    const registrationData = {
      fullName: this.fullName,
      phone: this.phone,
      email: this.email,
      password: this.password
    };

    console.log('✅ Dados de registro:', registrationData);

    // TODO: Chamada à API
    // this.authService.register(registrationData).subscribe({
    //   next: (response) => {
    //     console.log('Conta criada com sucesso');
    //     this.router.navigate(['/completarperfil']);
    //   },
    //   error: (error) => {
    //     console.error('Erro ao criar conta', error);
    //     this.showError('Erro ao criar conta. Tente novamente.');
    //   }
    // });

    // Por enquanto, apenas navega para completar perfil
    this.router.navigate(['/completarperfil']);
  }

  /**
   * Método para navegar para a página de login
   */
  goToLogin() {
    console.log('Navegar para login');
    this.router.navigate(['/login']);
  }

  /**
   * Método para abrir política de privacidade
   */
  openPrivacyPolicy() {
    console.log('Abrir Política de Privacidade');
    // this.router.navigate(['/privacy-policy']);
    // OU abrir em modal/browser externo
  }

  /**
   * Método para abrir termos de utilização
   */
  openTerms() {
    console.log('Abrir Termos de Utilização');
    // this.router.navigate(['/terms']);
    // OU abrir em modal/browser externo
  }
}