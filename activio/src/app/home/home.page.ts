import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonButtons,
  IonButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  notificationsOutline,
  bicycleOutline,
  waterOutline,
  barbellOutline,
  walkOutline,
  timeOutline,
  fitnessOutline,
  flameOutline,
  home,
  list,
  addCircle,
  statsChart,
  person
} from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonLabel,
    IonButtons,
    IonButton
  ],
})
export class HomePage {
  constructor() {
    addIcons({
      'notifications-outline': notificationsOutline,
      'bicycle-outline': bicycleOutline,
      'water-outline': waterOutline,
      'barbell-outline': barbellOutline,
      'walk-outline': walkOutline,
      'time-outline': timeOutline,
      'fitness-outline': fitnessOutline,
      'flame-outline': flameOutline,
      'home': home,
      'list': list,
      'add-circle': addCircle,
      'stats-chart': statsChart,
      'person': person
    });
  }
}
