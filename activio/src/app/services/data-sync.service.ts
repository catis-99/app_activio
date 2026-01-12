import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatabaseService, Badge, User, Activity } from './database.service';
import { firstValueFrom } from 'rxjs';

export interface SeedData {
    defaultUser: Partial<User>;
    sampleActivities: Partial<Activity>[];
    activityTypes: Array<{
        name: string;
        icon: string;
        defaultCaloriesPerHour: number;
    }>;
}

@Injectable({
    providedIn: 'root'
})
export class DataSyncService {
    private readonly BADGES_FILE = 'assets/data/badges.json';
    private readonly SEED_FILE = 'assets/data/seed-data.json';
    private readonly SYNC_KEY = 'lastDataSync';

    constructor(
        private http: HttpClient,
        private databaseService: DatabaseService
    ) { }

    /**
     * Carrega dados iniciais dos arquivos JSON para o banco de dados
     * Executa apenas na primeira vez ou quando solicitado
     */
    async loadInitialData(force: boolean = false): Promise<void> {
        const lastSync = localStorage.getItem(this.SYNC_KEY);

        // Só carregar se for forçado ou se nunca foi sincronizado
        if (!force && lastSync) {
            console.log('Dados já sincronizados em:', lastSync);
            return;
        }

        try {
            console.log('Carregando dados iniciais dos arquivos JSON...');

            // Carregar badges
            await this.loadBadges();

            // Carregar dados de exemplo
            await this.loadSeedData();

            // Marcar como sincronizado
            localStorage.setItem(this.SYNC_KEY, new Date().toISOString());
            console.log('Dados iniciais carregados com sucesso!');
        } catch (error) {
            console.error('Erro ao carregar dados iniciais:', error);
            throw error;
        }
    }

    /**
     * Carrega badges do arquivo JSON para o banco de dados
     */
    private async loadBadges(): Promise<void> {
        try {
            const badges = await firstValueFrom(
                this.http.get<Badge[]>(this.BADGES_FILE)
            );

            console.log(`Carregando ${badges.length} badges...`);

            for (const badge of badges) {
                const existing = await this.databaseService.getBadgeById(badge.id!);

                if (!existing) {
                    await this.databaseService.insertBadge({
                        ...badge,
                        created_at: new Date().toISOString()
                    });
                    console.log(`Badge "${badge.name}" inserido`);
                } else {
                    console.log(`Badge "${badge.name}" já existe`);
                }
            }
        } catch (error) {
            console.error('Erro ao carregar badges:', error);
        }
    }

    /**
     * Carrega dados de exemplo do arquivo JSON
     */
    private async loadSeedData(): Promise<void> {
        try {
            const seedData = await firstValueFrom(
                this.http.get<SeedData>(this.SEED_FILE)
            );

            console.log('Dados de exemplo carregados:', seedData);

            // Você pode processar os dados aqui conforme necessário
            // Por exemplo, criar usuário padrão, atividades de exemplo, etc.

        } catch (error) {
            console.error('Erro ao carregar seed data:', error);
        }
    }

    /**
     * Exporta dados atuais do banco para JSON (para backup/compartilhamento)
     */
    async exportData(): Promise<string> {
        try {
            const data = {
                exportDate: new Date().toISOString(),
                badges: await this.databaseService.getAllBadges(),
                // Adicione outros dados conforme necessário
            };

            return JSON.stringify(data, null, 2);
        } catch (error) {
            console.error('Erro ao exportar dados:', error);
            throw error;
        }
    }

    /**
     * Reseta dados para estado inicial (recarrega do JSON)
     */
    async resetToInitialData(): Promise<void> {
        localStorage.removeItem(this.SYNC_KEY);
        await this.loadInitialData(true);
    }

    /**
     * Verifica se há dados iniciais carregados
     */
    isDataLoaded(): boolean {
        return !!localStorage.getItem(this.SYNC_KEY);
    }
}
