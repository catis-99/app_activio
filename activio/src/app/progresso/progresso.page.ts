import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon, IonButton, AlertController } from '@ionic/angular/standalone';
import { I18nService } from '../services/i18n.service';
import { DataService, TrainingDay, WeightData } from '../services/data.service';
import { addIcons } from 'ionicons';
import { chevronBack, ellipsisHorizontal, chevronBackOutline } from 'ionicons/icons';

interface ActivityStats {
  name: string;
  percentage: number;
  color: string;
}

interface MonthlyActivity {
  week: number;
  football: number;
  ciclismo: number;
  natacao: number;
  atletismo: number;
  ginasio: number;
  yoga: number;
}

@Component({
  selector: 'app-progresso',
  templateUrl: './progresso.page.html',
  styleUrls: ['./progresso.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonIcon,
    IonButton,
    FormsModule
  ]
})
export class ProgressoPage implements OnInit {
  trainingDays: TrainingDay[] = [];
  weightData: WeightData = { start: 0, current: 0, goal: 0 };
  activityStats: ActivityStats[] = [];
  monthlyActivities: MonthlyActivity[] = [];

  private readonly ACTIVITY_COLORS: { [key: string]: string } = {
    'football': '#64B5F6',
    'ciclismo': '#FF9800',
    'natacao': '#03A9F4',
    'atletismo': '#9C27B0',
    'ginasio': '#4CAF50',
    'yoga': '#E91E63',
    'caminhar': '#FFC107',
    'saltarCord': '#F44336'
  };

  constructor(
    private location: Location,
    private i18nService: I18nService,
    private dataService: DataService,
    private cdr: ChangeDetectorRef,
    private alertController: AlertController
  ) {
    addIcons({ chevronBackOutline, ellipsisHorizontal, chevronBack });
  }

  async ngOnInit() {
    await this.loadData();
  }

  async ionViewWillEnter() {
    await this.loadData();
  }

  async loadData() {
    this.trainingDays = await this.dataService.getTrainingDays();
    this.weightData = await this.dataService.getWeightData();
    await this.loadActivityStats();
    await this.loadMonthlyActivities();
  }

  async loadActivityStats() {
    const stats = await this.dataService.getActivityStats();

    this.activityStats = stats.map(stat => {
      const normalizedType = stat.activityType.toLowerCase();
      
      return {
        name: this.t(`atividades.${normalizedType}`),
        percentage: stat.percentage,
        color: this.ACTIVITY_COLORS[normalizedType] || '#999999'
      };
    });
  }

  async loadMonthlyActivities() {
    this.monthlyActivities = await this.dataService.getMonthlyActivities();
  }

  t(key: string): string {
    return this.i18nService.t(key);
  }

  goBack() {
    this.location.back();
  }

  // ========== GRÁFICO DE BARRAS (Tempo Treinado) ==========
  
  getBarClass(hours: number): string {
    if (hours === 0) return 'bar-empty';
    if (hours <= 1) return 'bar-low';
    if (hours <= 2) return 'bar-medium';
    if (hours <= 3) return 'bar-high';
    return 'bar-max';
  }

  getMaxTrainingHours(): number {
    if (!this.trainingDays || this.trainingDays.length === 0) return 4;
    const maxHours = Math.max(...this.trainingDays.map(d => d.hours));
    return Math.ceil(maxHours * 2) / 2 || 4;
  }

  getBarHeight(hours: number): number {
    const maxHours = this.getMaxTrainingHours();
    if (maxHours === 0) return 0;
    return (hours / maxHours) * 100;
  }

  // ========== GRÁFICO DE PIZZA (Atividades Favoritas) ==========
  
  getPieSlices(): { path: string; color: string }[] {
    if (!this.activityStats || this.activityStats.length === 0) {
      return [];
    }

    const slices: { path: string; color: string }[] = [];
    let currentAngle = -90;
    const radius = 50;
    const cx = 70;
    const cy = 70;

    this.activityStats.forEach((activity) => {
      const percentage = activity.percentage;
      
      // Caso especial: atividade com 100%
      if (percentage >= 100) {
        const path = `M ${cx} ${cy - radius} A ${radius} ${radius} 0 1 1 ${cx - 0.001} ${cy - radius} Z`;
        slices.push({ path, color: activity.color });
        return;
      }

      // Ignora percentagens muito pequenas
      if (percentage <= 0) {
        return;
      }

      const angleSize = (percentage / 100) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angleSize;

      if (angleSize < 0.1) {
        return;
      }

      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;

      const x1 = cx + radius * Math.cos(startRad);
      const y1 = cy + radius * Math.sin(startRad);
      const x2 = cx + radius * Math.cos(endRad);
      const y2 = cy + radius * Math.sin(endRad);

      const largeArc = angleSize > 180 ? 1 : 0;
      const path = `M ${cx},${cy} L ${x1},${y1} A ${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z`;

      slices.push({ path, color: activity.color });
      currentAngle = endAngle;
    });

    return slices;
  }

  // ========== GRÁFICO DE LINHAS (Atividades por Mês) ==========
  
  getLinePoints(activityType: 'football' | 'ciclismo' | 'atletismo' | 'ginasio' | 'natacao' | 'yoga'): string {
    if (!this.monthlyActivities || this.monthlyActivities.length === 0) {
      return '';
    }

    const points = this.monthlyActivities.map((activity, index) => {
      const x = 45 + (index * 70);
      const maxHours = 50;
      const hours = activity[activityType] || 0;
      const y = 140 - ((hours / maxHours) * 120);
      return `${x},${y}`;
    });

    return points.join(' ');
  }

  getLineColor(activityType: string): string {
    return this.ACTIVITY_COLORS[activityType] || '#999999';
  }

  // ========== GRÁFICO DE PESO ==========
  
  getCurrentWeightPosition(): number {
    if (!this.weightData.start || !this.weightData.goal) return 0;
    
    const range = Math.abs(this.weightData.start - this.weightData.goal);
    if (range === 0) return 0;
    
    const currentProgress = Math.abs(this.weightData.start - this.weightData.current);
    return Math.max(0, Math.min(100, (currentProgress / range) * 100));
  }

  getStartMarkerPosition(): number {
    return 0;
  }

  getCurrentMarkerPosition(): number {
    return this.getCurrentWeightPosition();
  }

  getGoalMarkerPosition(): number {
    return 100;
  }

  hasWeightData(): boolean {
    return this.weightData.start > 0 && this.weightData.goal > 0;
  }

  // ========== MÉTODOS DE ATUALIZAÇÃO ==========
  
  async updateWeight(newWeight: number) {
    await this.dataService.updateWeight(newWeight);
    this.weightData = await this.dataService.getWeightData();
    this.cdr.detectChanges();
  }

  async addTrainingHours(dayLabel: string, hours: number) {
    await this.dataService.addTrainingHours(dayLabel, hours);
    this.trainingDays = await this.dataService.getTrainingDays();
    this.cdr.detectChanges();
  }
  
  async limparTudo() {
    await this.dataService.clearUserData();
    await this.loadData();
  };


  

  private async showToast(message: string) {
    console.log('📢 Toast:', message);
  }
}