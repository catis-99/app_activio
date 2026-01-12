import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import {
    DatabaseService,
    User,
    Activity,
    WeightEntry,
    TrainingDay as DBTrainingDay,
    Badge,
    Achievement
} from './database.service';
import { AuthService } from './auth.service';

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
    email?: string;
    weight?: number;
    goalWeight?: number;
    gender?: string;
    activityLevel?: string;
    birthdate?: string;
}

export interface UserAuth {
    email: string;
    password: string;
    isLoggedIn: boolean;
    registeredAt?: Date;
    lastLogin?: Date;
}

export interface CalorieEntry {
    date: string;
    consumed: number;
    burned: number;
    goal: number;
    meals?: Meal[];
}

export interface ActivityStat {
    activityType: string;
    percentage: number;
    totalHours: number;
}

export interface MonthlyActivity {
    week: number;
    football: number;
    ciclismo: number;
    natacao: number;
    atletismo: number;
    ginasio: number;
    yoga: number;

}

export interface Meal {
    name: string;
    calories: number;
    time: string;
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

export interface WorkoutDay {
    date: string;
    exercises: Exercise[];
    duration: number;
    caloriesBurned: number;
    completed: boolean;
}

export interface Exercise {
    name: string;
    sets?: number;
    reps?: number;
    duration?: number;
    calories?: number;
}

export interface ProgressEntry {
    date: string;
    weight: number;
    bodyFat?: number;
    muscleMass?: number;
    measurements?: {
        chest?: number;
        waist?: number;
        hips?: number;
        arms?: number;
        legs?: number;
    };
    photos?: string[];
    notes?: string;
}

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private storageReady: Promise<Storage>;
    private dbInitialized = false;

    constructor(
        private storage: Storage,
        private databaseService: DatabaseService,
        private authService: AuthService
    ) {
        this.storageReady = this.initStorage();
        this.initializeDatabase();
    }

    private async initStorage(): Promise<Storage> {
        await this.storage.create();
        return this.storage;
    }

    private async initializeDatabase(): Promise<void> {
        try {
            await this.databaseService.initializeDatabase();
            this.dbInitialized = true;
        } catch (error) {
            console.error('Failed to initialize database:', error);
        }
    }

    private async getStorage(): Promise<Storage> {
        return this.storageReady;
    }

    private getCurrentUserId(): number {
        const user = this.authService.getCurrentUser();
        return user?.id || 1; // Fallback to 1 for demo
    }

    // ===== AUTHENTICATION & REGISTRATION =====

    async register(email: string, password: string, name?: string): Promise<boolean> {
        const result = await this.authService.register({
            name: name || 'Utilizador',
            email,
            password,
            age: 25,
            height: 170,
            weight: 70,
            activity_level: 'Moderado'
        });
        return result.success;
    }

    async login(email: string, password: string): Promise<boolean> {
        const result = await this.authService.login(email, password);
        return result.success;
    }

    async logout(): Promise<void> {
        await this.authService.logout();
    }

    async getCurrentUser(): Promise<string | null> {
        const user = this.authService.getCurrentUser();
        return user?.email || null;
    }

    async isLoggedIn(): Promise<boolean> {
        return this.authService.isAuthenticated();
    }

    // ===== USER PROFILE =====

    async getUserProfile(): Promise<UserProfile> {
        const user = this.authService.getCurrentUser();
        console.log('🔍 DataService.getUserProfile() - user:', user);

        if (user) {
            const profile = {
                name: user.name,
                age: user.age,
                height: user.height,
                email: user.email,
                weight: user.weight,
                goalWeight: user.goal_weight,
                activityLevel: user.activity_level,
                gender: user.gender,
                birthdate: user.birthdate
            };
            console.log('🔍 DataService.getUserProfile() - retornando profile:', profile);
            return profile;
        }

        // Fallback to localStorage for compatibility
        const storage = await this.getStorage();
        const profile = await storage.get('userProfile');
        console.log('🔍 DataService.getUserProfile() - fallback storage:', profile);
        return profile || { name: '', age: 25, height: 170 };
    }

