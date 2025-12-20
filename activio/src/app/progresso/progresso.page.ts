import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { IonContent, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBack, ellipsisHorizontal } from 'ionicons/icons';

interface TrainingDay {
  label: string;
  hours: number;
}

@Component({
  selector: 'app-progresso',
  templateUrl: './progresso.page.html',
  styleUrls: ['./progresso.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonIcon]
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

  constructor(private location: Location) {
    // Registrar os ícones
    addIcons({
      'chevron-back': chevronBack,
      'ellipsis-horizontal': ellipsisHorizontal
    });
  }

  ngOnInit() {}

  goBack() {
    this.location.back();
  }
}