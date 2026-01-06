import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { I18nService } from '../services/i18n.service';
import { DataService } from '../services/data.service';

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

  constructor(
    private router: Router,
    private i18nService: I18nService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.loadUserProfile();
  }

  async loadUserProfile() {
    const profile = await this.dataService.getUserProfile();
    const latestProgress = await this.dataService.getLatestProgress();

    this.userProfile.name = profile.name || 'Utilizador';
    this.userProfile.height = profile.height ? `${profile.height}` : '';
    this.userProfile.weight = latestProgress?.weight ? `${latestProgress.weight}` : profile.weight ? `${profile.weight}` : '';
    this.userProfile.age = profile.age ? `${profile.age}` : '';
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
