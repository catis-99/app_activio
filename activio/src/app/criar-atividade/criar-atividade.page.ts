import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AtividadesService, Atividade } from '../services/atividades.service';
import { DataService } from '../services/data.service';
import { I18nService } from '../services/i18n.service';
import { PickerController } from '@ionic/angular';
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
  chevronForwardOutline,
  documentTextOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-criar-atividade',
  templateUrl: './criar-atividade.page.html',
  styleUrls: ['./criar-atividade.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class CriarAtividadePage implements OnInit {
  editMode = false;
  atividadeId: string | null = null;
  showCalendar = false;
  dataSelecionada = new Date().toISOString();

  // ✅ CORRIGIDO: Inicializar com dados vazios/padrão do utilizador
  atividade: Partial<Atividade> & { periodo: 'AM' | 'PM', intensidade: 'Baixa' | 'Média' | 'Alta' } = {
    data: this.formatarData(new Date()), // Data atual
    hora: 12,
    minuto: 0,
    periodo: 'PM' as 'AM' | 'PM',
    tipo: '', // Vazio até o utilizador escolher
    intensidade: 'Média' as 'Baixa' | 'Média' | 'Alta', // Valor padrão razoável
    duracao: '',
    calorias: '',
    local: '',
    notas: ''
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private atividadesService: AtividadesService,
    private dataService: DataService,
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
      chevronForwardOutline,
      documentTextOutline
    });
  }

  ngOnInit() {
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
          local: atividade.local,
          notas: atividade.notas
        };

        // Atualizar dataSelecionada para o calendário
        const parsedDate = this.parseActivityDate(atividade.data);
        this.dataSelecionada = parsedDate.toISOString();
      } else {
        this.atividadesService.showToast('Atividade não encontrada!', 'danger');
        this.router.navigate(['/lista-atividades']);
      }
    }
  }

  goMyActivities() {
    this.router.navigate(['/lista-atividades']);
  }

  get pageTitle() {
    return this.editMode ? 'Editar Atividade' : 'Criar Atividade';
  }

  abrirCalendario() {
    this.showCalendar = true;
  }

  fecharCalendario() {
    this.showCalendar = false;
  }

  onDataChange(event: any) {
    const selectedDate = new Date(event.detail.value);
    this.atividade.data = this.formatarData(selectedDate);
    this.dataSelecionada = event.detail.value;
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

  async escolherAtividade() {
    const picker = await this.pickerController.create({
      columns: [
        {
          name: 'atividade',
          options: [
            { text: this.t('atividades.ciclismo'), value: 'Ciclismo' },
            { text: this.t('atividades.atletismo'), value: 'Atletismo' },
            { text: this.t('atividades.ginasio'), value: 'Ginásio' },
            { text: this.t('atividades.football'), value: 'Futebol' },
            { text: this.t('atividades.natacao'), value: 'Natação' },
            { text: this.t('atividades.yoga'), value: 'Yoga' },
          ],
          selectedIndex: this.getSelectedActivityIndex()
        }
      ],
      buttons: [
        { text: this.t('criarAtividade.cancel'), role: 'cancel' },
        {
          text: this.t('criarAtividade.save'),
          handler: (value: any) => {
            this.atividade.tipo = value.atividade.value;
            console.log('✅ Atividade selecionada:', this.atividade.tipo);
          }
        }
      ]
    });
    await picker.present();
  }

  // ✅ NOVO: Helper para manter seleção atual
  private getSelectedActivityIndex(): number {
    const activities = ['Ciclismo', 'Atletismo', 'Ginásio', 'Futebol', 'Natação', 'Yoga'];
    const index = activities.indexOf(this.atividade.tipo as string);
    return index >= 0 ? index : 0;
  }

  async alterarIntensidade() {
    const intensidades: Array<'Baixa' | 'Média' | 'Alta'> = ['Baixa', 'Média', 'Alta'];
    const currentIndex = intensidades.indexOf(this.atividade.intensidade);

    const picker = await this.pickerController.create({
      columns: [
        {
          name: 'intensidade',
          options: [
            { text: this.t('intensidade.baixa'), value: 'Baixa' },
            { text: this.t('intensidade.media'), value: 'Média' },
            { text: this.t('intensidade.alta'), value: 'Alta' }
          ],
          selectedIndex: currentIndex >= 0 ? currentIndex : 1
        }
      ],
      buttons: [
        { text: this.t('criarAtividade.cancel'), role: 'cancel' },
        {
          text: this.t('criarAtividade.save'),
          handler: (value: any) => {
            this.atividade.intensidade = value.intensidade.value as 'Baixa' | 'Média' | 'Alta';
            console.log('✅ Intensidade atualizada:', this.atividade.intensidade);
          }
        }
      ]
    });
    await picker.present();
  }

  async abrirDuracao() {
    const duracoes = ['15', '30', '45', '60', '90', '120'];
    const currentIndex = duracoes.indexOf(this.atividade.duracao as string);

    const picker = await this.pickerController.create({
      columns: [
        {
          name: 'duracao',
          options: [
            { text: '15 min', value: '15' },
            { text: '30 min', value: '30' },
            { text: '45 min', value: '45' },
            { text: '60 min', value: '60' },
            { text: '90 min', value: '90' },
            { text: '120 min', value: '120' }
          ],
          selectedIndex: currentIndex >= 0 ? currentIndex : 0
        }
      ],
      buttons: [
        { text: this.t('criarAtividade.cancel'), role: 'cancel' },
        {
          text: this.t('criarAtividade.save'),
          handler: (value: any) => {
            this.atividade.duracao = value.duracao.value;
            console.log('✅ Duração atualizada:', this.atividade.duracao);
          }
        }
      ]
    });
    await picker.present();
  }

  async abrirTimePicker() {
    // Converter valores atuais para índices
    const currentHora = this.atividade.hora || 12;
    const horaIndex = currentHora - 1;

    const minutoOptions = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
    const currentMinuto = this.atividade.minuto !== undefined ? this.atividade.minuto : 0;
    const minutoIndex = minutoOptions.indexOf(currentMinuto);

    console.log('🕐 Valores atuais:', {
      hora: currentHora,
      horaIndex,
      minuto: currentMinuto,
      minutoIndex,
      periodo: this.atividade.periodo
    });

    const picker = await this.pickerController.create({
      columns: [
        {
          name: 'hour',
          options: Array.from({ length: 12 }, (_, i) => ({
            text: (i + 1).toString(),
            value: i + 1
          })),
          selectedIndex: horaIndex >= 0 && horaIndex < 12 ? horaIndex : 11
        },
        {
          name: 'minute',
          options: minutoOptions.map(m => ({
            text: m.toString().padStart(2, '0'),
            value: m
          })),
          selectedIndex: minutoIndex >= 0 ? minutoIndex : 0
        },
        {
          name: 'period',
          options: [
            { text: 'AM', value: 'AM' },
            { text: 'PM', value: 'PM' }
          ],
          selectedIndex: this.atividade.periodo === 'AM' ? 0 : 1
        }
      ],
      buttons: [
        { text: this.t('criarAtividade.cancel'), role: 'cancel' },
        {
          text: this.t('criarAtividade.save'),
          handler: (value: any) => {
            console.log('🕐 Valores selecionados:', value);
            this.atividade.hora = value.hour.value;
            this.atividade.minuto = value.minute.value;
            this.atividade.periodo = value.period.value;
            console.log('🕐 Atividade atualizada:', {
              hora: this.atividade.hora,
              minuto: this.atividade.minuto,
              periodo: this.atividade.periodo
            });
          }
        }
      ]
    });
    await picker.present();
  }

  // ✅ CORRIGIDO: Mapear TODAS as atividades disponíveis
  private mapActivityType(tipo: string): 'football' | 'ciclismo' | 'atletismo' | 'ginasio' | 'natacao' | 'yoga' | null {
    const tipoLower = tipo.toLowerCase();

    if (tipoLower.includes('futebol')) return 'football';
    if (tipoLower.includes('ciclismo')) return 'ciclismo';
    if (tipoLower.includes('atletismo')) return 'atletismo';
    if (tipoLower.includes('ginásio') || tipoLower.includes('ginasio')) return 'ginasio';
    if (tipoLower.includes('natação') || tipoLower.includes('natacao')) return 'natacao';
    if (tipoLower.includes('yoga')) return 'yoga';

    // Atividades que não são rastreadas nos gráficos
    return null;
  }

  async guardarAtividade() {
    // ✅ CORRIGIDO: Validação completa
    if (!this.atividade.tipo || this.atividade.tipo.trim() === '') {
      this.atividadesService.showToast('Por favor, escolha uma atividade!', 'warning');
      return;
    }

    if (!this.atividade.duracao) {
      this.atividadesService.showToast('Por favor, selecione a duração!', 'warning');
      return;
    }

    if (!this.atividade.calorias || parseInt(this.atividade.calorias as string) <= 0) {
      this.atividadesService.showToast('Por favor, insira as calorias queimadas!', 'warning');
      return;
    }

    if (!this.atividade.local || this.atividade.local.trim() === '') {
      this.atividadesService.showToast('Por favor, insira o local!', 'warning');
      return;
    }

    // Converter duração de minutos para horas
    const duracaoMinutos = parseInt(this.atividade.duracao as string);
    const duracaoHoras = duracaoMinutos / 60;

    // Mapear o tipo de atividade
    const activityType = this.mapActivityType(this.atividade.tipo as string);

    // Parsear a data da atividade
    const activityDate = this.parseActivityDate(this.atividade.data as string);

    try {
      if (this.editMode && this.atividadeId) {
        const success = this.atividadesService.updateAtividade(this.atividadeId, this.atividade);
        if (success) {
          // Atualizar gráficos se for uma atividade rastreada
          if (activityType) {
            await this.dataService.recordActivity(activityType, duracaoHoras, activityDate);
          }
          this.atividadesService.showToast('Atividade atualizada com sucesso!', 'success');
          this.router.navigate(['/lista-atividades']);
        } else {
          this.atividadesService.showToast('Erro ao atualizar atividade!', 'danger');
        }
      } else {
        // Criar nova atividade
        this.atividadesService.createAtividade(this.atividade);

        // Registar atividade nos gráficos se for uma atividade rastreada
        if (activityType) {
          await this.dataService.recordActivity(activityType, duracaoHoras, activityDate);
          console.log(`✅ Atividade ${activityType} registada: ${duracaoHoras}h em ${activityDate.toLocaleDateString()}`);
        }

        this.atividadesService.showToast('Atividade criada com sucesso!', 'success');
        this.router.navigate(['/lista-atividades']);
      }
    } catch (error) {
      console.error('Erro ao guardar atividade:', error);
      this.atividadesService.showToast('Erro ao guardar atividade!', 'danger');
    }
  }

  // ✅ CORRIGIDO: Melhor tratamento de erros e suporte para diferentes formatos
  private parseActivityDate(dataStr: string): Date {
    const meses: { [key: string]: number } = {
      'janeiro': 0, 'fevereiro': 1, 'março': 2, 'abril': 3,
      'maio': 4, 'junho': 5, 'julho': 6, 'agosto': 7,
      'setembro': 8, 'outubro': 9, 'novembro': 10, 'dezembro': 11
    };

    try {
      // Remover dia da semana se existir (formato: "Qui, 27 Maio 2025")
      const datePart = dataStr.includes(',') ? dataStr.split(',')[1].trim() : dataStr.trim();
      const parts = datePart.split(' ');

      if (parts.length !== 3) {
        throw new Error('Formato de data inválido');
      }

      const dia = parseInt(parts[0]);
      const mesNome = parts[1].toLowerCase();
      const ano = parseInt(parts[2]);

      const mes = meses[mesNome];

      if (mes === undefined || isNaN(dia) || isNaN(ano)) {
        throw new Error('Componentes de data inválidos');
      }

      // Criar data às 12:00 para evitar problemas de timezone
      const date = new Date(ano, mes, dia, 12, 0, 0);

      // Validar se a data é válida
      if (isNaN(date.getTime())) {
        throw new Error('Data inválida');
      }

      return date;
    } catch (error) {
      console.error('Erro ao parsear data:', dataStr, error);
      // Retornar data atual em caso de erro
      return new Date();
    }
  }

  t(key: string): string {
    return this.i18nService.t(key);
  }
}