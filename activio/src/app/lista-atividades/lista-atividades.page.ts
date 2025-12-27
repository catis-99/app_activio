import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline, addOutline, chevronDownOutline, heart, heartOutline } from 'ionicons/icons';

@Component({
  selector: 'app-lista-atividades',
  templateUrl: './lista-atividades.page.html',
  styleUrls: ['./lista-atividades.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, CommonModule, FormsModule]
})
export class ListaAtividadesPage {

  toggleFav(activity: any) {
    activity.favorite = !activity.favorite;
  }


  constructor() {
    addIcons({
      'chevron-back-outline': chevronBackOutline,
      'add-outline': addOutline,
      'chevron-down-outline': chevronDownOutline,
      'heart': heart,
      'heart-outline': heartOutline
    });
  }

  activities = [
    {
      name: 'Ciclismo',
      date: '12/10/2025',
      time: '45 min',
      intensity: 'Moderada',
      icon: 'assets/atividades/ciclismo.svg',
      favorite: true
    },
    {
      name: 'Atletismo',
      date: '12/10/2025',
      time: '45 min',
      intensity: 'Moderada',
      icon: 'assets/atividades/atletismo.svg',
      favorite: false
    },
    {
      name: 'Ginásio',
      date: '12/10/2025',
      time: '45 min',
      intensity: 'Moderada',
      icon: 'assets/atividades/ginasio.svg',
      favorite: true
    },
    {
      name: 'Futebol',
      date: '12/10/2025',
      time: '45 min',
      intensity: 'Moderada',
      icon: 'assets/atividades/futebol.svg',
      favorite: false
    },
    {
      name: 'Natação',
      date: '12/10/2025',
      time: '45 min',
      intensity: 'Moderada',
      icon: 'assets/atividades/natacao.svg',
      favorite: true
    },
    {
      name: 'Yoga',
      date: '12/10/2025',
      time: '45 min',
      intensity: 'Moderada',
      icon: 'assets/atividades/yoga.svg',
      favorite: false
    }
  ];

}
