import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AtividadesService, Atividade } from '../services/atividades.service';
import { I18nService } from '../services/i18n.service';
import { PickerController } from '@ionic/angular';
import { IonModal } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  calendarOutline,
  chevronDownOutline,
  closeOutline,
  barbellOutline,
  pulseOutline,
  timerOutline,
  flameOutline,
  locationOutline,
  timeOutline,
  chevronBackOutline,
  addOutline,
  chevronForwardOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-criar-atividade',
  templateUrl: './criar-atividade.page.html',
  styleUrls: ['./criar-atividade.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class CriarAtividadePage {
  editMode = false;
  atividadeId: string | null = null;
  showCalendar = false;
  dataSelecionada = new Date().toISOString();

  atividade: Partial<Atividade> & { periodo: 'AM' | 'PM', intensidade: 'Baixa' | 'Média' | 'Alta' } = {
    data: 'Qui, 27 Maio 2025',
    hora: 3,
    minuto: 30,
    periodo: 'PM' as 'AM' | 'PM',
    tipo: 'Ciclismo',
    intensidade: 'Alta' as 'Baixa' | 'Média' | 'Alta',
    duracao: '',
    calorias: '',
    local: ''
  };

  // Opções para o time picker
  horas = Array.from({ length: 12 }, (_, i) => i + 1);
  minutos = Array.from({ length: 60 }, (_, i) => i);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private atividadesService: AtividadesService,
    private i18nService: I18nService,
    private pickerController: PickerController
  ) {
    addIcons({
      calendarOutline,
      chevronDownOutline,
      closeOutline,
      barbellOutline,
      pulseOutline,
      timerOutline,
      flameOutline,
      locationOutline,
      timeOutline,
      chevronBackOutline,
      addOutline,
      chevronForwardOutline
    });
    this.checkEditMode();
  }

  checkEditMode() {
    this.atividadeId = this.route.snapshot.paramMap.get('id');
    if (this.atividadeId) {
      this.editMode = true;
      this.loadAtividadeData();
    }
  }

  loadAtividadeData() {
    if (this.atividadeId) {
      const atividade = this.atividadesService.getAtividadeById(this.atividadeId);
      if (atividade) {
        this.atividade = {
          data: atividade.data,
          hora: atividade.hora,
          minuto: atividade.minuto,
          periodo: atividade.periodo,
          tipo: atividade.tipo,
          intensidade: atividade.intensidade,
          duracao: atividade.duracao,
          calorias: atividade.calorias,
          local: atividade.local
        };
      } else {
        this.atividadesService.showToast('Atividade não encontrada!', 'danger');
        this.router.navigate(['/lista-atividades']);
      }
    }
  }

  get pageTitle() {
    return this.editMode ? 'Editar Atividade' : 'Criar Atividade';
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  openMenu() {
    console.log('Menu aberto');
  }

  abrirCalendario() {
    console.log('Abrir calendário - showCalendar antes:', this.showCalendar);
    this.showCalendar = true;
    console.log('Abrir calendário - showCalendar depois:', this.showCalendar);
  }

  fecharCalendario() {
    console.log('Fechar calendário');
    this.showCalendar = false;
  }

  onDataChange(event: any) {
    const selectedDate = new Date(event.detail.value);
    this.atividade.data = this.formatarData(selectedDate);
    this.fecharCalendario();
  }

  private formatarData(date: Date): string {
    const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    const diaSemana = diasSemana[date.getDay()];
    const dia = date.getDate().toString().padStart(2, '0');
    const mes = meses[date.getMonth()];
    const ano = date.getFullYear();

    return `${diaSemana}, ${dia} ${mes} ${ano}`;
  }

  escolherAtividade() {
    console.log('Escolher atividade');
    // Implementar modal de seleção de atividade
  }

  alterarIntensidade() {
    const intensidades: ('Baixa' | 'Média' | 'Alta')[] = ['Baixa', 'Média', 'Alta'];
    const currentIndex = intensidades.indexOf(this.atividade.intensidade);
    const nextIndex = (currentIndex + 1) % intensidades.length;
    this.atividade.intensidade = intensidades[nextIndex];
  }

  abrirDuracao() {
    console.log('Abrir duração');
    // Implementar modal de duração
  }

  async abrirTimePicker() {
    const picker = await this.pickerController.create({
      columns: [
        {
          name: 'hour',
          options: [
            { text: '1', value: '1' }, { text: '2', value: '2' }, { text: '3', value: '3' },
            { text: '4', value: '4' }, { text: '5', value: '5' }, { text: '6', value: '6' },
            { text: '7', value: '7' }, { text: '8', value: '8' }, { text: '9', value: '9' },
            { text: '10', value: '10' }, { text: '11', value: '11' }, { text: '12', value: '12' }
          ]
        },
        {
          name: 'minute',
          options: [
            { text: '00', value: '0' }, { text: '05', value: '5' }, { text: '10', value: '10' },
            { text: '15', value: '15' }, { text: '20', value: '20' }, { text: '25', value: '25' },
            { text: '30', value: '30' }, { text: '35', value: '35' }, { text: '40', value: '40' },
            { text: '45', value: '45' }, { text: '50', value: '50' }, { text: '55', value: '55' }
          ]
        },
        {
          name: 'period',
          options: [
            { text: 'AM', value: 'AM' }, { text: 'PM', value: 'PM' }
          ]
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'OK', handler: (value: any) => {
            this.atividade.hora = parseInt(value.hour.value);
            this.atividade.minuto = parseInt(value.minute.value);
            this.atividade.periodo = value.period.value;
          }
        }
      ]
    });
    await picker.present();
  }

  onHoraChange(event: any) {
    this.atividade.hora = parseInt(event.detail.value);
  }

  onMinutoChange(event: any) {
    this.atividade.minuto = parseInt(event.detail.value);
  }

  togglePeriodo() {
    this.atividade.periodo = this.atividade.periodo === 'AM' ? 'PM' : 'AM';
  }

  guardarAtividade() {
    // Validar campos obrigatórios
    if (!this.atividade.data || !this.atividade.tipo || !this.atividade.duracao || !this.atividade.calorias || !this.atividade.local) {
      this.atividadesService.showToast('Por favor, preencha todos os campos obrigatórios!', 'warning');
      return;
    }

    if (this.editMode && this.atividadeId) {
      const success = this.atividadesService.updateAtividade(this.atividadeId, this.atividade);
      if (success) {
        this.router.navigate(['/lista-atividades']);
      }
    } else {
      this.atividadesService.createAtividade(this.atividade);
      this.router.navigate(['/lista-atividades']);
    }
  }

  t(key: string): string {
    return this.i18nService.t(key);
  }
}
