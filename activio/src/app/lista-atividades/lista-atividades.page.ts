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
    this.loadActivities();
  }

  // ✅ CORREÇÃO: Método separado para carregar atividades
  ionViewWillEnter() {
    // Recarrega sempre que a página é exibida (útil após criar/editar)
    this.loadActivities();
  }

  private loadActivities() {
    // Carregar atividades reais do utilizador
    this.activities = this.atividadesService.getAtividades();
    this.applyFilters();
  }

  // ✅ CORREÇÃO: Atualização de favorito simplificada
  toggleFav(activity: any) {
    activity.favorite = !activity.favorite;

    // Atualizar no serviço
    this.atividadesService.updateAtividade(activity.id, activity);

    // Toast notification com tradução
    const message = activity.favorite 
      ? this.t('listaAtividades.addedToFavorites') 
      : this.t('listaAtividades.removedFromFavorites');
    this.atividadesService.showToast(message);
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
    this.showIntensidadeFilter = false;
  }

  toggleIntensidadeFilter() {
    this.showIntensidadeFilter = !this.showIntensidadeFilter;
    this.showAtividadeFilter = false;
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

  // ✅ CORREÇÃO: Eliminar atividade com traduções e lógica corrigida
  eliminarAtividade(activityId: string) {
    this.atividadesService.showConfirmAlert(
      this.t('listaAtividades.deleteTitle'),
      this.t('listaAtividades.deleteMessage'),
      () => {
        const success = this.atividadesService.deleteAtividade(activityId);
        if (success) {
          // Recarregar atividades após eliminação
          this.loadActivities();
          this.atividadesService.showToast(this.t('listaAtividades.activityDeleted'));
        }
      }
    );
  }
}