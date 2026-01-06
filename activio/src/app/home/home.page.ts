import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, PickerController } from '@ionic/angular';
import { Router } from '@angular/router';
import { I18nService } from '../services/i18n.service';
import { AtividadesService, Atividade } from '../services/atividades.service';
import { DataService } from '../services/data.service';
import { addIcons } from 'ionicons';
import {
  notificationsOutline,
  barbellOutline,
  flameOutline,
  addOutline,
  chevronDownOutline,
  chevronBackOutline,
  chevronForwardOutline,
  home,
  statsChartOutline,
  pieChartOutline,
  personOutline,
  settingsOutline,
  listOutline,
  calendarOutline,
  analyticsOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class HomePage implements OnInit {
  selectedPeriod: 'week' | 'month' = 'month';
  isPeriodDropdownOpen = false;
  isMonthYearPickerOpen = false;

  // Dados do calendário nativo
  selectedDate = new Date();
  currentMonth = new Date();

  // Anos disponíveis no picker
  availableYears: number[] = [];
  months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  // Dados reais das atividades
  atividades: Atividade[] = [];
  atividadesPorDia: { [key: string]: Atividade[] } = {};

  // Dados do utilizador
  userName: string = 'Luna';
  workoutDays: number = 0;
  totalWorkoutDays: number = 7;
  burnedCalories: number = 0;

  // Dados mock para gráficos (mantidos)
  weeklyData = [30, 45, 20, 60, 35, 50, 40]; // minutos por dia da semana

  // Array para gerar dias do calendário
  calendarDays: number[] = [];

  constructor(
    private router: Router,
    private i18nService: I18nService,
    private atividadesService: AtividadesService,
    private pickerController: PickerController,
    private dataService: DataService
  ) {
    addIcons({
      notificationsOutline,
      barbellOutline,
      flameOutline,
      addOutline,
      chevronDownOutline,
      chevronBackOutline,
      chevronForwardOutline,
      home,
      statsChartOutline,
      pieChartOutline,
      personOutline,
      settingsOutline,
      listOutline,
      calendarOutline,
      analyticsOutline
    });

    this.loadAtividades();
    this.generateCalendarDays();
    this.generateAvailableYears();
  }

  async ngOnInit() {
    await this.loadUserData();
  }

  async loadUserData() {
    const profile = await this.dataService.getUserProfile();
    this.userName = profile.name || 'Luna';

    const stats = await this.dataService.getWeeklyStats();
    this.workoutDays = stats.totalWorkouts;
    this.burnedCalories = stats.totalCaloriesBurned;
  }

  generateAvailableYears() {
    const currentYear = new Date().getFullYear();
    this.availableYears = [];
    // Gerar anos de 1900 até 100 anos no futuro
    for (let year = 1900; year <= currentYear + 100; year++) {
      this.availableYears.push(year);
    }
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

  selectYear(year: number) {
    this.currentMonth = new Date(year, this.currentMonth.getMonth(), 1);
    this.generateCalendarDays();
  }

  selectMonthYear(month: number, year: number) {
    this.currentMonth = new Date(year, month, 1);
    this.generateCalendarDays();
  }

  // Carregar atividades do serviço
  loadAtividades() {
    this.atividades = this.atividadesService.getAtividades();
    this.organizarAtividadesPorDia();
  }

  // Organizar atividades por dia
  organizarAtividadesPorDia() {
    this.atividadesPorDia = {};
    this.atividades.forEach(atividade => {
      // Extrair número do dia da data (assumindo formato "Qui, 27 Maio 2025")
      const dayMatch = atividade.data.match(/(\d{1,2})/);
      if (dayMatch) {
        const day = dayMatch[1];
        const monthYear = atividade.data.replace(/\d{1,2},?\s*/, ''); // Remove o dia

        const dateKey = `${day}-${monthYear}`;
        if (!this.atividadesPorDia[dateKey]) {
          this.atividadesPorDia[dateKey] = [];
        }
        this.atividadesPorDia[dateKey].push(atividade);
      }
    });
  }

  // Gerar dias do calendário atual
  generateCalendarDays() {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();

    // Obter primeiro dia do mês e quantos dias tem
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    this.calendarDays = Array.from({ length: lastDay.getDate() }, (_, i) => i + 1);
  }

  // Função para traduzir
  t(key: string): string {
    return this.i18nService.t(key);
  }

  // Navegação
  navigateToCriarAtividade() {
    this.router.navigate(['/criar-atividade']);
  }

  navigateToProgresso() {
    this.router.navigate(['/progresso']);
  }

  navigateToConquistas() {
    this.router.navigate(['/conquistas']);
  }

  navigateToProfile() {
    this.router.navigate(['/profile']);
  }

  navigateToSettings() {
    this.router.navigate(['/settings']);
  }

  navigateToListaAtividades() {
    this.router.navigate(['/lista-atividades']);
  }

  // Gestão do período
  togglePeriodDropdown() {
    this.isPeriodDropdownOpen = !this.isPeriodDropdownOpen;
  }

  selectPeriod(period: 'week' | 'month') {
    this.selectedPeriod = period;
    this.isPeriodDropdownOpen = false;
  }

  getPeriodLabel(): string {
    return this.t(`home.${this.selectedPeriod}`);
  }

  // Helper para obter nome do dia da semana
  getDayName(index: number): string {
    const days = this.t('calendario.days');
    return Array.isArray(days) ? days[index] : '';
  }

  // Helper para obter dados do gráfico baseado no período
  getChartData() {
    switch (this.selectedPeriod) {
      case 'week':
        return this.weeklyData;
      case 'month':
        return this.getActivitiesForMonth();
      default:
        return this.weeklyData;
    }
  }

  // Obter atividades do mês atual para o gráfico
  getActivitiesForMonth() {
    const monthActivities = [];
    for (let day = 1; day <= this.calendarDays.length; day++) {
      const activitiesForDay = this.getAtividadesDoDia(day);
      monthActivities.push({
        day,
        activity: activitiesForDay.length
      });
    }
    return monthActivities;
  }

  // Helper para obter intensidade da atividade (para cores dos pontos)
  getActivityIntensity(atividade: Atividade): string {
    switch (atividade.intensidade) {
      case 'Alta': return 'high';
      case 'Média': return 'medium';
      case 'Baixa': return 'low';
      default: return 'low';
    }
  }

  // Helper para obter atividades de um dia específico
  getAtividadesDoDia(dayNumber: number): Atividade[] {
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    const currentMonthName = monthNames[this.currentMonth.getMonth()];
    const currentYear = this.currentMonth.getFullYear();

    const dateKey = `${dayNumber}-${currentMonthName} ${currentYear}`;
    return this.atividadesPorDia[dateKey] || [];
  }

  // Helper para verificar se um dia tem atividades
  hasActivitiesOnDay(dayNumber: number): boolean {
    return this.getAtividadesDoDia(dayNumber).length > 0;
  }

  // Métodos para o calendário customizado
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
    return day === this.selectedDate.getDate() &&
      this.currentMonth.getMonth() === this.selectedDate.getMonth() &&
      this.currentMonth.getFullYear() === this.selectedDate.getFullYear();
  }

  hasActivity(day: number): boolean {
    return this.hasActivitiesOnDay(day);
  }

  selectDay(day: number) {
    this.selectedDate = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), day);
  }

  // Handler para mudança de data no calendário nativo
  onDateChange(event: any) {
    const selectedDate = new Date(event.detail.value);
    this.selectedDate = selectedDate;
    this.currentMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    this.generateCalendarDays();

    // Atualizar indicadores após mudança de data
    setTimeout(() => {
      this.addActivityIndicatorsToCalendar();
    }, 100);
  }

  // Adicionar indicadores de atividade diretamente no calendário nativo
  addActivityIndicatorsToCalendar() {
    const calendarElement = document.querySelector('ion-datetime.calendar-datetime') as any;
    if (!calendarElement) return;

    // Aguardar o calendário carregar completamente
    setTimeout(() => {
      const calendarDays = calendarElement.shadowRoot?.querySelectorAll('.calendar-day');
      if (!calendarDays) return;

      calendarDays.forEach((dayElement: any, index: number) => {
        // Calcular a data deste dia
        const dayNumber = index + 1;
        const atividadesDoDia = this.getAtividadesDoDia(dayNumber);

        if (atividadesDoDia.length > 0) {
          // Verificar tipos de intensidade presentes
          const hasLow = atividadesDoDia.some(a => a.intensidade === 'Baixa');
          const hasMedium = atividadesDoDia.some(a => a.intensidade === 'Média');
          const hasHigh = atividadesDoDia.some(a => a.intensidade === 'Alta');

          // Adicionar atributos data baseados na intensidade
          if (hasLow) dayElement.setAttribute('data-activity-low', 'true');
          if (hasMedium) dayElement.setAttribute('data-activity-medium', 'true');
          if (hasHigh) dayElement.setAttribute('data-activity-high', 'true');
        }
      });
    }, 200);
  }
}
