import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

export interface Atividade {
    id: string;
    data: string;
    hora: number;
    minuto: number;
    periodo: 'AM' | 'PM';
    tipo: string;
    intensidade: 'Baixa' | 'Média' | 'Alta';
    duracao: string;
    calorias: string;
    local: string;
    notas: string;
    favorite?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class AtividadesService {
    private storageKey = 'atividades_activio';

    constructor(
        private toastController: ToastController,
        private alertController: AlertController
    ) { }

    // ToastController - Funcionalidade obrigatória
    async showToast(message: string, color: string = 'primary') {
        const toast = await this.toastController.create({
            message,
            duration: 2000,
            color,
            position: 'bottom'
        });
        await toast.present();
    }

    // AlertController - Funcionalidade obrigatória
    async showAlert(title: string, message: string) {
        const alert = await this.alertController.create({
            header: title,
            message,
            buttons: ['OK']
        });
        await alert.present();
    }

    async showConfirmAlert(title: string, message: string, onConfirm: () => void) {
        const alert = await this.alertController.create({
            header: title,
            message,
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel'
                },
                {
                    text: 'Confirmar',
                    handler: onConfirm
                }
            ]
        });
        await alert.present();
    }

    // CRUD Operations
    getAtividades(): Atividade[] {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    saveAtividades(atividades: Atividade[]): void {
        localStorage.setItem(this.storageKey, JSON.stringify(atividades));
    }

    // Create
    createAtividade(atividade: Partial<Atividade>): Atividade {
        const newAtividade: Atividade = {
            data: atividade.data || '',
            hora: atividade.hora || 0,
            minuto: atividade.minuto || 0,
            periodo: atividade.periodo || 'AM',
            tipo: atividade.tipo || '',
            intensidade: atividade.intensidade || 'Média',
            duracao: atividade.duracao || '',
            calorias: atividade.calorias || '',
            local: atividade.local || '',
            notas: atividade.notas || '',
            favorite: atividade.favorite || false,
            id: this.generateId()
        };

        const atividades = this.getAtividades();
        atividades.push(newAtividade);
        this.saveAtividades(atividades);

        this.showToast('Atividade criada com sucesso!', 'success');
        return newAtividade;
    }

    // Read (get by id)
    getAtividadeById(id: string): Atividade | null {
        const atividades = this.getAtividades();
        return atividades.find(a => a.id === id) || null;
    }

    // Update
    updateAtividade(id: string, updatedAtividade: Partial<Atividade>): boolean {
        const atividades = this.getAtividades();
        const index = atividades.findIndex(a => a.id === id);

        if (index !== -1) {
            atividades[index] = { ...atividades[index], ...updatedAtividade };
            this.saveAtividades(atividades);
            this.showToast('Atividade atualizada com sucesso!', 'success');
            return true;
        }

        this.showToast('Atividade não encontrada!', 'danger');
        return false;
    }

    // Delete
    deleteAtividade(id: string): boolean {
        const atividades = this.getAtividades();
        const filteredAtividades = atividades.filter(a => a.id !== id);

        if (filteredAtividades.length !== atividades.length) {
            this.saveAtividades(filteredAtividades);
            this.showToast('Atividade eliminada com sucesso!', 'success');
            return true;
        }

        this.showToast('Atividade não encontrada!', 'danger');
        return false;
    }

    // Toggle favorite
    toggleFavorite(id: string): void {
        const atividade = this.getAtividadeById(id);
        if (atividade) {
            this.updateAtividade(id, { favorite: !atividade.favorite });
            this.showToast(
                atividade.favorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos',
                'medium'
            );
        }
    }

    // Estatísticas
    getEstatisticas() {
        const atividades = this.getAtividades();

        const totalAtividades = atividades.length;
        const totalCalorias = atividades.reduce((sum, a) => sum + (parseInt(a.calorias) || 0), 0);
        const tiposAtividade = atividades.reduce((acc, a) => {
            acc[a.tipo] = (acc[a.tipo] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const desportoMaisPraticado = Object.keys(tiposAtividade).reduce((a, b) =>
            tiposAtividade[a] > tiposAtividade[b] ? a : b, ''
        );

        return {
            totalAtividades,
            totalCalorias,
            desportoMaisPraticado,
            tiposAtividade
        };
    }

    private generateId(): string {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }
}

