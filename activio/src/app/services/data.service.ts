import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

export interface TrainingDay {
    label: string;
    hours: number;
}

export interface WeightData {
    start: number;
    current: number;
    goal: number;
}

export interface UserProfile {
    name: string;
    age: number;
    height: number;
}

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private storageReady: Promise<Storage>;

    constructor(private storage: Storage) {
        this.storageReady = this.initStorage();
    }

    private async initStorage(): Promise<Storage> {
        await this.storage.create();
        return this.storage;
    }

    private async getStorage(): Promise<Storage> {
        return this.storageReady;
    }

    // Training Days
    async getTrainingDays(): Promise<TrainingDay[]> {
        const storage = await this.getStorage();
        const days = await storage.get('trainingDays');
        return days || [
            { label: 'Seg', hours: 2 },
            { label: 'Ter', hours: 2.5 },
            { label: 'Qua', hours: 1.5 },
            { label: 'Qui', hours: 3 },
            { label: 'Sex', hours: 0 },
            { label: 'Sáb', hours: 3.5 },
            { label: 'Dom', hours: 1.5 }
        ];
    }

    async saveTrainingDays(days: TrainingDay[]): Promise<void> {
        const storage = await this.getStorage();
        await storage.set('trainingDays', days);
    }

    async addTrainingHours(dayLabel: string, hours: number): Promise<void> {
        const days = await this.getTrainingDays();
        const day = days.find(d => d.label === dayLabel);
        if (day) {
            day.hours += hours;
            await this.saveTrainingDays(days);
        }
    }

    // Weight Data
    async getWeightData(): Promise<WeightData> {
        const storage = await this.getStorage();
        const data = await storage.get('weightData');
        return data || { start: 68, current: 63, goal: 58 };
    }

    async saveWeightData(data: WeightData): Promise<void> {
        const storage = await this.getStorage();
        await storage.set('weightData', data);
    }

    async updateWeight(current: number): Promise<void> {
        const data = await this.getWeightData();
        data.current = current;
        await this.saveWeightData(data);
    }

    // User Profile
    async getUserProfile(): Promise<UserProfile> {
        const storage = await this.getStorage();
        const profile = await storage.get('userProfile');
        return profile || { name: '', age: 25, height: 170 };
    }

    async saveUserProfile(profile: UserProfile): Promise<void> {
        const storage = await this.getStorage();
        await storage.set('userProfile', profile);
    }

    // Activity Stats
    async getActivityStats(): Promise<{ [key: string]: number }> {
        const storage = await this.getStorage();
        const stats = await storage.get('activityStats');
        return stats || {};
    }

    async incrementActivity(activity: string): Promise<void> {
        const storage = await this.getStorage();
        const stats = await this.getActivityStats();
        stats[activity] = (stats[activity] || 0) + 1;
        await storage.set('activityStats', stats);
    }

    // Clear all data
    async clearAll(): Promise<void> {
        const storage = await this.getStorage();
        await storage.clear();
    }
}

