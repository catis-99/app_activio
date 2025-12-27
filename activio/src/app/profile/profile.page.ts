import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { I18nService } from '../services/i18n.service';

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
    photo: 'assets/profile-photo.jpg',
    height: '180cm',
    weight: '63kg',
    age: '22'
  };

  constructor(private router: Router, private i18nService: I18nService) { }

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
    console.log('Menu aberto');
  }

  t(key: string): string {
    return this.i18nService.t(key);
  }
}
