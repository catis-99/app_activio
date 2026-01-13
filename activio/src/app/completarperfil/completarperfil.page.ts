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
  IonSelectOption,
  IonModal,
  IonLabel,
  PickerController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline,
  calendarOutline,
  bodyOutline,
  trendingUpOutline,
  chevronBackOutline,
  chevronDownOutline,
  chevronForwardOutline,
  closeOutline,
  flagOutline
} from 'ionicons/icons';
import { I18nService } from '../services/i18n.service';
import { DataService } from '../services/data.service';
import { AlertController } from '@ionic/angular';

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
    IonSelectOption,
    IonModal,
    IonLabel
  ]
})
export class CompletarperfilPage implements OnInit {
  // Dados do perfil
  gender: string = '';
  birthdate: string = '';
  weight: number | null = null;
  height: number | null = null;
  goalWeight: number | null = null;

  // Controlar a abertura do calendário
  showCalendar = false;

  // Variáveis do calendário mensal customizado
  selectedDate: Date | null = null;
  currentMonth = new Date();
  calendarDays: number[] = [];
  availableYears: number[] = [];
  months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Data máxima (hoje)
  maxDate: string;
  // Data mínima (100 anos atrás)
  minDate: string;

  constructor(
    private router: Router,
    private i18nService: I18nService,
    private pickerController: PickerController,
    private dataService: DataService,
    private alertController: AlertController
  ) {
    // Registrar os ícones necessários
    addIcons({
      personOutline,
      calendarOutline,
      chevronBackOutline,
      chevronDownOutline,
      chevronForwardOutline,
      bodyOutline,
      trendingUpOutline,
      closeOutline,
      flagOutline
    });

    // Configurar datas
    const today = new Date();
    this.maxDate = this.formatDate(today);

    // Data mínima: 100 anos atrás
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 100);
    this.minDate = this.formatDate(minDate);

    // Inicializar calendário customizado
    this.generateCalendarDays();
    this.generateAvailableYears();
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
  async loadUserData() {
    // Carregar dados do DataService
    const profile = await this.dataService.getUserProfile();

    console.log('🔍 Perfil carregado:', profile);
    console.log('🔍 Gender:', profile.gender);
    console.log('🔍 Birthdate:', profile.birthdate);

    this.gender = profile.gender || '';
    this.birthdate = profile.birthdate || '';
    this.weight = profile.weight || null;
    this.height = profile.height || null;
    this.goalWeight = profile.goalWeight || null;

    // Si hay birthdate, actualizar selectedDate
    if (this.birthdate) {
      this.selectedDate = new Date(this.birthdate);
      this.currentMonth = new Date(this.birthdate);
      this.generateCalendarDays();
    }

    console.log('🔍 Valores no formulário:');
    console.log('   Gender:', this.gender);
    console.log('   Birthdate:', this.birthdate);
    console.log('   Weight:', this.weight);
    console.log('   Height:', this.height);
  }

