import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-criar-atividade',
  templateUrl: './criar-atividade.page.html',
  styleUrls: ['./criar-atividade.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class CriarAtividadePage {
  atividade = {
    data: 'Qui, 27 Maio 2025',
    hora: 3,
    minuto: 30,
    periodo: 'PM',
    tipo: 'Ciclismo',
    intensidade: 'Alta',
    duracao: '',
    calorias: '',
    local: ''
  };

  // Opções para o time picker
  horas = Array.from({ length: 12 }, (_, i) => i + 1);
  minutos = Array.from({ length: 60 }, (_, i) => i);

  constructor(private router: Router) { }

  closeModal() {
    this.router.navigate(['/home']);
  }

  openMenu() {
    console.log('Menu aberto');
  }

  abrirCalendario() {
    console.log('Abrir calendário');
    // Implementar modal de calendário
  }

  escolherAtividade() {
    console.log('Escolher atividade');
    // Implementar modal de seleção de atividade
  }

  alterarIntensidade() {
    const intensidades = ['Baixa', 'Média', 'Alta'];
    const currentIndex = intensidades.indexOf(this.atividade.intensidade);
    const nextIndex = (currentIndex + 1) % intensidades.length;
    this.atividade.intensidade = intensidades[nextIndex];
  }

  abrirDuracao() {
    console.log('Abrir duração');
    // Implementar modal de duração
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
    console.log('Guardar atividade:', this.atividade);
    // Implementar lógica de guardar
    this.router.navigate(['/home']);
  }
}