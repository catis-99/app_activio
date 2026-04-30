import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  ellipsisHorizontal,
  personOutline,
  mailOutline,
  barbellOutline,
  swapVerticalOutline,
  chevronForwardOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class EditarPerfilPage implements OnInit {
  private location = inject(Location);
  private router = inject(Router);
  private dataService = inject(DataService);
  private alertController = inject(AlertController);

  userProfile = {
    name: '',
    email: '',
    weight: '',
    height: ''
  };

  constructor() {
    addIcons({
      chevronBackOutline,
      ellipsisHorizontal,
      personOutline,
      mailOutline,
      barbellOutline,
      swapVerticalOutline,
      chevronForwardOutline
    });
  }

  async ngOnInit() {
    await this.loadUserProfile();
  }

  async loadUserProfile() {
    const profile = await this.dataService.getUserProfile();
    const latestProgress = await this.dataService.getLatestProgress();

    this.userProfile.name = profile.name || '';
    this.userProfile.email = profile.email || '';
    this.userProfile.weight = latestProgress?.weight ? `${latestProgress.weight}` : profile.weight ? `${profile.weight}` : '';
    this.userProfile.height = profile.height ? `${profile.height}` : '';
  }

  goBack() {
    this.location.back();
  }

  openMenu() {
    console.log('Open menu');
  }

  async editField(field: 'name' | 'email' | 'weight' | 'height') {
    const fieldLabels = {
      name: 'Nome',
      email: 'Email',
      weight: 'Peso (kg)',
      height: 'Altura (cm)'
    };

    const alert = await this.alertController.create({
      header: `Editar ${fieldLabels[field]}`,
      inputs: [
        {
          name: field,
          type: field === 'email' ? 'email' : 'text',
          placeholder: fieldLabels[field],
          value: this.userProfile[field]
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'OK',
          handler: (data) => {
            this.userProfile[field] = data[field];
          }
        }
      ]
    });

    await alert.present();
  }

  async saveProfile() {
    try {
      const profile = await this.dataService.getUserProfile();
      
      // Update profile
      const updatedProfile: any = {
        ...profile,
        name: this.userProfile.name,
        email: this.userProfile.email
      };
      
      if (this.userProfile.height) {
        updatedProfile.height = parseInt(this.userProfile.height);
      }
      if (this.userProfile.weight) {
        updatedProfile.weight = parseInt(this.userProfile.weight);
      }
      
      await this.dataService.saveUserProfile(updatedProfile);

      // Show success alert
      const alert = await this.alertController.create({
        header: 'Sucesso',
        message: 'Perfil atualizado com sucesso!',
        buttons: ['OK']
      });
      await alert.present();

      // Navigate back
      this.goBack();
    } catch (error) {
      const alert = await this.alertController.create({
        header: 'Erro',
        message: 'Erro ao guardar o perfil. Tente novamente.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }
}