    async saveUserProfile(profile: UserProfile): Promise<void> {
        console.log('💾 DataService.saveUserProfile() - Recebido:', profile);

        const user = this.authService.getCurrentUser();
        console.log('💾 DataService.saveUserProfile() - Current user:', user);

        if (user) {
            const updates = {
                name: profile.name,
                age: profile.age,
                height: profile.height,
                weight: profile.weight,
                goal_weight: profile.goalWeight,
                activity_level: profile.activityLevel as any,
                gender: profile.gender,
                birthdate: profile.birthdate
            };
            console.log('💾 DataService.saveUserProfile() - Atualizando com:', updates);

            await this.authService.updateProfile(updates);
            console.log('💾 DataService.saveUserProfile() - Atualizado com sucesso');
        } else {
            // Fallback to localStorage
            console.log('💾 DataService.saveUserProfile() - Salvando no localStorage');
            const storage = await this.getStorage();
            await storage.set('userProfile', profile);
        }
    }


    // ===== TRAINING DAYS =====

    async getTrainingDays(): Promise<TrainingDay[]> {
        if (!this.dbInitialized) {
            return this.getTrainingDaysFromStorage();
        }

        try {
            const userId = this.getCurrentUserId();
            const days = await this.databaseService.getTrainingDays(userId);

            // Convert database format to app format
            const weekLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
            const trainingData: TrainingDay[] = weekLabels.map((label, index) => {
                const day = days.find(d => d.day_of_week === index);
                return {
                    label,
                    hours: day?.actual_hours || 0
                };
            });

            return trainingData;
        } catch {
            return this.getTrainingDaysFromStorage();
        }
    }

    private async getTrainingDaysFromStorage(): Promise<TrainingDay[]> {
        const storage = await this.getStorage();
        const days = await storage.get('trainingDays');

        console.log('🔍 getTrainingDaysFromStorage - Dados do storage:', days);

        // Se não houver dados, retorna semana vazia
        if (!days) {
            console.warn('⚠️ trainingDays está vazio/null - retornando array vazio');
            return [
                { label: 'Seg', hours: 0 },
                { label: 'Ter', hours: 0 },
                { label: 'Qua', hours: 0 },
                { label: 'Qui', hours: 0 },
                { label: 'Sex', hours: 0 },
                { label: 'Sáb', hours: 0 },
                { label: 'Dom', hours: 0 }
            ];
        }

        return days;
    }

    async saveTrainingDays(days: TrainingDay[]): Promise<void> {
        const storage = await this.getStorage();
        await storage.set('trainingDays', days);
        console.log('💾 Training days salvos:', days);
    }

    async addTrainingHours(dayLabel: string, hours: number): Promise<void> {
        const days = await this.getTrainingDays();
        const day = days.find(d => d.label === dayLabel);
        if (day) {
            day.hours += hours;
            await this.saveTrainingDays(days);
        }
    }

    // ===== WEIGHT DATA =====

    async getWeightData(): Promise<WeightData> {
        if (!this.dbInitialized) {
            return this.getWeightDataFromStorage();
        }

        try {
            const userId = this.getCurrentUserId();
            const user = this.authService.getCurrentUser();
            const entries = await this.databaseService.getWeightEntries(userId, 10);

            if (entries.length === 0 || !user) {
                return this.getWeightDataFromStorage();
            }

            return {
                start: entries[entries.length - 1]?.weight || user.weight,
                current: entries[0]?.weight || user.weight,
                goal: user.goal_weight || user.weight - 5
            };
        } catch {
            return this.getWeightDataFromStorage();
        }
    }

    private async getWeightDataFromStorage(): Promise<WeightData> {
        const storage = await this.getStorage();
        const data = await storage.get('weightData');

        console.log('🔍 getWeightDataFromStorage - Dados do storage:', data);

        // Se não houver dados no storage, tenta buscar do perfil do utilizador
        if (!data) {
            console.warn('⚠️ weightData está vazio/null - tentando buscar do perfil');

            // Buscar do perfil do utilizador (onde o goalWeight foi salvo)
            const profile = await this.getUserProfile();
            if (profile && profile.weight) {
                console.log('✅ Usando dados do perfil:', {
                    weight: profile.weight,
                    goalWeight: profile.goalWeight
                });
                return {
                    start: profile.weight,
                    current: profile.weight,
                    goal: profile.goalWeight || profile.weight - 5
                };
            }

            // Fallback: tentar buscar do authService
            const user = this.authService.getCurrentUser();
            if (user && user.weight) {
                console.log('✅ Usando dados do utilizador (authService):', user.weight);
                return {
                    start: user.weight,
                    current: user.weight,
                    goal: user.goal_weight || user.weight - 5
                };
            }

            // Se não houver utilizador ou dados, retorna valores neutros
            console.warn('⚠️ Sem dados de utilizador - retornando valores neutros');
            return { start: 0, current: 0, goal: 0 };
        }

        return data;
    }

