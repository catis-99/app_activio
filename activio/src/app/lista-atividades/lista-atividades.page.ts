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
    this.router.navigate(['/home']);
  }

  goMyActivities() {
    this.router.navigate(['/lista-atividades']);
  }

  // Função para construir o horário formatado
  formatTime(hora: number, minuto: number, periodo: 'AM' | 'PM'): string {
    const horaFormatada = hora.toString().padStart(2, '0');
    const minutoFormatado = minuto.toString().padStart(2, '0');
    return `${horaFormatada}:${minutoFormatado} ${periodo}`;
  }

  // Função para obter o ícone da atividade
  getActivityIcon(tipo: string): string {
    const iconMapping: { [key: string]: string } = {
      'Ciclismo': 'assets/atividades/ciclismo.svg',
      'Atletismo': 'assets/atividades/atletismo.svg',
      'Ginásio': 'assets/atividades/ginasio.svg',
      'Futebol': 'assets/atividades/futebol.svg',
      'Natação': 'assets/atividades/natacao.svg',
      'Yoga': 'assets/atividades/yoga.svg'
    };
    return iconMapping[tipo] || 'assets/atividades/ciclismo.svg';
  }

  editarAtividade(activityId: string) {
    this.router.navigate(['/editar-atividade', activityId]);
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
        data: 'Seg, 25 Maio 2025',
        hora: 15,
        minuto: 30,
        periodo: 'PM' as 'AM' | 'PM',
        tipo: 'Ciclismo',
        intensidade: 'Média' as 'Baixa' | 'Média' | 'Alta',
        duracao: '45',
        calorias: '300',
        local: 'Parque da Cidade',
        favorite: true
      },
      {
        id: '2',
        data: 'Ter, 26 Maio 2025',
        hora: 7,
        minuto: 0,
        periodo: 'AM' as 'AM' | 'PM',
        tipo: 'Atletismo',
        intensidade: 'Média' as 'Baixa' | 'Média' | 'Alta',
        duracao: '45',
        calorias: '250',
        local: 'Pista de Atletismo',
        favorite: false
      },
      {
        id: '3',
        data: 'Qua, 27 Maio 2025',
        hora: 18,
        minuto: 30,
        periodo: 'PM' as 'AM' | 'PM',
        tipo: 'Ginásio',
        intensidade: 'Alta' as 'Baixa' | 'Média' | 'Alta',
        duracao: '60',
        calorias: '400',
        local: 'Fitness Center',
        favorite: true
      },
      {
        id: '4',
        data: 'Qui, 28 Maio 2025',
        hora: 16,
        minuto: 0,
        periodo: 'PM' as 'AM' | 'PM',
        tipo: 'Futebol',
        intensidade: 'Alta' as 'Baixa' | 'Média' | 'Alta',
        duracao: '90',
        calorias: '500',
        local: 'Campo de Futebol',
        favorite: false
      },
      {
        id: '5',
        data: 'Sex, 29 Maio 2025',
        hora: 8,
        minuto: 0,
        periodo: 'AM' as 'AM' | 'PM',
        tipo: 'Natação',
        intensidade: 'Média' as 'Baixa' | 'Média' | 'Alta',
        duracao: '45',
        calorias: '350',
        local: 'Piscina Municipal',
        favorite: true
      },
      {
        id: '6',
        data: 'Sáb, 30 Maio 2025',
        hora: 19,
        minuto: 30,
        periodo: 'PM' as 'AM' | 'PM',
        tipo: 'Yoga',
        intensidade: 'Baixa' as 'Baixa' | 'Média' | 'Alta',
        duracao: '60',
        calorias: '150',
        local: 'Estúdio de Yoga',
        favorite: false
      }
    ];

    this.activities = sampleActivities;
    this.saveActivitiesToStorage();
  }
}

