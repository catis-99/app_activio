import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { I18nService } from '../services/i18n.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterLink]
})
export class ProfilePage implements OnInit {
  userProfile = {
    name: '',
    photo: 'assets/perfil.svg',
    height: '',
    weight: '',
    age: ''
  };

  constructor(private router: Router, private i18nService: I18nService) { }

  ngOnInit() {
    this.loadUserProfile();
  }

  loadUserProfile() {
    // Carregar dados do localStorage se existirem
    this.userProfile.name = localStorage.getItem('userName') || 'Utilizador';
    this.userProfile.height = localStorage.getItem('userHeight') || '';
    this.userProfile.weight = localStorage.getItem('userWeight') || '';
    this.userProfile.age = localStorage.getItem('userAge') || '';
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  editProfile() {
    this.router.navigate(['/completarperfil']);
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  openMenu() {
    console.log('Menu aberto');
  }

  t(key: string): string {
    return this.i18nService.t(key);
  }
}
