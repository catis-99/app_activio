import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonIcon, IonButton } from '@ionic/angular/standalone';
import { I18nService } from '../services/i18n.service';
import { DataService, TrainingDay, WeightData } from '../services/data.service';
import { addIcons } from 'ionicons';
import { chevronBack, ellipsisHorizontal, chevronBackOutline } from 'ionicons/icons';

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
  weightData: WeightData = { start: 68, current: 63, goal: 58 };
  maxWeight: number = 70;

  constructor(
    private location: Location,
    private i18nService: I18nService,
    private dataService: DataService
  ) {
    addIcons({ chevronBackOutline, ellipsisHorizontal, chevronBack });
  }

  async ngOnInit() {
    await this.loadData();
  }

  async loadData() {
    this.trainingDays = await this.dataService.getTrainingDays();
    this.weightData = await this.dataService.getWeightData();
  }

  t(key: string): string {
    return this.i18nService.t(key);
  }

  goBack() {
    this.location.back();
  }

  getBarClass(hours: number): string {
    if (hours === 0) return 'bar-empty';
    if (hours <= 1) return 'bar-low';
    if (hours <= 2) return 'bar-medium';
    if (hours <= 3) return 'bar-high';
    return 'bar-max';
  }

  getWeightLossPercent(): number {
    const totalLoss = this.weightData.start - this.weightData.goal;
    const currentLoss = this.weightData.start - this.weightData.current;
    return Math.round((currentLoss / totalLoss) * 100);
  }

  getCurrentWeightPosition(): number {
    // Barra de progresso: quanto já foi alcançado do objetivo (0 a 100%)
    // Início (68) -> Objetivo (58), então Início = 0%, Objetivo = 100%
    const range = this.weightData.start - this.weightData.goal;
    const currentProgress = this.weightData.start - this.weightData.current;
    return (currentProgress / range) * 100;
  }

  getStartMarkerPosition(): number {
    // Início está posicionado a 10% para dar espaçamento à esquerda
    return 10;
  }

  getCurrentMarkerPosition(): number {
    // Posição atual baseada no progresso (ajustada para ficar mais próxima)
    const range = this.weightData.start - this.weightData.goal;
    const currentProgress = this.weightData.start - this.weightData.current;
    const percent = (currentProgress / range) * 100;
    // Mapeia 0-100% para 20-80%
    return 20 + (percent * 0.6);
  }

  getGoalMarkerPosition(): number {
    // Objetivo está posicionado a 90% para dar espaçamento à direita
    return 90;
  }

  async updateWeight(newWeight: number) {
    await this.dataService.updateWeight(newWeight);
    this.weightData = await this.dataService.getWeightData();
  }

  async addTrainingHours(dayLabel: string, hours: number) {
    await this.dataService.addTrainingHours(dayLabel, hours);
    this.trainingDays = await this.dataService.getTrainingDays();
  }
}