    async saveWeightData(data: WeightData): Promise<void> {
        const storage = await this.getStorage();
        await storage.set('weightData', data);
        console.log('💾 Weight data salvos:', data);
    }

    async updateWeight(current: number): Promise<void> {
        if (this.dbInitialized) {
            const userId = this.getCurrentUserId();
            await this.databaseService.addWeightEntry({
                user_id: userId,
                weight: current,
                date: new Date().toISOString().split('T')[0]
            });
        }

        const data = await this.getWeightData();
        data.current = current;
        await this.saveWeightData(data);
    }

    // ===== CALORIES MANAGEMENT =====

    async getCaloriesForDate(date: string): Promise<CalorieEntry> {
        const storage = await this.getStorage();
        const entry = await storage.get(`calories_${date}`);
        return entry || {
            date,
            consumed: 0,
            burned: 0,
            goal: 2000,
            meals: []
        };
    }

    async saveCaloriesForDate(entry: CalorieEntry): Promise<void> {
        const storage = await this.getStorage();
        await storage.set(`calories_${entry.date}`, entry);
    }

    async addMeal(date: string, meal: Meal): Promise<void> {
        const entry = await this.getCaloriesForDate(date);
        entry.meals = entry.meals || [];
        entry.meals.push(meal);
        entry.consumed += meal.calories;
        await this.saveCaloriesForDate(entry);
    }

    async getCaloriesHistory(days: number = 7): Promise<CalorieEntry[]> {
        const storage = await this.getStorage();
        const history: CalorieEntry[] = [];
        const today = new Date();

        for (let i = 0; i < days; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const entry = await storage.get(`calories_${dateStr}`);
            if (entry) {
                history.push(entry);
            }
        }

        return history;
    }

    // ===== WORKOUT DAYS =====

    async getWorkoutForDate(date: string): Promise<WorkoutDay | null> {
        const storage = await this.getStorage();
        return await storage.get(`workout_${date}`);
    }

    async saveWorkout(workout: WorkoutDay): Promise<void> {
        const storage = await this.getStorage();
        await storage.set(`workout_${workout.date}`, workout);
    }

    async getWorkoutHistory(days: number = 30): Promise<WorkoutDay[]> {
        const storage = await this.getStorage();
        const history: WorkoutDay[] = [];
        const today = new Date();

        for (let i = 0; i < days; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const workout = await storage.get(`workout_${dateStr}`);
            if (workout) {
                history.push(workout);
            }
        }

        return history;
    }

    async completeWorkout(date: string): Promise<void> {
        const workout = await this.getWorkoutForDate(date);
        if (workout) {
            workout.completed = true;
            await this.saveWorkout(workout);
        }
    }

    // ===== PROGRESS TRACKING =====

    async getProgressForDate(date: string): Promise<ProgressEntry | null> {
        const storage = await this.getStorage();
        return await storage.get(`progress_${date}`);
    }

    async saveProgress(progress: ProgressEntry): Promise<void> {
        const storage = await this.getStorage();
        await storage.set(`progress_${progress.date}`, progress);

        // Also save to database if available
        if (this.dbInitialized && progress.weight) {
            const userId = this.getCurrentUserId();
            await this.databaseService.addWeightEntry({
                user_id: userId,
                weight: progress.weight,
                date: progress.date,
                notes: progress.notes
            });
        }
    }

