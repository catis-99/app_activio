import { Injectable } from '@angular/core';
import { Activity, User } from './database.service';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {

    private readonly KEYS = {
        ACTIVITIES: 'activio_activities',
        USER: 'activio_user',
        WEIGHT_HISTORY: 'activio_weight_history',
        ACHIEVEMENTS: 'activio_achievements',
        LAST_SYNC: 'activio_last_sync'
    };

    constructor() { }

    // ==================== ACTIVITIES ====================

    async saveActivities(activities: Activity[]): Promise<void> {
        try {
            localStorage.setItem(this.KEYS.ACTIVITIES, JSON.stringify(activities));
            await this.updateLastSync();
            console.log(`✅ ${activities.length} atividades salvas no LocalStorage`);
        } catch (error) {
            console.error('❌ Erro ao salvar atividades:', error);
            throw error;
        }
    }

    async getActivities(): Promise<Activity[]> {
        try {
            const data = localStorage.getItem(this.KEYS.ACTIVITIES);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('❌ Erro ao carregar atividades:', error);
            return [];
        }
    }

    async addActivity(activity: Activity): Promise<void> {
        const activities = await this.getActivities();
        activities.push(activity);
        await this.saveActivities(activities);
    }

    async updateActivity(id: number, activity: Partial<Activity>): Promise<void> {
        const activities = await this.getActivities();
        const index = activities.findIndex(a => a.id === id);
        if (index !== -1) {
            activities[index] = { ...activities[index], ...activity };
            await this.saveActivities(activities);
        }
    }

    async deleteActivity(id: number): Promise<void> {
        const activities = await this.getActivities();
        const filtered = activities.filter(a => a.id !== id);
        await this.saveActivities(filtered);
    }

    // ==================== USER ====================

    async saveUser(user: User): Promise<void> {
        try {
            localStorage.setItem(this.KEYS.USER, JSON.stringify(user));
            await this.updateLastSync();
            console.log('✅ Dados do usuário salvos');
        } catch (error) {
            console.error('❌ Erro ao salvar usuário:', error);
            throw error;
        }
    }

    async getUser(): Promise<User | null> {
        try {
            const data = localStorage.getItem(this.KEYS.USER);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('❌ Erro ao carregar usuário:', error);
            return null;
        }
    }

    // ==================== WEIGHT HISTORY ====================

    async saveWeightHistory(history: any[]): Promise<void> {
        try {
            localStorage.setItem(this.KEYS.WEIGHT_HISTORY, JSON.stringify(history));
            await this.updateLastSync();
        } catch (error) {
            console.error('❌ Erro ao salvar histórico de peso:', error);
            throw error;
        }
    }

    async getWeightHistory(): Promise<any[]> {
        try {
            const data = localStorage.getItem(this.KEYS.WEIGHT_HISTORY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('❌ Erro ao carregar histórico de peso:', error);
            return [];
        }
    }

    // ==================== BACKUP & RESTORE ====================

    async createBackup(): Promise<string> {
        const backup = {
            activities: await this.getActivities(),
            user: await this.getUser(),
            weightHistory: await this.getWeightHistory(),
            achievements: this.getAchievements(),
            timestamp: new Date().toISOString(),
            version: '1.0'
        };

        return JSON.stringify(backup);
    }

    async restoreBackup(backupJson: string): Promise<void> {
        try {
            const backup = JSON.parse(backupJson);

            if (backup.activities) {
                await this.saveActivities(backup.activities);
            }
            if (backup.user) {
                await this.saveUser(backup.user);
            }
            if (backup.weightHistory) {
                await this.saveWeightHistory(backup.weightHistory);
            }
            if (backup.achievements) {
                this.saveAchievements(backup.achievements);
            }

            console.log('✅ Backup restaurado com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao restaurar backup:', error);
            throw error;
        }
    }

    async downloadBackup(): Promise<void> {
        const backup = await this.createBackup();
        const blob = new Blob([backup], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `activio_backup_${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        URL.revokeObjectURL(url);
        console.log('✅ Backup baixado!');
    }

    // ==================== ACHIEVEMENTS ====================

    saveAchievements(achievements: any[]): void {
        localStorage.setItem(this.KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
    }

    getAchievements(): any[] {
        const data = localStorage.getItem(this.KEYS.ACHIEVEMENTS);
        return data ? JSON.parse(data) : [];
    }

    // ==================== SYNC INFO ====================

    private async updateLastSync(): Promise<void> {
        localStorage.setItem(this.KEYS.LAST_SYNC, new Date().toISOString());
    }

    getLastSync(): Date | null {
        const data = localStorage.getItem(this.KEYS.LAST_SYNC);
        return data ? new Date(data) : null;
    }

    // ==================== STORAGE INFO ====================

    getStorageSize(): { used: number; total: number; percentage: number } {
        let total = 0;

        for (const key in this.KEYS) {
            const item = localStorage.getItem(this.KEYS[key as keyof typeof this.KEYS]);
            if (item) {
                total += item.length * 2; // UTF-16 = 2 bytes por caractere
            }
        }

        const usedMB = total / (1024 * 1024);
        const totalMB = 10; // LocalStorage ~10MB limite
        const percentage = (usedMB / totalMB) * 100;

        return {
            used: usedMB,
            total: totalMB,
            percentage: percentage
        };
    }

    // ==================== CLEAR DATA ====================

    async clearAll(): Promise<void> {
        for (const key in this.KEYS) {
            localStorage.removeItem(this.KEYS[key as keyof typeof this.KEYS]);
        }
        console.log('✅ Todos os dados do LocalStorage foram limpos');
    }

    async clearActivities(): Promise<void> {
        localStorage.removeItem(this.KEYS.ACTIVITIES);
        console.log('✅ Atividades limpas do LocalStorage');
    }

    // ==================== EXISTE DADOS ====================

    hasData(): boolean {
        return localStorage.getItem(this.KEYS.ACTIVITIES) !== null ||
            localStorage.getItem(this.KEYS.USER) !== null;
    }
}
