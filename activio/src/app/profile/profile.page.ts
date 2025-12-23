import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class ProfilePage {
  userProfile = {
    name: 'Luna Domingues',
    photo: 'assets/profile-photo.jpg', // Coloque o caminho da sua foto aqui
    height: '180cm',
    weight: '63kg',
    age: '22'
  };

  accountOptions = [
    { icon: 'person-outline', label: 'Informação Pessoal', route: '/personal-info' },
    { icon: 'trophy-outline', label: 'Conquistas', route: '/achievements' },
    { icon: 'time-outline', label: 'Histórico', route: '/history' },
    { icon: 'stats-chart-outline', label: 'Progresso', route: '/progress' }
  ];

  otherOptions = [
    { icon: 'call-outline', label: 'Contactos', route: '/contacts' },
    { icon: 'shield-checkmark-outline', label: 'Política de privacidade', route: '/privacy' },
    { icon: 'settings-outline', label: 'Configurações', route: '/settings' }
  ];

  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  editProfile() {
    this.router.navigate(['/edit-profile']);
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  openMenu() {
    // Implementar menu
    console.log('Menu aberto');
  }
}