  /**
   * Validar formulário
   */
  validateForm(): boolean {
    console.log('🔍 Validando formulário...');
    console.log('   Gender:', this.gender);
    console.log('   Birthdate:', this.birthdate);
    console.log('   Birthdate type:', typeof this.birthdate);
    console.log('   Birthdate length:', this.birthdate?.length);
    console.log('   Weight:', this.weight);
    console.log('   Height:', this.height);

    if (!this.gender) {
      this.showError('Por favor, escolhe o teu género');
      return false;
    }

    if (!this.birthdate || this.birthdate.trim() === '') {
      console.log('❌ Birthdate vazio ou inválido');
      this.showError('Por favor, insere a tua data de nascimento');
      return false;
    }

    // Validar idade mínima (ex: 13 anos)
    const birthDate = new Date(this.birthdate);
    console.log('📅 Data parsed:', birthDate);

    if (isNaN(birthDate.getTime())) {
      console.log('❌ Data inválida');
      this.showError('Data de nascimento inválida');
      return false;
    }

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

    if (calculatedAge > 120) {
      this.showError('Por favor, insere uma data de nascimento válida');
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

    if (!this.goalWeight || this.goalWeight <= 0 || this.goalWeight > 500) {
      this.showError('Por favor, insere um objetivo de peso válido (1-500 kg)');
      return false;
    }

    return true;
  }

  /**
   * Mostrar erro
   */
  async showError(message: string) {
    const alert = await this.alertController.create({
      header: 'Erro',
      message,
      buttons: ['OK']
    });
    await alert.present();
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
  async onNext() {
    if (!this.validateForm()) {
      return;
    }

    const age = this.calculateAge();

    // Dados do perfil completo
    const profileData = {
      gender: this.gender,
      birthdate: this.birthdate,
      age: age,
      weight: this.weight!,
      height: this.height!,
      bmi: this.calculateBMI()
    };

    try {
      // Buscar perfil atual para manter nome e email
      const currentProfile = await this.dataService.getUserProfile();

      // Atualizar perfil com novos dados
      await this.dataService.saveUserProfile({
        name: currentProfile.name,
        email: currentProfile.email,
        age: age!,
        height: this.height!,
        weight: this.weight!,
        goalWeight: this.goalWeight!,
        gender: this.gender,
        activityLevel: 'Moderado',
        birthdate: this.birthdate
      });

      // Salvar progresso inicial
      const today = new Date().toISOString().split('T')[0];
      await this.dataService.saveProgress({
        date: today,
        weight: this.weight!,
        notes: 'Perfil inicial completado'
      });

      // Inicializar dados de peso para o gráfico
      await this.dataService.saveWeightData({
        start: this.weight!,
        current: this.weight!,
        goal: this.goalWeight!
      });

      console.log('✅ Perfil completo:', profileData);
      console.log('✅ Dados de peso inicializados:', {
        start: this.weight,
        current: this.weight,
        goal: this.goalWeight
      });

      // Mostrar alerta de sucesso e redirecionar para home
      const alert = await this.alertController.create({
        header: 'Sucesso',
        message: 'Perfil completado com sucesso!',
        buttons: [{
          text: 'OK',
          handler: () => {
            this.router.navigate(['/home']);
          }
        }]
      });
      await alert.present();
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      await this.showError('Erro ao salvar o perfil. Tenta novamente.');
    }
  }

  /**
   * Voltar para a página anterior
   */
  goBack() {
    this.router.navigate(['/registro']);
  }

  /**
   * Abrir o calendário
   */
  abrirCalendario() {
    // Se já existe uma data de nascimento, mostrar esse mês
    if (this.birthdate) {
      this.selectedDate = new Date(this.birthdate);
      this.currentMonth = new Date(this.birthdate);
    } else {
      // Se não, mostrar o mês/ano há 25 anos atrás (idade padrão razoável)
      const defaultDate = new Date();
      defaultDate.setFullYear(defaultDate.getFullYear() - 25);
      this.selectedDate = defaultDate;
      this.currentMonth = new Date(defaultDate);
    }
    this.generateCalendarDays();
    this.showCalendar = true;
  }

  /**
   * Fechar o calendário
   */
  fecharCalendario() {
    this.showCalendar = false;
  }

  /**
   * Confirmar fecha seleccionada y cerrar modal
   */
  confirmarData() {
    if (this.selectedDate) {
      this.birthdate = this.formatDate(this.selectedDate);
      console.log('📅 Data confirmada:', this.birthdate);
      console.log('📅 Data selecionada:', this.selectedDate);
    }
    this.fecharCalendario();
  }

  // ===== MÉTODOS DO CALENDÁRIO MENSAL CUSTOMIZADO =====

  generateAvailableYears() {
    const currentYear = new Date().getFullYear();
    this.availableYears = [];
    // Gerar anos de 1900 até ano atual
    for (let year = 1900; year <= currentYear; year++) {
      this.availableYears.push(year);
    }
  }

  generateCalendarDays() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const lastDay = new Date(year, month + 1, 0);
    this.calendarDays = Array.from({ length: lastDay.getDate() }, (_, i) => i + 1);
  }

  getMonthYear(): string {
    const monthNames = [
      'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
      'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
    ];
    return `${monthNames[this.currentMonth.getMonth()]} de ${this.currentMonth.getFullYear()}`;
  }

  previousMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.generateCalendarDays();
  }

  nextMonth() {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.generateCalendarDays();
  }

  getEmptyDays(): number[] {
    const firstDayOfWeek = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1).getDay();
    return Array(firstDayOfWeek).fill(0);
  }

  isToday(day: number): boolean {
    const today = new Date();
    return day === today.getDate() &&
      this.currentMonth.getMonth() === today.getMonth() &&
      this.currentMonth.getFullYear() === today.getFullYear();
  }

  isSelected(day: number): boolean {
    if (!this.selectedDate) return false;
    return day === this.selectedDate.getDate() &&
      this.currentMonth.getMonth() === this.selectedDate.getMonth() &&
      this.currentMonth.getFullYear() === this.selectedDate.getFullYear();
  }

  hasActivity(day: number): boolean {
    // Por enquanto, retornar false - pode ser customizado depois
    return false;
  }

  selectDay(day: number) {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    this.selectedDate = new Date(year, month, day);
    
    console.log('📅 Dia selecionado:', this.selectedDate);
    console.log('📅 Data formatada:', this.formatDate(this.selectedDate));
  }

  toggleMonthYearPicker() {
    this.openMonthYearPicker();
  }

  async openMonthYearPicker() {
    const monthOptions = this.months.map((month, index) => ({
      text: month,
      value: index
    }));

    const yearOptions = this.availableYears.map(year => ({
      text: year.toString(),
      value: year
    }));

    const picker = await this.pickerController.create({
      columns: [
        {
          name: 'month',
          options: monthOptions,
          selectedIndex: this.currentMonth.getMonth()
        },
        {
          name: 'year',
          options: yearOptions,
          selectedIndex: this.availableYears.indexOf(this.currentMonth.getFullYear())
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: (value) => {
            this.selectMonthYear(value.month.value, value.year.value);
          }
        }
      ],
      cssClass: 'month-year-picker-ionic'
    });

    await picker.present();
  }

  selectMonthYear(month: number, year: number) {
    this.currentMonth = new Date(year, month, 1);
    this.generateCalendarDays();
  }

  /**
   * Confirmar data selecionada e fechar modal
   */
  
}