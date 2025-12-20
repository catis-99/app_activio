// conquista.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import {
  IonContent,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  chevronBackOutline,
  ellipsisHorizontal,
  trophyOutline,
  flameOutline,
  ribbonOutline,
  starOutline,
  medalOutline,
  rocketOutline,
  flashOutline,
  heartOutline,
  fitnessOutline,
  barbellOutline,
  stopwatchOutline,
  podiumOutline
} from 'ionicons/icons';

interface Badge {
  id: number;
  label: string;
  icon: string;
  description?: string;
}

@Component({
  selector: 'app-conquistas',
  templateUrl: './conquistas.page.html',
  styleUrls: ['./conquistas.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonButton,
    IonIcon
  ]
})
export class ConquistasPage implements OnInit {
  // Badges conquistados
  achievedBadges: Badge[] = [
    {
      id: 1,
      label: 'Primeira Vitória',
      icon: 'assets/badges/trophy.svg',
      description: 'Completou o primeiro treino'
    },
    {
      id: 2,
      label: 'Sequência de 7 dias',
      icon: 'assets/badges/flame.svg',
      description: 'Treinou 7 dias seguidos'
    },
    {
      id: 3,
      label: 'Maratonista',
      icon: 'assets/badges/ribbon.svg',
      description: 'Completou 5km de corrida'
    },
    {
      id: 4,
      label: 'Estrela em Ascensão',
      icon: 'assets/badges/star.svg',
      description: 'Alcançou nível 5'
    },
    {
      id: 5,
      label: 'Campeão do Mês',
      icon: 'assets/badges/medal.svg',
      description: 'Melhor desempenho mensal'
    },
    {
      id: 6,
      label: 'Super Rápido',
      icon: 'assets/badges/rocket.svg',
      description: 'Bateu recorde pessoal'
    }
  ];

  // Badges por conquistar
  lockedBadges: Badge[] = [
    {
      id: 7,
      label: 'Raio de Energia',
      icon: 'assets/badges/flash-locked.svg',
      description: 'Complete 10 treinos intensos'
    },
    {
      id: 8,
      label: 'Coração de Ferro',
      icon: 'assets/badges/heart-locked.svg',
      description: 'Treine por 30 dias consecutivos'
    },
    {
      id: 9,
      label: 'Fitness Master',
      icon: 'assets/badges/fitness-locked.svg',
      description: 'Alcance todos os objetivos mensais'
    },
    {
      id: 10,
      label: 'Força Total',
      icon: 'assets/badges/barbell-locked.svg',
      description: 'Levante 1000kg acumulados'
    },
    {
      id: 11,
      label: 'Velocista',
      icon: 'assets/badges/stopwatch-locked.svg',
      description: 'Corra 5km em menos de 25 minutos'
    },
    {
      id: 12,
      label: 'Pódio de Ouro',
      icon: 'assets/badges/podium-locked.svg',
      description: 'Fique em 1º lugar no ranking'
    }
  ];

  constructor(private location: Location) {
    // Registrar os ícones necessários
    addIcons({
      'chevron-back-outline': chevronBackOutline,
      'ellipsis-horizontal': ellipsisHorizontal,
      'trophy-outline': trophyOutline,
      'flame-outline': flameOutline,
      'ribbon-outline': ribbonOutline,
      'star-outline': starOutline,
      'medal-outline': medalOutline,
      'rocket-outline': rocketOutline,
      'flash-outline': flashOutline,
      'heart-outline': heartOutline,
      'fitness-outline': fitnessOutline,
      'barbell-outline': barbellOutline,
      'stopwatch-outline': stopwatchOutline,
      'podium-outline': podiumOutline
    });
  }

  ngOnInit() {
    // Pode carregar badges da API aqui
    this.loadBadges();
  }

  /**
   * Carregar badges (simula chamada à API)
   */
  loadBadges() {
    // Exemplo de como você carregaria da API:
    // this.badgeService.getUserBadges().subscribe(
    //   (data) => {
    //     this.achievedBadges = data.achieved;
    //     this.lockedBadges = data.locked;
    //   }
    // );
  }

  /**
   * Voltar para a página anterior
   */
  goBack() {
    this.location.back();
  }

  /**
   * Abrir menu de opções
   */
  openMenu() {
    console.log('Abrir menu de opções');
    // Implementar action sheet ou popover
  }

  /**
   * Ver detalhes de um badge
   */
  viewBadgeDetails(badge: Badge) {
    console.log('Ver detalhes do badge:', badge);
    // Abrir modal com detalhes do badge
  }

  /**
   * Obter estatísticas de conquistas
   */
  getAchievementStats() {
    const total = this.achievedBadges.length + this.lockedBadges.length;
    const achieved = this.achievedBadges.length;
    const percentage = Math.round((achieved / total) * 100);

    return {
      total,
      achieved,
      locked: this.lockedBadges.length,
      percentage
    };
  }

  /**
   * Compartilhar conquista
   */
  shareBadge(badge: Badge) {
    console.log('Compartilhar badge:', badge.label);
    // Implementar compartilhamento social
    // if (navigator.share) {
    //   navigator.share({
    //     title: `Conquistei: ${badge.label}`,
    //     text: badge.description,
    //     url: window.location.href
    //   });
    // }
  }
}