import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonItem, IonIcon, IonInput, IonCheckbox, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [IonContent, IonItem, IonIcon, IonInput, IonCheckbox, IonButton, CommonModule, FormsModule]
})
export class RegistroPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
