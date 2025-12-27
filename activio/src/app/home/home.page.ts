import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  notificationsOutline,
  barbellOutline,
  flameOutline,
  addOutline,
  chevronDownOutline,
  home,
  statsChartOutline,
  pieChartOutline,
  personOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class HomePage {

  constructor() {
    addIcons({
      notificationsOutline,
      barbellOutline,
      flameOutline,
      addOutline,
      chevronDownOutline,
      home,
      statsChartOutline,
      pieChartOutline,
      personOutline
    });
  }
}