    async getProgressHistory(days: number = 90): Promise<ProgressEntry[]> {
        const storage = await this.getStorage();
        const history: ProgressEntry[] = [];
        const today = new Date();

        for (let i = 0; i < days; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const progress = await storage.get(`progress_${dateStr}`);
            if (progress) {
                history.push(progress);
            }
        }

        return history.sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );
    }

    async getLatestProgress(): Promise<ProgressEntry | null> {
        const history = await this.getProgressHistory(365);
        return history.length > 0 ? history[history.length - 1] : null;
    }

    // ===== STATISTICS & ANALYTICS =====

    async getWeeklyStats(): Promise<{
        totalWorkouts: number;
        totalCaloriesBurned: number;
        totalCaloriesConsumed: number;
        averageWeight: number;
        workoutStreak: number;
    }> {
        const workouts = await this.getWorkoutHistory(7);
        const calories = await this.getCaloriesHistory(7);
        const progress = await this.getProgressHistory(7);

        const completedWorkouts = workouts.filter(w => w.completed);
        const totalCaloriesBurned = completedWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0);
        const totalCaloriesConsumed = calories.reduce((sum, c) => sum + c.consumed, 0);
        const averageWeight = progress.length > 0
            ? progress.reduce((sum, p) => sum + p.weight, 0) / progress.length
            : 0;

        return {
            totalWorkouts: completedWorkouts.length,
            totalCaloriesBurned,
            totalCaloriesConsumed,
            averageWeight,
            workoutStreak: this.calculateStreak(workouts)
        };
    }

    private calculateStreak(workouts: WorkoutDay[]): number {
        let streak = 0;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 365; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(checkDate.getDate() - i);
            const dateStr = checkDate.toISOString().split('T')[0];

            const workout = workouts.find(w => w.date === dateStr);
            if (workout && workout.completed) {
                streak++;
            } else if (i > 0) {
                break;
            }
        }

        return streak;
    }

    // ===== ACTIVITY STATS =====

    async getActivityStats(): Promise<ActivityStat[]> {
        const storage = await this.getStorage();

        try {
            const stats = await storage.get('activity-stats-chart');
            if (stats && Array.isArray(stats)) {
                return stats;
            }
        } catch (error) {
            console.log('Estatísticas de atividades não encontradas');
        }

        // Retorna dados vazios inicialmente
        return [
            { activityType: 'football', percentage: 0, totalHours: 0 },
            { activityType: 'ciclismo', percentage: 0, totalHours: 0 },
            { activityType: 'atletismo', percentage: 0, totalHours: 0 },
            { activityType: 'ginasio', percentage: 0, totalHours: 0 },
            { activityType: 'natacao', percentage: 0, totalHours: 0 },
            { activityType: 'yoga', percentage: 0, totalHours: 0 },
        ];
    }

    async updateActivityStats(activityType: string, hours: number): Promise<void> {
        const storage = await this.getStorage();

        try {
            const stats = await this.getActivityStats();

            // Encontra a atividade e atualiza as horas
            const activity = stats.find(s => s.activityType === activityType);
            if (activity) {
                activity.totalHours += hours;
            } else {
                stats.push({ activityType, percentage: 0, totalHours: hours });
            }

            // Recalcula as percentagens
            const totalHours = stats.reduce((sum, s) => sum + s.totalHours, 0);
            if (totalHours > 0) {
                stats.forEach(s => {
                    s.percentage = Math.round((s.totalHours / totalHours) * 100);
                });
            }

            await storage.set('activity-stats-chart', stats);
        } catch (error) {
            console.error('Erro ao atualizar estatísticas:', error);
        }
    }

    async getMonthlyActivities(): Promise<MonthlyActivity[]> {
        const storage = await this.getStorage();

        try {
            const activities = await storage.get('monthly-activities-chart');
            if (activities && Array.isArray(activities) && activities.length > 0) {
                return activities;
            }
        } catch (error) {
            console.log('Atividades mensais não encontradas');
        }

        // Retorna 4 semanas vazias inicialmente
        return [
            { week: 1, football: 0, ciclismo: 0, atletismo: 0, ginasio: 0, natacao: 0, yoga: 0 },
            { week: 2, football: 0, ciclismo: 0, atletismo: 0, ginasio: 0, natacao: 0, yoga: 0 },
            { week: 3, football: 0, ciclismo: 0, atletismo: 0, ginasio: 0, natacao: 0, yoga: 0 },
            { week: 4, football: 0, ciclismo: 0, atletismo: 0, ginasio: 0, natacao: 0, yoga: 0 }
        ];
    }

    async updateMonthlyActivity(
        week: number,
        activityType: 'football' | 'ciclismo' | 'atletismo' | 'ginasio' | 'natacao' | 'yoga',
        hours: number
    ): Promise<void> {
        const storage = await this.getStorage();

        try {
            const activities = await this.getMonthlyActivities();
            const weekData = activities.find(a => a.week === week);

            if (weekData) {
                weekData[activityType] = (weekData[activityType] || 0) + hours;
            }

            await storage.set('monthly-activities-chart', activities);
        } catch (error) {
            console.error('Erro ao atualizar atividades mensais:', error);
        }
    }

    async recordActivity(
        activityType: 'football' | 'ciclismo' | 'atletismo' | 'ginasio' | 'natacao' | 'yoga',
        hours: number,
        date?: Date
    ): Promise<void> {
        // Atualiza estatísticas gerais (gráfico de pizza)
        await this.updateActivityStats(activityType, hours);

        // Determina a semana do mês (1-4)
        const currentDate = date || new Date();
        const dayOfMonth = currentDate.getDate();
        const week = Math.min(4, Math.ceil(dayOfMonth / 7));

        // Mapeia o tipo de atividade para o formato do gráfico mensal
        let monthlyActivityType: 'football' | 'ciclismo' | 'atletismo' | 'ginasio' | 'natacao' | 'yoga';
        if (activityType === 'ciclismo') {
            monthlyActivityType = 'ciclismo';
        } else if (activityType === 'atletismo') {
            monthlyActivityType = 'atletismo';
        } else if (activityType === 'ginasio') {
            monthlyActivityType = 'ginasio';
        } else if (activityType === 'natacao') {
            monthlyActivityType = 'natacao';
        } else if (activityType === 'yoga') {
            monthlyActivityType = 'yoga';
        } else {
            monthlyActivityType = 'football';
        }

        // Atualiza atividades mensais (gráfico de linhas)
        await this.updateMonthlyActivity(week, monthlyActivityType, hours);

        // Atualiza tempo treinado por dia da semana
        await this.updateTrainingDays(currentDate, hours);

        console.log(`✅ Atividade registada: ${activityType}, ${hours}h, ${currentDate.toLocaleDateString()}`);
    }

    /**
     * Atualiza o tempo treinado para um dia específico da semana
     */
    private async updateTrainingDays(date: Date, hours: number): Promise<void> {
        const storage = await this.getStorage();

        try {
            const days = await this.getTrainingDays();
            const dayOfWeek = date.getDay(); // 0 = Domingo, 1 = Segunda, etc.

            // Mapear o índice do dia para o array de treino
            // Array é: [Dom, Seg, Ter, Qua, Qui, Sex, Sáb]
            const dayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
            const dayLabel = dayLabels[dayOfWeek];

            const day = days.find(d => d.label === dayLabel);
            if (day) {
                day.hours += hours;
                await this.saveTrainingDays(days);
                console.log(`✅ Tempo treinado atualizado para ${dayLabel}: ${day.hours}h`);
            }
        } catch (error) {
            console.error('Erro ao atualizar trainingDays:', error);
        }
    }



    async incrementActivity(activity: string): Promise<void> {
        const storage = await this.getStorage();
        const stats = await storage.get('activityStats') || {};
        stats[activity] = (stats[activity] || 0) + 1;
        await storage.set('activityStats', stats);
    }

    async debugStorage(): Promise<void> {
        const storage = await this.getStorage();

        console.log('🔍 ===== DEBUG STORAGE =====');
        console.log('trainingDays:', await storage.get('trainingDays'));
        console.log('weightData:', await storage.get('weightData'));
        console.log('activity-stats-chart:', await storage.get('activity-stats-chart'));
        console.log('monthly-activities-chart:', await storage.get('monthly-activities-chart'));
        console.log('currentUser:', await storage.get('currentUser'));
        console.log('userProfile:', await storage.get('userProfile'));
        console.log('activityStats:', await storage.get('activityStats'));
    }

    // ===== CLEAR DATA =====

    async clearAll(): Promise<void> {
        const storage = await this.getStorage();
        await storage.clear();

        if (this.dbInitialized) {
            await this.databaseService.clearAllData();
        }
    }

    async clearUserData(): Promise<void> {
        const storage = await this.getStorage();
        const currentUser = await this.getCurrentUser();

        if (currentUser) {
            await storage.remove(`user_${currentUser}`);
            await storage.remove('currentUser');
        }

        await storage.remove('userProfile');
        await storage.remove('activityStats');

        await storage.remove('trainingDays');
        await storage.remove('weightData');
        await storage.remove('activity-stats-chart');
        await storage.remove('monthly-activities-chart');

        console.log('✅ Dados do utilizador limpos');
    }

}

