import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonIcon, NavController } from '@ionic/angular/standalone';
import { I18nService } from '../services/i18n.service';
import { addIcons } from 'ionicons';
import { chevronBackOutline, addOutline, chevronDownOutline, heart, heartOutline, createOutline, trashOutline } from 'ionicons/icons';
import { Router } from '@angular/router';
import { AtividadesService } from '../services/atividades.service';

@Component({
  selector: 'app-lista-atividades',
  templateUrl: './lista-atividades.page.html',
  styleUrls: ['./lista-atividades.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonIcon, CommonModule, FormsModule]
})
export class ListaAtividadesPage implements OnInit {
  activities: any[] = [];
  filteredActivities: any[] = [];
  filtroAtividade = 'todas';
  filtroIntensidade = 'todas';
  showAtividadeFilter = false;
  showIntensidadeFilter = false;

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private atividadesService: AtividadesService,
    private i18nService: I18nService
  ) {
    addIcons({ chevronBackOutline, addOutline, chevronDownOutline, createOutline, trashOutline, heart, heartOutline });
  }

  // Função para traduzir
  t(key: string): string {
    return this.i18nService.t(key);
  }

  // Traduzir nome da atividade
  translateActivityName(name: string): string {
    const mapping: { [key: string]: string } = {
      'Ciclismo': 'atividades.ciclismo',
      'Atletismo': 'atividades.atletismo',
      'Ginásio': 'atividades.ginasio',
      'Futebol': 'atividades.football',
      'Natação': 'atividades.natacao',
      'Yoga': 'atividades.yoga'
    };
    const translationKey = mapping[name];
    return translationKey ? this.t(translationKey) : name;
  }

  navigateToCriarAtividade() {
    this.router.navigate(['/criar-atividade']);
  }
  // Traduzir intensidade
  translateIntensity(intensity: string): string {
    const mapping: { [key: string]: string } = {
      'Baixa': 'intensidade.baixa',
      'Média': 'intensidade.media',
      'Alta': 'intensidade.alta'
    };
    const translationKey = mapping[intensity];
    return translationKey ? this.t(translationKey) : intensity;
  }

  ngOnInit() {
    // Carregar atividades do localStorage
    this.activities = this.atividadesService.getAtividades();

    // Se não houver atividades, criar algumas de exemplo
    if (this.activities.length === 0) {
      this.createSampleActivities();
    }

    // Aplicar filtros iniciais
    this.applyFilters();
  }

  toggleFav(activity: any) {
    activity.favorite = !activity.favorite;

    // Toast notification
    const message = activity.favorite ? 'Adicionado aos favoritos!' : 'Removido dos favoritos!';
    this.atividadesService.showToast(message);

    // Salvar no localStorage
    this.saveActivitiesToStorage();
  }

  private saveActivitiesToStorage() {
    this.atividadesService.saveAtividades(this.activities);
    this.applyFilters(); // Atualizar filtros após salvar
  }

  // Métodos de filtro
  applyFilters() {
    this.filteredActivities = this.activities.filter(activity => {
      const matchAtividade = this.filtroAtividade === 'todas' || activity.tipo === this.filtroAtividade;
      const matchIntensidade = this.filtroIntensidade === 'todas' || activity.intensidade === this.filtroIntensidade;
      return matchAtividade && matchIntensidade;
    });
  }

  toggleAtividadeFilter() {
    this.showAtividadeFilter = !this.showAtividadeFilter;
    this.showIntensidadeFilter = false; // Fechar o outro filtro
  }

  toggleIntensidadeFilter() {
    this.showIntensidadeFilter = !this.showIntensidadeFilter;
    this.showAtividadeFilter = false; // Fechar o outro filtro
  }

  setFiltroAtividade(filtro: string) {
    this.filtroAtividade = filtro;
    this.showAtividadeFilter = false;
    this.applyFilters();
  }

  setFiltroIntensidade(filtro: string) {
    this.filtroIntensidade = filtro;
    this.showIntensidadeFilter = false;
    this.applyFilters();
  }

  goHome() {
    console.log('Navigating to home...');
    this.router.navigate(['/home']).then(success => {
      if (success) {
        console.log('Navigation to home successful');
      } else {
        console.error('Navigation to home failed');
      }
    });
  }

  editarAtividade(activityId: string) {
    this.router.navigate(['/criar-atividade'], { queryParams: { edit: true, id: activityId } });
  }

  eliminarAtividade(activityId: string) {
    this.atividadesService.showConfirmAlert(
      'Eliminar Atividade',
      'Tem certeza de que deseja eliminar esta atividade?',
      () => {
        const success = this.atividadesService.deleteAtividade(activityId);
        if (success) {
          // Atualizar a lista local
          this.activities = this.activities.filter(a => a.id !== activityId);
        }
      }
    );
  }

  private createSampleActivities() {
    const sampleActivities = [
      {
        id: '1',
        name: 'Ciclismo',
        date: '12/10/2025',
        time: '45 min',
        intensity: 'Moderada',
        icon: 'assets/atividades/ciclismo.svg',
        favorite: true,
        tipo: 'Ciclismo',
        intensidade: 'Média',
        hora: 15,
        minuto: 30,
        periodo: 'PM' as 'AM' | 'PM',
        duracao: '45',
        calorias: '300',
        local: 'Parque da Cidade',
        data: 'Seg, 25 Maio 2025'
      },
      {
        id: '2',
        name: 'Atletismo',
        date: '12/10/2025',
        time: '45 min',
        intensity: 'Moderada',
        icon: 'assets/atividades/atletismo.svg',
        favorite: false,
        tipo: 'Atletismo',
        intensidade: 'Média',
        hora: 7,
        minuto: 0,
        periodo: 'AM' as 'AM' | 'PM',
        duracao: '45',
        calorias: '250',
        local: 'Pista de Atletismo',
        data: 'Ter, 26 Maio 2025'
      },
      {
        id: '3',
        name: 'Ginásio',
        date: '12/10/2025',
        time: '45 min',
        intensity: 'Moderada',
        icon: 'assets/atividades/ginasio.svg',
        favorite: true,
        tipo: 'Ginásio',
        intensidade: 'Alta',
        hora: 18,
        minuto: 30,
        periodo: 'PM' as 'AM' | 'PM',
        duracao: '60',
        calorias: '400',
        local: 'Fitness Center',
        data: 'Qua, 27 Maio 2025'
      },
      {
        id: '4',
        name: 'Futebol',
        date: '12/10/2025',
        time: '45 min',
        intensity: 'Moderada',
        icon: 'assets/atividades/futebol.svg',
        favorite: false,
        tipo: 'Futebol',
        intensidade: 'Alta',
        hora: 16,
        minuto: 0,
        periodo: 'PM' as 'AM' | 'PM',
        duracao: '90',
        calorias: '500',
        local: 'Campo de Futebol',
        data: 'Qui, 28 Maio 2025'
      },
      {
        id: '5',
        name: 'Natação',
        date: '12/10/2025',
        time: '45 min',
        intensity: 'Moderada',
        icon: 'assets/atividades/natacao.svg',
        favorite: true,
        tipo: 'Natação',
        intensidade: 'Média',
        hora: 8,
        minuto: 0,
        periodo: 'AM' as 'AM' | 'PM',
        duracao: '45',
        calorias: '350',
        local: 'Piscina Municipal',
        data: 'Sex, 29 Maio 2025'
      },
      {
        id: '6',
        name: 'Yoga',
        date: '12/10/2025',
        time: '45 min',
        intensity: 'Moderada',
        icon: 'assets/atividades/yoga.svg',
        favorite: false,
        tipo: 'Yoga',
        intensidade: 'Baixa',
        hora: 19,
        minuto: 30,
        periodo: 'PM' as 'AM' | 'PM',
        duracao: '60',
        calorias: '150',
        local: 'Estúdio de Yoga',
        data: 'Sáb, 30 Maio 2025'
      }
    ];

    this.activities = sampleActivities;
    this.saveActivitiesToStorage();
  }
}

