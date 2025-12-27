import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent,
  IonItem,
  IonInput,
  IonIcon,
  IonButton,
  IonSelect,
  IonSelectOption
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline,
  calendarOutline,
  mailOutline,
  trendingUpOutline
} from 'ionicons/icons';
import { I18nService } from '../services/i18n.service';

@Component({
  selector: 'app-completarperfil',
  templateUrl: './completarperfil.page.html',
  styleUrls: ['./completarperfil.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonItem,
    IonInput,
    IonIcon,
    IonButton,
    IonSelect,
    IonSelectOption
  ]
})
export class CompletarperfilPage implements OnInit {
  // Dados do perfil
  gender: string = '';
  birthdate: string = '';
  weight: number | null = null;
  height: number | null = null;

  // Data máxima (hoje)
  maxDate: string;
  // Data mínima (18 anos atrás)
  minDate: string;

  constructor(
    private router: Router,
    private i18nService: I18nService
  ) {
    // Registrar os ícones necessários
    addIcons({ personOutline, calendarOutline, mailOutline, trendingUpOutline });

    // Configurar datas
    const today = new Date();
    this.maxDate = this.formatDate(today);

    // Data mínima: 100 anos atrás
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 100);
    this.minDate = this.formatDate(minDate);
  }

  // Função para traduzir
  t(key: string): string {
    return this.i18nService.t(key);
  }

  ngOnInit() {
    // Verificar se há dados do registro no localStorage/state
    this.loadUserData();
  }

  /**
   * Formatar data para o formato YYYY-MM-DD
   */
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Carregar dados do usuário (se existirem)
   */
  loadUserData() {
    // Se você salvou dados do registro, pode carregá-los aqui
    // const userData = localStorage.getItem('userData');
    // if (userData) {
    //   const data = JSON.parse(userData);
    //   // Carregar dados...
    // }
  }

  /**
   * Validar formulário
   */
  validateForm(): boolean {
    if (!this.gender) {
      this.showError('Por favor, escolhe o teu género');
      return false;
    }

    if (!this.birthdate) {
      this.showError('Por favor, insere a tua data de nascimento');
      return false;
    }

    // Validar idade mínima (ex: 13 anos)
    const birthDate = new Date(this.birthdate);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }

    if (calculatedAge < 13) {
      this.showError('Deves ter pelo menos 13 anos para usar a aplicação');
      return false;
    }

    if (!this.weight || this.weight <= 0 || this.weight > 500) {
      this.showError('Por favor, insere um peso válido (1-500 kg)');
      return false;
    }

    if (!this.height || this.height <= 0 || this.height > 300) {
      this.showError('Por favor, insere uma altura válida (1-300 cm)');
      return false;
    }

    return true;
  }

  /**
   * Mostrar erro
   */
  showError(message: string) {
    console.error(message);
    // TODO: Implementar toast
    // const toast = await this.toastController.create({
    //   message: message,
    //   duration: 3000,
    //   color: 'danger',
    //   position: 'top'
    // });
    // toast.present();
  }

  /**
   * Calcular IMC (Índice de Massa Corporal)
   */
  calculateBMI(): number | null {
    if (!this.weight || !this.height) return null;

    const heightInMeters = this.height / 100;
    const bmi = this.weight / (heightInMeters * heightInMeters);
    return Math.round(bmi * 10) / 10;
  }

  /**
   * Calcular idade
   */
  calculateAge(): number | null {
    if (!this.birthdate) return null;

    const birthDate = new Date(this.birthdate);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }

    return calculatedAge;
  }

  /**
   * Método chamado ao clicar em "Próximo"
   */
  onNext() {
    if (!this.validateForm()) {
      return;
    }

    // Dados do perfil completo
    const profileData = {
      gender: this.gender,
      birthdate: this.birthdate,
      age: this.calculateAge(),
      weight: this.weight,
      height: this.height,
      bmi: this.calculateBMI()
    };

    console.log('✅ Perfil completo:', profileData);

    // Salvar dados (localStorage ou enviar para API)
    // localStorage.setItem('userProfile', JSON.stringify(profileData));

    // TODO: Enviar para API
    // this.userService.updateProfile(profileData).subscribe({
    //   next: (response) => {
    //     console.log('Perfil atualizado com sucesso');
    //     this.router.navigate(['/home']);
    //   },
    //   error: (error) => {
    //     console.error('Erro ao atualizar perfil', error);
    //     this.showError('Erro ao salvar perfil. Tente novamente.');
    //   }
    // });

    // Por enquanto, navega para a home
    this.router.navigate(['/home']);
  }

  /**
   * Voltar para a página anterior
   */
  goBack() {
    this.router.navigate(['/registro']);
  }
}