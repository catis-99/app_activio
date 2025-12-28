import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { IonContent, IonIcon, IonButton } from '@ionic/angular/standalone';
import { I18nService } from '../services/i18n.service';
import { addIcons } from 'ionicons';
import { chevronBack, ellipsisHorizontal, chevronBackOutline } from 'ionicons/icons';

interface TrainingDay {
  label: string;
  hours: number;
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
    IonButton // 🔑 Adicionado para poder usar <ion-button>
  ]
})
export class ProgressoPage implements OnInit {
  trainingDays: TrainingDay[] = [
    { label: 'Seg', hours: 2 },
    { label: 'Ter', hours: 2.5 },
    { label: 'Qua', hours: 1.5 },
    { label: 'Qui', hours: 3 },
    { label: 'Sex', hours: 0 },
    { label: 'Sáb', hours: 3.5 },
    { label: 'Dom', hours: 1.5 }
  ];

  constructor(private location: Location, private i18nService: I18nService) {
    // Registrar os ícones
    addIcons({ chevronBackOutline, ellipsisHorizontal, chevronBack });
  }

  ngOnInit() { }

  // Função para traduzir
  t(key: string): string {
    return this.i18nService.t(key);
  }

  goBack() {
    this.location.back();
  }
}
