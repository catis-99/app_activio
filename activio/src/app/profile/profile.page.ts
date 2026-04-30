import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { I18nService } from '../services/i18n.service';
import { DataService } from '../services/data.service';
import { addIcons } from 'ionicons';
import { cloudDownloadOutline } from 'ionicons/icons';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterLink]
})
export class ProfilePage implements OnInit {
  private router = inject(Router);
  private i18nService = inject(I18nService);
  private dataService = inject(DataService);

  userProfile = {
    name: '',
    photo: 'assets/perfil.svg',
    height: '',
    weight: '',
    age: ''
  };

  constructor() {
    addIcons({ cloudDownloadOutline });
  }

  ngOnInit() {
    this.loadUserProfile();
  }

  ionViewWillEnter() {
    // Recarregar perfil sempre que entrar na página
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

  async loadGumballlProfile() {
    try {
      await this.dataService.loadGumballlProfile();
      await this.loadUserProfile();
      console.log('✅ Perfil Gumballl carregado com sucesso!');
      alert('Perfil Gumballl carregado! Verifique o progresso, conquistas e atividades.');
    } catch (error) {
      console.error('❌ Erro ao carregar perfil Gumballl:', error);
      alert('Erro ao carregar perfil Gumballl. Verifique o console.');
    }
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  editProfile() {
    this.router.navigate(['/editar-perfil']);
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  openMenu() {
    console.log('Menu aberto');
  }

  logout() {
    // Placeholder: add real logout logic (clear tokens, call API, etc.)
    this.router.navigate(['/login']);
  }

  t(key: string): string {
    return this.i18nService.t(key);
  }
}
